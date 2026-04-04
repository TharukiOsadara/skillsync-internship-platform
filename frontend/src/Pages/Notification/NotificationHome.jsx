import { Link, NavLink, useNavigate } from 'react-router-dom'
import StudentSidebar from "../../Components/StudentSidebar";

function NotificationHome() {
  const navigate = useNavigate()

  return (   
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
          <StudentSidebar />
          <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div
        className="mx-auto flex w-full max-w-[96rem] flex-col px-3 py-6 sm:px-5 lg:px-6"
        style={{ height: '100%', overflow: 'hidden' }}
      >

        {/* ── Page Content ── */}
        <main className="flex-1 flex flex-col" style={{ overflowY: 'auto' }}>
          <section className="space-y-8">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  SkillSync Internships
                </div>
                <h2 className="mt-6 max-w-lg text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Never miss an{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">important date</span>
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                  Manage your internship interviews, application deadlines, and follow-ups all in one place.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link to="/calendar" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:from-cyan-300 hover:to-cyan-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Open Calendar
                  </Link>
                  <Link to="/events" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-green-500/30 transition-all duration-200 hover:from-green-300 hover:to-emerald-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Manage Events
                  </Link>
                  <Link to="/reminders" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-white/40 hover:bg-white/5">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    View Reminders
                  </Link>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="grid gap-6 sm:grid-cols-3">
                <Link to="/calendar" className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/10">
                  <div className="mb-4 inline-flex rounded-xl bg-cyan-400/20 p-3">
                    <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-cyan-400">Calendar View</h3>
                  <p className="text-sm text-slate-400">View all your events on an interactive calendar. Click dates to filter and see your schedule at a glance.</p>
                </Link>
                <Link to="/events" className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-200 hover:border-green-400/30 hover:bg-white/10">
                  <div className="mb-4 inline-flex rounded-xl bg-green-400/20 p-3">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-green-400">Manage Events</h3>
                  <p className="text-sm text-slate-400">Add, edit, and delete your internship events. Track interviews, deadlines, and follow-ups.</p>
                </Link>
                <Link to="/reminders" className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-200 hover:border-amber-400/30 hover:bg-white/10">
                  <div className="mb-4 inline-flex rounded-xl bg-amber-400/20 p-3">
                    <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-amber-400">Reminders</h3>
                  <p className="text-sm text-slate-400">Stay on top of your schedule with timely notifications. Never miss an important deadline.</p>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
    </main>
    </div>
  )
}

export default NotificationHome