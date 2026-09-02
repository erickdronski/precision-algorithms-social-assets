// The pinned explainer: who Precision Algorithms is, in twenty seconds, for a stranger who has never
// heard of a prediction market.
//
// This one is different from the market reels and the difference is the point. A market reel is a
// dated snapshot that expires; this sits at the top of the profile for months, so every frame has to
// stay true indefinitely. That rules out three things the daily format allows: a live figure, a
// market that will settle, and any claim about how the model has performed.
//
// Six beats:
//   0.0  COVER      The pinned thumbnail. It is a frame, not a transition: the bull, the name, and
//                   one line a stranger can act on. TikTok shows this still in the grid and in the
//                   pin, so it has to work with no motion and no sound.
//   3.4  THE BOARD  What a prediction market is, with the two venue marks landing together.
//   7.0  THE MODEL  Our side of it, and the chart draws itself left to right.
//   11.6 THE GAP    The reading of that chart, stated plainly, with the gap called out.
//   15.4 THE LIMIT  What we are not. This beat is the credibility beat and it is deliberately blunt.
//   18.2 CTA        Where to go, and the legal footer.
//
// The chart is real: forty-seven observations of one open contract out of the desk's own history
// ledger, drawn by source/build-chart.mjs. It settles 31 December 2026, so nothing here can be
// scored against an outcome, which is exactly why that contract was chosen. See build-chart.mjs.
//
//   higgsedit build explainer.jsx    (project dir needs src/bull.png, src/kalshi.png,
//                                     src/polymarket.png, src/chart.png and General Sans 700, Satoshi 500 and
//                                     JetBrains Mono 500 registered, see brand/fonts in the assets repo)
import { readFileSync } from 'node:fs';

