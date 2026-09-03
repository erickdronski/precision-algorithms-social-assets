// How much of a market's plain-language read the REEL carries, and at what size.
//
// Erick, 3 September 2026: "the second page also has the text sitting right at the edge of a
// gradient border which doesn't look good, and maybe the text can be spread out a little bit or
// have space in between so it's easier to read."
//
// Both halves of that are the same fault. The reel's second beat was set at a fixed 60px, so the
// block grew down the frame as the sentence got longer, and on a long read it ran past the band it
// was composed to sit in and into the gradient. Shrinking the type to fit is not the answer either:
// the full rays-rangers read only sets inside the band at 34px, which is a caption, not a hook.
//
// The real answer is editorial. The reel is the hook and the card is the record. The card already
// carries the whole read, the figures, the observation stamp and the legal line; the reel needs the
// sentence that makes a stranger stop. So take whole sentences while they still set at a size that
// reads at arm's length, and let the card carry the rest. Nothing is invented and no figure moves:
// this only ever drops trailing sentences from copy that is already written and already checked.
import { fitToBox, measureText } from './balance-lines.mjs';

// The smallest size that still reads as a headline on a phone rather than as a caption.
export const MIN_HERO_PX = 48;
export const MAX_HERO_LINES = 5;

// A private-use codepoint, so it cannot occur in real copy.
const DECIMAL_GUARD = String.fromCharCode(0xE000);

/**
 * Split prose into sentences WITHOUT splitting a decimal.
 *
 * "Precision reads it at 72.9" is one sentence. A naive /[^.!?]+[.!?]+/ splits it after "72." and
 * renders "72. 9", which publishes a wrong number in 60px type. Every figure this desk prints is a
 * probability with one decimal place, so this is not a hypothetical.
 */
export const splitSentences = (text) => {
  const s = String(text ?? '').trim();
  if (!s) return [];
  const guarded = s.replace(/(\d)\.(\d)/g, `$1${DECIMAL_GUARD}$2`);
  const parts = guarded.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [guarded];
  return parts.map((p) => p.replaceAll(DECIMAL_GUARD, '.').trim()).filter(Boolean);
};

/**
 * The reel's second beat: the text, the size it is set at, and the lines it breaks into.
 *
 * Returns { text, size, lines, sentences, of } so a QA receipt can record how much of the read the
 * reel carried and why.
 */
export const readForReel = (read, boxPx, {
  sizes = [60, 56, 52, 48], maxLines = MAX_HERO_LINES, minPx = MIN_HERO_PX, upper = true, ...opts
} = {}) => {
  const sentences = splitSentences(read);
  if (!sentences.length) return { text: '', size: sizes[0], lines: [], sentences: 0, of: 0 };
  const cast = (t) => {
    const clean = t.trim().replace(/[.!]$/, '');
    return upper ? clean.toUpperCase() : clean;
  };
  for (let n = sentences.length; n >= 1; n -= 1) {
    const text = cast(sentences.slice(0, n).join(' '));
    const fit = fitToBox(text, boxPx, { sizes, maxLines, ...opts });
    // fitToBox falls back to the smallest size in the ladder when nothing fits, so the line count
    // has to be checked too. Trusting the returned size alone is what let a seven-line block
    // through at 48px on the first attempt.
    if (fit.size >= minPx && fit.lines.length <= maxLines) {
      return { text, ...fit, sentences: n, of: sentences.length };
    }
  }
  // One sentence that still will not fit is set at the floor and allowed to run a line long. The
  // alternative is truncating a sentence mid-clause, which changes what the desk said.
  const text = cast(sentences[0]);
  const fit = fitToBox(text, boxPx, { sizes: [minPx], maxLines: maxLines + 1, ...opts });
  return { text, ...fit, sentences: 1, of: sentences.length };
};

export { measureText };
