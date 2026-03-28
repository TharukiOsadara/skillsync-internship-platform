import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { authHeaders, getLoggedInAt, getUser } from "../../Utils/auth";

const initialForm = {
  fullName: "", gmail: "", age: "", address: "", phoneNo: "",
  skills: "", education: "", experience: "", role: "Student",
};

// ── Online status helper ─────────────────────────────────────────────────────
function getOnlineStatus(lastLoginAt) {
  if (!lastLoginAt) return "offline";
  const diff = (Date.now() - new Date(lastLoginAt).getTime()) / 1000 / 60; // minutes
  if (diff < 5) return "online";
  if (diff < 30) return "away";
  return "offline";
}

const STATUS_STYLE = {
  online: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)", dot: "#4ADE80", label: "Online" },
  away: { color: "#FCD34D", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.2)", dot: "#FCD34D", label: "Away" },
  offline: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", dot: "#F87171", label: "Offline" },
};

const Ico = ({ stroke = "#22D3EE", size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ background: "none", border: "none", color: "#64748B", fontSize: "20px", cursor: "pointer", padding: 0, transition: "color .15s" }}
    onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
    onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>←</button>
);

export default function UsersDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const loggedInAt = getLoggedInAt();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [entered, setEntered] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ total: 0, admins: 0, students: 0 });
  const [liveTime, setLiveTime] = useState(new Date());
  const [updatedRows, setUpdatedRows] = useState({}); // { userId: changedFields[] }
  const [modalError, setModalError] = useState(""); // error shown inside the edit modal

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "Admin").length;
  const studentCount = users.filter(u => u.role === "Student").length;

  useEffect(() => {
    if (loading) return;
    const targets = { total: totalUsers, admins: adminCount, students: studentCount };
    const start = Date.now();
    const duration = 380;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setAnimatedStats({
        total: Math.round(targets.total * progress),
        admins: Math.round(targets.admins * progress),
        students: Math.round(targets.students * progress),
      });
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [loading, totalUsers, adminCount, studentCount]);

  useEffect(() => { if (!currentUser || currentUser.role !== "Admin") navigate("/login"); }, [currentUser, navigate]);
  
  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:5000/users", { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to load users.");
      setUsers(data.users || []);
    } catch { setError("Server error while loading users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const validateUser = (payload) => {
    const hasLetter = (v) => /[A-Za-z]/.test(String(v || ""));
    const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneDigits = String(payload.phoneNo || "").replace(/\D/g, "");
    if (!payload.fullName || !payload.gmail || !payload.age || !payload.address || !payload.phoneNo || !payload.education || !payload.experience)
      return "All required fields must be filled.";
    if (/\d/.test(payload.fullName)) return "Full name cannot contain numbers.";
    if (!emailRx.test(payload.gmail)) return "Gmail must start with a letter and be valid.";
    if (!hasLetter(payload.address)) return "Address cannot be only numbers.";
    if (payload.skills && !hasLetter(payload.skills)) return "Skills cannot be only numbers.";
    if (!hasLetter(payload.education)) return "Education cannot be only numbers.";
    if (!hasLetter(payload.experience)) return "Experience cannot be only numbers.";
    if (phoneDigits.length !== 10) return "Phone number must be exactly 10 digits.";
    if (Number(payload.age) < 16 || Number(payload.age) > 60) return "Age must be between 16 and 60.";
    return null;
  };

  const openEditModal = (user) => {
    setEditUser(user); setModalError(""); setSuccess("");
    setForm({
      fullName: user.fullName || "", gmail: user.gmail || "",
      age: user.age || "", address: user.address || "", phoneNo: user.phoneNo || "",
      skills: user.skills || "", education: user.education || "", experience: user.experience || "",
      role: user.role || "Student"
    });
  };

  const handleUpdateUser = async () => {
    setModalError(""); setSuccess("");
    const err = validateUser(form);
    if (err) return setModalError(err);
    try {
      const res = await fetch(`http://localhost:5000/users/${editUser._id}`, {
        method: "PUT", headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setModalError(data.message || "Update failed.");

      // Detect which fields changed
      const changed = Object.keys(form).filter(k => String(form[k]) !== String(editUser[k] ?? ""));
      const isFullRow = changed.length >= Object.keys(form).length - 1; // almost all fields

      setUsers(prev => prev.map(u => u._id === editUser._id ? { ...u, ...form } : u));
      setEditUser(null);
      setSuccess("User updated successfully.");

      // Mark row for highlight, clear after 3s
      setUpdatedRows(prev => ({ ...prev, [editUser._id]: { fields: changed, full: isFullRow } }));
      setTimeout(() => {
        setUpdatedRows(prev => { const n = { ...prev }; delete n[editUser._id]; return n; });
      }, 3000);
    } catch { setModalError("Server error while updating."); }
  };

  const handleDeleteUser = async () => {
    setError(""); setSuccess("");
    if (!adminPassword) return setError("Admin password is required.");
    try {
      const res = await fetch(`http://localhost:5000/users/${deleteUserId}`, {
        method: "DELETE", headers: authHeaders(),
        body: JSON.stringify({ adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Delete failed.");
      setUsers(prev => prev.filter(u => u._id !== deleteUserId));
      setDeleteUserId(null); setAdminPassword("");
      setSuccess("User deleted successfully.");
    } catch { setError("Server error while deleting."); }
  };

  const filtered = users.filter(u => {
    const role = u.role || "Student";
    if (roleFilter === "Admin" && role !== "Admin") return false;
    if (roleFilter === "Student" && role !== "Student") return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.fullName || "").toLowerCase().includes(q) || (u.gmail || "").toLowerCase().includes(q);
  });

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex min-h-screen bg-[#0B1220] font-syne">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        {/* ── Page header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", ...revealStyle(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <BackBtn onClick={() => navigate(-1)} />
            <div style={{ width: "44px", height: "44px", flexShrink: 0, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico size={20}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </Ico>
            </div>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Users Dashboard</h1>
              <p style={{ color: "#64748B", fontSize: "13px", margin: "3px 0 0" }}>Registered users and login activity</p>
            </div>
          </div>
          <div style={{
            minWidth: "275px", borderRadius: "12px", padding: "10px 12px",
            border: "1px solid rgba(34,211,238,0.25)", background: "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(15,23,42,0.94))",
            boxShadow: "0 10px 24px rgba(34,211,238,0.12)", opacity: entered ? 1 : 0,
            transform: entered ? "translateX(0)" : "translateX(24px)",
            transition: "opacity .38s ease 120ms, transform .45s cubic-bezier(0.22, 1, 0.36, 1) 120ms",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "10px", background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico size={15} stroke="#22D3EE"><path d="M22 12h-4l-3 8-4-16-3 8H2" /></Ico>
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ color: "#67E8F9", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>Welcome Back</p>
                <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 700, margin: "4px 0 0" }}>{currentUser?.fullName}</p>
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

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "20px", ...revealStyle(70) }}>
          {[
            { label: "Total Users", value: animatedStats.total, color: "#22D3EE", border: "rgba(34,211,238,0.2)", filterKey: "All", hoverBg: "rgba(34,211,238,0.1)", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
            { label: "Admins", value: animatedStats.admins, color: "#A78BFA", border: "rgba(167,139,250,0.2)", filterKey: "Admin", hoverBg: "rgba(167,139,250,0.1)", icon: <><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" /><path d="M9 12l2 2 4-4" /></> },
            { label: "Students", value: animatedStats.students, color: "#4ADE80", border: "rgba(74,222,128,0.2)", filterKey: "Student", hoverBg: "rgba(74,222,128,0.1)", icon: <><path d="M22 10v6M2 10v6" /><path d="M12 2L1 8l11 6 9-4.91" /><path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5" /></> },
          ].map((s, i) => (
            <div key={i} onClick={() => setRoleFilter(s.filterKey)} style={{ background: roleFilter === s.filterKey ? s.hoverBg : "#0F172A", border: `1px solid ${roleFilter === s.filterKey ? s.color : s.border}`, borderRadius: "14px", padding: "20px", textAlign: "center", cursor: "pointer", opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(-14px)", boxShadow: roleFilter === s.filterKey ? `0 14px 30px ${s.color}35, 0 0 0 1px ${s.color}44 inset` : "none", transition: `opacity .45s ease ${120 + (i * 80)}ms, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${120 + (i * 80)}ms, box-shadow .2s, border-color .2s, background-color .2s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 34px ${s.color}40, 0 0 0 1px ${s.color}55 inset`; e.currentTarget.style.backgroundColor = s.hoverBg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = roleFilter === s.filterKey ? s.color : s.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = roleFilter === s.filterKey ? `0 14px 30px ${s.color}35, 0 0 0 1px ${s.color}44 inset` : "none"; e.currentTarget.style.backgroundColor = roleFilter === s.filterKey ? s.hoverBg : "#0F172A"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: s.border, border: `1px solid ${s.color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ico size={14} stroke={s.color}>{s.icon}</Ico>
                </div>
                <p style={{ color: "#64748B", fontSize: "11px", margin: 0 }}>{s.label}</p>
              </div>
              <p style={{ fontSize: "32px", fontWeight: 800, color: s.color, margin: "0 auto", textAlign: "center", width: "100%" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search bar ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px", ...revealStyle(190) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1E293B", border: "1px solid #334155", borderRadius: "9px", padding: "6px 10px", width: "320px", transition: "border-color .15s" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#22D3EE")}
            onBlur={e => (e.currentTarget.style.borderColor = "#334155")}>
            <Ico size={12} stroke="#64748B"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ico>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." style={{ background: "transparent", border: "none", outline: "none", color: "#F1F5F9", fontSize: "11px", width: "100%", fontFamily: "'DM Sans',sans-serif" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: "14px", padding: 0 }}>×</button>}
          </div>
        </div>

        {error && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4" style={revealStyle(230)}>⚠️ {error}</div>}
        {success && <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4" style={revealStyle(230)}>✅ {success}</div>}

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10" style={revealStyle(250)}>Loading users...</div>
        ) : (
          <div className="admin-hover-surface" style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden", ...revealStyle(250) }}>
            <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
              <table className="w-full min-w-[1700px] border-collapse text-xs">
                <thead>
                  <tr style={{ background: "#0B1220" }}>
                    {["#", "Full Name", "Status", "Gmail", "Role", "Age", "Address", "Phone", "Skills", "Education", "Experience", "Created At", "Updated At", "Last Login", "Actions"].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3 border-b border-navy-800" style={{ position: "sticky", top: 0, background: "#0B1220", zIndex: 2 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, index) => {
                    const status = getOnlineStatus(user.lastLoginAt);
                    const ss = STATUS_STYLE[status];
                    const rowUpdate = updatedRows[user._id];
                    const isFullHighlight = rowUpdate?.full;
                    const changedFields = rowUpdate?.fields || [];

                    // Map field keys to column order for partial cell highlights
                    const fieldToCol = { fullName: 1, gmail: 3, role: 4, age: 5, address: 6, phoneNo: 7, skills: 8, education: 9, experience: 10 };

                    const rowStyle = isFullHighlight
                      ? { background: "rgba(34,211,238,0.10)", outline: "1px solid rgba(34,211,238,0.35)", transition: "background 0.5s, outline 0.5s" }
                      : {};

                    const cellHighlight = (field) =>
                      !isFullHighlight && changedFields.includes(field)
                        ? { background: "rgba(34,211,238,0.12)", borderRadius: "6px", transition: "background 0.5s" }
                        : {};

                    return (
                      <tr key={user._id} className="border-b border-navy-800 transition-colors"
                        style={{ ...rowStyle, ...(isFullHighlight ? {} : { hover: undefined }) }}
                        onMouseEnter={e => { if (!rowUpdate) e.currentTarget.style.background = "rgba(30,41,59,0.3)"; }}
                        onMouseLeave={e => { if (!rowUpdate) e.currentTarget.style.background = ""; if (isFullHighlight) e.currentTarget.style.background = "rgba(34,211,238,0.10)"; }}
                      >
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{index + 1}</td>
                        <td className="px-3 py-3 text-slate-200 font-bold whitespace-nowrap" style={cellHighlight("fullName")}>{user.fullName}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "8px", fontWeight: 700, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, padding: "2px 8px", borderRadius: "99px" }}>
                            <span style={{ width: "5px", height: "5px", background: ss.dot, borderRadius: "50%", flexShrink: 0 }}></span>
                            {ss.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap" style={cellHighlight("gmail")}>{user.gmail}</td>
                        <td className="px-3 py-3 whitespace-nowrap" style={cellHighlight("role")}>
                          <span className={(user.role || "Student") === "Admin" ? "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20" : "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20"}>
                            {user.role || "Student"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap" style={cellHighlight("age")}>{user.age}</td>
                        <td className="px-3 py-3 text-slate-400" style={cellHighlight("address")}>{user.address}</td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap" style={cellHighlight("phoneNo")}>{user.phoneNo}</td>
                        <td className="px-3 py-3 text-slate-400" style={cellHighlight("skills")}>{user.skills}</td>
                        <td className="px-3 py-3 text-slate-400" style={cellHighlight("education")}>{user.education}</td>
                        <td className="px-3 py-3 text-slate-400" style={cellHighlight("experience")}>{user.experience}</td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}</td>
                        <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(user)} className="text-cyan-400 text-xs font-bold bg-cyan-400/8 border border-cyan-400/15 px-2 py-1 rounded-lg hover:bg-cyan-400/15 transition-all cursor-pointer">Update</button>
                            <button onClick={() => setDeleteUserId(user._id)} className="text-red-400 text-xs font-bold bg-red-400/8 border border-red-400/15 px-2 py-1 rounded-lg hover:bg-red-400/15 transition-all cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={16} className="text-center text-slate-400 text-sm py-10">{search ? "No users match your search." : "No users found."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-6 max-w-3xl w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-4">Update User</h3>
            <div className="grid grid-cols-2 gap-3">
              {[ ["fullName", "Full Name"], ["gmail", "Gmail"], ["age", "Age"], ["address", "Address"], ["phoneNo", "Phone Number"], ["skills", "Skills"], ["education", "Education"], ["experience", "Experience"] ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-slate-400 text-xs">{label}</label>
                  <input value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="input-field" />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-xs">Role</label>
                <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))} className="input-field">
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            {modalError && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171", padding: "9px 13px", borderRadius: "9px", fontSize: "12px", marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{modalError}</span>
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setEditUser(null); setModalError(""); }} className="flex-1 py-3 bg-navy-800 border border-navy-700 text-slate-400 font-bold text-sm rounded-xl hover:border-slate-500 cursor-pointer transition-all">Cancel</button>
              <button onClick={handleUpdateUser} className="flex-1 py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-bold text-sm rounded-xl hover:bg-cyan-400/20 cursor-pointer transition-all">Save Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-2">Confirm User Delete</h3>
            <p className="text-slate-400 text-sm mb-4">Enter admin password to delete this user.</p>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Admin password" className="input-field" />
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setDeleteUserId(null); setAdminPassword(""); }} className="flex-1 py-3 bg-navy-800 border border-navy-700 text-slate-400 font-bold text-sm rounded-xl hover:border-slate-500 cursor-pointer transition-all">Cancel</button>
              <button onClick={handleDeleteUser} className="flex-1 py-3 bg-red-400/10 border border-red-400/30 text-red-400 font-bold text-sm rounded-xl hover:bg-red-400/20 cursor-pointer transition-all">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}