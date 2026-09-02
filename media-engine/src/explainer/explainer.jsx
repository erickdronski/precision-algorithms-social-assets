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
//   higgsedit build explainer.jsx    (project dir needs src/bull.png, src/kalshi.svg,
//                                     src/polymarket.svg, src/chart.svg and Inter 700/500 +
//                                     JetBrains Mono 500 vendored)
export default async ({ project }) => {
  const W = 1080, H = 1920, D = 20, F = 1 / 30, life = (a) => D - a;
  const p = await project({ dir: '.', size: `${W}x${H}`, fps: 30, background: '#05090D' });
  const bull = await p.add('src/bull.png');
  const kalshi = await p.add('src/kalshi.svg');
  const poly = await p.add('src/polymarket.svg');
  const chart = await p.add('src/chart.svg');

  const NAVY = '#05090D', MINT = '#34DFBA', BLUE = '#147DFF', WHITE = '#F8FAF8';
  const MUTE = '#8BE8D9', GREY = '#9AA6AD', CARD = '#0A1B24', ROW = '#0F2833';
  const M = 80, CW = W - 2 * M;
  // Beat starts. Every node is windowed with at/duration so nothing from a past beat is still alive.
  const B1 = 3.4, B2 = 7.0, B3 = 11.6, B4 = 15.4, B5 = 18.2;
  const beat = (a, b) => ({ at: a, duration: b - a });
  // The house fade: in over 0.35s, hold, out over the last 0.25s of the window.
  const fade = (len) => [{ property: 'opacity', keyframes: [
    { at: 0, value: 0 }, { at: 0.35, value: 1 }, { at: len - 0.25, value: 1 }, { at: len - 0.02, value: 0 },
  ] }];
  const riseFade = (len, dy = 26) => [
    ...fade(len),
    { property: 'offsetY', from: dy, to: 0, duration: 0.5, easing: 'house' },
  ];

  const CHART_W = 920, CHART_H = Math.round((CHART_W * 560) / 1080);

  const nodes = [
    // A single field for the whole clip. No photograph: this is the house's own surface, and a
    // stranger's first frame should be the brand rather than a stock picture of something else.
    <rect x={0} y={0} width={W} height={H} fill={{ kind: 'radial', angle: 0, stops: [
      { offset: 0, color: '#0B2430' }, { offset: 0.55, color: '#061219' }, { offset: 1, color: NAVY },
    ] }} />,

    // ── Beat 0: the cover ───────────────────────────────────────────────────────────────────────
    // Held longer than a normal beat because it is also the thumbnail. The bull settles rather than
    // bounces: a pinned cover that jitters looks cheap on a second viewing.
    <group name="coverbull" x={(W - 300) / 2} y={470} width={300} height={300} origin="center"
      {...beat(0.15, B1)}
      animate={[
        { property: 'scale', keyframes: [{ at: 0, value: 0.86 }, { at: 0.55, value: 1.02, easing: 'house' }, { at: 0.85, value: 1 }] },
        { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.4, value: 1 }, { at: B1 - 0.15 - 0.02, value: 0 }] },
      ]}>
      <media file={bull} x={0} y={0} width={300} fit="width" />
    </group>,
    <text x={M} y={840} width={CW} align="center" fontFamily="Inter" fontSize={78} fontWeight={700}
      color={WHITE} lineHeight={1.1} {...beat(0.5, B1)} animate={riseFade(B1 - 0.5, 30)}>
      Precision Algorithms
    </text>,
    <row x={(W - 560) / 2} y={968} width={560} padding={{ top: 16, bottom: 16, left: 26, right: 26 }}
      radius={30} fill={MINT} justify="center" {...beat(0.9, B1)} animate={riseFade(B1 - 0.9, 20)}>
      <text fontFamily="JetBrains Mono" fontSize={25} fontWeight={500} letterSpacing={4} color={NAVY}>
        INDEPENDENT PROBABILITY RESEARCH
      </text>
    </row>,
    <text x={M} y={1080} width={CW} align="center" fontFamily="Inter" fontSize={46} fontWeight={500}
      color={MUTE} lineHeight={1.35} {...beat(1.25, B1)} animate={riseFade(B1 - 1.25, 24)}>
      {'The board has a price.\nWe run our own number.'}
    </text>,

    // ── Beat 1: what a prediction market is ─────────────────────────────────────────────────────
    <text x={M} y={640} width={CW} align="center" fontFamily="Inter" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B1, B2)} animate={riseFade(B2 - B1, 28)}>
      {'Prediction markets put a price\non what happens next'}
    </text>,
    <text x={M} y={840} width={CW} align="center" fontFamily="Inter" fontSize={38} fontWeight={500}
      color={MUTE} lineHeight={1.4} {...beat(B1 + 0.35, B2)} animate={riseFade(B2 - B1 - 0.35, 22)}>
      Traders move that price all day, on two of the venues we cover
    </text>,
    <row x={(W - 720) / 2} y={1020} width={720} gap={64} justify="center" align="center"
      {...beat(B1 + 0.75, B2)} animate={riseFade(B2 - B1 - 0.75, 18)}>
      <media file={kalshi} width={260} fit="width" />
      <media file={poly} width={300} fit="width" />
    </row>,

    // ── Beat 2: the model, and the chart drawing itself ─────────────────────────────────────────
    <text x={M} y={520} width={CW} align="center" fontFamily="Inter" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B2, B3)} animate={riseFade(B3 - B2, 28)}>
      {'We score the same question\nwith our own model'}
    </text>,
    // The chart is revealed left to right by a mask, the same mechanism the banner uses to pencil in
    // its connector. Declared mask width starts at zero and animates to full: a mask declared at zero
    // width is refused, so the rectangle is declared at full size and the ANIMATED value starts at 0.
    <group name="chart" x={(W - CHART_W) / 2} y={760} width={CHART_W} height={CHART_H}
      mask={{ shape: 'rectangle', x: 0, y: 0, width: CHART_W, height: CHART_H }}
      {...beat(B2 + 0.3, B3)}
      animate={[
        { property: 'maskWidth', keyframes: [{ at: 0, value: 0 }, { at: 0.25, value: 0 }, { at: 2.1, value: CHART_W, easing: 'ease-out' }] },
        { property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: 0.25, value: 1 }, { at: B3 - B2 - 0.3 - 0.02, value: 0 }] },
      ]}>
      <media file={chart} x={0} y={0} width={CHART_W} fit="width" />
    </group>,
    <row x={(W - 660) / 2} y={1300} width={660} gap={44} justify="center" align="center"
      {...beat(B2 + 1.6, B3)} animate={riseFade(B3 - B2 - 1.6, 16)}>
      <text fontFamily="JetBrains Mono" fontSize={26} fontWeight={500} letterSpacing={3} color={WHITE}>THE BOARD</text>
      <text fontFamily="JetBrains Mono" fontSize={26} fontWeight={500} letterSpacing={3} color={MINT}>OUR MODEL</text>
    </row>,

    // ── Beat 3: reading the chart ───────────────────────────────────────────────────────────────
    <text x={M} y={560} width={CW} align="center" fontFamily="Inter" fontSize={56} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B3, B4)} animate={riseFade(B4 - B3, 26)}>
      {'Over three days the board\nwalked five points'}
    </text>,
    <text x={M} y={760} width={CW} align="center" fontFamily="Inter" fontSize={44} fontWeight={500}
      color={MUTE} lineHeight={1.35} {...beat(B3 + 0.3, B4)} animate={riseFade(B4 - B3 - 0.3, 22)}>
      Our number did not move at all
    </text>,
    <column name="gapcard" x={(W - 720) / 2} y={960} width={720} radius={28} fill={CARD}
      padding={{ top: 34, bottom: 34, left: 36, right: 36 }} gap={18}
      {...beat(B3 + 0.7, B4)} animate={riseFade(B4 - B3 - 0.7, 26)}>
      <row width={648} radius={18} fill={ROW} padding={{ top: 18, bottom: 18, left: 24, right: 24 }} justify="space-between" align="center">
        <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={GREY}>POLYMARKET</text>
        <text fontFamily="JetBrains Mono" fontSize={56} fontWeight={500} color={WHITE}>40%</text>
      </row>
      <row width={648} radius={18} fill={ROW} padding={{ top: 18, bottom: 18, left: 24, right: 24 }} justify="space-between" align="center">
        <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={MINT}>PRECISION</text>
        <text fontFamily="JetBrains Mono" fontSize={56} fontWeight={500} color={MINT}>22%</text>
      </row>
      <text width={648} align="center" fontFamily="Inter" fontSize={30} fontWeight={700} color={BLUE}>
        That distance is the Model Gap
      </text>
    </column>,

    // ── Beat 4: what we are not ─────────────────────────────────────────────────────────────────
    <text x={M} y={700} width={CW} align="center" fontFamily="Inter" fontSize={58} fontWeight={700}
      color={WHITE} lineHeight={1.22} {...beat(B4, B5)} animate={riseFade(B5 - B4, 26)}>
      {'We publish the difference.\nWe do not place trades'}
    </text>,
    <text x={M} y={950} width={CW} align="center" fontFamily="Inter" fontSize={38} fontWeight={500}
      color={MUTE} lineHeight={1.4} {...beat(B4 + 0.35, B5)} animate={riseFade(B5 - B4 - 0.35, 20)}>
      No broker, no positions, no tips. A model estimate beside the market price, every day
    </text>,

    // ── Beat 5: the CTA ─────────────────────────────────────────────────────────────────────────
    <rect name="ctafield" x={0} y={0} width={W} height={H} fill={NAVY}
      animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: B5 - 0.35, value: 0 }, { at: B5, value: 1, easing: 'house' }] }]} />,
    <group name="ctabull" x={(W - 200) / 2} y={620} width={200} height={200} origin="center"
      {...beat(B5, life(B5))}
      animate={[
        { property: 'scale', keyframes: [{ at: 0, value: 0.84 }, { at: 0.4, value: 1.03, easing: 'house' }, { at: 0.62, value: 1 }] },
        { property: 'opacity', from: 0, to: 1, duration: 0.3 },
      ]}>
      <media file={bull} x={0} y={0} width={200} fit="width" />
    </group>,
    <text x={M} y={900} width={CW} align="center" fontFamily="Inter" fontSize={54} fontWeight={700}
      color={WHITE} lineHeight={1.2} {...beat(B5 + 0.2, life(B5 + 0.2))}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.35 }, { property: 'offsetY', from: 22, to: 0, duration: 0.5, easing: 'house' }]}>
      See today&apos;s markets
    </text>,
    <text x={M} y={1000} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={42} fontWeight={500}
      color={MINT} {...beat(B5 + 0.35, life(B5 + 0.35))}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.35 }]}>
      precisionalgorithms.com
    </text>,
    <row x={(W - 280) / 2} y={1090} width={280} padding={{ top: 14, bottom: 14, left: 24, right: 24 }}
      radius={26} fill={MINT} justify="center" {...beat(B5 + 0.55, life(B5 + 0.55))}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.3 }]}>
      <text fontFamily="Inter" fontSize={28} fontWeight={700} color={NAVY}>Link in bio</text>
    </row>,
    <text x={M} y={1660} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={18}
      fontWeight={500} color={GREY} lineHeight={1.5} {...beat(B5 + 0.7, life(B5 + 0.7))}
      animate={[{ property: 'opacity', from: 0, to: 1, duration: 0.4 }]}>
      {'Informational research. Precision does not place trades.\nModel estimates can be wrong. Prediction markets involve risk.\nKalshi and Polymarket named for market-source context; no affiliation implied.\nChart: 47 observations of one open contract, 31 Aug to 2 Sep 2026. No outcome is claimed.'}
    </text>,

    // Loops back to the cover field so a replay does not flash.
    <rect name="loopfade" x={0} y={0} width={W} height={H} fill={NAVY}
      animate={[{ property: 'opacity', keyframes: [{ at: 0, value: 0 }, { at: D - 0.6, value: 0 }, { at: D - F, value: 1, easing: 'house' }] }]} />,
  ];

  await p.compose(nodes);
  await p.render('renders/pa-explainer.mp4');
  // The cover is frame one of the hold, not a transition frame: it is the pinned thumbnail.
  await p.frame(2.2, 'renders/pa-explainer-cover.png');
  await p.frame(5.2, 'renders/pa-explainer-2.png');
  await p.frame(9.6, 'renders/pa-explainer-3.png');
  await p.frame(13.4, 'renders/pa-explainer-4.png');
  await p.frame(19.0, 'renders/pa-explainer-5.png');
};
