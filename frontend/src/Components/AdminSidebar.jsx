import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser, authHeaders } from "../Utils/auth";

// ── Inline SVG icon helper ────────────────────────────────────────────────────
const Ico = ({ size = 14, stroke = "currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function AdminSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();
  const [collapsed, setCollapsed] = useState(false);

  // Live counts fetched from backend
<<<<<<< HEAD
  const [userCount, setUserCount]         = useState(null);
  const [internCount, setInternCount]     = useState(null);
=======
  const [userCount, setUserCount]   = useState(null);
  const [internCount, setInternCount] = useState(null);
>>>>>>> origin/CV-Builder
  const [appUnreadCount, setAppUnreadCount] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, iRes, aRes] = await Promise.all([
          fetch("http://localhost:5000/users",        { headers: authHeaders() }),
          fetch("http://localhost:5000/internships"),
          fetch("http://localhost:5000/internships/applications", { headers: authHeaders() }),
        ]);
        const uData = await uRes.json();
        const iData = await iRes.json();
        const aData = await aRes.json();
        setUserCount((uData.users || []).length);
        setInternCount((iData.internships || []).length);
        setAppUnreadCount(aData.unreadCount || 0);
      } catch { /* silently fail — badges just won't show */ }
    };
    load();
  }, []);

  const userInitial = (user?.fullName || "A").trim().charAt(0).toUpperCase();
  const handleLogout = () => { logout(); navigate("/homepage"); };
  const active = (path) => location.pathname === path;
<<<<<<< HEAD

  const applyNavHoverIn = (e, isActive) => {
    if (isActive) return;
    e.currentTarget.style.background    = "rgba(34,211,238,0.1)";
    e.currentTarget.style.borderColor   = "rgba(34,211,238,0.35)";
    e.currentTarget.style.color         = "#A5F3FC";
    e.currentTarget.style.transform     = "translateX(2px)";
    e.currentTarget.style.boxShadow     = "0 10px 22px rgba(34,211,238,0.14)";
  };
  const applyNavHoverOut = (e, isActive) => {
    if (isActive) return;
    e.currentTarget.style.background    = "transparent";
    e.currentTarget.style.borderColor   = "transparent";
    e.currentTarget.style.color         = "#4E6785";
    e.currentTarget.style.transform     = "translateX(0)";
    e.currentTarget.style.boxShadow     = "none";
=======
  const applyNavHoverIn = (e, isActive) => {
    if (isActive) return;
    e.currentTarget.style.background = "rgba(34,211,238,0.1)";
    e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)";
    e.currentTarget.style.color = "#A5F3FC";
    e.currentTarget.style.transform = "translateX(2px)";
    e.currentTarget.style.boxShadow = "0 10px 22px rgba(34,211,238,0.14)";
  };
  const applyNavHoverOut = (e, isActive) => {
    if (isActive) return;
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.borderColor = "transparent";
    e.currentTarget.style.color = "#4E6785";
    e.currentTarget.style.transform = "translateX(0)";
    e.currentTarget.style.boxShadow = "none";
>>>>>>> origin/CV-Builder
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const S = {
    aside: {
      width: collapsed ? "68px" : "230px",
      height: "100vh",
      background: "rgba(10,22,40,0.98)",
      border: "1px solid rgba(255,255,255,0.07)",
      padding: collapsed ? "18px 10px" : "18px 14px",
      display: "flex", flexDirection: "column", gap: "2px",
      transition: "width 0.25s ease, padding 0.25s ease",
      flexShrink: 0, position: "sticky", top: 0,
      fontFamily: "'DM Sans', sans-serif",
      overflowY: "auto",
      overflowX: "hidden",
    },
    navItem: (isActive) => ({
      display: "flex", alignItems: "center",
      gap: collapsed ? "0" : "11px",
      justifyContent: collapsed ? "center" : "flex-start",
      padding: collapsed ? "10px 0" : "9px 11px",
      borderRadius: "11px", cursor: "pointer",
      transition: "all .2s", textDecoration: "none",
      position: "relative",
      background: isActive ? "rgba(34,211,238,0.1)" : "transparent",
      border: isActive ? "1px solid rgba(34,211,238,0.18)" : "1px solid transparent",
      color: isActive ? "#22D3EE" : "#4E6785",
    }),
    ibox: (isActive) => ({
      width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isActive ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)",
    }),
    badge: {
      fontSize: "9px", fontWeight: 800,
      padding: "2px 7px", borderRadius: "99px",
      background: "rgba(34,211,238,0.12)",
      border: "1px solid rgba(34,211,238,0.2)",
      color: "#22D3EE", marginLeft: "auto", flexShrink: 0,
    },
    secLabel: {
      fontSize: "8px", fontWeight: 700, color: "#334155",
      letterSpacing: ".5em", textTransform: "uppercase",
      padding: "10px 10px 4px",
    },
  };

  return (
    <aside style={S.aside}>

      {/* ── Logo block ── */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: collapsed ? "0" : "11px",
        justifyContent: collapsed ? "center" : "flex-start",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        marginBottom: "4px",
      }}>