export default async ({ project }) => {
  // Every figure on screen comes from assets/explainer-spec.json, written by source/build-chart.mjs
  // out of the same observations the chart is drawn from. Nothing here is typed by hand.
  const S = JSON.parse(readFileSync(process.env.SPEC || 'explainer-spec.json', 'utf8'));
  const W = 1080, H = 1920, D = 20, F = 1 / 30, life = (a) => D - a;
  const p = await project({ dir: '.', size: `${W}x${H}`, fps: 30, background: '#05090D' });
  const bull = await p.add('src/bull.png');
  const kalshi = await p.add('src/kalshi.png');
  const poly = await p.add('src/polymarket.png');
  const chart = await p.add('src/chart.png');

  const NAVY = '#05090D', MINT = '#34DFBA', BLUE = '#147DFF', WHITE = '#F8FAF8';
  const MUTE = '#8BE8D9', GREY = '#9AA6AD', CARD = '#0A1B24', ROW = '#0F2833';
  const M = 80, CW = W - 2 * M;
  // Beat starts. Every node is windowed with at/duration so nothing from a past beat is still alive.
  const B1 = 3.4, B2 = 7.0, B3 = 11.6, B4 = 15.4, B5 = 18.2;
  // beat(START, END), both absolute times. It returns a duration because that is what higgsedit
  // wants, and passing a duration in as the second argument produces a negative window that dies
  // with "Cannot read properties of undefined (reading 'dur')" rather than anything readable.
  const beat = (a, b) => {
    const duration = b - a;
    if (!(duration > 0)) throw new Error(`beat(${a}, ${b}) is not a window: end must be after start`);
    return { at: a, duration };
  };
  // The house fade: in over 0.35s, hold, out over the last 0.25s of the window.
  const fade = (len) => [{ property: 'opacity', keyframes: [
    { at: 0, value: 0 }, { at: 0.35, value: 1 }, { at: len - 0.25, value: 1 }, { at: len - 0.02, value: 0 },
  ] }];
  const riseFade = (len, dy = 26) => [
    ...fade(len),
    { property: 'offsetY', from: dy, to: 0, duration: 0.5, easing: 'house' },
  ];

  const CHART_W = 1000, CHART_H = Math.round((CHART_W * 620) / 1080);

  const nodes = [
    // A single field for the whole clip. No photograph: this is the house's own surface, and a
    // stranger's first frame should be the brand rather than a stock picture of something else.
    <rect x={0} y={0} width={W} height={H} fill={{ kind: 'radial', angle: 0, stops: [
      { offset: 0, color: '#0B2430' }, { offset: 0.55, color: '#061219' }, { offset: 1, color: NAVY },
    ] }} />,

    // ── Beat 0: the cover ───────────────────────────────────────────────────────────────────────
    // Held longer than a normal beat because it is also the thumbnail. The bull settles rather than
    // bounces: a pinned cover that jitters looks cheap on a second viewing.
    //
    // This frame is designed for the TikTok PROFILE GRID, where it appears as a tile roughly 150px
    // wide, which is 0.139 of the frame. At that scale the old cover said nothing: the wordmark at
    // 82px rendered 11px tall, the mint pill's 25px mono rendered 3.5px and read as a solid green
    // bar, and the body copy at 48px was gone entirely. Erick, 2 September: "The cover slide to our
    // pinned video should show 'Who we are' as the title under precision algorithms so a user can
    // quickly see what the video is about."
    //
    // He is right about more than the words. The profile page already prints the account name and
    // this same bull as the avatar directly above the grid, so the cover does not have to answer
    // "who is this". It has to answer "what is THIS video", and "Who we are" at 124px is the only
    // string in the frame that survives the tile. The wordmark drops to 56px, which also takes it
    // off the wrap ceiling it was sitting on: 20 characters against a budget of exactly 20.
    // The mint pill is gone. It said the same thing as the line under it, and it cost the frame its
    // only piece of semantic colour: mint means the model estimate (AGENTS.md), and a mint slab
    // behind a slogan spends that meaning on decoration. The bull is the frame's mint now.
    <group name="coverbull" x={(W - 340) / 2 - 27} y={498} width={340} height={340} origin="center"
      {...beat(0.15, B1)}
      animate={[
        { property: 'scale', keyframes: [{ at: 0, value: 0.86 }, { at: 0.55, value: 1.02, easing: 'house' }, { at: 0.85, value: 1 }] },
        // The old keyframes ramped 1 -> 0 with no hold, so opacity fell from the instant it arrived
        // and the mark sat at 42% at the cover grab, which is why it is a ghost in the render Erick
        // saw. fade() holds full opacity across the beat and drops only at the end, the same shape
        // every other element here uses.
        ...fade(B1 - 0.15),
      ]}>
      <media file={bull} x={0} y={0} width={340} fit="width" />
    </group>,
    // x is nudged 27px left of centre on purpose. The mark's ink is not centred in its own PNG:
    // measured on brand/logo-v2026/assets/precision-bull-primary.png, the alpha above half spans
    // x 254-933 of 1024, so its optical centre sits at 0.5796 of the box, which is 27px right of
    // box centre at 340px. Without the nudge the bull leans right of a centred wordmark.
    <text x={M} y={875} width={CW} align="center" fontFamily="General Sans" fontSize={56} fontWeight={700}
      color={WHITE} lineHeight={1.1} {...beat(0.55, B1)} animate={riseFade(B1 - 0.55, 26)}>
      Precision Algorithms
    </text>,
    <text x={M} y={972} width={CW} align="center" fontFamily="General Sans" fontSize={124} fontWeight={700}
      color={WHITE} lineHeight={1.05} {...beat(0.95, B1)} animate={riseFade(B1 - 0.95, 30)}>
      Who we are
    </text>,
    <text x={M} y={1155} width={CW} align="center" fontFamily="Satoshi" fontSize={48} fontWeight={500}
      color={MUTE} lineHeight={1.35} {...beat(1.3, B1)} animate={riseFade(B1 - 1.3, 24)}>
      {'A machine learning model\nfor Kalshi and Polymarket'}
    </text>,

    // ── Beat 1: what a prediction market is ─────────────────────────────────────────────────────
    <text x={M} y={700} width={CW} align="center" fontFamily="General Sans" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B1, B2)} animate={riseFade(B2 - B1, 28)}>
      {'Kalshi and Polymarket put\na price on what happens next'}
    </text>,
    <text x={M} y={900} width={CW} align="center" fontFamily="Satoshi" fontSize={38} fontWeight={500}
      color={MUTE} lineHeight={1.4} {...beat(B1 + 0.35, B2)} animate={riseFade(B2 - B1 - 0.35, 22)}>
      {'That price is what traders think,\nwritten as a percent'}
    </text>,
    <row x={(W - 720) / 2} y={1090} width={720} gap={64} justify="center" align="center"
      {...beat(B1 + 0.75, B2)} animate={riseFade(B2 - B1 - 0.75, 18)}>
      <media file={kalshi} width={260} fit="width" />
      <media file={poly} width={300} fit="width" />
    </row>,

    // ── Beat 2: the model, and the chart drawing itself ─────────────────────────────────────────
    <text x={M} y={600} width={CW} align="center" fontFamily="General Sans" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B2, B3)} animate={riseFade(B3 - B2, 28)}>
      {'We run a machine learning\nmodel on the same question'}
    </text>,
    // The chart is revealed left to right by a mask, the same mechanism the banner uses to pencil in
    // its connector. Declared mask width starts at zero and animates to full: a mask declared at zero
    // width is refused, so the rectangle is declared at full size and the ANIMATED value starts at 0.
    <group name="chart" x={(W - CHART_W) / 2} y={830} width={CHART_W} height={CHART_H}
      mask={{ shape: 'rectangle', x: 0, y: 0, width: CHART_W, height: CHART_H }}
      {...beat(B2 + 0.3, B3)}
      animate={[
        { property: 'maskWidth', keyframes: [{ at: 0, value: 0 }, { at: 0.25, value: 0 }, { at: 2.1, value: CHART_W, easing: 'ease-out' }] },
        { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.25, value: 1 }, { at: B3 - B2 - 0.3 - 0.02, value: 0 }] },
      ]}>
      <media file={chart} x={0} y={0} width={CHART_W} fit="width" />
    </group>,
    <row x={(W - 660) / 2} y={1420} width={660} gap={44} justify="center" align="center"
      {...beat(B2 + 1.6, B3)} animate={riseFade(B3 - B2 - 1.6, 16)}>
      <text fontFamily="JetBrains Mono" fontSize={26} fontWeight={500} letterSpacing={3} color={WHITE}>THEIR PRICE</text>
      <text fontFamily="JetBrains Mono" fontSize={26} fontWeight={500} letterSpacing={3} color={MINT}>OUR MODEL</text>
    </row>,

    // ── Beat 3: reading the chart ───────────────────────────────────────────────────────────────
    <text x={M} y={640} width={CW} align="center" fontFamily="General Sans" fontSize={56} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B3, B4)} animate={riseFade(B4 - B3, 26)}>
      {'When the two disagree,\nwe publish the difference'}
    </text>,
    <text x={M} y={840} width={CW} align="center" fontFamily="Satoshi" fontSize={44} fontWeight={500}
      color={MUTE} lineHeight={1.35} {...beat(B3 + 0.3, B4)} animate={riseFade(B4 - B3 - 0.3, 22)}>
      {S.gapPoints + ' points apart on ' + S.asOf}
    </text>,
    <column name="gapcard" x={(W - 760) / 2} y={1020} width={760} radius={30} fill={CARD}
      padding={{ top: 36, bottom: 36, left: 38, right: 38 }} gap={18}
      {...beat(B3 + 0.7, B4)} animate={riseFade(B4 - B3 - 0.7, 26)}>
      <row width={684} radius={18} fill={ROW} padding={{ top: 18, bottom: 18, left: 24, right: 24 }} justify="space-between" align="center">
        <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={GREY}>{S.venueLabel.toUpperCase()}</text>
        <text fontFamily="JetBrains Mono" fontSize={56} fontWeight={500} color={WHITE}>{S.venueLast + '%'}</text>
      </row>
      <row width={684} radius={18} fill={ROW} padding={{ top: 18, bottom: 18, left: 24, right: 24 }} justify="space-between" align="center">
        <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={MINT}>PRECISION</text>
        <text fontFamily="JetBrains Mono" fontSize={56} fontWeight={500} color={MINT}>{S.modelLast + '%'}</text>
      </row>
      <text width={684} align="center" fontFamily="General Sans" fontSize={30} fontWeight={700} color={BLUE}>
        {'That distance is the edge we publish'}
      </text>
    </column>,

    // ── Beat 4: what we are not ─────────────────────────────────────────────────────────────────
    <text x={M} y={700} width={CW} align="center" fontFamily="General Sans" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.22} {...beat(B4, B5)} animate={riseFade(B5 - B4, 26)}>
      {'We publish the number.\nWe do not place trades'}
    </text>,
    <text x={M} y={950} width={CW} align="center" fontFamily="Satoshi" fontSize={38} fontWeight={500}
      color={MUTE} lineHeight={1.4} {...beat(B4 + 0.35, B5)} animate={riseFade(B5 - B4 - 0.35, 20)}>
      {'No broker. No positions. No tips.\nA model estimate beside the market price'}
    </text>,

    // ── Beat 5: the CTA ─────────────────────────────────────────────────────────────────────────
    <rect name="ctafield" x={0} y={0} width={W} height={H} fill={NAVY}
      animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: B5 - 0.35, value: 0 }, { at: B5, value: 1, easing: 'house' }] }]} />,
    <group name="ctabull" x={(W - 200) / 2} y={620} width={200} height={200} origin="center"
      {...beat(B5, D)}
      animate={[
        { property: 'scale', keyframes: [{ at: 0, value: 0.84 }, { at: 0.4, value: 1.03, easing: 'house' }, { at: 0.62, value: 1 }] },
        { property: 'opacity', from: 0, to: 1, duration: 0.3 },
      ]}>
      <media file={bull} x={0} y={0} width={200} fit="width" />
    </group>,
    <text x={M} y={900} width={CW} align="center" fontFamily="General Sans" fontSize={54} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B5 + 0.2, D)}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.35 }, { property: 'offsetY', from: 22, to: 0, duration: 0.5, easing: 'house' }]}>
      {'Five free previews a day'}
    </text>,
    <text x={M} y={1000} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={42} fontWeight={500}
      color={MINT} {...beat(B5 + 0.35, D)}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.35 }]}>
      precisionalgorithms.com
    </text>,
    <row x={(W - 280) / 2} y={1090} width={280} padding={{ top: 14, bottom: 14, left: 24, right: 24 }}
      radius={26} fill={MINT} justify="center" {...beat(B5 + 0.55, D)}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.3 }]}>
      <text fontFamily="General Sans" fontSize={28} fontWeight={700} color={NAVY}>Link in bio</text>
    </row>,
    <text x={M} y={1660} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={18}
      fontWeight={500} color={GREY} lineHeight={1.5} {...beat(B5 + 0.7, D)}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.4 }]}>
      {'Informational research. Precision does not place trades.\nModel estimates can be wrong. Prediction markets involve risk.\nKalshi and Polymarket named for market-source context; no affiliation implied.\n' + S.legalChart}
    </text>,

    // Loops back to the cover field so a replay does not flash.
    <rect name="loopfade" x={0} y={0} width={W} height={H} fill={NAVY}
      animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: D - 0.6, value: 0 }, { at: D - F, value: 1, easing: 'house' }] }]} />,
  ];

  // compose() takes the duration explicitly: `compose(): dur must be a positive number of seconds`.
  // Omitting it dies as "Cannot read properties of undefined (reading 'dur')", which reads like a
  // broken node tree and is not.
  await p.compose(nodes, { dur: D });
  await p.render('renders/pa-explainer.mp4');
  // The cover is frame one of the hold, not a transition frame: it is the pinned thumbnail.
  await p.frame(2.2, 'renders/pa-explainer-cover.png');
  await p.frame(5.2, 'renders/pa-explainer-2.png');
  await p.frame(9.6, 'renders/pa-explainer-3.png');
  await p.frame(13.4, 'renders/pa-explainer-4.png');
  await p.frame(19.0, 'renders/pa-explainer-5.png');
};
