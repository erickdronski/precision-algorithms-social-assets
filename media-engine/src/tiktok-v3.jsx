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
  const W=1080,H=1920,D=10,F=1/30, life=(a)=>D-a;
  const p = await project({ dir: ".", size: `${W}x${H}`, fps: 30, background: "#05090D" });
  const plate=await p.add(S.plate), bull=await p.add("src/bull.png");
  const NAVY="#05090D",MINT="#34DFBA",BLUE="#147DFF",WHITE="#F8FAF8",MUTE="#8BE8D9",GREY="#9AA6AD",CARD="#0A1B24";
  const M=80,CW=W-2*M, T1=2.5, T2=5.0, T3=7.6;
  const legal = "Informational research. Precision does not place trades. Model estimates can be wrong. Prediction markets involve risk. " +
                S.venue + " named for market-source context; no affiliation implied." + (S.credit ? " Photo: " + S.credit + "." : "");
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
    <column name="card" x={M} y={620} width={CW} radius={28} fill={CARD} padding={{top:40,bottom:36,left:40,right:40}} gap={26} at={T2} duration={T3-T2}
      animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:0.4,value:1},{at:T3-T2-0.3,value:1},{at:T3-T2-0.02,value:0}]},{property:"offsetY",from:30,to:0,duration:0.5,easing:"house"}]}>
      <text fontFamily="JetBrains Mono" fontSize={24} fontWeight={500} letterSpacing={4} color={MUTE}>{S.venue.toUpperCase()+" VS. PRECISION · PA SIDE "+S.side}</text>
      <text width={CW-80} fontFamily="Inter" fontSize={40} fontWeight={700} color={WHITE} lineHeight={1.15}>{S.q}</text>
      <row width={CW-80} gap={24} align="start" justify="space-between">
        <column gap={8}><text fontFamily="JetBrains Mono" fontSize={22} fontWeight={500} letterSpacing={3} color={GREY}>{S.venue.toUpperCase()+" "+S.side}</text><text fontFamily="JetBrains Mono" fontSize={88} fontWeight={500} color={WHITE}>{S.mp+"%"}</text></column>
        <column gap={8}><text fontFamily="JetBrains Mono" fontSize={22} fontWeight={500} letterSpacing={3} color={MINT}>{"PRECISION "+S.side}</text><text fontFamily="JetBrains Mono" fontSize={88} fontWeight={500} color={MINT}>{S.pp+"%"}</text></column>
        <column gap={8}><text fontFamily="JetBrains Mono" fontSize={22} fontWeight={500} letterSpacing={3} color={GREY}>MODEL GAP</text><text fontFamily="JetBrains Mono" fontSize={88} fontWeight={500} color={BLUE}>{"+"+S.gap}</text></column>
      </row>
      <text width={CW-80} fontFamily="Inter" fontSize={26} fontWeight={500} color={MUTE}>{S.yesParty ? "YES = "+S.yesParty+" win." : "The side Precision reads higher than the venue."}</text>
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
    <rect name="loopfade" x={0} y={0} width={W} height={H} fill={NAVY} animate={[{property:"opacity",keyframes:[{at:0,value:0},{at:9.4,value:0},{at:D-F,value:1,easing:"smooth"}]}]} />,
  ];
  p.compose(nodes,{at:0,dur:D,name:"tiktok-"+S.key});
  await p.frame(1.5,`renders/pa-tiktok-${S.key}-1.png`); await p.frame(3.8,`renders/pa-tiktok-${S.key}-2.png`);
  await p.frame(6.3,`renders/pa-tiktok-${S.key}-3.png`); await p.frame(8.8,`renders/pa-tiktok-${S.key}-4.png`);
  await p.render(`renders/pa-tiktok-${S.key}.mp4`);
};
