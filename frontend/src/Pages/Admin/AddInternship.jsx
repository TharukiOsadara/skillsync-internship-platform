import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

export default function AddInternship() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "", mode: "", timePreference: "", description: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [entered, setEntered] = useState(false);
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const validate = () => {

    const { title, company, location, duration, skillsRequired, deadline, mode, timePreference, description } = form;
    const startsWithDigit = (v) => /^\d/.test(String(v).trim());
    const hasLetter = (v) => /[A-Za-z]/.test(String(v));
    if (!title || !company || !location || !duration || !skillsRequired || !deadline || !mode || !timePreference || !description) return "All fields are mandatory.";

    if (startsWithDigit(title)) return "Title cannot start with a number.";
    if (startsWithDigit(company)) return "Company name cannot start with a number.";
    if (startsWithDigit(location)) return "Location cannot start with a number.";
    if (startsWithDigit(skillsRequired)) return "Skills cannot start with a number.";
    if (!hasLetter(title) || !hasLetter(company) || !hasLetter(location) || !hasLetter(skillsRequired)) return "Title, company, location and skills must include letters.";

    if (!mode || !["Online/Remote", "Physical/On-site", "Hybrid"].includes(mode)) return "Please select a valid work mode.";
    if (!timePreference || !["Day", "Night"].includes(timePreference)) return "Please select a valid time preference.";
    if (!description || description.trim().length < 10) return "Description must be at least 10 characters.";
    if (!hasLetter(description)) return "Description cannot be only numbers.";

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

      setForm({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "", mode: "", timePreference: "", description: "" });

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

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto" style={{ minWidth: 0 }}>
          {/* Page header */}
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"28px",...revealStyle(0)}}>
            <button onClick={()=>navigate(-1)}
              style={{background:"none",border:"none",color:"#64748B",fontSize:"20px",cursor:"pointer",padding:0,transition:"color .15s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#22D3EE")}
              onMouseLeave={e=>(e.currentTarget.style.color="#64748B")}>←</button>
            <div style={{width:"44px",height:"44px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <h1 style={{fontSize:"28px",fontWeight:800,color:"#F1F5F9",margin:0}}>Add Internship</h1>
              <p style={{color:"#64748B",fontSize:"13px",margin:"3px 0 0"}}>Post a new internship opportunity for students</p>
            </div>
          </div>

        <div className="max-w-2xl" style={revealStyle(90)}>
          <div className="card admin-hover-surface p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-cyan-400/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="7" width="18" height="13" rx="2" ry="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold">Work Mode *</label>
                  <select
                    name="mode" value={form.mode} onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select work mode</option>
                    <option value="Online/Remote">Online/Remote</option>
                    <option value="Physical/On-site">Physical/On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold">Time Preference *</label>
                  <select
                    name="timePreference" value={form.timePreference} onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select time preference</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Description * (Min 10 characters)</label>
                <textarea
                  name="description" placeholder="Describe the internship role, responsibilities, and expectations..."
                  value={form.description} onChange={handleChange}
                  rows="4"
                  className="input-field resize-none"
                />
                {form.description && (
                  <span className="text-cyan-400 text-xs font-semibold">{form.description.length} characters</span>
                )}
              </div>


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
          <div className="admin-hover-surface mt-5 border rounded-2xl p-5" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.1)", ...revealStyle(170) }}>
            <p className="text-cyan-400 font-bold text-sm mb-2">📌 Business Rules Applied</p>
            <ul className="text-slate-400 text-xs leading-7 pl-4 m-0">

              <li>All fields are mandatory including Work Mode, Time Preference, and Description</li>
              <li>Description must be at least 10 characters and contain letters</li>
              <li>Work Mode options: Online/Remote, Physical/On-site, or Hybrid</li>

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