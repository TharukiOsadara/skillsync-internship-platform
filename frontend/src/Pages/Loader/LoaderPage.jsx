import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * LoaderPage
 * ──────────
 * Full-screen animated logo page shown on first load at "/".
 * Auto-redirects to /homepage after 5 seconds.
 * No layout wrapper — renders standalone.
 *
 * Animations:
 *  - Two counter-rotating orbital rings with glowing dots
 *  - Logo icon box with pop-in spring animation
 *  - Brand name + tagline fade-up
 *  - Animated progress bar
 *  - Floating ambient particles
 *  - Subtle grid overlay
 */
export default function LoaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/homepage", { replace: true }), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={S.page}>
      {/* Grid overlay */}
      <div style={S.grid} />

      {/* Floating particles */}
      <div style={S.particles}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{ ...S.particle, ...p }} />
        ))}
      </div>

      {/* Ambient glow */}
      <div style={S.ambient} />

      {/* Orbital rings */}
      <div style={S.ring1}>
        <div style={S.dotOuter} />
      </div>
      <div style={S.ring2}>
        <div style={S.dotInner} />
      </div>

      {/* Logo icon */}
      <div style={S.logoBox}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={S.logoIcon}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Brand text */}
      <div style={S.textBlock}>
        <div style={S.brand}>
          <span style={{ color: "#F1F5F9" }}>skill</span>
          <span style={{ color: "#22D3EE" }}>sync</span>
        </div>
        <p style={S.tagline}>Internship Matching Platform</p>
        
      </div>

      {/* Progress bar */}
      <div style={S.progressWrap}>
        <div style={S.progressTrack}>
          <div style={S.progressFill} />
        </div>
        <p style={S.progressLabel}>Loading...</p>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{KEYFRAMES}</style>
    </div>
  );
}

