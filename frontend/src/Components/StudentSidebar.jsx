import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../Utils/auth";

// ── SVG icon helper ───────────────────────────────────────────────────────────
const Ico = ({ stroke = "currentColor", size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ── Nav items definition ──────────────────────────────────────────────────────
const NAV = [
  {
    section: "MY SPACE",
    items: [
      {
        to: "/student/cv-upload",
        label: "CV Upload",
        icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
      },
      {
        to: "/student/suggestions",
        label: "Suggestions",
        icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
      },
      {
        to: "/student/notifications",
        label: "Notifications",
        icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
      },
      {
        to: "/student/matches",
        label: "My Matches",
        icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>,
      },
    ],
  },
  {
    section: "PROFILE",
    items: [
      {
        to: "/student/profile",
        label: "My Profile",
        icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
      },
    ],
  },
];

export default function StudentSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();
  const [collapsed, setCollapsed] = useState(false);

  const userInitial = (user?.fullName || "S").trim().charAt(0).toUpperCase();
  const handleLogout = () => {
    try {
      logout();
      navigate("/homepage", { replace: true });
    } catch {
      // Fallback protects logout flow if router state is unstable.
      window.location.replace("/homepage");
    }
  };
  const isActive = (path) => {
    if (path === "/student/matches") {
      return location.pathname === "/student/matches" || location.pathname === "/student/dashboard";
    }
    return location.pathname === path;
  };
  const applyNavHoverIn = (e, active) => {
    if (active) return;
    e.currentTarget.style.background = "rgba(34,211,238,0.1)";
    e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)";
    e.currentTarget.style.color = "#A5F3FC";
    e.currentTarget.style.transform = "translateX(2px)";
    e.currentTarget.style.boxShadow = "0 10px 22px rgba(34,211,238,0.14)";
  };
  const applyNavHoverOut = (e, active) => {
    if (active) return;
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.borderColor = "transparent";
    e.currentTarget.style.color = "#4E6785";
    e.currentTarget.style.transform = "translateX(0)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <aside style={{
      width: collapsed ? "68px" : "230px",
      minHeight: "100vh",
      height: "100vh",
      background: "rgba(10,22,40,0.98)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      padding: collapsed ? "18px 10px" : "18px 14px",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      transition: "width 0.25s ease, padding 0.25s ease",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      overflowY: "hidden",
      overflowX: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── Logo ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "11px",
        justifyContent: collapsed ? "center" : "flex-start",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        marginBottom: "4px",
      }}>
        {/* Logo icon */}
        <div style={{
          width: "44px", height: "44px", flexShrink: 0,
          background: "linear-gradient(135deg,#0ea5e9,#22D3EE)",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        {/* Logo text */}
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#F1F5F9", display: "flex", lineHeight: 1 }}>
              <span>skill</span><span style={{ color: "#22D3EE" }}>sync</span>
            </div>
            <span style={{
              fontSize: "9px", fontWeight: 700, color: "#4ADE80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              padding: "2px 9px", borderRadius: "99px",
              width: "fit-content",
            }}>student</span>
          </div>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-end",
          gap: "5px", padding: "6px 8px",
          background: "rgba(34,211,238,0.04)",
          border: "1px solid rgba(34,211,238,0.08)",
          borderRadius: "8px", cursor: "pointer",
          marginBottom: "4px", width: "100%",
          transition: "all .2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(34,211,238,0.12)";
          e.currentTarget.style.borderColor = "rgba(34,211,238,0.28)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(34,211,238,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(34,211,238,0.04)";
          e.currentTarget.style.borderColor = "rgba(34,211,238,0.08)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {!collapsed && <span style={{ fontSize: "10px", color: "#64748B", fontWeight: 600 }}>Collapse</span>}
        <Ico size={13} stroke="#22D3EE">
          {collapsed
            ? <polyline points="9 18 15 12 9 6"/>
            : <polyline points="15 18 9 12 15 6"/>}
        </Ico>
      </button>

      {/* ── Nav ── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, overflowY: "auto", overflowX: "hidden", minWidth: 0 }}>
        {NAV.map(group => (
          <div key={group.section}>
            {/* Section label */}
            {!collapsed && (
              <div style={{
                fontSize: "8px", fontWeight: 700, color: "#334155",
                letterSpacing: ".45em", textTransform: "uppercase",
                padding: "10px 10px 4px",
              }}>{group.section}</div>
            )}

            {group.items.map(item => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : ""}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: collapsed ? "0" : "11px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "10px 0" : "9px 11px",
                    borderRadius: "11px",
                    textDecoration: "none",
                    position: "relative",
                    background: active ? "rgba(34,211,238,0.1)" : "transparent",
                    border: active ? "1px solid rgba(34,211,238,0.15)" : "1px solid transparent",
                    color: active ? "#22D3EE" : "#4E6785",
                    transition: "all .2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => applyNavHoverIn(e, active)}
                  onMouseLeave={e => applyNavHoverOut(e, active)}
                >
                  {/* Active accent bar */}
                  {active && (
                    <span style={{
                      position: "absolute", left: 0, top: "22%", bottom: "22%",
                      width: "3px", background: "#22D3EE",
                      borderRadius: "0 3px 3px 0",
                    }} />
                  )}
                  {/* Icon box */}
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)",
                    color: active ? "#22D3EE" : "#4E6785",
                  }}>
                    <Ico stroke="currentColor">{item.icon}</Ico>
                  </div>
                  {/* Label + sub */}
                  {!collapsed && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.2 }}>{item.label}</span>
                      <span style={{ fontSize: "10px", color: active ? "rgba(34,211,238,0.6)" : "#475569", fontWeight: 400 }}>
                        {item.sub}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

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
        {!collapsed && (
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p style={{ color: "#F1F5F9", fontSize: "12px", fontWeight: 700, margin: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.fullName || "Student"}
            </p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "4px",
              fontSize: "8px", fontWeight: 800, color: "#4ADE80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              padding: "1px 7px", borderRadius: "99px",
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10v6"/>
                <path d="M12 2L1 8l11 6 9-4.91"/>
                <path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5"/>
              </svg>
              <span>Student</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Sign Out ── */}
      <button
        type="button"
        onClick={handleLogout}
        title={collapsed ? "Sign Out" : ""}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? "0" : "10px",
          padding: collapsed ? "10px 4px" : "10px 12px",
          borderRadius: "10px",
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.12)",
          color: "#F87171", fontSize: "12px", fontWeight: 700,
          cursor: "pointer", marginTop: "6px", width: "100%",
          transition: "all .2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(248,113,113,0.14)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
          e.currentTarget.style.boxShadow = "0 10px 22px rgba(248,113,113,0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(248,113,113,0.06)";
          e.currentTarget.style.borderColor = "rgba(248,113,113,0.12)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
          background: "rgba(248,113,113,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#F87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="8 7 3 12 8 17"/>
            <line x1="3" y1="12" x2="15" y2="12"/>
          </svg>
        </div>
        {!collapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}