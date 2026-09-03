// Break a line of copy so no line ends up carrying one word, or one punctuation mark.
//
// Erick, 3 September 2026, on the reels: "see how the question mark sits on its own row? I told you
// i have orphans/tailing where there is a single word or punctuation on its own line, doesn't look
// good... Rangers is also on its own line... people will easily call this out as AI slop."
//
// WHY IT KEPT HAPPENING AFTER I BUILT A CHECKER FOR IT.
//
// check-lines.mjs measured STATIC strings and printed a count of the rest: "15 node(s) carry
// computed text and were not measured". The market question is one of those fifteen, because it
// arrives as {S.q} at render time. So the checker was clean on exactly the text that was breaking.
// A guard with a blind spot over the thing it guards is worse than no guard: it produces
// confidence. That checker now refuses a computed node that is not routed through this module.
//
// WHY A GREEDY WRAP ALWAYS PRODUCES THIS.
//
// Every renderer wraps greedily: fill a line to the budget, start a new one. That packs the early
// lines full and dumps whatever is left onto the last, so a question that is one word too long
// becomes "Tampa Bay Rays vs. Texas" and then "Rangers?" alone. The remainder is structurally the
// smallest piece. Greedy wrapping does not have an orphan bug; orphans are what greedy wrapping IS.
// So choose the number of lines first, then spread the words evenly: a balanced rag.
//
// AND WHY THE FIRST VERSION OF THIS FILE MADE IT WORSE.
//
// It budgeted characters per line from an assumed average advance of 0.55 em. General Sans Bold in
// UPPERCASE actually averages 0.717 em, and the reel's second beat is set in caps, so the budget
// was thirty percent too generous. Every balanced line overflowed, the renderer re-wrapped it, and
// re-wrapping a pre-broken line strands MORE words than leaving it alone: the published frame read
// "POLYMARKET PUTS THE / NO / SIDE AT 45.5 PERCENT,". An estimate that is confidently wrong is the
// same failure as the checker's blind spot, one layer down.
//
// So nothing here estimates. face-metrics.json holds the real advance width of every character in
// the three house faces, read out of the woff2 files with fontTools, and lines are measured in
// pixels against the actual box.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const FACES = JSON.parse(readFileSync(fileURLToPath(new URL('./face-metrics.json', import.meta.url)), 'utf8'));

// Kerning and hinting move a real line by a fraction of a percent either way, and a line that
// overflows by one pixel is re-wrapped into an orphan. Two percent of headroom costs nothing.
const SAFETY = 0.98;
const DEFAULT_FACE = 'General Sans';

/** The rendered width of a string, in pixels. */
export const measureText = (text, sizePx, { family = DEFAULT_FACE, letterSpacing = 0 } = {}) => {
  const face = FACES[family] ?? FACES[DEFAULT_FACE];
  const s = String(text ?? '');
  let w = 0;
  for (const ch of s) w += (face.adv?.[ch] ?? face.mono ?? face.space ?? 0.6) * sizePx;
  return w + Math.max(0, s.length - 1) * letterSpacing;
};

/** Characters that fit one line. Kept for callers that think in budgets; measurement is exact. */
export const budgetFor = (boxPx, sizePx, { family = DEFAULT_FACE, letterSpacing = 0, mono = false } = {}) => {
  const fam = mono ? 'JetBrains Mono' : family;
  const face = FACES[fam] ?? FACES[DEFAULT_FACE];
  const avg = face.mono ?? 0.55;
  return Math.floor((boxPx * SAFETY) / (avg * sizePx + letterSpacing));
};

const packTo = (words, limitPx, sizePx, opts) => {
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measureText(next, sizePx, opts) > limitPx) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

/**
 * Distribute words across at most `n` lines, minimising the longest one: a balanced rag, so the
 * last line is never just the leftovers. Binary search on the line width in pixels, because the
 * narrowest width that still fits in n lines is the balanced one.
 */
const balanceInto = (words, n, boxPx, sizePx, opts) => {
  let lo = Math.max(...words.map((w) => measureText(w, sizePx, opts)));
  let hi = boxPx, best = null;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    const lines = packTo(words, mid, sizePx, opts);
    if (lines.length <= n) { best = lines; hi = mid; } else lo = mid;
  }
  return best ?? packTo(words, boxPx, sizePx, opts);
};

/** A line that reads as a mistake: one short word alone, or nothing but punctuation. */
const stranded = (lines, orphanMax) => {
  if (lines.length < 2) return false;
  const last = lines[lines.length - 1];
  return (last.split(' ').length === 1 && last.length <= orphanMax) || /^[^\w]+$/.test(last);
};

/**
 * Break `text` for a box, returning the lines. Rules, in order:
 *   1. Never leave a line carrying one short word. "Rangers?" alone reads as a mistake.
 *   2. Never leave a line carrying only punctuation. "?" alone is worse.
 *   3. Prefer the fewest lines that satisfy 1 and 2, then balance them.
 * A single word too long for the box is returned alone: nothing can be done about it, and dropping
 * it silently would be worse.
 */
export const balanceLines = (text, boxPx, sizePx, opts = {}) => {
  const { orphanMax = 14 } = opts;
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const box = boxPx * SAFETY;
  const words = clean.split(' ');
  if (words.length === 1) return [clean];

  const base = packTo(words, box, sizePx, opts);
  let lines = balanceInto(words, base.length, box, sizePx, opts);
  // Balancing usually cures it: spreading the words moves something up beside the orphan. If not,
  // one more line gives the rag somewhere to put the weight.
  if (stranded(lines, orphanMax) && base.length + 1 <= words.length) {
    const wider = balanceInto(words, base.length + 1, box, sizePx, opts);
    if (!stranded(wider, orphanMax)) lines = wider;
  }
  // Last resort: pull a word down from the line above, which always cures a lone-word ending as
  // long as the line above has two words to give and the moved word still fits.
  if (stranded(lines, orphanMax) && lines.length >= 2) {
    const above = lines[lines.length - 2].split(' ');
    if (above.length >= 2) {
      const moved = above[above.length - 1];
      const merged = `${moved} ${lines[lines.length - 1]}`;
      if (measureText(merged, sizePx, opts) <= box) {
        above.pop();
        lines[lines.length - 2] = above.join(' ');
        lines[lines.length - 1] = merged;
      }
    }
  }
  return lines;
};

/**
 * The largest size from `sizes` at which `text` balances into at most `maxLines`, with the lines.
 *
 * This is the answer to the other half of what Erick found: "the second page also has the text
 * sitting right at the edge of a gradient border... maybe the text can be spread out a little bit."
 * A block set at a fixed size grows down the frame as the copy gets longer, and eventually it
 * crosses whatever it was composed to sit above. Fitting the size to the band instead keeps the
 * block inside its own space no matter how long the sentence turns out to be.
 */
export const fitToBox = (text, boxPx, { sizes = [], maxLines = 4, ...opts } = {}) => {
  const ladder = [...sizes].sort((a, b) => b - a);
  for (const size of ladder) {
    const lines = balanceLines(text, boxPx, size, opts);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = ladder[ladder.length - 1];
  return { size, lines: balanceLines(text, boxPx, size, opts) };
};

/** The same, joined with hard breaks, ready to hand a composition that honours "\n". */
export const balanced = (text, boxPx, sizePx, opts = {}) => balanceLines(text, boxPx, sizePx, opts).join('\n');
