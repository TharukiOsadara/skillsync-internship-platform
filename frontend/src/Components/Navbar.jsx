import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../Utils/auth";

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/homepage");
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 px-6 py-4 flex items-center justify-between font-syne">
      {/* Left: Toggle button + Logo */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-slate-400 hover:text-cyan-400 transition-colors text-xl"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        )}
        <Link to="/homepage" className="flex items-center gap-1 no-underline">
          <span className="text-lg font-extrabold text-slate-200">skill</span>
          <span className="text-lg font-extrabold text-cyan-400">sync</span>
        </Link>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-3">
        {!loggedIn ? (
          <>
            <Link
              to="/login"
              className="text-slate-400 font-semibold text-sm px-3 py-2 rounded-lg border border-navy-700 hover:border-cyan-400 hover:text-cyan-400 transition-all no-underline"
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-cyan text-sm px-3 py-2 no-underline">
              Get Started →
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 cursor-pointer hover:border-cyan-400/50 transition-all"
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
              <div className="absolute right-0 top-[calc(100%+8px)] bg-navy-900 border border-navy-700 rounded-2xl min-w-[220px] p-2 shadow-2xl z-50">
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
                <div className="h-px bg-navy-800 my-1" />
                {user?.role === "Admin" && (
                  <>
                    <NavItem
                      to="/admin/dashboard"
                      label="📊 Dashboard"
                      onClick={() => setMenuOpen(false)}
                    />
                    <NavItem
                      to="/admin/users"
                      label="👥 Users"
                      onClick={() => setMenuOpen(false)}
                    />
                    <NavItem
                      to="/admin/add-internship"
                      label="➕ Add Internship"
                      onClick={() => setMenuOpen(false)}
                    />
                    <NavItem
                      to="/admin/manage-internships"
                      label="📋 Manage"
                      onClick={() => setMenuOpen(false)}
                    />
                    <NavItem
                      to="/admin/matching-engine"
                      label="🔍 Matching Engine"
                      onClick={() => setMenuOpen(false)}
                    />
                  </>
                )}
                {user?.role === "Student" && (
                  <NavItem
                    to="/student/dashboard"
                    label="🎓 My Dashboard"
                    onClick={() => setMenuOpen(false)}
                  />
                )}
                <div className="h-px bg-navy-800 my-1" />
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
    </nav>
  );
}

function NavItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg text-slate-400 text-sm font-bold hover:bg-navy-800 hover:text-cyan-400 transition-all no-underline block"
    >
      {label}
    </Link>
  );
}
