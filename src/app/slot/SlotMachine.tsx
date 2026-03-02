import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  solved: number;
  total: number;
}

const LIGHTS = [
  "#ff2200","#ff8800","#ffee00","#44ff00","#00ffee","#0088ff","#cc00ff",
  "#ff2200","#ff8800","#ffee00","#44ff00","#00ffee","#0088ff","#cc00ff",
  "#ff2200","#ff8800","#ffee00","#44ff00","#00ffee","#0088ff","#cc00ff",
];

export default function SlotMachine({ children, solved, total }: Props) {
  const progress = total > 0 ? (solved / total) * 100 : 0;

  return (
    <>
      <style>{`
        @keyframes blink-a { 0%,49%{opacity:1;} 50%,100%{opacity:0.12;} }
        @keyframes blink-b { 0%,49%{opacity:0.12;} 50%,100%{opacity:1;} }
        @keyframes neon    { 0%,100%{text-shadow:0 0 6px #ffe000,0 0 16px #ffe000,0 0 32px #ff8800,0 0 60px #ff4400}
                             50%{text-shadow:0 0 3px #ffe000,0 0 8px #ffe000,0 0 16px #ff8800} }
        @keyframes sign-glow { 0%,100%{box-shadow:0 0 18px 4px rgba(255,136,0,0.7),inset 0 0 18px rgba(255,100,0,0.15)}
                                50%{box-shadow:0 0 35px 8px rgba(255,200,0,0.8),inset 0 0 30px rgba(255,200,0,0.2)} }
        .neon-title { animation: neon 2.5s ease-in-out infinite; color:#ffe000; }
        .sign-box   { animation: sign-glow 2.5s ease-in-out infinite; }
        .la { animation: blink-a 0.9s step-start infinite; }
        .lb { animation: blink-b 0.9s step-start infinite; }
      `}</style>

      {/* Outer cabinet */}
      <div
        className="relative mx-auto w-full max-w-2xl"
        style={{
          borderRadius: 28,
          background: "linear-gradient(160deg,#ff4db8 0%,#8228ff 28%,#24124d 62%,#0a0620 100%)",
          padding: 5,
          boxShadow: "0 0 0 3px #d17dff,0 0 0 5px #3d1a60,0 0 70px rgba(160,40,255,0.55),0 40px 100px rgba(0,0,0,0.95),inset 0 1px 0 rgba(255,255,255,0.22)",
        }}
      >
        {/* Inner cabinet */}
        <div
          style={{
            borderRadius: 24,
            background: "linear-gradient(180deg,#22083c 0%,#120526 42%,#09021a 100%)",
            overflow: "hidden",
          }}
        >
          {/* TOP LIGHT STRIP */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"10px 16px 6px" }}>
            {LIGHTS.map((c,i)=>(
              <div key={i} className={i%2===0?"la":"lb"} style={{
                width:11,height:11,borderRadius:"50%",background:c,
                boxShadow:`0 0 7px 2px ${c}`,flexShrink:0,
              }}/>
            ))}
          </div>

          {/* NEON SIGN */}
          <div style={{ padding:"0 16px 10px" }}>
            <div className="sign-box" style={{
              borderRadius:12, padding:"8px 16px",
              background:"linear-gradient(180deg,#2f001f,#140014)",
              border:"2px solid #ff8a00",
              textAlign:"center",
            }}>
              <div className="neon-title" style={{
                fontSize:22,fontWeight:900,letterSpacing:"0.2em",
                fontFamily:"Impact,'Arial Black',sans-serif",
                textTransform:"uppercase",
              }}>
                ★ Kabinet Jetten ★
              </div>
             
            </div>
          </div>

          {/* CHROME FRAME + REEL WINDOW */}
          <div style={{ padding:"0 12px 10px" }}>
            <div style={{
              borderRadius:18, padding:4,
              background:"linear-gradient(145deg,#ffc933 0%,#ff8f00 38%,#ac40ff 68%,#6f1dff 100%)",
              boxShadow:"0 0 25px rgba(255,170,0,0.45),0 6px 20px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.35)",
            }}>
              {/* Glass interior */}
              <div style={{
                borderRadius:15,
                background:"radial-gradient(circle at 50% 15%, rgba(255,120,220,0.25) 0%, rgba(44,10,100,0.6) 32%, #120336 72%, #060118 100%)",
                boxShadow:"inset 0 6px 24px rgba(0,0,0,0.9),inset 0 0 70px rgba(170,30,255,0.5)",
                padding:10,
              }}>
                {/* The three reels */}
                <div style={{ display:"flex", gap:8 }}>
                  {children}
                </div>
              </div>
            </div>
          </div>

          {/* SCORE PANEL */}
          <div style={{ padding:"0 16px 8px" }}>
            <div style={{
              borderRadius:12, padding:"6px 14px",
              background:"linear-gradient(180deg,#060f06,#030803)",
              border:"1px solid #007700",
              boxShadow:"0 0 12px rgba(0,180,0,0.25),inset 0 0 12px rgba(0,100,0,0.15)",
              display:"flex", alignItems:"center", gap:12,
            }}>
              <span style={{fontFamily:"monospace",fontSize:13,color:"#00ff44",textShadow:"0 0 8px #00ff44"}}>
                CREDITS: <b>{String(solved).padStart(2,"0")}</b>
              </span>
              <div style={{flex:1,height:6,borderRadius:4,overflow:"hidden",background:"#001200",border:"1px solid #005500"}}>
                <div style={{
                  width:`${progress}%`,height:"100%",borderRadius:4,
                  background:"linear-gradient(90deg,#007700,#00ff44)",
                  boxShadow:"0 0 6px #00ff44",
                  transition:"width 0.5s ease",
                }}/>
              </div>
              <span style={{fontFamily:"monospace",fontSize:13,color:"#00ff44",textShadow:"0 0 8px #00ff44"}}>
                / <b>{String(total).padStart(2,"0")}</b>
              </span>
            </div>
          </div>

          {/* BOTTOM LIGHT STRIP */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"4px 16px 12px" }}>
            {LIGHTS.map((c,i)=>(
              <div key={i} className={i%2===0?"lb":"la"} style={{
                width:11,height:11,borderRadius:"50%",background:c,
                boxShadow:`0 0 7px 2px ${c}`,flexShrink:0,
              }}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
