import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders, saveAuth, getToken, getLoggedInAt } from "../../Utils/auth";

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const Ico = ({ size = 16, stroke = "#22D3EE", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const PageIcon = ({ children, color = "#22D3EE", bg = "rgba(34,211,238,0.1)", border = "rgba(34,211,238,0.2)" }) => (
  <div style={{ width: "44px", height: "44px", flexShrink: 0, background: bg, border: `1px solid ${border}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

const Inp = ({ label, name, value, onChange, type = "text", placeholder = "", readOnly = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
    <input
      name={name} type={type} value={value} onChange={onChange}
      placeholder={placeholder} readOnly={readOnly}
      style={{
        background: readOnly ? "rgba(30,41,59,0.5)" : "#1E293B",
        border: `1px solid ${readOnly ? "#1E293B" : "#334155"}`,
        borderRadius: "9px", padding: "9px 12px",
        color: readOnly ? "#64748B" : "#F1F5F9",
        fontSize: "12px", width: "100%",
        fontFamily: "'DM Sans', sans-serif", outline: "none",
        cursor: readOnly ? "not-allowed" : "text",
        transition: "border-color .15s, box-shadow .15s",
      }}
      onFocus={e => { if (!readOnly) { e.target.style.borderColor = "#22D3EE"; e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)"; } }}
      onBlur={e => { e.target.style.borderColor = readOnly ? "#1E293B" : "#334155"; e.target.style.boxShadow = "none"; }}
    />
  </div>
);

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const cfg = {
    error: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#F87171", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
    success: { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", color: "#4ADE80", icon: <><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 10" /></> },
  }[type];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, padding: "10px 14px", borderRadius: "10px", fontSize: "12px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
      <Ico size={14} stroke={cfg.color}>{cfg.icon}</Ico>
      <span>{msg}</span>
    </div>
  );
};

// ── Stat card (hoverable, smaller font, system color) ──────────────────────────
const StatCard = ({ label, value, icon }) => {
  const color = "#22D3EE";
  return (
    <div
      style={{
        background: "#0F172A",
        border: `1px solid ${color}22`,
        borderRadius: "12px",
        padding: "8px 8px",
        minWidth: 0,
        height: "60px",
        maxWidth: "180px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "11px",
        color: "#F1F5F9",
        fontWeight: 600,
        cursor: "pointer",
        transition: "box-shadow .15s, border-color .15s",
        wordBreak: "break-word"
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 12px 0 rgba(34,211,238,0.10)"; e.currentTarget.style.borderColor = "#22D3EE"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#22D3EE22"; }}
    >
      <div style={{ width: "28px", height: "28px", borderRadius: "10px", background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ico size={12} stroke={color}>{icon}</Ico>
      </div>
      <div>
        <p style={{ color: "#64748B", fontSize: "10px", fontWeight: 700, margin: 0 }}>{label}</p>
        <p style={{ color: color, fontSize: "11px", fontWeight: 800, margin: "3px 0 0", wordBreak: "break-word" }}>{value || "—"}</p>
      </div>
    </div>
  );
};

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [profile, setProfile] = useState(() => user || {});
  const loggedInAt = getLoggedInAt();
  const fileRef = useRef(null);
  const [entered, setEntered] = useState(false);

  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || "",
    gmail: user?.gmail || "",
    age: user?.age || "",
    address: user?.address || "",
    phoneNo: user?.phoneNo || "",
    education: user?.education || "",
    experience: user?.experience || "",
  }));
  const [photo, setPhoto] = useState(() => user?.photo || null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Live clock
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/login");
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-14px)",
    transition: `opacity .45s ease ${delay}ms, transform .52s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setProfileError(""); };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileError(""); setProfileSuccess("");
    if (!form.fullName || !form.gmail) return setProfileError("Name and email are required.");
    if (/\d/.test(form.fullName)) return setProfileError("Full name cannot contain numbers.");
    setProfileLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ ...form, photo }),
      });
      const data = await res.json();
      if (!res.ok) return setProfileError(data.message || "Update failed.");
      const updatedProfile = { ...profile, ...form, photo };
      saveAuth(getToken(), updatedProfile);
      setProfile(updatedProfile);
      setProfileSuccess("Profile updated successfully!");
    } catch { setProfileError("Server error. Please try again."); }
    finally { setProfileLoading(false); }
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
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setPwError(data.message || "Password change failed.");
      setPwSuccess("Password changed successfully! Use your new password on next login.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch { setPwError("Server error. Please try again."); }
    finally { setPwLoading(false); }
  };

  const initial = (profile?.fullName || "A").trim().charAt(0).toUpperCase();
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const lastLogin = loggedInAt ? loggedInAt.toLocaleString() : "—";

  // Shared password input renderer
  const PwInput = ({ label, field, placeholder }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={showPw[field] ? "text" : "password"}
          value={pwForm[field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"]}
          onChange={e => setPwForm(prev => ({ ...prev, [field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"]: e.target.value }))}
          placeholder={placeholder}
          style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "9px", padding: "9px 38px 9px 12px", color: "#F1F5F9", fontSize: "12px", width: "100%", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .15s, box-shadow .15s", boxSizing: "border-box" }}
          onFocus={e => { e.target.style.borderColor = "#A78BFA"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "#334155"; e.target.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#64748B" }}>
          <Ico size={14} stroke="#64748B">
            {showPw[field]
              ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
            }
          </Ico>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        /* Hide built-in browser password reveal button */
        .skillsync-admin-password::-ms-reveal,
        .skillsync-admin-password::-ms-clear {
          display: none;
        }
        .skillsync-admin-password::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0, height: "100vh", overscrollBehavior: "contain" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", ...revealStyle(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#64748B", fontSize: "20px", cursor: "pointer", padding: 0, transition: "color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
              onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>←</button>
            <PageIcon>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </PageIcon>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>My Profile</h1>
              <p style={{ color: "#64748B", fontSize: "13px", margin: "3px 0 0" }}>Manage your admin account details</p>
            </div>
          </div>

          {/* Welcome card */}
          <div style={{ minWidth: "260px", borderRadius: "12px", padding: "10px 14px", border: "1px solid rgba(34,211,238,0.25)", background: "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(15,23,42,0.94))", boxShadow: "0 10px 24px rgba(34,211,238,0.12)", ...revealStyle(80) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "10px", background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico size={15} stroke="#22D3EE"><path d="M22 12h-4l-3 8-4-16-3 8H2" /></Ico>
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ color: "#67E8F9", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>Welcome Back</p>
                <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 700, margin: "4px 0 0" }}>{profile?.fullName}</p>
              </div>
            </div>
            {loggedInAt && (
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px" }}>
                <Ico size={12} stroke="#64748B"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Ico>
                <span>Logged in at: {loggedInAt.toLocaleString()}</span>
              </div>
            )}
            <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px" }}>
              <Ico size={12} stroke="#22D3EE"><circle cx="12" cy="12" r="9" /><polyline points="12 8 12 12 15 12" /></Ico>
              <span>Live: {liveTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", marginBottom: "24px", ...revealStyle(60) }}>
          <StatCard label="Role" value={profile?.role} icon={<><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" /><path d="M9 12l2 2 4-4" /></>} />
          <StatCard label="Member Since" value={memberSince} icon={<><rect x="3" y="4" width="18" height="17" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", ...revealStyle(120) }}>

          {/* ── Profile Form ──────────────────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <PageIcon color="#22D3EE" bg="rgba(34,211,238,0.08)" border="rgba(34,211,238,0.15)">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </PageIcon>
              <div>
                <h2 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "16px", margin: 0 }}>Account Details</h2>
                <p style={{ color: "#64748B", fontSize: "11px", margin: "2px 0 0" }}>Update your personal information</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              {/* Avatar */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "18px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
                <div onClick={() => fileRef.current?.click()}
                  style={{ width: "72px", height: "72px", flexShrink: 0, background: photo ? "transparent" : "linear-gradient(135deg,#A78BFA,#7C3AED)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "28px", color: "#F8FAFC", cursor: "pointer", position: "relative", overflow: photo ? "hidden" : "visible" }}>
                  {photo ? <img src={photo} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "18px" }} /> : initial}
                  <div style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "22px", height: "22px", background: "#A78BFA", borderRadius: "50%", border: "2px solid #0B1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ico size={9} stroke="#fff"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></Ico>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                <div>
                  <p style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "14px", margin: "0 0 2px" }}>{profile?.fullName || "Admin"}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#A78BFA", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px" }}>
                    <Ico size={9} stroke="#A78BFA"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" /></Ico>
                    ADMIN
                  </span>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    style={{ display: "flex", marginTop: "8px", alignItems: "center", gap: "5px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", fontSize: "10px", fontWeight: 700, padding: "4px 12px", borderRadius: "99px", cursor: "pointer" }}>
                    Upload photo
                  </button>
                </div>
              </div>

              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "18px" }}>
                <Alert type="error" msg={profileError} />
                <Alert type="success" msg={profileSuccess} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <Inp label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Admin" />
                  <Inp label="Email" name="gmail" value={form.gmail} onChange={handleChange} type="email" placeholder="admin@example.com" />
                  <Inp label="Age" name="age" value={form.age} onChange={handleChange} type="number" placeholder="30" />
                  <Inp label="Phone Number" name="phoneNo" value={form.phoneNo} onChange={handleChange} placeholder="0771234567" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Inp label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Colombo, Sri Lanka" />
                  <Inp label="Education" name="education" value={form.education} onChange={handleChange} placeholder="BSc Computer Science" />
                  <Inp label="Experience" name="experience" value={form.experience} onChange={handleChange} placeholder="5 years in System Administration" />
                  <Inp label="Role (read-only)" name="role" value={profile?.role || "Admin"} onChange={() => {}} readOnly />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button type="button" onClick={() => navigate(-1)}
                    style={{ flex: 1, padding: "10px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: "12px", fontWeight: 700, borderRadius: "9px", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={profileLoading}
                    style={{ flex: 2, padding: "10px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontSize: "12px", fontWeight: 800, borderRadius: "9px", border: "none", cursor: "pointer", opacity: profileLoading ? 0.7 : 1 }}>
                    {profileLoading ? "Saving..." : "Save Changes →"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ── Right Column ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Account Info Card */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <PageIcon color="#22D3EE" bg="rgba(34,211,238,0.1)" border="rgba(34,211,238,0.2)">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </PageIcon>
                <div>
                  <h2 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: "16px", margin: 0 }}>Account Info</h2>
                  <p style={{ color: "#64748B", fontSize: "11px", margin: "2px 0 0" }}>Read-only account metadata</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[ 
                  { label: "Email (Gmail)", value: profile?.gmail },
                  { label: "Account Role", value: profile?.role },
                  { label: "Member Since", value: memberSince },
                  { label: "Education", value: profile?.education || "—" },
                  { label: "Experience", value: profile?.experience || "—" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "8px", borderBottom: "1px solid #1E293B" }}>
                    <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600 }}>{label}</span>
                    <span style={{ color: "#22D3EE", fontSize: "11px", fontWeight: 700, textAlign: "right", maxWidth: "60%", wordBreak: "break-all" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Change Password ─────────────────────────────────────────── */}
            {/* Change Password (copied from StudentProfilePage for full consistency) */}
            <div style={{ background: "#0F172A", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "14px", padding: "20px" }}>
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
                  {/* PwInput fields mimic StudentProfilePage */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>Current Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw.current ? "text" : "password"}
                        value={pwForm.currentPassword}
                        onChange={e => { setPwForm(p => ({ ...p, currentPassword: e.target.value })); setPwError(""); }}
                        placeholder={"......"}
                        autoComplete="current-password"
                        className="skillsync-admin-password"
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
                        onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                        style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Ico size={13} stroke="#64748B">
                          {showPw.current
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                        </Ico>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw.new ? "text" : "password"}
                        value={pwForm.newPassword}
                        onChange={e => { setPwForm(p => ({ ...p, newPassword: e.target.value })); setPwError(""); }}
                        placeholder={"Min. 6 characters"}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                        className="skillsync-admin-password"
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
                        onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                        style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Ico size={13} stroke="#64748B">
                          {showPw.new
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                        </Ico>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw.confirm ? "text" : "password"}
                        value={pwForm.confirmPassword}
                        onChange={e => { setPwForm(p => ({ ...p, confirmPassword: e.target.value })); setPwError(""); }}
                        placeholder={"Repeat new password"}
                        autoComplete="off"
                        data-lpignore="true"
                        data-form-type="other"
                        className="skillsync-admin-password"
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
                        onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                        style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Ico size={13} stroke="#64748B">
                          {showPw.confirm
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                        </Ico>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength bar and match check */}
                {pwForm.newPassword && (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4].map(i => {
                        const p = pwForm.newPassword;
                        let s = 0;
                        if (p.length >= 6) s++;
                        if (p.length >= 8) s++;
                        if (/[A-Z]/.test(p) && p.length >= 10) s++;
                        if (/[^A-Za-z0-9]/.test(p) && p.length >= 12) s++;
                        return <div key={i} style={{ flex: 1, height: "3px", borderRadius: "99px", background: i <= s ? ["#F87171", "#FCD34D", "#4ADE80", "#22D3EE"][s - 1] : "#1E293B", transition: "background .25s" }} />;
                      })}
                    </div>
                    <p style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: (() => { const p = pwForm.newPassword; let s = 0; if (p.length >= 6) s++; if (p.length >= 8) s++; if (/[A-Z]/.test(p) && p.length >= 10) s++; if (/[^A-Za-z0-9]/.test(p) && p.length >= 12) s++; return s > 0 ? ["#F87171", "#FCD34D", "#4ADE80", "#22D3EE"][s - 1] : "#64748B"; })() }}>
                      {(() => { const p = pwForm.newPassword; let s = 0; if (p.length >= 6) s++; if (p.length >= 8) s++; if (/[A-Z]/.test(p) && p.length >= 10) s++; if (/[^A-Za-z0-9]/.test(p) && p.length >= 12) s++; return s > 0 ? ["Weak", "Fair", "Good", "Strong"][s - 1] : "Enter password"; })()} password
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
        </div>
      </main>
    </div>
  );
}