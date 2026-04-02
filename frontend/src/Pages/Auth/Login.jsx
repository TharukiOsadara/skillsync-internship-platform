import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";


import { saveAuth, isLoggedIn, getUser } from "../../Utils/auth";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

// Particle animation config (from HomePage)
const HERO_PARTICLES = [
  { width: "3px", height: "3px", top: "16%", left: "10%", animation: "float1 4.2s ease-in-out infinite" },
  { width: "2px", height: "2px", top: "72%", left: "15%", animation: "float2 4.8s ease-in-out infinite .8s" },
  { width: "3px", height: "3px", top: "24%", right: "11%", animation: "float1 3.7s ease-in-out infinite .3s" },
  { width: "2px", height: "2px", top: "78%", right: "17%", animation: "float2 5.1s ease-in-out infinite 1.1s" },
  { width: "2px", height: "2px", top: "45%", left: "4%", animation: "float1 5.6s ease-in-out infinite 1.6s" },
  { width: "3px", height: "3px", top: "38%", right: "5%", animation: "float2 4.6s ease-in-out infinite .6s" },
  { width: "2px", height: "2px", top: "10%", left: "42%", animation: "float1 4.1s ease-in-out infinite .9s" },
  { width: "2px", height: "2px", top: "84%", right: "36%", animation: "float2 4.4s ease-in-out infinite 1.2s" },
  { width: "3px", height: "3px", top: "20%", left: "24%", animation: "float1 4.9s ease-in-out infinite .5s" },
  { width: "2px", height: "2px", top: "63%", left: "28%", animation: "float2 5.2s ease-in-out infinite .7s" },
  { width: "3px", height: "3px", top: "14%", right: "27%", animation: "float1 4.0s ease-in-out infinite 1.0s" },
  { width: "2px", height: "2px", top: "67%", right: "29%", animation: "float2 4.3s ease-in-out infinite .4s" },
  { width: "3px", height: "3px", top: "32%", left: "33%", animation: "float1 5.4s ease-in-out infinite 1.1s" },
  { width: "2px", height: "2px", top: "56%", right: "41%", animation: "float2 4.7s ease-in-out infinite .9s" },
  { width: "3px", height: "3px", top: "87%", left: "46%", animation: "float1 4.5s ease-in-out infinite .2s" },
  { width: "2px", height: "2px", top: "26%", right: "46%", animation: "float2 5.0s ease-in-out infinite 1.3s" },
];


