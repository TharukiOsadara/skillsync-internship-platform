import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../Utils/auth";

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

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const cfg = {
    error: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#F87171", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
    success: { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", color: "#4ADE80", icon: <><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 10" /></> },
  }[type];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, padding: "11px 14px", borderRadius: "10px", fontSize: "12px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "9px" }}>
      <Ico size={14} stroke={cfg.color}>{cfg.icon}</Ico>
      <span>{msg}</span>
    </div>
  );
};

const RoleTag = ({ role }) => {
  const isAdmin = role === "Admin";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: isAdmin ? "rgba(167,139,250,0.12)" : "rgba(34,211,238,0.1)", border: `1px solid ${isAdmin ? "rgba(167,139,250,0.3)" : "rgba(34,211,238,0.25)"}`, color: isAdmin ? "#A78BFA" : "#22D3EE", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", letterSpacing: "0.05em" }}>
      <Ico size={9} stroke={isAdmin ? "#A78BFA" : "#22D3EE"}>
        {isAdmin ? <><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" /></> : <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>}
      </Ico>
      {role} Account
    </span>
  );
};

// STEP CONFIG
const STEPS = [
  { num: 1, label: "Enter Email" },
  { num: 2, label: "Reset Password" },
  { num: 3, label: "Done" },
];

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Step 1: verify email ──────────────────────────────────────────────────
  const handleVerifyEmail = async e => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Please enter your email address.");
    const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRx.test(email.trim())) return setError("Please enter a valid email address.");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Email not found.");
      setRole(data.role);
      setFullName(data.fullName || "");
      setStep(2);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  // ── Step 2: reset password ────────────────────────────────────────────────
  const handleResetPassword = async e => {
    e.preventDefault();
    setError("");
    if (!newPassword || !confirmPassword) return setError("Both password fields are required.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: email.trim(), newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Password reset failed.");
      setSuccess(data.message || "Password reset successfully!");
      setStep(3);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  // Password strength
  const strengthScore = (() => {
    let s = 0;
    if (newPassword.length >= 6) s++;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword) && newPassword.length >= 10) s++;
    if (/[^A-Za-z0-9]/.test(newPassword) && newPassword.length >= 12) s++;
    return s;
  })();
  const strengthColors = ["#F87171", "#FCD34D", "#4ADE80", "#22D3EE"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ minHeight: "100vh", background: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* Particle animation background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {HERO_PARTICLES.map((p, i) => (
          <div key={i} style={{ ...p, position: "absolute", borderRadius: "50%", background: "rgba(103,232,249,0.9)", boxShadow: "0 0 8px rgba(34,211,238,0.8), 0 0 18px rgba(34,211,238,0.55)" }} />
        ))}
      </div>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 2 }}>
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
        /* Hide built-in browser password reveal button */
        .skillsync-forgot-password-input::-ms-reveal,
        .skillsync-forgot-password-input::-ms-clear {
          display: none;
        }
        .skillsync-forgot-password-input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>

        {/* Back to login */}
        <button
          type="button"
          onClick={() => { logout(); navigate("/login", { replace: true }); }}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "12px", fontWeight: 600, background: "none", border: "none", padding: 0, marginBottom: "24px", cursor: "pointer", transition: "color .15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}
        >
          <Ico size={12} stroke="currentColor"><polyline points="15 18 9 12 15 6" /></Ico>
          Back to Login
        </button>

        {/* Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico size={18} stroke="#0B1220"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Ico>
          </div>
          <div>
            <p style={{ color: "#F1F5F9", fontSize: "16px", fontWeight: 800, margin: 0 }}>Forgot Password</p>
            <p style={{ color: "#64748B", fontSize: "11px", margin: "2px 0 0" }}>SkillSync · Reset your account password</p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "24px" }}>
          {STEPS.map((s, idx) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0,
                  background: step > s.num ? "linear-gradient(135deg,#22D3EE,#06B6D4)" : step === s.num ? "rgba(34,211,238,0.15)" : "#1E293B",
                  border: step >= s.num ? "1px solid rgba(34,211,238,0.5)" : "1px solid #334155",
                  color: step > s.num ? "#0B1220" : step === s.num ? "#22D3EE" : "#64748B",
                  transition: "all .3s",
                }}>
                  {step > s.num
                    ? <Ico size={12} stroke="#0B1220"><polyline points="20 6 9 17 4 12" /></Ico>
                    : s.num
                  }
                </div>
                <span style={{ fontSize: "9px", fontWeight: 700, color: step >= s.num ? "#22D3EE" : "#334155", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{ flex: 1, height: "1px", background: step > s.num ? "#22D3EE" : "#1E293B", margin: "0 8px", marginBottom: "18px", transition: "background .3s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", padding: "28px 26px", boxShadow: "0 20px 48px rgba(0,0,0,0.4)" }}>

          {/* ── STEP 1 ─────────────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <h2 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "20px", margin: "0 0 6px" }}>Find Your Account</h2>
              <p style={{ color: "#64748B", fontSize: "12px", margin: "0 0 22px", lineHeight: 1.6 }}>
                Enter the email address linked to your SkillSync account. We'll verify it and let you set a new password.
              </p>
              <Alert type="error" msg={error} />
              <form onSubmit={handleVerifyEmail}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "18px" }}>
                  <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                      <Ico size={14} stroke="#64748B"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Ico>
                    </div>
                    <input
                      type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com" autoFocus
                      style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "10px 12px 10px 38px", color: "#F1F5F9", fontSize: "13px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s, box-shadow .15s", boxSizing: "border-box" }}
                      onFocus={e => { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontSize: "13px", fontWeight: 800, borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {loading ? "Verifying..." : <>Verify Email <Ico size={14} stroke="#060D1A"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Ico></>}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2 ─────────────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
                <h2 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "20px", margin: 0 }}>Set New Password</h2>
                <RoleTag role={role} />
              </div>
              {fullName && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "8px 12px", background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.12)", borderRadius: "9px" }}>
                  <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "12px", color: "#0B1220", flexShrink: 0 }}>
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "12px", margin: 0 }}>{fullName}</p>
                    <p style={{ color: "#64748B", fontSize: "10px", margin: "1px 0 0" }}>{email}</p>
                  </div>
                </div>
              )}
              <p style={{ color: "#64748B", fontSize: "12px", margin: "0 0 20px", lineHeight: 1.6 }}>
                Enter and confirm your new password. It must be at least 6 characters and different from your old password.
              </p>
              <Alert type="error" msg={error} />
              <form onSubmit={handleResetPassword}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
                  {/* New password */}
                  {[
                    { label: "New Password", val: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(p => !p), ph: "Min. 6 characters" },
                    { label: "Confirm New Password", val: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(p => !p), ph: "Repeat new password" },
                  ].map(({ label, val, set, show, toggle, ph }) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
                      <div style={{ position: "relative" }}>
                        <input type={show ? "text" : "password"} value={val} onChange={e => { set(e.target.value); setError(""); }} placeholder={ph}
                          className="skillsync-forgot-password-input"
                          style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "10px 38px 10px 12px", color: "#F1F5F9", fontSize: "13px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s, box-shadow .15s", boxSizing: "border-box" }}
                          onFocus={e => { e.target.style.borderColor = "#A78BFA"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
                          onBlur={e => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}
                        />
                        <button type="button" onClick={toggle} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          <Ico size={14} stroke="#64748B">
                            {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                          </Ico>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Strength bar */}
                  {newPassword && (
                    <div>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{ flex: 1, height: "3px", borderRadius: "99px", background: i <= strengthScore ? strengthColors[strengthScore - 1] : "#1E293B", transition: "background .25s" }} />
                        ))}
                      </div>
                      <p style={{ color: strengthScore > 0 ? strengthColors[strengthScore - 1] : "#64748B", fontSize: "10px", fontWeight: 700, margin: 0 }}>
                        {strengthScore > 0 ? strengthLabels[strengthScore - 1] : "Enter password"} password
                      </p>
                    </div>
                  )}

                  {/* Match indicator */}
                  {confirmPassword && (
                    <p style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: newPassword === confirmPassword ? "#4ADE80" : "#F87171", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Ico size={11} stroke={newPassword === confirmPassword ? "#4ADE80" : "#F87171"}>
                        {newPassword === confirmPassword ? <polyline points="20 6 9 17 4 12" /> : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
                      </Ico>
                      {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" onClick={() => { setStep(1); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                    style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: "12px", fontWeight: 700, borderRadius: "10px", cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#A78BFA,#7C3AED)", color: "#fff", fontSize: "13px", fontWeight: 800, borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Resetting..." : "Reset Password →"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Success ─────────────────────────────────────────── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: "64px", height: "64px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <Ico size={28} stroke="#4ADE80"><polyline points="20 6 9 17 4 12" /></Ico>
              </div>
              <h2 style={{ color: "#4ADE80", fontWeight: 800, fontSize: "22px", margin: "0 0 8px" }}>Password Reset!</h2>
              <p style={{ color: "#94A3B8", fontSize: "13px", margin: "0 0 8px", lineHeight: 1.7 }}>
                Your password has been updated successfully in the database.
              </p>
              <p style={{ color: "#64748B", fontSize: "12px", margin: "0 0 24px" }}>
                Account: <span style={{ color: "#22D3EE", fontWeight: 700 }}>{email}</span>
              </p>
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "22px", textAlign: "left" }}>
                <p style={{ color: "#4ADE80", fontSize: "11px", fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Ico size={12} stroke="#4ADE80"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>
                  What changed
                </p>
                <ul style={{ color: "#64748B", fontSize: "11px", margin: 0, paddingLeft: "16px", lineHeight: 1.9 }}>
                  <li>Your password has been updated in MongoDB</li>
                  <li>You can now log in with your new password</li>
                  <li>Previous password is no longer valid</li>
                </ul>
              </div>
              <button onClick={() => navigate("/login")}
                style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontSize: "13px", fontWeight: 800, borderRadius: "10px", border: "none", cursor: "pointer" }}>
                Go to Login →
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        {step !== 3 && (
          <p style={{ textAlign: "center", color: "#334155", fontSize: "11px", marginTop: "18px" }}>
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => { logout(); navigate("/login", { replace: true }); }}
              style={{ color: "#22D3EE", fontWeight: 700, textDecoration: "none", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}