// ── Particles config ─────────────────────────────────────────────────────────
const PARTICLES = [
  { width:"3px",height:"3px",top:"18%",left:"14%",   animation:"float1 4s ease-in-out infinite" },
  { width:"2px",height:"2px",top:"68%",left:"18%",   animation:"float2 5s ease-in-out infinite 1s" },
  { width:"3px",height:"3px",top:"28%",right:"17%",  animation:"float1 3.5s ease-in-out infinite 0.5s" },
  { width:"2px",height:"2px",top:"72%",right:"20%",  animation:"float2 4.5s ease-in-out infinite 1.5s" },
  { width:"2px",height:"2px",top:"48%",left:"7%",    animation:"float1 6s ease-in-out infinite 2s" },
  { width:"3px",height:"3px",top:"42%",right:"9%",   animation:"float2 5s ease-in-out infinite 0.8s" },
  { width:"2px",height:"2px",top:"82%",left:"38%",   animation:"float1 4.2s ease-in-out infinite 1.2s" },
  { width:"2px",height:"2px",top:"12%",right:"35%",  animation:"float2 3.8s ease-in-out infinite 0.3s" },
  { width:"3px",height:"3px",top:"22%",left:"27%",   animation:"float1 4.7s ease-in-out infinite 0.6s" },
  { width:"2px",height:"2px",top:"64%",left:"30%",   animation:"float2 4.1s ease-in-out infinite 1.4s" },
  { width:"3px",height:"3px",top:"14%",right:"28%",  animation:"float1 5.3s ease-in-out infinite 0.9s" },
  { width:"2px",height:"2px",top:"58%",right:"33%",  animation:"float2 4.9s ease-in-out infinite 0.7s" },
  { width:"2px",height:"2px",top:"36%",left:"42%",   animation:"float1 5.6s ease-in-out infinite 1.1s" },
  { width:"3px",height:"3px",top:"76%",left:"50%",   animation:"float2 4.4s ease-in-out infinite 0.4s" },
  { width:"2px",height:"2px",top:"30%",right:"46%",  animation:"float1 4.3s ease-in-out infinite 1.6s" },
  { width:"3px",height:"3px",top:"86%",right:"41%",  animation:"float2 5.1s ease-in-out infinite 1.0s" },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    position:        "fixed",
    inset:           0,
    background:      "#020617",
    display:         "flex",
    flexDirection:   "column",
    alignItems:      "center",
    justifyContent:  "center",
    fontFamily:      "'DM Sans', sans-serif",
    overflow:        "hidden",
    zIndex:          9999,
  },
  grid: {
    position:        "absolute",
    inset:           0,
    backgroundImage: "linear-gradient(rgba(34,211,238,0.03)1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03)1px,transparent 1px)",
    backgroundSize:  "36px 36px",
    pointerEvents:   "none",
  },
  particles: { position:"absolute", inset:0, pointerEvents:"none" },
  particle:  { position:"absolute", borderRadius:"50%", background:"rgba(34,211,238,0.5)" },
  ambient: {
    position:     "absolute",
    width:        "400px",
    height:       "400px",
    borderRadius: "50%",
    background:   "radial-gradient(circle,rgba(34,211,238,0.07)0%,transparent 70%)",
    animation:    "pulse-ambient 3s ease-in-out infinite",
    pointerEvents:"none",
  },
  ring1: {
    position:     "absolute",
    width:        "190px",
    height:       "190px",
    borderRadius: "50%",
    border:       "1px solid rgba(34,211,238,0.14)",
    animation:    "spin1 9s linear infinite",
  },
  dotOuter: {
    position:     "absolute",
    top:          "-4px",
    left:         "50%",
    transform:    "translateX(-50%)",
    width:        "7px",
    height:       "7px",
    background:   "#22D3EE",
    borderRadius: "50%",
    boxShadow:    "0 0 8px #22D3EE, 0 0 18px #22D3EE",
  },
  ring2: {
    position:     "absolute",
    width:        "138px",
    height:       "138px",
    borderRadius: "50%",
    border:       "1px solid rgba(34,211,238,0.2)",
    animation:    "spin2 6s linear infinite reverse",
  },
  dotInner: {
    position:     "absolute",
    bottom:       "-3px",
    left:         "50%",
    transform:    "translateX(-50%)",
    width:        "5px",
    height:       "5px",
    background:   "#06B6D4",
    borderRadius: "50%",
    boxShadow:    "0 0 6px #06B6D4, 0 0 12px #06B6D4",
  },
  logoBox: {
    position:     "relative",
    width:        "84px",
    height:       "84px",
    background:   "linear-gradient(135deg,#0ea5e9,#22D3EE)",
    borderRadius: "24px",
    display:      "flex",
    alignItems:   "center",
    justifyContent:"center",
    animation:    "logo-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
    boxShadow:    "0 0 40px rgba(34,211,238,0.28), 0 0 0 1px rgba(34,211,238,0.18)",
  },
  logoIcon: {
    animation:    "icon-glow 2.4s ease-in-out infinite",
    filter:       "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
  },
  textBlock: {
    marginTop:    "28px",
    textAlign:    "center",
    animation:    "fade-up 0.7s ease 0.9s both",
  },
  brand: {
    fontSize:     "36px",
    fontWeight:   800,
    letterSpacing:"-1px",
    lineHeight:   1,
  },
  tagline: {
    fontSize:     "13px",
    color:        "#64748B",
    margin:       "7px 0 0",
    letterSpacing:".4px",
  },
  pill: {
    display:      "inline-block",
    marginTop:    "10px",
    fontSize:     "9px",
    fontWeight:   700,
    color:        "#22D3EE",
    background:   "rgba(34,211,238,0.08)",
    border:       "1px solid rgba(34,211,238,0.2)",
    padding:      "3px 14px",
    borderRadius: "99px",
    letterSpacing:".4px",
    textTransform:"uppercase",
  },
  progressWrap: {
    marginTop:    "40px",
    width:        "200px",
    animation:    "fade-up 0.7s ease 1.1s both",
  },
  progressTrack: {
    height:       "2px",
    background:   "rgba(34,211,238,0.1)",
    borderRadius: "99px",
    overflow:     "hidden",
  },
  progressFill: {
    height:       "2px",
    background:   "linear-gradient(90deg,#22D3EE,#06B6D4)",
    borderRadius: "99px",
    animation:    "progress 2.4s ease-in-out 1.2s both",
  },
  progressLabel: {
    fontSize:     "9px",
    color:        "#334155",
    textAlign:    "center",
    marginTop:    "8px",
    fontWeight:   700,
    letterSpacing:".4em",
    textTransform:"uppercase",
  },
};

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes spin1{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes logo-pop{
  0%{transform:scale(0.4) rotate(-12deg);opacity:0}
  100%{transform:scale(1) rotate(0deg);opacity:1}
}
@keyframes fade-up{
  0%{transform:translateY(18px);opacity:0}
  100%{transform:translateY(0);opacity:1}
}
@keyframes icon-glow{
  0%,100%{filter:drop-shadow(0 0 4px rgba(255,255,255,0.35))}
  50%{filter:drop-shadow(0 0 14px rgba(255,255,255,0.85))}
}
@keyframes progress{
  0%{width:0%}
  25%{width:30%}
  55%{width:62%}
  80%{width:85%}
  100%{width:100%}
}
@keyframes pulse-ambient{
  0%,100%{transform:scale(1);opacity:1}
  50%{transform:scale(1.2);opacity:0.6}
}
@keyframes float1{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-14px) scale(1.4)}
}
@keyframes float2{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(11px) scale(0.7)}
}
`;