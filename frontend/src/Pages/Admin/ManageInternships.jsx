import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

export default function ManageInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "" });
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const user = getUser();
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const now = new Date();

  useEffect(() => { if (!user || user.role !== "Admin") navigate("/login"); }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/internships");
      const data = await res.json();
      setInternships(data.internships || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleDelete = async (id) => {
    setActionError(""); setActionSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/internships/${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return setActionError(data.message || "Delete failed.");
      setInternships(prev => prev.filter(i => i._id !== id));
      setDeleteId(null);
      setActionSuccess("Internship deleted successfully.");
    } catch (err) { console.error(err); }
  };

  const validateInternshipInput = (payload) => {
    const { title, company, location, duration, skillsRequired, deadline } = payload;
    const startsWithDigit = (v) => /^\d/.test(String(v || "").trim());
    const hasLetter = (v) => /[A-Za-z]/.test(String(v || ""));
    if (!title || !company || !location || !duration || !skillsRequired || !deadline) return "All fields are mandatory.";
    if (startsWithDigit(title)) return "Title cannot start with a number.";
    if (startsWithDigit(company)) return "Company name cannot start with a number.";
    if (startsWithDigit(location)) return "Location cannot start with a number.";
    if (startsWithDigit(skillsRequired)) return "Skills cannot start with a number.";
    if (!hasLetter(title) || !hasLetter(company) || !hasLetter(location) || !hasLetter(skillsRequired)) return "Title, company, location and skills must include letters.";
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(deadline) <= today) return "Deadline must be a future date.";
    return null;
  };

  const openEdit = (item) => {
    setActionError(""); setActionSuccess("");
    setEditItem(item);
    setEditForm({
      title: item.title || "",
      company: item.company || "",
      location: item.location || "",
      duration: item.duration || "",
      skillsRequired: item.skillsRequired || "",
      deadline: item.deadline ? new Date(item.deadline).toISOString().split("T")[0] : "",
    });
  };

  const handleUpdate = async () => {
    setActionError(""); setActionSuccess("");
    const validationError = validateInternshipInput(editForm);
    if (validationError) return setActionError(validationError);
    try {
      const res = await fetch(`http://localhost:5000/internships/${editItem._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) return setActionError(data.message || "Update failed.");
      setInternships((prev) => prev.map((i) => (i._id === editItem._id ? data.internship : i)));
      setEditItem(null);
      setActionSuccess("Internship updated successfully.");
    } catch (err) {
      console.error(err);
      setActionError("Server error while updating internship.");
    }
  };

  const filtered = internships.filter(i => {
    const exp = new Date(i.deadline) < now;
    if (filter === "Active")  return !exp;
    if (filter === "Expired") return  exp;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-8 overflow-y-auto" style={{ minWidth: 0 }}>
        {/* Top bar */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-cyan-400 transition-colors text-2xl">←</button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-200 m-0">Manage Internships</h1>
              <p className="text-slate-400 text-sm mt-1">
                {internships.length} total · {internships.filter(i => new Date(i.deadline) >= now).length} active ·
                <span className="text-red-400"> {internships.filter(i => new Date(i.deadline) < now).length} expired</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/add-internship" className="btn-cyan text-sm no-underline px-4 py-2">+ Add New</Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-3 mb-3">
          {["All", "Active", "Expired"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all"
              style={filter === f
                ? { background: "rgba(34,211,238,0.1)", borderColor: "#22D3EE", color: "#22D3EE" }
                : { background: "#1E293B", borderColor: "#334155", color: "#94A3B8" }
              }
            >
              {f === "Expired" ? " " : f === "Active" ? " " : ""}{f}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-slate-400 text-xs">Red highlighted rows = Expired internships (deadline passed)</span>
        </div>

        {actionError   && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{actionError}</div>}
        {actionSuccess && <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">{actionSuccess}</div>}

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10">Loading internships...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-3"></p>
            <p className="text-slate-400 text-sm">No internships found for this filter.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#0B1220" }}>
                  {["#", "Title", "Company", "Location", "Skills", "Deadline", "Status", "Action"].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3"
                      style={{ borderBottom: "1px solid #1E293B" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const expired = new Date(item.deadline) < now;
                  return (
                    <tr key={item._id}
                      style={{
                        borderBottom: "1px solid #1E293B",
                        background: expired ? "rgba(248,113,113,0.05)" : "transparent",
                        borderLeft: expired ? "3px solid #F87171" : "none",
                      }}
                    >
                      <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                      <td className={`px-4 py-3 text-sm font-bold ${expired ? "text-red-400" : "text-slate-200"}`}>{item.title}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{item.company}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{item.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(item.skillsRequired || "").split(",").slice(0, 2).map((s, i) =>
                            s.trim() ? <span key={i} className="skill-tag">{s.trim()}</span> : null
                          )}
                          {(item.skillsRequired || "").split(",").length > 2 && (
                            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full"
                              style={{ background: "#1E293B", border: "1px solid #334155" }}>
                              +{(item.skillsRequired || "").split(",").length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${expired ? "text-red-400" : "text-slate-400"}`}>
                        {new Date(item.deadline).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={expired ? "badge-expired" : "badge-active"}>
                          {expired ? "Expired" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)}
                            className="text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}
                          >
                            Update
                          </button>
                          <button onClick={() => setDeleteId(item._id)}
                            className="text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-8 max-w-sm w-full mx-4">
            <p className="text-4xl text-center mb-3"></p>
            <h3 className="text-slate-200 font-extrabold text-center text-lg mb-2">Confirm Delete</h3>
            <p className="text-slate-400 text-sm text-center mb-6">This action cannot be undone. The internship will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 text-slate-400 font-bold text-sm rounded-xl transition-all cursor-pointer"
                style={{ background: "#1E293B", border: "1px solid #334155" }}
              >
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 text-red-400 font-bold text-sm rounded-xl transition-all cursor-pointer"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-8 max-w-2xl w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-5">Update Internship</h3>
            <div className="grid grid-cols-2 gap-4">
              {["title", "company", "location", "duration", "skillsRequired"].map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold capitalize">
                    {field === "skillsRequired" ? "Skills Required" : field}
                  </label>
                  <input
                    value={editForm[field]}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="input-field"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Deadline</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            {actionError && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mt-4">{actionError}</div>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditItem(null)}
                className="flex-1 py-3 text-slate-400 font-bold text-sm rounded-xl transition-all cursor-pointer"
                style={{ background: "#1E293B", border: "1px solid #334155" }}
              >
                Cancel
              </button>
              <button onClick={handleUpdate}
                className="flex-1 py-3 text-cyan-400 font-bold text-sm rounded-xl transition-all cursor-pointer"
                style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}