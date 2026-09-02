// Media engine, clip 3 v3: production TikTok / Reels format. Four beats in 10 s, one spec file per
// market (SPEC=a.json higgsedit build tiktok-v3.jsx), one build emits the reel plus four stills.
//
// What changed from v2 (Erick, 2 Sep, after the first tests):
//   - The plate is SUBJECT-ALIGNED and attention-grabbing (a rocket for a SpaceX market, the iPhone
//     for an iPhone market), sourced from Commons with a recorded licence and reviewed by eye. Still
//     no identifiable people and no full-bleed trademark: those are house rules, not taste.
//   - A closing CTA beat: the plate is covered, the desk lockup lands, "See the full comparison",
//     precisionalgorithms.com large, a "Link in bio" pill. The CTA points at the site, never at a
//     /m/ dossier page, which is paywalled to five previews a day.
//   - The legal line rides in the CTA footer, small: informational research, no trades, estimates
//     can be wrong, markets involve risk, venue named for context with no affiliation implied, and
//     the photo credit where the licence requires one. The observed stamp and "values can move"
//     stay OFF, per Erick, 2 Sep.
//   - Two-party markets print "YES = <party> win." on the figures card (spec.yesParty).
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
  const NAVY="#05090D",MINT="#34DFBA",BLUE="#147DFF",WHITE="#F8FAF8",MUTE="#8BE8D9",GREY="#9AA6AD",CARD="#0A1B24";
  // Each figure sits on its own chip so the numbers cannot run together. ROW is one step up from
  // the card; GAPROW carries a blue tint so the focal number reads as the point of the card.
  const ROW="#0F2833",GAPROW="#10334A";
  const M=80,CW=W-2*M, T1=2.8, T2=5.8, T3=9.2;
  // One sentence pair per line, joined with hard breaks: a wrapped footer once put a period at the
  // start of a line. The credit line is mandatory for CC BY / BY-SA plates (spec.credit).
  const legal = ["Informational research. Precision does not place trades.",
                 "Model estimates can be wrong. Prediction markets involve risk.",
                 S.venue + " named for market-source context; no affiliation implied."]
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
      <text fontFamily="Inter" fontSize={30} fontWeight={700} color={WHITE}>Precision Algorithms</text>
    </row>,
    <column name="bubble" x={110} y={700} width={W-220} radius={28} fill={CARD} at={0.35} duration={T1-0.35}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.35,value:1},{at:T1-0.35-0.3,value:1},{at:T1-0.35-0.02,value:0}]},{property:"offsetY",from:28,to:0,duration:0.5,easing:"house"}]}>
      <row width={W-220} padding={{top:18,bottom:18,left:28,right:28}} fill={MINT} radius={28} justify="center">
        <text fontFamily="JetBrains Mono" fontSize={26} fontWeight={500} letterSpacing={4} color={NAVY}>{"CURRENT MARKET · "+S.cat}</text>
      </row>
      <column padding={{top:34,bottom:40,left:40,right:40}} gap={18}>
        <text width={W-300} align="center" fontFamily="Inter" fontSize={58} fontWeight={700} color={WHITE} lineHeight={1.15}>{S.q}</text>
        <text width={W-300} align="center" fontFamily="Inter" fontSize={28} fontWeight={500} color={MUTE}>{S.venue+" vs. the Precision model"}</text>
      </column>
    </column>,
    <row x={M} y={1180} padding={{top:12,bottom:12,left:22,right:22}} fill={MINT} radius={30} at={T1} duration={T2-T1}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.3,value:1},{at:T2-T1-0.3,value:1},{at:T2-T1-0.02,value:0}]},{property:"offsetX",from:-24,to:0,duration:0.4,easing:"house"}]}>
      <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={4} color={NAVY}>{"CURRENT MARKET · "+S.cat}</text>
    </row>,
    <text x={M} y={1260} width={CW} fontFamily="Inter" fontSize={72} fontWeight={700} color={WHITE} lineHeight={1.08} at={T1+0.15} duration={T2-T1-0.15}
      motion={{by:"word",from:{y:34,opacity:0},overlap:0.6,duration:0.55,easing:"house"}}
      animate={[{property:"opacity",keyframes:[{at:0,value:1},{at:T2-T1-0.15-0.3,value:1},{at:T2-T1-0.15-0.02,value:0}]}]}>{S.read.replace(/[.!]$/,"").toUpperCase()}</text>,
    // The figures card, rebuilt 2 Sep 2026 after Erick read the first reels on a phone: "too much
    // numbers and data too close to one another". The three figures used to sit in one row across a
    // 840px card, so 61.0% / 77.5% / +16.5 ran together into a single band of digits and the small
    // caps label above each one was reading as a header for the whole row rather than for its own
    // number. Now each figure is its own full-width chip: the label on the left in small caps, the
    // number hard right, one per line, with real space between them. The Model Gap chip is bigger,
    // tinted and carries a top rule, because the house rule is that the signed gap is the focal
    // number on any market creative.
    <column name="card" x={M} y={470} width={CW} radius={32} fill={CARD} padding={{top:44,bottom:40,left:40,right:40}} gap={30} at={T2} duration={T3-T2}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.4,value:1},{at:T3-T2-0.3,value:1},{at:T3-T2-0.02,value:0}]},{property:"offsetY",from:30,to:0,duration:0.5,easing:"house"}]}>
      <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={4} color={MUTE}>{S.venue.toUpperCase()+" VS. PRECISION · PA SIDE "+S.side}</text>
      <text width={CW-80} fontFamily="Inter" fontSize={44} fontWeight={700} color={WHITE} lineHeight={1.18}>{S.q}</text>
      <column width={CW-80} gap={14}>
        <row width={CW-80} radius={18} fill={ROW} padding={{top:20,bottom:20,left:26,right:26}} justify="space-between" align="center">
          <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={GREY}>{S.venue.toUpperCase()+" "+S.side}</text>
          <text fontFamily="JetBrains Mono" fontSize={62} fontWeight={500} color={WHITE}>{S.mp+"%"}</text>
        </row>
        <row width={CW-80} radius={18} fill={ROW} padding={{top:20,bottom:20,left:26,right:26}} justify="space-between" align="center">
          <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={MINT}>{"PRECISION "+S.side}</text>
          <text fontFamily="JetBrains Mono" fontSize={62} fontWeight={500} color={MINT}>{S.pp+"%"}</text>
        </row>
        <row width={CW-80} radius={18} fill={GAPROW} padding={{top:26,bottom:26,left:26,right:26}} justify="space-between" align="center">
          <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={3} color={BLUE}>MODEL GAP</text>
          <text fontFamily="JetBrains Mono" fontSize={80} fontWeight={500} color={BLUE}>{"+"+S.gap}</text>
        </row>
      </column>
      <text width={CW-80} fontFamily="Inter" fontSize={27} fontWeight={500} color={MUTE} lineHeight={1.35}>{S.yesParty ? "YES = "+S.yesParty+" win." : "Precision reads this side higher than the venue does. The gap is in probability points, not a return."}</text>
    </column>,
    <rect name="ctafield" x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:T3-0.35,value:0},{at:T3,value:1,easing:"house"}]}]} />,
    <group name="ctabull" x={(W-220)/2} y={520} width={220} height={220} origin="center" at={T3} duration={life(T3)}
      animate={[{property:"scale",keyframes:[{at:0,value:0.82},{at:0.45,value:1.04,easing:"house"},{at:0.7,value:1}]},{property:"opacity",from:0,to:1,duration:0.3}]}>
      <media file={bull} x={0} y={0} width={220} fit="width" />
    </group>,
    <text x={80} y={800} width={W-160} align="center" fontFamily="Inter" fontSize={62} fontWeight={700} color={WHITE} lineHeight={1.12} at={T3+0.25} duration={life(T3+0.25)}
      motion={{by:"word",from:{y:30,opacity:0},overlap:0.6,duration:0.5,easing:"house"}}>See the full comparison</text>,
    <text x={80} y={960} width={W-160} align="center" fontFamily="JetBrains Mono" fontSize={44} fontWeight={500} letterSpacing={1} color={MINT} at={T3+0.55} duration={life(T3+0.55)}
      animate={[{property:"opacity",from:0,to:1,duration:0.4,easing:"house"},{property:"offsetY",from:14,to:0,duration:0.4,easing:"house"}]}>precisionalgorithms.com</text>,
    <row x={(W-300)/2} y={1070} width={300} padding={{top:16,bottom:16,left:26,right:26}} fill={MINT} radius={36} justify="center" at={T3+0.8} duration={life(T3+0.8)}
      animate={[{property:"opacity",from:0,to:1,duration:0.35,easing:"house"},{property:"offsetY",from:14,to:0,duration:0.4,easing:"house"}]}>
      <text fontFamily="Inter" fontSize={30} fontWeight={700} color={NAVY}>Link in bio</text>
    </row>,
    <text x={M} y={1640} width={CW} align="center" fontFamily="JetBrains Mono" fontSize={18} fontWeight={500} color={GREY} lineHeight={1.5} at={T3+0.9} duration={life(T3+0.9)}
      animate={[{property:"opacity",from:0,to:1,duration:0.4}]}>{legal}</text>,
    <rect name="loopfade" x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:D-2.6,value:0},{at:D-F,value:1,easing:"smooth"}]}]} />,
  ];
  p.compose(nodes,{at:0,dur:D,name:"tiktok-"+S.key});
  // One still per beat, taken mid-beat so no still lands on a fade. These are the TikTok photo-mode
  // slides and the poster, so they have to be frames a reader would stop on.
  await p.frame(1.6,`renders/pa-tiktok-${S.key}-1.png`); await p.frame(4.2,`renders/pa-tiktok-${S.key}-2.png`);
  await p.frame(7.4,`renders/pa-tiktok-${S.key}-3.png`); await p.frame(10.6,`renders/pa-tiktok-${S.key}-4.png`);
  await p.render(`renders/pa-tiktok-${S.key}.mp4`);
};
