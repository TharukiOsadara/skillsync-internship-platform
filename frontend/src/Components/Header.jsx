import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../Utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getUser();
  const loggedIn = isLoggedIn();
  const isHomePage = location.pathname === "/homepage";
  const isActive = (p) => location.pathname === p;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/homepage");
  };

  return (
    <>
      <header
        className={`${isHomePage ? "fixed top-0 left-0 w-full" : "sticky top-0"} z-50 flex items-center justify-between px-6 h-16 backdrop-blur-md font-syne`}
        style={{ background: "rgba(15,23,42,0.97)", borderBottom: "1px solid #1E293B" }}
      >
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

        {/* ── LEFT: hamburger + logo ── */}
        <div className="flex items-center gap-3 z-10">
          {/* Hamburger button */}
          {!isHomePage && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1 p-2 rounded-lg cursor-pointer transition-all"
              style={{ background: "#1E293B", border: "1px solid #334155" }}
              aria-label="Toggle menu"
            >
              <span
                className="block transition-all duration-200"
                style={{
                  width: "18px", height: "2px", background: "#94A3B8", borderRadius: "2px",
                  transform: mobileOpen ? "rotate(45deg) translateY(6px)" : "none",
                }}
              />
              <span
                className="block transition-all duration-200"
                style={{
                  width: "18px", height: "2px", background: "#94A3B8", borderRadius: "2px",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block transition-all duration-200"
                style={{
                  width: "18px", height: "2px", background: "#94A3B8", borderRadius: "2px",
                  transform: mobileOpen ? "rotate(-45deg) translateY(-6px)" : "none",
                }}
              />
            </button>
          )}

          {/* Logo */}
          <Link to="/homepage" className="flex items-center gap-1 no-underline">
            <span className="text-xl font-extrabold text-slate-200">skill</span>
            <span className="text-xl font-extrabold text-cyan-400">sync</span>
            <span className="ml-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
              internships
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 z-10">
          {!loggedIn && (
            <>
              <NavLink to="/homepage" label="Home" active={isActive("/homepage")} />
              <NavLink to="/homepage#features" label="Features" />
              <NavLink to="/homepage#how" label="How it works" />
            </>
          )}
          {loggedIn && user?.role === "Admin" && (
            <>
              <NavLink to="/admin/dashboard" label="Dashboard" active={isActive("/admin/dashboard")} />
              <NavLink to="/admin/add-internship" label="Add Internship" active={isActive("/admin/add-internship")} />
              <NavLink to="/admin/manage-internships" label="Manage" active={isActive("/admin/manage-internships")} />
              <NavLink to="/admin/matching-engine" label="Matching" active={isActive("/admin/matching-engine")} />
            </>
          )}
          {loggedIn && user?.role === "Student" && (
            <NavLink to="/student/dashboard" label="My Matches" active={isActive("/student/dashboard")} />
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 z-10">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="text-slate-300 font-semibold text-sm px-4 py-2 rounded-lg transition-all no-underline hover:text-cyan-300"
                style={{ border: "1px solid #334155", background: "rgba(30,41,59,0.45)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34,211,238,0.12)";
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30,41,59,0.45)";
                  e.currentTarget.style.borderColor = "#334155";
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-cyan text-sm px-4 py-2 no-underline transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,211,238,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Get Started →
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition-all hover:border-cyan-400/50"
                style={{ background: "#1E293B", border: "1px solid #334155" }}
              >
                <div className="w-7 h-7 rounded-lg btn-cyan flex items-center justify-center text-sm font-extrabold">
                  {(user?.fullName || "U")[0].toUpperCase()}
                </div>
                <span className="text-slate-200 text-sm font-bold hidden sm:block">
                  {user?.fullName?.split(" ")[0]}
                </span>
                <span className="text-slate-400 text-xs">▾</span>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] rounded-2xl min-w-[220px] p-2 shadow-2xl z-50"
                  style={{ background: "#0F172A", border: "1px solid #334155" }}
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="text-slate-200 font-bold text-sm m-0">{user?.fullName}</p>
                    <p className="text-slate-400 text-xs mt-1 m-0">{user?.gmail}</p>
                    <span
                      className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user?.role === "Admin"
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "bg-green-400/10 text-green-400 border border-green-400/20"
                      }`}
                    >
                      {user?.role === "Admin" ? "🛡️ Admin" : "🎓 Student"}
                    </span>
                  </div>
                  <div className="h-px my-1" style={{ background: "#1E293B" }} />
                  {user?.role === "Admin" && (
                    <>
                      <DropItem to="/admin/dashboard"          label="📊 Dashboard"       onClick={() => setMenuOpen(false)} />
                      <DropItem to="/admin/add-internship"     label="➕ Add Internship"   onClick={() => setMenuOpen(false)} />
                      <DropItem to="/admin/manage-internships" label="📋 Manage"           onClick={() => setMenuOpen(false)} />
                      <DropItem to="/admin/matching-engine"    label="🔍 Matching Engine"  onClick={() => setMenuOpen(false)} />
                    </>
                  )}
                  {user?.role === "Student" && (
                    <DropItem to="/student/dashboard" label="🎓 My Dashboard" onClick={() => setMenuOpen(false)} />
                  )}
                  <div className="h-px my-1" style={{ background: "#1E293B" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 text-sm font-bold bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all cursor-pointer"
                  >
                    ⬅️ Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`text-sm font-semibold no-underline pb-0.5 transition-all ${
        active ? "text-cyan-400 border-b border-cyan-400" : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {label}
    </Link>
  );
}

function DropItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-lg text-slate-400 text-sm font-semibold hover:text-slate-200 transition-all no-underline"
      style={{ background: "transparent" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#1E293B")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </Link>
  );
}