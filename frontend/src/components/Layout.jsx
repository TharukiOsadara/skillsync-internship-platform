/**
 * Layout Component
 * ================
 * Main layout wrapper for the entire application.
 * Provides consistent header, navigation, and footer across all pages.
 *
 * Features:
 * - Responsive navigation with mobile-friendly design
 * - Dark theme with gradient background
 * - Active link highlighting with cyan accent
 * - Glassmorphism card effects
 */

import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[96rem] flex-col px-3 py-6 sm:px-5 lg:px-6">
        {/* Header with Navigation */}
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Logo and Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
                SkillSync Internships
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Calendar & Notification Management
              </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Calendar
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-slate-950 shadow-lg shadow-green-500/25'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Events
              </NavLink>
              <NavLink
                to="/reminders"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Reminders
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content Area - Rendered by React Router */}
        <main className="flex-1">
          <Outlet />
        </main>

 
      </div>
    </div>
  )
}

export default Layout
