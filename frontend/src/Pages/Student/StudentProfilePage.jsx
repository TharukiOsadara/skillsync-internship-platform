import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import StudentWelcomeBack from "../../Components/StudentWelcomeBack";
import { getUser, authHeaders, saveAuth, getToken } from "../../Utils/auth";

const Ico = ({ size = 16, stroke = "#22D3EE", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const PageIcon = ({ children, color = "#22D3EE", bg = "rgba(34,211,238,0.1)", border = "rgba(34,211,238,0.2)" }) => (
  <div style={{ width: "42px", height: "42px", flexShrink: 0, background: bg, border: `1px solid ${border}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

const Inp = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 11px", color: "#F1F5F9", fontSize: "12px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s" }}
      onFocus={e => { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}

    />
  </div>
);

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const cfg = {
    error:   { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#F87171", icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    success: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  color: "#4ADE80", icon: <><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 10"/></> },
  }[type];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, padding: "10px 14px", borderRadius: "10px", fontSize: "12px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
      <Ico size={14} stroke={cfg.color}>{cfg.icon}</Ico>
      <span>{msg}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1 — CURSOR DISAPPEARING:
// PwInput must live OUTSIDE the parent component. When it was defined inside,
// React treated it as a brand-new component type on every render and unmounted/
// remounted the <input> element, destroying focus and the cursor each keystroke.
// Moving it outside gives it a stable identity across renders.
//
// FIX 2 — DB PASSWORD:
// All data (value, onChange, showPw, setShowPw) are passed as props so the
// component stays pure and stateless — nothing inside causes a re-definition.
// ─────────────────────────────────────────────────────────────────────────────
const PwInput = ({ label, field, placeholder, value, onChange, showPw, setShowPw }) => {
  // current password → browser may offer saved-password suggestions
  // new / confirm    → manual typing only, suppress autofill
  const autoComplete = field === "current" ? "current-password" : "off";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={showPw[field] ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...(field !== "current" ? { "data-lpignore": "true", "data-form-type": "other" } : {})}
          style={{
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "8px",
            padding: "8px 34px 8px 11px",
            color: "#F1F5F9",
            fontSize: "12px",
            width: "100%",
            fontFamily: "'DM Sans',sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={e => { e.target.style.borderColor = "#A78BFA"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
          onBlur={e  => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}
        />
        <button
          type="button"
          onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
          style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Ico size={13} stroke="#64748B">
            {showPw[field]
              ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
          </Ico>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function StudentProfile() {
  const navigate = useNavigate();
  const user     = getUser();
  const [profile, setProfile] = useState(() => user || {});
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    fullName:   user?.fullName   || "",
    gmail:      user?.gmail      || "",
    age:        user?.age        || "",
    address:    user?.address    || "",
    phoneNo:    user?.phoneNo    || "",
    skills:     user?.skills     || "",
    education:  user?.education  || "",
    experience: user?.experience || "",
  });

  const [photo, setPhoto]               = useState(user?.photo || null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [loading, setLoading]           = useState(false);

  // Password change state
  const [pwForm, setPwForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError]   = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw]     = useState({ current: false, new: false, confirm: false });

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);

  // ── FIX 2: Fetch plain-text password from DB and pre-fill current field ───
  useEffect(() => {
    if (!user?._id) return;
    fetch(`http://localhost:5000/users/${user._id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        // getUserById returns { success, data: userDoc }
        const pw = data?.data?.password || "";
        if (pw) setPwForm(prev => ({ ...prev, currentPassword: pw }));
      })
      .catch(() => {/* silently ignore — user can still type it manually */});
  }, []);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setProfileError(""); };


  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setProfileError(""); setProfileSuccess("");
    if (!form.fullName || !form.gmail) return setProfileError("Name and email are required.");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT", headers: authHeaders(),
        body: JSON.stringify({ ...form, photo }),
      });
      const data = await res.json();
      if (!res.ok) return setProfileError(data.message || "Update failed.");
      const updatedProfile = { ...profile, ...form, photo };
      saveAuth(getToken(), updatedProfile);
      setProfile(updatedProfile);
      setProfileSuccess("Profile updated successfully! Your matches will reflect the new skills.");
    } catch { setProfileError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    const { currentPassword, newPassword, confirmPassword } = pwForm;
    if (!currentPassword || !newPassword || !confirmPassword) return setPwError("All password fields are required.");
    if (newPassword.length < 6) return setPwError("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setPwError("New passwords do not match.");
    if (newPassword === currentPassword) return setPwError("New password must be different from current password.");
    setPwLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/change-password", {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setPwError(data.message || "Password change failed.");
      setPwSuccess("Password changed! Use your new password on next login.");
      // After success, update current field to the newly set password
      setPwForm({ currentPassword: newPassword, newPassword: "", confirmPassword: "" });
    } catch { setPwError("Server error. Please try again."); }
    finally { setPwLoading(false); }
  };

  const initial = (profile?.fullName || "S").trim().charAt(0).toUpperCase();

  const strengthScore = (() => {
    const p = pwForm.newPassword;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && p.length >= 10) s++;
    if (/[^A-Za-z0-9]/.test(p) && p.length >= 12) s++;
    return s;
  })();
  const strengthColors = ["#F87171", "#FCD34D", "#4ADE80", "#22D3EE"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0 }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PageIcon>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>My Profile</h1>
              <p style={{ color: "#64748B", fontSize: "13px", margin: "3px 0 0" }}>Update your personal information and skills</p>
            </div>
          </div>
          <StudentWelcomeBack />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", alignItems: "start" }}>

          {/* ── Left: Profile form ──────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>

            {/* Avatar card */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
              <div onClick={() => fileRef.current?.click()}
                style={{ width: "80px", height: "80px", flexShrink: 0, background: photo ? "transparent" : "linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "30px", color: "#060D1A", cursor: "pointer", position: "relative", overflow: photo ? "hidden" : "visible" }}>
                {photo ? <img src={photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}/> : initial}
                <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "24px", height: "24px", background: "#22D3EE", borderRadius: "50%", border: "2px solid #0B1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico size={10} stroke="#060D1A"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></Ico>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto}/>
              <div>
                <p style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "15px", margin: "0 0 4px" }}>{profile?.fullName || "Your Name"}</p>
                <p style={{ color: "#64748B", fontSize: "11px", margin: "0 0 8px" }}>{profile?.gmail}</p>
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", fontSize: "11px", fontWeight: 700, padding: "5px 14px", borderRadius: "99px", cursor: "pointer" }}>
                  Upload new photo
                </button>
              </div>
            </div>

            <Alert type="error"   msg={profileError}   />
            <Alert type="success" msg={profileSuccess} />

            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", marginBottom: "14px" }}>
                <Inp label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Kasun Rajapaksha" />
                <Inp label="Email" name="gmail" value={form.gmail} onChange={handleChange} type="email" placeholder="you@example.com" />
                <Inp label="Age" name="age" value={form.age} onChange={handleChange} type="number" placeholder="22" />
                <Inp label="Phone Number" name="phoneNo" value={form.phoneNo} onChange={handleChange} placeholder="0771234567" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Inp label="Address"    name="address"    value={form.address}    onChange={handleChange} placeholder="Colombo, Sri Lanka"/>
                <div>
                  <Inp label="Skills (comma separated — these drive your match results)" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB"/>
                  {form.skills && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "8px" }}>
                      {form.skills.split(",").map((s, i) => s.trim() ? (
                        <span key={i} style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", padding: "2px 9px", borderRadius: "99px", fontSize: "10px", fontWeight: 700 }}>{s.trim()}</span>
                      ) : null)}
                    </div>
                  )}
                </div>
                <Inp label="Education"  name="education"  value={form.education}  onChange={handleChange} placeholder="BSc IT - SLIIT"/>
                <Inp label="Experience" name="experience" value={form.experience} onChange={handleChange} placeholder="Intern at ABC Corp, 2024"/>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button type="button" onClick={() => navigate(-1)}
                style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: "13px", fontWeight: 700, borderRadius: "10px", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontSize: "13px", fontWeight: 800, borderRadius: "10px", border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : "Save Changes →"}
              </button>
            </div>
          </form>

          {/* ── Right: Change Password panel ──────────────────────────── */}
          <div style={{ background: "#0F172A", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <PageIcon color="#22D3EE" bg="rgba(34,211,238,0.1)" border="rgba(34,211,238,0.2)">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </PageIcon>
              <div>
                <h2 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "15px", margin: 0 }}>Change Password</h2>
                <p style={{ color: "#64748B", fontSize: "11px", margin: "2px 0 0" }}>Update your login password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange}>
              <Alert type="error"   msg={pwError}   />
              <Alert type="success" msg={pwSuccess} />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
                <PwInput
                  label="Current Password"
                  field="current"
                  placeholder="......"
                  value={pwForm.currentPassword}
                  onChange={e => { setPwForm(p => ({ ...p, currentPassword: e.target.value })); setPwError(""); }}
                  showPw={showPw}
                  setShowPw={setShowPw}
                />
                <PwInput
                  label="New Password"
                  field="new"
                  placeholder="Min. 6 characters"
                  value={pwForm.newPassword}
                  onChange={e => { setPwForm(p => ({ ...p, newPassword: e.target.value })); setPwError(""); }}
                  showPw={showPw}
                  setShowPw={setShowPw}
                />
                <PwInput
                  label="Confirm New Password"
                  field="confirm"
                  placeholder="Repeat new password"
                  value={pwForm.confirmPassword}
                  onChange={e => { setPwForm(p => ({ ...p, confirmPassword: e.target.value })); setPwError(""); }}
                  showPw={showPw}
                  setShowPw={setShowPw}
                />
              </div>

              {pwForm.newPassword && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: "3px", borderRadius: "99px", background: i <= strengthScore ? strengthColors[strengthScore - 1] : "#1E293B", transition: "background .25s" }}/>
                    ))}
                  </div>
                  <p style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: strengthScore > 0 ? strengthColors[strengthScore - 1] : "#64748B" }}>
                    {strengthScore > 0 ? strengthLabels[strengthScore - 1] : "Enter password"} password
                  </p>
                </div>
              )}

              {pwForm.confirmPassword && (
                <p style={{ fontSize: "10px", fontWeight: 700, margin: "0 0 12px", color: pwForm.newPassword === pwForm.confirmPassword ? "#4ADE80" : "#F87171", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Ico size={11} stroke={pwForm.newPassword === pwForm.confirmPassword ? "#4ADE80" : "#F87171"}>
                    {pwForm.newPassword === pwForm.confirmPassword
                      ? <polyline points="20 6 9 17 4 12"/>
                      : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
                  </Ico>
                  {pwForm.newPassword === pwForm.confirmPassword ? "Passwords match" : "Passwords do not match"}
                </p>
              )}

              <button type="submit" disabled={pwLoading}
                style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontSize: "12px", fontWeight: 800, borderRadius: "9px", border: "none", cursor: "pointer", opacity: pwLoading ? 0.7 : 1 }}>
                {pwLoading ? "Updating Password..." : "Update Password →"}
              </button>
            </form>

            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #1E293B", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{ background: "none", border: "none", padding: 0, color: "#64748B", fontSize: "11px", fontWeight: 600, textDecoration: "none", cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}
              >
                Forgot your current password?
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}