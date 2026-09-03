// Media engine, clip 3 v4: the production TikTok / Reels format, with the venue's own mark on it.
//
// What changed from v3 (Erick, 2 Sep 2026): "add Kalshi & Polymarket logo/branding when mentioned,
// it's a big credibility add and design add. Really think cinematic, motion graphic, UI/UX, design
// principles and how we hook attention and garner credibility being attached to these giants in the
// prediction market space."
//
// He is naming a real regression. v3 printed the venue's NAME five times and its MARK zero times,
// while the static market card has carried a proper venue chip since v29 and the first two reels in
// this campaign (banner.jsx, market.jsx) both landed the logos. The reel, which is the format a
// stranger meets first, was the one surface that dropped them.
//
// The design argument for putting them back, in the order that matters:
//
//   1. CREDIBILITY IS BORROWED BEFORE IT IS EARNED. Nobody knows this desk. Everybody who would
//      care about this reel knows Kalshi or Polymarket. A recognisable mark in frame one is the
//      fastest available proof that the thing on screen is a real market and not a chart someone
//      drew. The word "Polymarket" set in 28px muted text was doing none of that work.
//   2. THE THESIS IS A PICTURE, NOT A CAPTION. The product is one sentence: the venue prices a
//      question, our model prices the same question, we publish the distance. v3 said that in a
//      subline. v4 stages it: the venue chip enters from the left, the Precision chip from the
//      right, they stop apart, and the gap between them is where the number lands two beats later.
//      The layout IS the argument, which is the only version a viewer absorbs in 1.5 seconds.
//   3. TWO BRANDS READ FASTER THAN TWO LABELS. On the figures card, "POLYMARKET NO" and
//      "PRECISION NO" were the same face at the same size in the same case, so the eye had to READ
//      to learn which row was theirs and which was ours. A mark per row makes that pre-attentive.
//
// The chip is deliberately NOT a new invention. It is the market card's own venue chip
// (pa-2026-09-0*-live-markets-v*/source/render.mjs, `venueChip`), rebuilt in composition
// primitives at reel scale: Kalshi is its green wordmark on a near-white slab, Polymarket is its
// white glyph and General Sans wordmark on Polymarket blue. Same shape, same colours, same
// hierarchy as the still cards, because Erick also asked that every output look like one house.
//
// Two rules constrain the marks and neither is negotiable:
//   - Precision Mint is never applied to a venue mark. Mint means the model estimate (AGENTS.md).
//     Kalshi's own green (#21C891) sits close enough to our mint to blur that, which is exactly why
//     it stays inside its white chip and never touches our type.
//   - Displaying a mark raises a trademark question the desk answers in the footer, in words:
//     the marks belong to their owners and no affiliation or endorsement is implied.
//
// One spec file per market: SPEC=a.json higgsedit build tiktok-v4.jsx. One build emits the reel
// plus four stills. Needs src/bull.png, src/kalshi.png, src/polymarket.png and the house faces
// (General Sans 700, Satoshi 500, JetBrains Mono 500) registered in the project.
import { readFileSync } from "node:fs";
export default async ({ project }) => {
  const S = JSON.parse(readFileSync(process.env.SPEC, "utf8"));
  // Twelve seconds, not ten (Erick, 2 Sep: "gives users 2 more seconds to read and digest"). The two
  // extra seconds are NOT spread evenly: they go where the reading load is. The figures card gains
  // the most (+0.8s) because it carries three numbers and a question, the caps read gains +0.5s, the
  // hook and the CTA gain +0.3 and +0.4. Both networks accept it: TikTok and Instagram Reels have a
  // three-second floor and minutes of ceiling.
  const W=1080,H=1920,D=12,F=1/30, life=(a)=>D-a;
  const p = await project({ dir: ".", size: `${W}x${H}`, fps: 30, background: "#05090D" });
  const plate=await p.add(S.plate), bull=await p.add("src/bull.png");
  const kalshi=await p.add("src/kalshi.png"), poly=await p.add("src/polymarket.png");
  const NAVY="#05090D",MINT="#34DFBA",BLUE="#147DFF",WHITE="#F8FAF8",MUTE="#8BE8D9",GREY="#9AA6AD",CARD="#0A1B24";
  // Each figure sits on its own chip so the numbers cannot run together. ROW is one step up from
  // the card; GAPROW carries a blue tint so the focal number reads as the point of the card.
  const ROW="#0F2833",GAPROW="#10334A";
  const M=80,CW=W-2*M, T1=2.8, T2=5.8, T3=9.2;

  // The venue's identity, matching the still card's chip exactly. Kalshi ships a WORDMARK (the
  // glyph and the letters are one asset), so its chip carries the artwork alone; Polymarket ships
  // an ICON, so its chip pairs the glyph with the name set in the house display face. That
  // asymmetry is the venues' own, not ours, and copying it is what makes the chip read as theirs.
  const vk = /kalshi/i.test(S.venue || "") ? "kalshi" : "polymarket";
  const V = {
    kalshi:     { fill:"#F4F7F5", ink:"#071018", name:"Kalshi",     mark:kalshi, wordmark:true,  ratio:78/20 },
    polymarket: { fill:"#2E5CFF", ink:WHITE,     name:"Polymarket", mark:poly,   wordmark:false, ratio:1 },
  }[vk];

  // One chip, one scale knob. `h` is the chip's cap height in pixels; everything else is derived so
  // the mark, the type and the padding stay in proportion at any size the layout asks for.
  const venueChip = (h, key, animate) => (
    <row key={key} animate={animate} gap={Math.round(h*0.42)} align="center" justify="center" fill={V.fill} radius={Math.round(h*0.62)}
      padding={{top:Math.round(h*0.44),bottom:Math.round(h*0.44),left:Math.round(h*0.68),right:Math.round(h*0.72)}}>
      {V.wordmark
        ? <media file={V.mark} width={Math.round(h*V.ratio)} fit="width" />
        : <media file={V.mark} width={h} fit="width" />}
      {V.wordmark
        ? null
        : <text fontFamily="General Sans" fontSize={Math.round(h*0.94)} fontWeight={700} color={V.ink} letterSpacing={-1}>{V.name}</text>}
    </row>
  );
  // Our half of the lockup. Navy slab, mint hairline, the circuit bull and the desk name: the same
  // weight of object as the venue chip, because a lockup where one side is a logo and the other is
  // plain text reads as a logo endorsing some text.
  const paChip = (h, key, animate) => (
    <row key={key} animate={animate} gap={Math.round(h*0.40)} align="center" justify="center" fill={CARD} radius={Math.round(h*0.62)}
      padding={{top:Math.round(h*0.44),bottom:Math.round(h*0.44),left:Math.round(h*0.66),right:Math.round(h*0.72)}}>
      <media file={bull} width={Math.round(h*1.08)} fit="width" />
      <text fontFamily="General Sans" fontSize={Math.round(h*0.94)} fontWeight={700} color={WHITE} letterSpacing={-1}>Precision</text>
    </row>
  );

  // One sentence pair per line, joined with hard breaks: a wrapped footer once put a period at the
  // start of a line. The credit line is mandatory for CC BY / BY-SA plates (spec.credit). The marks
  // line is new in v4 and is the price of showing the logos: it is not decoration, it is the
  // disclaimer that keeps a displayed trademark honest.
  const legal = ["Informational research. Precision does not place trades.",
                 "Model estimates can be wrong. Prediction markets involve risk.",
                 "Kalshi and Polymarket names and marks belong to their owners.",
                 "Named for market-source context. No affiliation or endorsement implied."]
                 .concat(S.credit ? ["Photo: " + S.credit + "."] : []).join("\n");

  const nodes=[
    <group name="plate" x={0} y={0} width={W} height={H} origin="center"
      animate={[{property:"scale",keyframes:[{at:0,value:1.0},{at:T3,value:1.12,easing:"linear"}]},{property:"offsetX",keyframes:[{at:0,value:0},{at:T3,value:-50,easing:"linear"}]}]}>
      <media file={plate} x={0} y={0} width={W} height={H} fit="cover" />
    </group>,
    <rect x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0.38},{at:T3,value:0.38}]}]} />,
    <rect x={0} y={H*0.55} width={W} height={H*0.45} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:T1,value:0},{at:T1+0.4,value:0.5}]}]} />,
    <row x={M} y={120} width={520} gap={14} align="center" animate={[{property:"opacity",from:0,to:1,duration:0.4}]}>
      <media file={bull} width={52} fit="width" />
      <text fontFamily="General Sans" fontSize={30} fontWeight={700} color={WHITE}>Precision Algorithms</text>
    </row>,

    // ── Beat 1: the hook ────────────────────────────────────────────────────────────────────────
    // Header row: the venue's chip where v3 had a mint category pill. The pill lost that argument
    // twice over. It spent the frame's only semantic colour on a taxonomy label, and it answered a
    // question ("which category?") nobody scrolling has. The chip answers the one they do have:
    // is this a real market, on a venue I have heard of? The category survives at the right edge in
    // small mono, which is where a deck line belongs.
    <column name="bubble" x={110} y={640} width={W-220} radius={28} fill={CARD} at={0.35} duration={T1-0.35}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.35,value:1},{at:T1-0.35-0.3,value:1},{at:T1-0.35-0.02,value:0}]},{property:"offsetY",from:28,to:0,duration:0.5,easing:"house"}]}>
      <row width={W-220} padding={{top:26,bottom:8,left:30,right:34}} justify="space-between" align="center">
        {venueChip(30,"vchip-hook")}
        <text fontFamily="JetBrains Mono" fontSize={22} fontWeight={500} letterSpacing={4} color={MUTE}>{String(S.cat||"").toUpperCase()}</text>
      </row>
      <column padding={{top:22,bottom:34,left:40,right:40}} gap={26}>
        <text width={W-300} align="center" fontFamily="General Sans" fontSize={58} fontWeight={700} color={WHITE} lineHeight={1.15}>{S.q}</text>
        {/* The thesis, staged. Two chips of equal weight stop with air between them, and that air
            is the Model Gap before a single number has appeared. They do not slide all the way
            together and they never touch: a lockup that closes reads as a partnership, which is
            the one thing the footer spends four lines denying. */}
        <row width={W-300} gap={20} align="center" justify="center"
          animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.9,value:0},{at:1.25,value:1}]}]}>
          {venueChip(26,"vchip-vs",[{property:"offsetX",keyframes:[{at:0,value:-40},{at:0.9,value:-40},{at:1.35,value:0,easing:"house"}]}])}
          <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={GREY}>VS</text>
          {paChip(26,"pachip-vs",[{property:"offsetX",keyframes:[{at:0,value:40},{at:0.9,value:40},{at:1.35,value:0,easing:"house"}]}])}
        </row>
      </column>
    </column>,

    // ── Beat 2: the read ────────────────────────────────────────────────────────────────────────
    // The venue chip persists here at the same size and position it held in the bubble's header, so
    // it reads as one continuous object across the cut rather than a new element per beat. That is
    // the difference between a motion graphic and a slideshow.
    <group name="vchip-read" x={M} y={1176} width={360} height={74} at={T1} duration={T2-T1}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.3,value:1},{at:T2-T1-0.3,value:1},{at:T2-T1-0.02,value:0}]},{property:"offsetX",from:-24,to:0,duration:0.4,easing:"house"}]}>
      {venueChip(30,"vchip-read-inner")}
    </group>,
    <text x={M} y={1270} width={CW} fontFamily="General Sans" fontSize={72} fontWeight={700} color={WHITE} lineHeight={1.08} at={T1+0.15} duration={T2-T1-0.15}
      motion={{by:"word",from:{y:34,opacity:0},overlap:0.6,duration:0.55,easing:"house"}}
      animate={[{property:"opacity",keyframes:[{at:0,value:1},{at:T2-T1-0.15-0.3,value:1},{at:T2-T1-0.15-0.02,value:0}]}]}>{S.read.replace(/[.!]$/,"").toUpperCase()}</text>,

    // ── Beat 3: the figures ─────────────────────────────────────────────────────────────────────
    // Rebuilt 2 Sep after Erick read the first reels on a phone: "too much numbers and data too
    // close to one another". Each figure is its own full-width chip, label left, number hard right,
    // one per line. The Model Gap chip is bigger, tinted and rule-topped because the house rule is
    // that the signed gap is the focal number on any market creative.
    //
    // v4 adds the marks INSIDE the rows. The venue's glyph sits against its own row and the circuit
    // bull against ours, so which number belongs to whom is settled before the labels are read.
    // The glyphs are small (26px) and the chip fills are unchanged: this is identification, not
    // co-branding, and a row that looked like a venue advertisement would be a lie about the source
    // of the second number.
    <column name="card" x={M} y={470} width={CW} radius={32} fill={CARD} padding={{top:40,bottom:40,left:40,right:40}} gap={26} at={T2} duration={T3-T2}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.4,value:1},{at:T3-T2-0.3,value:1},{at:T3-T2-0.02,value:0}]},{property:"offsetY",from:30,to:0,duration:0.5,easing:"house"}]}>
      <row width={CW-80} justify="space-between" align="center">
        {venueChip(26,"vchip-card")}
        <text fontFamily="JetBrains Mono" fontSize={22} fontWeight={500} letterSpacing={3} color={MUTE}>{"PA SIDE "+S.side}</text>
      </row>
      <text width={CW-80} fontFamily="General Sans" fontSize={44} fontWeight={700} color={WHITE} lineHeight={1.18}>{S.q}</text>
      <column width={CW-80} gap={14}>
        <row width={CW-80} radius={18} fill={ROW} padding={{top:20,bottom:20,left:26,right:26}} justify="space-between" align="center">
          <row gap={14} align="center">
            <media file={V.mark} width={V.wordmark?58:26} fit="width" />
            <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={GREY}>{S.venue.toUpperCase()+" "+S.side}</text>
          </row>
          <text fontFamily="JetBrains Mono" fontSize={62} fontWeight={500} color={WHITE}>{S.mp+"%"}</text>
        </row>
        <row width={CW-80} radius={18} fill={ROW} padding={{top:20,bottom:20,left:26,right:26}} justify="space-between" align="center">
          <row gap={14} align="center">
            <media file={bull} width={28} fit="width" />
            <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={MINT}>{"PRECISION "+S.side}</text>
          </row>
          <text fontFamily="JetBrains Mono" fontSize={62} fontWeight={500} color={MINT}>{S.pp+"%"}</text>
        </row>
        <row width={CW-80} radius={18} fill={GAPROW} padding={{top:26,bottom:26,left:26,right:26}} justify="space-between" align="center">
          <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={BLUE}>MODEL GAP</text>
          <text fontFamily="JetBrains Mono" fontSize={80} fontWeight={500} color={BLUE}>{"+"+S.gap}</text>
        </row>
      </column>
      <text width={CW-80} fontFamily="Satoshi" fontSize={27} fontWeight={500} color={MUTE} lineHeight={1.35}>{S.yesParty ? "YES = "+S.yesParty+" win." : "Precision reads this side higher than the venue does. The gap is in probability points, not a return."}</text>
    </column>,

    // ── Beat 4: the ask ─────────────────────────────────────────────────────────────────────────
    <rect name="ctafield" x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:T3-0.35,value:0},{at:T3,value:1,easing:"house"}]}]} />,
    <group name="ctabull" x={(W-220)/2} y={500} width={220} height={220} origin="center" at={T3} duration={life(T3)}
      animate={[{property:"scale",keyframes:[{at:0,value:0.82},{at:0.45,value:1.04,easing:"house"},{at:0.7,value:1}]},{property:"opacity",from:0,to:1,duration:0.3}]}>
      <media file={bull} x={0} y={0} width={220} fit="width" />
    </group>,
    <text x={80} y={790} width={W-160} align="center" fontFamily="General Sans" fontSize={62} fontWeight={700} color={WHITE} lineHeight={1.12} at={T3+0.25} duration={life(T3+0.25)}
      motion={{by:"word",from:{y:30,opacity:0},overlap:0.6,duration:0.5,easing:"house"}}>Five free previews a day</text>,
    <text x={80} y={950} width={W-160} align="center" fontFamily="JetBrains Mono" fontSize={44} fontWeight={500} letterSpacing={1} color={MINT} at={T3+0.55} duration={life(T3+0.55)}
      animate={[{property:"opacity",from:0,to:1,duration:0.4,easing:"house"},{property:"offsetY",from:14,to:0,duration:0.4,easing:"house"}]}>precisionalgorithms.com</text>,
    <row x={(W-300)/2} y={1060} width={300} padding={{top:16,bottom:16,left:26,right:26}} fill={MINT} radius={36} justify="center" at={T3+0.8} duration={life(T3+0.8)}
      animate={[{property:"opacity",from:0,to:1,duration:0.35,easing:"house"},{property:"offsetY",from:14,to:0,duration:0.4,easing:"house"}]}>
      <text fontFamily="General Sans" fontSize={30} fontWeight={700} color={NAVY}>Link in bio</text>
    </row>,
    // Coverage, stated at the moment of the ask, with both marks rather than one. This is the same
    // line the still card prints in its header ("SELECTED KALSHI AND POLYMARKET MARKETS"), and it
    // is here because a viewer deciding whether to follow wants to know the beat we cover, not the
    // single market they happened to land on.
    <column x={M} y={1230} width={CW} gap={18} align="center" at={T3+1.0} duration={life(T3+1.0)}
      animate={[{property:"opacity",from:0,to:1,duration:0.45,easing:"house"}]}>
      <text width={CW} align="center" fontFamily="JetBrains Mono" fontSize={20} fontWeight={500} letterSpacing={3} color={GREY}>WE PRICE SELECTED MARKETS ON</text>
      <row width={CW} gap={30} align="center" justify="center">
        <media file={kalshi} width={168} fit="width" />
        <rect width={2} height={34} fill="#2A4A55" />
        <row gap={14} align="center">
          <media file={poly} width={38} fit="width" />
          <text fontFamily="General Sans" fontSize={38} fontWeight={700} color={WHITE} letterSpacing={-1}>Polymarket</text>
        </row>
      </row>
    </column>,
    <text x={M} y={1660} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={18} fontWeight={500} color={GREY} lineHeight={1.5} at={T3+1.15} duration={life(T3+1.15)}
      animate={[{property:"opacity",from:0,to:1,duration:0.4}]}>{legal}</text>,
    <rect name="loopfade" x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:D-1.1,value:0},{at:D-F,value:1,easing:"smooth"}]}]} />,
  ];
  p.compose(nodes,{at:0,dur:D,name:"tiktok-"+S.key});
  // One still per beat, taken mid-beat so no still lands on a fade. These are the TikTok photo-mode
  // slides and the poster, so they have to be frames a reader would stop on.
  await p.frame(1.9,`renders/pa-tiktok-${S.key}-1.png`); await p.frame(4.2,`renders/pa-tiktok-${S.key}-2.png`);
  await p.frame(7.4,`renders/pa-tiktok-${S.key}-3.png`); await p.frame(10.2,`renders/pa-tiktok-${S.key}-4.png`);
  await p.render(`renders/pa-tiktok-${S.key}.mp4`);
};
