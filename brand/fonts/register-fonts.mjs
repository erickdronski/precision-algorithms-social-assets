// Register the Precision Algorithms house faces with a higgsedit project, from inside the render
// sandbox.
//
// Why this file exists. higgsedit's own `fonts add` vendors from Google Fonts and nowhere else, and
// two of our three faces are Fontshare releases, so the CLI answers "Google Fonts answered 400" for
// both General Sans and Satoshi. Until 2 September 2026 every reel this desk published was
// therefore set in Inter, a typeface that appears on no card we make. Erick, that day: "make sure
// all our outputs are following the same font, branding style, theme, colors, etc so we are all
// uniform in what we do."
//
// The renderer does not care where a face came from. It reads font assets off project.json and
// refuses to render if a family the document sets text in never applied, which is the guard that
// makes this safe: a mis-registration fails the render instead of silently drawing in a fallback.
// So this writes the same asset rows `fonts add` writes, pointing at the woff2 files served from
// this repository at brand/fonts/.
//
// Recipe, inside the sandbox, in one chained command (the sandbox is discarded seconds after a call
// returns, so nothing survives between calls):
//
//   B=https://raw.githubusercontent.com/erickdronski/precision-algorithms-social-assets/main/brand/fonts
//   mkdir -p fonts
//   for f in general-sans-500 general-sans-700 satoshi-400 satoshi-500 satoshi-700 jetbrains-mono-500; do
//     curl -fsSL "$B/$f.woff2" -o "fonts/$f.woff2"; done
//   curl -fsSL "$B/register-fonts.mjs" -o register-fonts.mjs
//   higgsedit build <composition>.jsx   # first build creates project.json and may fail on fonts
//   node register-fonts.mjs             # register the faces
//   higgsedit build <composition>.jsx   # now it renders in the house faces
//
// Check the byte sizes after the curl. raw.githubusercontent has served this desk stale bytes
// before and ignores cache-busting query parameters.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';

// The slug in the filename maps to the family name the compositions set text in. A file whose slug
// is not in this table is refused rather than guessed at: a face registered under the wrong family
// name renders as a fallback, and a fallback that renders is worse than a render that stops.
const FAMILY = {
  'general-sans': 'General Sans',
  satoshi: 'Satoshi',
  'jetbrains-mono': 'JetBrains Mono',
};

if (!existsSync('project.json')) {
  console.error('No project.json here. Run `higgsedit build <composition>` once first: the first build creates the project, and it is allowed to fail on fonts.');
  process.exit(1);
}
if (!existsSync('fonts')) {
  console.error('No fonts/ directory. Fetch the woff2 files from brand/fonts in the assets repo first.');
  process.exit(1);
}

const project = JSON.parse(readFileSync('project.json', 'utf8'));
// Replace rather than append: running this twice must not leave two rows for one face.
project.assets = (project.assets || []).filter((a) => a.kind !== 'font');

const files = readdirSync('fonts').filter((f) => f.endsWith('.woff2')).sort();
if (!files.length) {
  console.error('fonts/ has no .woff2 files.');
  process.exit(1);
}

for (const file of files) {
  const m = file.match(/^(.*)-(\d{3})\.woff2$/);
  if (!m) throw new Error(`fonts/${file} is not named <family-slug>-<weight>.woff2`);
  const family = FAMILY[m[1]];
  if (!family) throw new Error(`fonts/${file}: no family name is mapped for the slug "${m[1]}". Add it to FAMILY rather than letting the renderer guess.`);
  const size = statSync(`fonts/${file}`).size;
  // A truncated or HTML-error-page download is a common failure on this path and produces a file
  // that is present, small, and useless. Every real face here is over 20 KB.
  if (size < 8000) throw new Error(`fonts/${file} is only ${size} bytes. That is a failed download, not a typeface.`);
  project.assets.push({
    id: `font-${m[1]}-${m[2]}`,
    name: `fonts/${file}`,
    kind: 'font',
    mimeType: 'font/woff2',
    byteSize: size,
    duration: null,
    width: null,
    height: null,
    fontFace: { family, weight: m[2], style: 'normal' },
    uri: `fs:fonts/${file}`,
    hash: null,
  });
}

writeFileSync('project.json', `${JSON.stringify(project, null, 2)}\n`);
const registered = project.assets.filter((a) => a.kind === 'font');
console.log(`registered ${registered.length} face(s): ${registered.map((a) => `${a.fontFace.family} ${a.fontFace.weight}`).join(', ')}`);
