import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

export default function AddInternship() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const validate = () => {
    const { title, company, location, duration, skillsRequired, deadline } = form;
    const startsWithDigit = (v) => /^\d/.test(String(v).trim());
    const hasLetter = (v) => /[A-Za-z]/.test(String(v));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      // Duplicate check
      const checkRes = await fetch("http://localhost:5000/internships");
      const checkData = await checkRes.json();
      const exists = (checkData.internships || []).some(
        i => i.title.toLowerCase() === form.title.toLowerCase() && i.company.toLowerCase() === form.company.toLowerCase()
      );
      if (exists) return setError("An internship with this title already exists for this company.");

      const res = await fetch("http://localhost:5000/internships", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to add internship.");
      setSuccess("Internship published successfully!");
      setForm({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "" });
      setTimeout(() => navigate("/admin/manage-internships"), 1500);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const fields = [
    { name: "title",    label: "Internship Title *",    placeholder: "e.g. Frontend Developer Intern" },
    { name: "company",  label: "Company Name *",         placeholder: "e.g. Dialog Axiata" },
    { name: "location", label: "Location *",             placeholder: "e.g. Colombo / Remote" },
    { name: "duration", label: "Duration *",             placeholder: "e.g. 3 months" },
    { name: "deadline", label: "Application Deadline *", type: "date" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto" style={{ minWidth: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-200 m-0">Add Internship</h1>
            <p className="text-slate-400 text-sm mt-1">Post a new internship opportunity for students</p>
          </div>

        <div className="max-w-2xl">
          <div className="card p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"></div>
              <div>
                <p className="text-slate-200 font-bold text-base m-0">New Internship Listing</p>
                <p className="text-slate-400 text-xs mt-1 m-0">All fields required. Deadline must be a future date.</p>
              </div>
            </div>

            {error   && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4"> {error}</div>}
            {success && <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4"> {success}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold">{f.label}</label>
                    <input
                      name={f.name} type={f.type || "text"} placeholder={f.placeholder}
                      value={form[f.name]} onChange={handleChange}
                      min={f.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Skills Required * (comma separated)</label>
                <input
                  name="skillsRequired" placeholder="e.g. React, Node.js, MongoDB"
                  value={form.skillsRequired} onChange={handleChange} className="input-field"
                />
              </div>

              {/* Skill tag preview */}
              {form.skillsRequired && (
                <div className="flex flex-wrap gap-2">
                  {form.skillsRequired.split(",").map((s, i) => s.trim() ? <span key={i} className="skill-tag">{s.trim()}</span> : null)}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button" onClick={() => navigate("/admin/manage-internships")}
                  className="flex-1 py-3 text-slate-400 font-bold text-sm rounded-xl transition-all cursor-pointer"
                  style={{ background: "#1E293B", border: "1px solid #334155" }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-cyan py-3 text-sm flex-[2]">
                  {loading ? "Publishing..." : "Publish Internship →"}
                </button>
              </div>
            </form>
          </div>

          {/* Rules box */}
          <div className="mt-5 border rounded-2xl p-5" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.1)" }}>
            <p className="text-cyan-400 font-bold text-sm mb-2">📌 Business Rules Applied</p>
            <ul className="text-slate-400 text-xs leading-7 pl-4 m-0">
              <li>All fields (Title, Company, Skills, Location, Duration, Deadline) are mandatory</li>
              <li>Deadline must be set to a future date</li>
              <li>Duplicate internship title + same company is prevented</li>
              <li>Skills feed into the matching engine automatically when posted</li>
            </ul>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}