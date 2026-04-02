import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../Utils/auth";

const Ico = ({ stroke = "currentColor", size = 13, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

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
                      className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user?.role === "Admin"
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "bg-green-400/10 text-green-400 border border-green-400/20"
                      }`}
                    >
                      {user?.role === "Admin" ? (
                        <>
                          <Ico size={11}>
                            <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z"/>
                            <path d="M9 12l2 2 4-4"/>
                          </Ico>
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <Ico size={11}>
                            <path d="M22 10v6M2 10v6"/>
                            <path d="M12 2L1 8l11 6 9-4.91"/>
                            <path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5"/>
                          </Ico>
                          <span>Student</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="h-px my-1" style={{ background: "#1E293B" }} />
                  {user?.role === "Admin" && (
                    <>
                      <DropItem
                        to="/admin/dashboard"
                        label="Dashboard"
                        onClick={() => setMenuOpen(false)}
                        icon={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
                      />
                      <DropItem
                        to="/admin/add-internship"
                        label="Add Internship"
                        onClick={() => setMenuOpen(false)}
                        icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></>}
                      />
                      <DropItem
                        to="/admin/manage-internships"
                        label="Manage"
                        onClick={() => setMenuOpen(false)}
                        icon={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>}
                      />
                      <DropItem
                        to="/admin/matching-engine"
                        label="Matching Engine"
                        onClick={() => setMenuOpen(false)}
                        icon={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>}
                      />
                    </>
                  )}
                  {user?.role === "Student" && (
                    <DropItem
                      to="/student/dashboard"
                      label="My Dashboard"
                      onClick={() => setMenuOpen(false)}
                      icon={<><path d="M22 10v6M2 10v6"/><path d="M12 2L1 8l11 6 9-4.91"/><path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5"/></>}
                    />
                  )}
                  <div className="h-px my-1" style={{ background: "#1E293B" }} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 text-sm font-bold bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Ico size={13} stroke="#F87171"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/></Ico>
                    <span>Sign Out</span>
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

function DropItem({ to, label, onClick, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 text-sm font-semibold hover:text-slate-200 transition-all no-underline"
      style={{ background: "transparent" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#1E293B")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <Ico size={13}>{icon}</Ico>
      <span>{label}</span>
    </Link>
  );
}