const Ico = ({ size = 16, stroke = "#22D3EE", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function Login() {
  const navigate   = useNavigate();
  const emailRef   = useRef(null);
  const passRef    = useRef(null);

  const [form, setForm]           = useState({ gmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [allEmails, setAllEmails] = useState([]);   // [{ gmail, role }]
  const [emailRole, setEmailRole] = useState(null); // badge in the corner of the email field
  const [entered, setEntered]     = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      navigate(user?.role === "Admin" ? "/admin/dashboard" : "/student/matches", { replace: true });
    }
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Fetch emails + roles from backend for autosuggest
  useEffect(() => {
    fetch("http://localhost:5000/users/emails")
      .then(r => r.json())
      .then(d => setAllEmails(d.emails || []))
      .catch(() => {});
  }, []);

  // ── Email input logic ────────────────────────────────────────────────────────
  // Rules:
  //   1. NO autocomplete / autofill — handled by autoComplete="new-password" + readOnly trick
  //   2. Only show role badge once the user types "@" — not before
  //   3. NO dropdown suggestion list at all
  //   4. Match: the part before "@" in the typed value must match the start of a
  //      stored email. Show role badge if exactly one email matches after "@".
  const handleEmailInput = (val) => {
    setForm(f => ({ ...f, gmail: val }));
    setError("");

    // Only look for a match once the user has typed "@"
    const atIdx = val.indexOf("@");
    if (atIdx === -1) {
      setEmailRole(null);
      return;
    }

    const prefix = val.slice(0, atIdx).toLowerCase();  // part before @
    const suffix = val.slice(atIdx).toLowerCase();      // @ and everything after

    // Find a stored email whose prefix (before @) starts with what the user typed
    // AND whose suffix (after @) starts with what the user typed after @
    const match = allEmails.find(e => {
      const [ePrefix] = e.gmail.toLowerCase().split("@");
      const eSuffix   = "@" + e.gmail.toLowerCase().split("@")[1];
      return ePrefix.startsWith(prefix) && eSuffix.startsWith(suffix);
    });

    if (match) {
      setEmailRole({
        role:   match.role,
        color:  match.role === "Admin" ? "#A78BFA" : "#22D3EE",
        bg:     match.role === "Admin" ? "rgba(167,139,250,0.12)" : "rgba(34,211,238,0.08)",
        border: match.role === "Admin" ? "rgba(167,139,250,0.25)" : "rgba(34,211,238,0.18)",
      });
    } else {
      setEmailRole(null);
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.gmail || !form.password) return setError("Both fields are required.");

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid credentials.");
      saveAuth(data.token, data.user);
      navigate(data.user.role === "Admin" ? "/admin/dashboard" : "/student/matches", { replace: true });
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const revealStyle = (delay = 0) => ({
    opacity:   entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .45s ease ${delay}ms, transform .52s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });


  const inputStyle = {
    background:  "#1E293B",
    border:      "1px solid #334155",
    borderRadius:"10px",
    color:       "#F1F5F9",
    fontSize:    "13px",
    width:       "100%",
    fontFamily:  "'DM Sans',sans-serif",
    outline:     "none",
    transition:  "border-color .15s, box-shadow .15s",
    boxSizing:   "border-box",
  };
  

  return (
    <>
      <Header />
      <div style={{ minHeight:"100vh", background:"#0B1220", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
        {/* Particle animation background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {HERO_PARTICLES.map((p, i) => (
            <div key={i} style={{ ...p, position: "absolute", borderRadius: "50%", background: "rgba(103,232,249,0.9)", boxShadow: "0 0 8px rgba(34,211,238,0.8), 0 0 18px rgba(34,211,238,0.55)" }} />
          ))}
        </div>
        {/* Subtle grid overlay */}
        <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(34,211,238,0.03)1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03)1px,transparent 1px)", backgroundSize:"44px 44px", pointerEvents:"none", zIndex: 1 }} />
        <div style={{ width:"100%", maxWidth:"420px", position:"relative", zIndex:2 }}>
          {/* Floating particle CSS */}
          <style>{`
            @keyframes float1 {
              0% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-18px) scale(1.18); }
              100% { transform: translateY(0) scale(1); }
            }
            @keyframes float2 {
              0% { transform: translateY(0) scale(1); }
              50% { transform: translateY(14px) scale(0.92); }
              100% { transform: translateY(0) scale(1); }
            }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes fade-in { from { opacity: 0; transform: translateY(-50%) scale(0.85); } to { opacity: 1; transform: translateY(-50%) scale(1); } }
          `}</style>
          {/* Brand */}
          <div style={{ textAlign:"center", marginBottom:"32px", ...revealStyle(0) }}>
            <div style={{ width:"52px", height:"52px", background:"linear-gradient(135deg,#0ea5e9,#22D3EE)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(34,211,238,0.3)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 style={{ color:"#F1F5F9", fontSize:"26px", fontWeight:800, margin:"0 0 4px" }}>SkillSync</h1>
            <p style={{ color:"#64748B", fontSize:"13px", margin:0 }}>Sign in to your account</p>
          </div>
          {/* Card */}
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"18px", padding:"30px 26px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", ...revealStyle(80) }}>
            {/* Error */}
            {error && (
              <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", color:"#F87171", padding:"10px 14px", borderRadius:"10px", fontSize:"12px", marginBottom:"18px", display:"flex", alignItems:"center", gap:"8px" }}>
                <Ico size={14} stroke="#F87171"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Ico>
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }} autoComplete="off">
              {/* ── Email field ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                <label style={{ fontSize:"10px", color:"#64748B", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                  Email Address
                </label>
                {/* Input wrapper — role badge lives inside here */}
                <div style={{ position:"relative" }}>
                  {/* Mail icon */}
                  <div style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <Ico size={14} stroke="#64748B">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </Ico>
                  </div>
                  <input
                    ref={emailRef}
                    type="text"
                    value={form.gmail}
                    autoComplete="new-password"
                    name="skillsync-login-email"
                    id="skillsync-login-email"
                    readOnly
                    onFocus={e => {
                      e.target.removeAttribute("readOnly");
                      e.target.style.borderColor = "#22D3EE";
                      e.target.style.boxShadow   = "0 0 0 3px rgba(34,211,238,0.1)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "#334155";
                      e.target.style.boxShadow   = "none";
                    }}
                    onChange={e => handleEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    style={{ ...inputStyle, padding: emailRole ? "11px 80px 11px 38px" : "11px 12px 11px 38px" }}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {/* ── Role badge — appears inside the input on the right ── */}
                  {emailRole && (
                    <span style={{
                      position:    "absolute",
                      right:       "10px",
                      top:         "50%",
                      transform:   "translateY(-50%)",
                      fontSize:    "10px",
                      fontWeight:  700,
                      color:       emailRole.color,
                      background:  emailRole.bg,
                      border:      `1px solid ${emailRole.border}`,
                      padding:     "2px 9px",
                      borderRadius:"99px",
                      letterSpacing:".2px",
                      whiteSpace:  "nowrap",
                      pointerEvents:"none",
                      zIndex:      2,
                      animation:   "fade-in .2s ease",
                    }}>
                      {emailRole.role}
                    </span>
                  )}
                </div>
                {/* ── NO dropdown suggestion bar — completely removed ── */}
              </div>
              {/* ── Password field ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <label style={{ fontSize:"10px", color:"#64748B", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                    Password
                  </label>
                  <Link to="/forgot-password"
                    style={{ fontSize:"11px", color:"#64748B", fontWeight:600, textDecoration:"none", transition:"color .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}> 
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position:"relative" }}>
                  {/* Lock icon */}
                  <div style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                    <Ico size={14} stroke="#64748B">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </Ico>
                  </div>
                  <input
                    ref={passRef}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    autoComplete="new-password"
                    name="skillsync-login-password"
                    id="skillsync-login-password"
                    readOnly
                    onFocus={e => {
                      e.target.removeAttribute("readOnly");
                      e.target.style.borderColor = "#22D3EE";
                      e.target.style.boxShadow   = "0 0 0 3px rgba(34,211,238,0.1)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "#334155";
                      e.target.style.boxShadow   = "none";
                    }}
                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
                    placeholder="Your password"
                    style={{ ...inputStyle, padding:"11px 40px 11px 38px" }}
                  />
                  {/* Show/hide toggle */}
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0, color:"#64748B" }}>
                    <Ico size={15} stroke="#64748B">
                      {showPassword
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </Ico>
                  </button>
                </div>
              </div>
              {/* ── Submit button ── */}
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"12px", background: loading?"#1E293B":"linear-gradient(135deg,#22D3EE,#06B6D4)", color: loading?"#64748B":"#060D1A", fontSize:"13px", fontWeight:800, borderRadius:"10px", border:"none", cursor: loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"opacity .2s", marginTop:"4px" }}>
                {loading
                  ? <><span style={{ display:"inline-block", width:"14px", height:"14px", border:"2px solid #334155", borderTopColor:"#22D3EE", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> Signing in...</>
                  : <>Sign In <Ico size={14} stroke="#060D1A"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Ico></>}
              </button>
            </form>
          </div>
          {/* Register link */}
          <p style={{ textAlign:"center", color:"#334155", fontSize:"12px", marginTop:"18px", ...revealStyle(160) }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"#22D3EE", fontWeight:700, textDecoration:"none" }}>Create one</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}