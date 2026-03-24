import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders, getLoggedInAt } from "../../Utils/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = getUser();
  const loggedInAt = getLoggedInAt();
  const now = new Date();

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/login");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [iRes, uRes] = await Promise.all([
          fetch("http://localhost:5000/internships"),
          fetch("http://localhost:5000/users", { headers: authHeaders() }),
        ]);
        const iData = await iRes.json();
        const uData = await uRes.json();
        setInternships(iData.internships || []);
        setUsers(uData.users || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const activeCount  = internships.filter(i => new Date(i.deadline) >= now).length;
  const expiredCount = internships.filter(i => new Date(i.deadline) < now).length;
  const studentCount = users.filter(u => u.role === "Student").length;
  const recent = [...internships].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const stats = [
    {  label: "Total Internships", value: internships.length, color: "text-cyan-400",   borderColor: "rgba(34,211,238,0.2)" },
    {  label: "Active",            value: activeCount,         color: "text-green-400",  borderColor: "rgba(74,222,128,0.2)" },
    {  label: "Expired",           value: expiredCount,        color: "text-red-400",    borderColor: "rgba(248,113,113,0.2)" },
    {  label: "Students",          value: studentCount,        color: "text-purple-400", borderColor: "rgba(167,139,250,0.2)" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-8 overflow-y-auto" style={{ minWidth: 0 }}>
        {/* Top bar */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-cyan-400 transition-colors text-2xl">←</button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-200 m-0">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Admin overview and platform metrics</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-200 text-sm font-semibold m-0">Welcome back, {user?.fullName}</p>
            {loggedInAt && (
              <p className="text-slate-400 text-xs mt-1 m-0">Logged in at: {loggedInAt.toLocaleString()}</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400 text-sm animate-pulse">Loading data...</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-cyan-sm"
                  style={{ border: `1px solid ${s.borderColor}` }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-slate-400 text-xs m-0">{s.label}</p>
                    <p className={`text-3xl font-extrabold m-0 ${s.color}`}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-base font-bold text-slate-200 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { to: "/admin/add-internship",      title: "Add Internship",    desc: "Post a new listing" },
                { to: "/admin/manage-internships",  title: "Manage Internships", desc: "Edit, delete, track status" },
                { to: "/admin/matching-engine",     title: "Matching Engine",    desc: "See skill-matched students" },
              ].map(a => (
                <Link key={a.to} to={a.to} className="card p-4 flex items-center gap-3 transition-all no-underline group"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1E293B")}
                >
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-slate-200 font-bold text-sm m-0">{a.title}</p>
                    <p className="text-slate-400 text-xs m-0">{a.desc}</p>
                  </div>
                  <span className="text-cyan-400">→</span>
                </Link>
              ))}
            </div>

            {/* Recent table */}
            <h2 className="text-base font-bold text-slate-200 mb-3">Recently Added Internships</h2>
            <div className="card overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#0B1220" }}>
                    {["#", "Title", "Company", "Location", "Deadline", "Status"].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3"
                        style={{ borderBottom: "1px solid #1E293B" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item, index) => {
                    const expired = new Date(item.deadline) < now;
                    return (
                      <tr key={item._id} style={{ borderBottom: "1px solid #1E293B" }}>
                        <td className="px-5 py-3.5 text-slate-400 text-sm">{index + 1}</td>
                        <td className="px-5 py-3.5 text-slate-200 text-sm font-semibold">{item.title}</td>
                        <td className="px-5 py-3.5 text-slate-400 text-sm">{item.company}</td>
                        <td className="px-5 py-3.5 text-slate-400 text-sm">{item.location}</td>
                        <td className={`px-5 py-3.5 text-sm ${expired ? "text-red-400" : "text-slate-400"}`}>
                          {new Date(item.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={expired ? "badge-expired" : "badge-active"}>
                            {expired ? "Expired" : "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-slate-400 text-sm py-10">No internships added yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}