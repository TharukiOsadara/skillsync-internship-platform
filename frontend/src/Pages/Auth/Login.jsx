<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuth, isLoggedIn, getUser } from "../../Utils/auth";

const Ico = ({ size = 16, stroke = "#22D3EE", children }) => (
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../../Utils/auth";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const Ico = ({ size = 14, stroke = "currentColor", children }) => (
>>>>>>> origin/CV-Builder
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ gmail: "", password: "" });
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [entered, setEntered] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      navigate(user?.role === "Admin" ? "/admin/dashboard" : "/student/matches", { replace: true });
    }
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Load email suggestions
  useEffect(() => {
    fetch("http://localhost:5000/users/emails")
      .then(r => r.json())
      .then(d => setAllEmails(d.emails || []))
      .catch(() => {});
  }, []);

  const handleEmailInput = (val) => {
    setForm(f => ({ ...f, gmail: val }));
    setError("");
    if (val.length < 2) { setEmailSuggestions([]); return; }
    const filtered = allEmails.filter(e => e.gmail.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
    setEmailSuggestions(filtered);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.gmail || !form.password) return setError("Both fields are required.");
=======
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gmail || !form.password) return setError("All fields are required.");
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.gmail)) return setError("Please enter a valid email.");

>>>>>>> origin/CV-Builder
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid credentials.");
      saveAuth(data.token, data.user);
<<<<<<< HEAD
      navigate(data.user.role === "Admin" ? "/admin/dashboard" : "/student/matches", { replace: true });
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .45s ease ${delay}ms, transform .52s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans',sans-serif" }}>

      {/* Grid background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px", ...revealStyle(0) }}>
          <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(34,211,238,0.3)" }}>
            <Ico size={22} stroke="#060D1A">
              <path d="M22 12h-4l-3 8-4-16-3 8H2" />
            </Ico>
          </div>
          <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, margin: "0 0 4px" }}>SkillSync</h1>
          <p style={{ color: "#64748B", fontSize: "13px", margin: 0 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "30px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", ...revealStyle(80) }}>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171", padding: "10px 14px", borderRadius: "10px", fontSize: "12px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Ico size={14} stroke="#F87171"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", position: "relative" }}>
              <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Ico size={14} stroke="#64748B"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Ico>
                </div>
                <input
                  type="email" value={form.gmail} autoComplete="email"
                  onChange={e => handleEmailInput(e.target.value)}
                  onBlur={() => setTimeout(() => setEmailSuggestions([]), 150)}
                  placeholder="your@email.com"
                  style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "11px 12px 11px 38px", color: "#F1F5F9", fontSize: "13px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s, box-shadow .15s", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; }}
                />
              </div>
              {/* Email suggestions dropdown */}
              {emailSuggestions.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", marginTop: "4px" }}>
                  {emailSuggestions.map((e, i) => (
                    <button key={i} type="button"
                      onClick={() => { setForm(f => ({ ...f, gmail: e.gmail })); setEmailSuggestions([]); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", color: "#F1F5F9", fontSize: "12px", textAlign: "left", transition: "background .1s" }}
                      onMouseEnter={el => (el.currentTarget.style.background = "#334155")}
                      onMouseLeave={el => (el.currentTarget.style.background = "none")}>
                      <span>{e.gmail}</span>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: e.role === "Admin" ? "#A78BFA" : "#22D3EE", background: e.role === "Admin" ? "rgba(167,139,250,0.12)" : "rgba(34,211,238,0.08)", border: `1px solid ${e.role === "Admin" ? "rgba(167,139,250,0.25)" : "rgba(34,211,238,0.18)"}`, padding: "2px 7px", borderRadius: "99px" }}>
                        {e.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Password</label>
                {/* ── FORGOT PASSWORD LINK ── */}
                <Link to="/forgot-password"
                  style={{ fontSize: "11px", color: "#64748B", fontWeight: 600, textDecoration: "none", transition: "color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Ico size={14} stroke="#64748B"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Ico>
                </div>
                <input
                  type={showPassword ? "text" : "password"} value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
                  placeholder="Your password"
                  style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "11px 40px 11px 38px", color: "#F1F5F9", fontSize: "13px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s, box-shadow .15s", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#64748B" }}>
                  <Ico size={15} stroke="#64748B">
                    {showPassword
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </Ico>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "12px", background: loading ? "#1E293B" : "linear-gradient(135deg,#22D3EE,#06B6D4)", color: loading ? "#64748B" : "#060D1A", fontSize: "13px", fontWeight: 800, borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity .2s", marginTop: "4px" }}>
              {loading
                ? <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #334155", borderTopColor: "#22D3EE", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Signing in...</>
                : <>Sign In <Ico size={14} stroke="#060D1A"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Ico></>}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p style={{ textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "18px", ...revealStyle(160) }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#22D3EE", fontWeight: 700, textDecoration: "none" }}>
            Create one
          </Link>
        </p>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
=======
      navigate(data.user.role === "Admin" ? "/admin/dashboard" : "/student/matches");
    } catch { setError("Server error. Make sure backend is running."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#0B1220] min-h-screen font-syne">
      <Header />
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="card p-10 shadow-cyan">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-6">
              <span className="text-xl font-extrabold text-slate-200">skill</span>
              <span className="text-xl font-extrabold text-cyan-400">sync</span>
              <span className="ml-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">internships</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-200 mb-1">Welcome Back!!</h2>
            <p className="text-slate-400 text-sm mb-7">Sign in with your email and password</p>

            {error && (
              <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <Ico size={14} stroke="#f87171"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Email Address</label>
                <input name="gmail" placeholder="you@example.com" value={form.gmail} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Password</label>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-cyan w-full mt-1 text-sm">
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Role hints */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                {
                  role: "Admin",
                  desc: "Manage internships & matching",
                  icon: <Ico size={16} stroke="#a78bfa"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>,
                },
                {
                  role: "Student",
                  desc: "View matched internships",
                  icon: <Ico size={16} stroke="#22d3ee"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v4.5C6 18.5 8.7 20 12 20s6-1.5 6-3.5V12" /></Ico>,
                },
              ].map(r => (
                <div key={r.role} className="bg-navy-800 border border-navy-700 rounded-xl p-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/70">{r.icon}</span>
                  <div>
                    <p className="text-slate-200 text-xs font-bold m-0">{r.role}</p>
                    <p className="text-slate-400 text-[10px] m-0">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-400 text-sm mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-cyan-400 font-bold no-underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
>>>>>>> origin/CV-Builder
    </div>
  );
}