<<<<<<< HEAD
=======
        {/* Icon */}
>>>>>>> origin/CV-Builder
        <div style={{
          width: "44px", height: "44px", flexShrink: 0,
          background: "linear-gradient(135deg,#0ea5e9,#22D3EE)",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
<<<<<<< HEAD
=======

        {/* Text */}
>>>>>>> origin/CV-Builder
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ fontSize: "17px", fontWeight: 800, color: "#F1F5F9",
              lineHeight: 1, letterSpacing: "-.2px", display: "flex" }}>
              <span>skill</span><span style={{ color: "#22D3EE" }}>sync</span>
            </div>
            <span style={{
              fontSize: "9px", fontWeight: 700, color: "#22D3EE",
              letterSpacing: ".3px",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.2)",
              padding: "2px 9px", borderRadius: "99px",
              width: "fit-content",
            }}>internships</span>
          </div>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-end",
          gap: "5px", padding: "6px 8px",
          background: "rgba(34,211,238,0.04)",
          border: "1px solid rgba(34,211,238,0.08)",
          borderRadius: "8px", cursor: "pointer",
          marginBottom: "4px", transition: "all .2s",
          width: "100%",
        }}
        onMouseEnter={e => {
<<<<<<< HEAD
          e.currentTarget.style.background   = "rgba(34,211,238,0.12)";
          e.currentTarget.style.borderColor  = "rgba(34,211,238,0.28)";
          e.currentTarget.style.boxShadow    = "0 8px 20px rgba(34,211,238,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background   = "rgba(34,211,238,0.04)";
          e.currentTarget.style.borderColor  = "rgba(34,211,238,0.08)";
          e.currentTarget.style.boxShadow    = "none";
=======
          e.currentTarget.style.background = "rgba(34,211,238,0.12)";
          e.currentTarget.style.borderColor = "rgba(34,211,238,0.28)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(34,211,238,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(34,211,238,0.04)";
          e.currentTarget.style.borderColor = "rgba(34,211,238,0.08)";
          e.currentTarget.style.boxShadow = "none";
>>>>>>> origin/CV-Builder
        }}
      >
        {!collapsed && <span style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>Collapse</span>}
        <Ico size={13} stroke="#22D3EE">
          {collapsed
            ? <polyline points="9 18 15 12 9 6" />
<<<<<<< HEAD
            : <polyline points="15 18 9 12 15 6" />}
=======
            : <polyline points="15 18 9 12 15 6" />
          }
>>>>>>> origin/CV-Builder
        </Ico>
      </button>

      {/* ── MAIN section ── */}
      {!collapsed && <div style={S.secLabel}>Main</div>}

      {/* Dashboard */}
      <Link to="/admin/dashboard" style={S.navItem(active("/admin/dashboard"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/dashboard"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/dashboard"))}
        title={collapsed ? "Dashboard" : ""}
      >
        {active("/admin/dashboard") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/dashboard"))}>
          <Ico stroke={active("/admin/dashboard") ? "#22D3EE" : "#4E6785"}>
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Dashboard</span>}
      </Link>

      {/* Users */}
      <Link to="/admin/users" style={S.navItem(active("/admin/users"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/users"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/users"))}
        title={collapsed ? "Users" : ""}
      >
        {active("/admin/users") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/users"))}>
          <Ico stroke={active("/admin/users") ? "#22D3EE" : "#4E6785"}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Users</span>}
        {!collapsed && userCount !== null && <span style={S.badge}>{userCount}</span>}
      </Link>

<<<<<<< HEAD
      {/* Applications */}
=======
>>>>>>> origin/CV-Builder
      <Link to="/admin/applications" style={S.navItem(active("/admin/applications"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/applications"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/applications"))}
        title={collapsed ? "Applications" : ""}
      >
        {active("/admin/applications") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/applications"))}>
          <Ico stroke={active("/admin/applications") ? "#22D3EE" : "#4E6785"}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Applications</span>}
        {!collapsed && appUnreadCount !== null && <span style={S.badge}>{appUnreadCount}</span>}
      </Link>

      {/* ── INTERNSHIPS section ── */}
      {!collapsed && <div style={S.secLabel}>Internships</div>}

      {/* Add Internship */}
      <Link to="/admin/add-internship" style={S.navItem(active("/admin/add-internship"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/add-internship"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/add-internship"))}
        title={collapsed ? "Add Internship" : ""}
      >
        {active("/admin/add-internship") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/add-internship"))}>
          <Ico stroke={active("/admin/add-internship") ? "#22D3EE" : "#4E6785"}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Add Internship</span>}
      </Link>

      {/* Manage Internships */}
      <Link to="/admin/manage-internships" style={S.navItem(active("/admin/manage-internships"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/manage-internships"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/manage-internships"))}
        title={collapsed ? "Manage Internships" : ""}
      >
        {active("/admin/manage-internships") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/manage-internships"))}>
          <Ico stroke={active("/admin/manage-internships") ? "#22D3EE" : "#4E6785"}>
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Manage Internships</span>}
        {!collapsed && internCount !== null && <span style={S.badge}>{internCount}</span>}
      </Link>

      {/* Matching Engine */}
      <Link to="/admin/matching-engine" style={S.navItem(active("/admin/matching-engine"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/matching-engine"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/matching-engine"))}
        title={collapsed ? "Matching Engine" : ""}
      >
        {active("/admin/matching-engine") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/matching-engine"))}>
          <Ico stroke={active("/admin/matching-engine") ? "#22D3EE" : "#4E6785"}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>Matching Engine</span>}
      </Link>

