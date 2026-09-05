# media-engine/v4 — the APPROVED TikTok and Instagram Reels template

Approved by Erick on 5 September 2026: *"this is perfect! lock this in log this and back this up to
github for codex to be aware. this is the ongoing template for tiktok and instagram reels."*

`APPROVED-REFERENCE-2026-09-05.jpg` is the render he approved: the six opening tiles.

## The format

1080x1920, 30fps, **18.0 seconds**, licensed audio bed. A full-bleed licensed plate under a slow
push-in, the brand row top left, and a five-line legal footer carrying the observation stamp and the
photo credit. **Three tiles, and the order is not a preference:**

| Tile | Clock | On screen |
|---|---|---|
| 1 | 0.5 – 7.4 | Venue chip, the exact market question, and **the divergence**: two curves leaving ONE origin and separating by exactly the distance between the two readings, the venue's in white below and Precision's in mint above; both figures counting up beneath them on the same clock; the Model Gap in Edge Blue |
| 2 | 7.6 – 12.6 | `EVENT CONTEXT` — one sourced fact about the real-world event, with its source and date named underneath |
| 3 | 12.8 – 18.0 | The bull, the desk, "Sign up for free predictions today.", the free tier, `precisionalgorithms.com`, "Link in bio." |

## Where the engine lives

`social-assets/campaigns/pa-2026-09-05-reels-v4/source/render-reel.mjs` in the content-engine repo.
It needs **only Chrome and ffmpeg** — no Higgsfield sandbox and no MCP connector — so a scheduled
window can build a reel unattended. Read that campaign's `APPROVED.json` and `README.md`, and
`docs/agents/TIKTOK-ENGINE.md`, before changing anything.

## Four rules that come with it

- **The divergence draws two CURRENT figures, never a time series.** The real time-series chart is
  `scripts/render-divergence.mjs` and it refuses to draw without eight recorded observations across
  24 hours with no hole over nine.
- **Every file is `tt-<market-key>.mp4`.** `parseAssetKey` in `queue-guard.mjs` resolves a queued
  asset back to its market record through the filename, and the shape it accepts is
  `<fmt>-<key>.<ext>`. A reel named anything else has figures nobody can re-verify before it
  publishes.
- **All three figures are burned into pixels**, so re-verification refuses drift past 1.5 points on
  the venue price, the model estimate *and* the gap. A wrong number in a video is deleted, never
  edited, and a reel never sits in a queue overnight.
- **Cards are centred, and centring is measured.** These renders measure 0.0px off on all four
  layers.

## The eight 15-second reels published on 5 September are superseded

`2026/09-05-six-fresh-reels-v1/` and `2026/09-05-venue-context-reels-v1/` carry no divergence tile,
and their filenames (`<key>-15s.mp4`) return null from `parseAssetKey`, so none of their burned-in
figures can be re-verified before publishing. Renaming them to `tt-<key>.mp4` fixes the second
problem on its own.
