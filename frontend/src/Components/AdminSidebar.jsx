import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../Utils/auth";

const navItems = [
  { to: "/admin/dashboard",            label: "Dashboard" },
  { to: "/admin/users",                label: "Users" },
  { to: "/admin/add-internship",       label: "Add Internship" },
  { to: "/admin/manage-internships",   label: "Manage Internships" },
  { to: "/admin/matching-engine",      label: "Matching Engine" },
];

export default function AdminSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();
  const [collapsed, setCollapsed] = useState(false);
  const userInitial = (user?.fullName || "U").trim().charAt(0).toUpperCase();

  const handleLogout = () => { logout(); navigate("/homepage"); };

  return (
    <aside
      className="flex-shrink-0 flex flex-col gap-2 sticky top-0 h-screen font-syne overflow-hidden"
      style={{
        width: collapsed ? "64px" : "220px",
        minHeight: "100vh",
        background: "#0F172A",
        borderRight: "1px solid #1E293B",
        padding: collapsed ? "20px 10px" : "20px",
        transition: "width 0.25s ease, padding 0.25s ease",
      }}
    >
      {/* ── Logo row + toggle button ── */}
      <div className="flex items-center justify-between mb-1">
        {!collapsed && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-extrabold text-slate-200">skill</span>
            <span className="text-lg font-extrabold text-cyan-400">sync</span>
          </div>
        )}
        {/* Toggle button — collapses/expands sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex flex-col justify-center items-center gap-[4px] rounded-lg cursor-pointer transition-all hover:bg-cyan-400/10 flex-shrink-0"
          style={{
            width: "30px",
            height: "30px",
            background: "rgba(34,211,238,0.06)",
            border: "1px solid rgba(34,211,238,0.15)",
            marginLeft: collapsed ? "auto" : "0",
            marginRight: collapsed ? "auto" : "0",
          }}
        >
          {/* Three animated bars */}
          <span style={{ width: "13px", height: "1.5px", background: "#22D3EE", borderRadius: "2px", display: "block",
            transform: collapsed ? "none" : "none", transition: "all 0.2s" }} />
          <span style={{ width: collapsed ? "9px" : "13px", height: "1.5px", background: "#22D3EE", borderRadius: "2px", display: "block", transition: "all 0.2s" }} />
          <span style={{ width: "13px", height: "1.5px", background: "#22D3EE", borderRadius: "2px", display: "block", transition: "all 0.2s" }} />
        </button>
      </div>

      {/* Badge — hidden when collapsed */}
      {!collapsed && (
        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full w-fit mb-3">
          internships
        </span>
      )}

      {/* Admin badge — icon-only when collapsed */}
      <div
        className="border text-xs font-bold rounded-xl mb-3 flex items-center justify-center"
        style={{
          background: "rgba(167,139,250,0.1)",
          borderColor: "rgba(167,139,250,0.2)",
          color: "#A78BFA",
          padding: collapsed ? "8px 4px" : "8px 12px",
          transition: "padding 0.25s",
        }}
      >
        {collapsed ? "🛡️" : " Admin Panel"}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ""}
              className={`nav-item ${active ? "active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px 0" : undefined,
              }}
            >
              <span className="text-sm flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info — compact when collapsed */}
      <div
        className="rounded-xl mb-3"
        style={{
          background: "#1E293B",
          border: "1px solid #334155",
          padding: collapsed ? "8px 4px" : "12px",
          transition: "padding 0.25s",
        }}
      >
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-8 h-8 btn-cyan rounded-lg flex items-center justify-center text-sm font-extrabold flex-shrink-0">
            {userInitial}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-slate-200 text-xs font-bold truncate m-0">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px] truncate m-0">{user?.gmail}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title={collapsed ? "Sign Out" : ""}
        className="w-full rounded-xl text-red-400 text-xs font-bold bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all cursor-pointer flex items-center justify-center"
        style={{ padding: collapsed ? "10px 4px" : "10px 12px", gap: collapsed ? "0" : "6px", textAlign: "left" }}
      >
        
        {!collapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}