<<<<<<< HEAD
      {/* ── ACCOUNT section ── */}
      {!collapsed && <div style={S.secLabel}>Account</div>}

      {/* My Profile ← NEW */}
      <Link to="/admin/profile" style={S.navItem(active("/admin/profile"))}
        onMouseEnter={e => applyNavHoverIn(e, active("/admin/profile"))}
        onMouseLeave={e => applyNavHoverOut(e, active("/admin/profile"))}
        title={collapsed ? "My Profile" : ""}
      >
        {active("/admin/profile") && <span style={{ position:"absolute",left:0,top:"22%",bottom:"22%",width:"3px",background:"#22D3EE",borderRadius:"0 3px 3px 0" }} />}
        <div style={S.ibox(active("/admin/profile"))}>
          <Ico stroke={active("/admin/profile") ? "#22D3EE" : "#4E6785"}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Ico>
        </div>
        {!collapsed && <span style={{ fontSize: "13px", fontWeight: 600 }}>My Profile</span>}
      </Link>

=======
>>>>>>> origin/CV-Builder
      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── User card ── */}
      <div style={{
        padding: collapsed ? "10px 4px" : "11px 12px",
        borderRadius: "13px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? "0" : "10px",
        marginTop: "8px",
        transition: "padding 0.25s",
      }}>
<<<<<<< HEAD
=======
        {/* Avatar + green dot */}
>>>>>>> origin/CV-Builder
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg,#22D3EE,#06B6D4)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "14px", color: "#060D1A",
          }}>{userInitial}</div>
          <span style={{
            position: "absolute", bottom: "-2px", right: "-2px",
            width: "9px", height: "9px",
            background: "#4ADE80", borderRadius: "50%",
            border: "2px solid #0A1628",
          }} />
        </div>
<<<<<<< HEAD
=======

>>>>>>> origin/CV-Builder
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#F1F5F9",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.fullName || "Admin User"}
            </div>
<<<<<<< HEAD
=======
            {/* Shield + ADMIN role badge */}
>>>>>>> origin/CV-Builder
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              marginTop: "5px",
              fontSize: "8px", fontWeight: 800, color: "#A78BFA",
              background: "rgba(167,139,250,0.12)",
              border: "1px solid rgba(167,139,250,0.2)",
              padding: "2px 8px", borderRadius: "99px",
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              ADMIN
            </div>
          </div>
        )}
      </div>

      {/* ── Sign Out ── */}
      <button
        onClick={handleLogout}
        title={collapsed ? "Sign Out" : ""}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? "0" : "10px",
          padding: collapsed ? "10px 4px" : "10px 12px",
          borderRadius: "11px",
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.12)",
          color: "#F87171", fontSize: "12px", fontWeight: 700,
          cursor: "pointer", marginTop: "7px", width: "100%",
          transition: "all .2s",
        }}
        onMouseEnter={e => {
<<<<<<< HEAD
          e.currentTarget.style.background  = "rgba(248,113,113,0.14)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
          e.currentTarget.style.boxShadow   = "0 10px 22px rgba(248,113,113,0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background  = "rgba(248,113,113,0.06)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.12)";
          e.currentTarget.style.boxShadow   = "none";
=======
          e.currentTarget.style.background = "rgba(248,113,113,0.14)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
          e.currentTarget.style.boxShadow = "0 10px 22px rgba(248,113,113,0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(248,113,113,0.06)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.12)";
          e.currentTarget.style.boxShadow = "none";
>>>>>>> origin/CV-Builder
        }}
      >
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
          background: "rgba(248,113,113,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#F87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<<<<<<< HEAD
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
=======
            {/* The "door" remains on the right side of the icon now */}
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            {/* Arrow pointing left */}
>>>>>>> origin/CV-Builder
            <polyline points="10 17 5 12 10 7" />
            <line x1="5" y1="12" x2="15" y2="12" />
          </svg>
        </div>
        {!collapsed && <span>Sign Out</span>}
      </button>

    </aside>
  );
}