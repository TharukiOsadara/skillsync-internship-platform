import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

// ── Tech language badge helper ───────────────────────────────────────────────
const TECH_STYLES = {
  react:      {bg:"rgba(34,211,238,0.1)",  border:"rgba(34,211,238,0.2)",  color:"#22D3EE",  label:"React"},
  javascript: {bg:"rgba(251,191,36,0.1)",  border:"rgba(251,191,36,0.25)", color:"#FCD34D",  label:"JavaScript"},
  js:         {bg:"rgba(251,191,36,0.1)",  border:"rgba(251,191,36,0.25)", color:"#FCD34D",  label:"JS"},
  python:     {bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.25)", color:"#60A5FA",  label:"Python"},
  node:       {bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.2)",  color:"#4ADE80",  label:"Node.js"},
  "node.js":  {bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.2)",  color:"#4ADE80",  label:"Node.js"},
  mongodb:    {bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.2)",  color:"#4ADE80",  label:"MongoDB"},
  docker:     {bg:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.2)",  color:"#93C5FD",  label:"Docker"},
  java:       {bg:"rgba(251,146,60,0.1)",  border:"rgba(251,146,60,0.2)",  color:"#FB923C",  label:"Java"},
  flutter:    {bg:"rgba(99,179,237,0.1)",  border:"rgba(99,179,237,0.2)",  color:"#63B3ED",  label:"Flutter"},
  kubernetes: {bg:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.2)",  color:"#93C5FD",  label:"Kubernetes"},
  aws:        {bg:"rgba(251,146,60,0.1)",  border:"rgba(251,146,60,0.2)",  color:"#FB923C",  label:"AWS"},
  django:     {bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.2)",  color:"#4ADE80",  label:"Django"},
  ml:         {bg:"rgba(167,139,250,0.1)", border:"rgba(167,139,250,0.2)", color:"#A78BFA",  label:"ML"},
  mysql:      {bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.25)", color:"#60A5FA",  label:"MySQL"},
  css:        {bg:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.2)",  color:"#93C5FD",  label:"CSS"},
  html:       {bg:"rgba(251,146,60,0.1)",  border:"rgba(251,146,60,0.2)",  color:"#FB923C",  label:"HTML"},
  typescript: {bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.25)", color:"#60A5FA",  label:"TypeScript"},
  express:    {bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.2)",  color:"#4ADE80",  label:"Express"},
  redux:      {bg:"rgba(167,139,250,0.1)", border:"rgba(167,139,250,0.2)", color:"#A78BFA",  label:"Redux"},
  firebase:   {bg:"rgba(251,146,60,0.1)",  border:"rgba(251,146,60,0.2)",  color:"#FB923C",  label:"Firebase"},
};
function TechBadge({skill}){
  const key=skill.trim().toLowerCase().replace(/\s+/g,"");
  const s=TECH_STYLES[key]||{bg:"rgba(34,211,238,0.08)",border:"rgba(34,211,238,0.15)",color:"#22D3EE",label:skill.trim()};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:"3px",padding:"2px 7px",borderRadius:"99px",fontSize:"9px",fontWeight:700,background:s.bg,border:`1px solid ${s.border}`,color:s.color,margin:"1px"}}>
      {s.label}
    </span>
  );
}

export default function ManageInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", company: "", location: "", duration: "", skillsRequired: "", deadline: "", mode: "", timePreference: "", description: "" });
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [entered, setEntered] = useState(false);
  const user = getUser();
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const now = new Date();

  useEffect(() => { if (!user || user.role !== "Admin") navigate("/login"); }, []);
  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

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
    const { title, company, location, duration, skillsRequired, deadline, mode, timePreference, description } = payload;
    const startsWithDigit = (v) => /^\d/.test(String(v || "").trim());
    const hasLetter = (v) => /[A-Za-z]/.test(String(v || ""));
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
      mode: item.mode || "",
      timePreference: item.timePreference || "",
      description: item.description || "",
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
  }).filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (i.title || "").toLowerCase().includes(q) ||
      (i.company || "").toLowerCase().includes(q) ||
      (i.location || "").toLowerCase().includes(q) ||
      (i.skillsRequired || "").toLowerCase().includes(q)
    );
  });

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-hidden" style={{ minWidth: 0, display:"flex", flexDirection:"column" }}>
        {/* Page header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",...revealStyle(0)}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <button onClick={()=>navigate(-1)}
              style={{background:"none",border:"none",color:"#64748B",fontSize:"20px",cursor:"pointer",padding:0,transition:"color .15s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#22D3EE")}
              onMouseLeave={e=>(e.currentTarget.style.color="#64748B")}>←</button>
            <div style={{width:"44px",height:"44px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div>
              <h1 style={{fontSize:"28px",fontWeight:800,color:"#F1F5F9",margin:0}}>Manage Internships</h1>
              <p style={{color:"#64748B",fontSize:"13px",margin:"3px 0 0"}}>
                {internships.length} total · {internships.filter(i=>new Date(i.deadline)>=now).length} active ·{" "}
                <span style={{color:"#F87171"}}>{internships.filter(i=>new Date(i.deadline)<now).length} expired</span>
              </p>
            </div>
          </div>
          <Link to="/admin/add-internship" style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"linear-gradient(135deg,#22D3EE,#06B6D4)",color:"#060D1A",fontSize:"12px",fontWeight:800,padding:"9px 18px",borderRadius:"10px",textDecoration:"none"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New
          </Link>
        </div>

        {/* Filter tabs + search */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"14px",...revealStyle(70)}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
            {[
              {key:"All",    label:"All",     color:"#22D3EE", bg:"rgba(34,211,238,0.1)", border:"rgba(34,211,238,0.3)", icon:<path d="M3 12h18M3 6h18M3 18h18"/>},
              {key:"Active", label:"Active",  color:"#4ADE80", bg:"rgba(74,222,128,0.1)", border:"rgba(74,222,128,0.3)", icon:<><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M1 12h4M19 12h4"/></>},
              {key:"Expired",label:"Expired", color:"#F87171", bg:"rgba(248,113,113,0.08)", border:"rgba(248,113,113,0.3)", icon:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>},
            ].map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                onMouseEnter={e=>{
                  if (filter !== f.key) {
                    e.currentTarget.style.background = f.bg;
                    e.currentTarget.style.borderColor = f.border;
                    e.currentTarget.style.color = f.color;
                  }
                }}
                onMouseLeave={e=>{
                  if (filter !== f.key) {
                    e.currentTarget.style.background = "#1E293B";
                    e.currentTarget.style.borderColor = "#334155";
                    e.currentTarget.style.color = "#94A3B8";
                  }
                }}
                style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"5px 14px",borderRadius:"99px",fontSize:"11px",fontWeight:700,cursor:"pointer",border:"1px solid",transition:"all .15s",
                  background: filter===f.key ? f.bg : "#1E293B",
                  borderColor: filter===f.key ? f.border : "#334155",
                  color: filter===f.key ? f.color : "#94A3B8",
                }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px",background:"#1E293B",border:"1px solid #334155",borderRadius:"9px",padding:"6px 10px",width:"310px",flexShrink:0}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search title, company, location, skills..."
              style={{background:"transparent",border:"none",outline:"none",color:"#F1F5F9",fontSize:"11px",width:"100%",fontFamily:"'DM Sans',sans-serif"}}
            />
            {search && (
              <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"14px",padding:0}}>×</button>
            )}
          </div>
        </div>
        

        {actionError   && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4" style={revealStyle(120)}>{actionError}</div>}
        {actionSuccess && <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4" style={revealStyle(120)}>{actionSuccess}</div>}

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10" style={revealStyle(170)}>Loading internships...</div>
        ) : filtered.length === 0 ? (
          <div className="card admin-hover-surface p-16 text-center" style={revealStyle(170)}>
            <p className="text-4xl mb-3"></p>
            <p className="text-slate-400 text-sm">No internships found for this filter.</p>
          </div>
        ) : (
          <div className="card admin-hover-surface overflow-hidden" style={{...revealStyle(170), flex:1, minHeight:0, display:"flex", flexDirection:"column"}}>
            <div className="overflow-auto" style={{flex:1, minHeight:0}}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#0B1220" }}>
                  {["#", "Title", "Company", "Location", "Skills", "Mode", "Time", "Description", "Deadline", "Status", "Action"].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3"
                      style={{ borderBottom: "1px solid #1E293B", position:"sticky", top:0, background:"#0B1220", zIndex:2 }}>
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
                        <div style={{display:"flex",flexWrap:"wrap",gap:"2px"}}>
                          {(item.skillsRequired||"").split(",").slice(0,3).map((s,i)=>
                            s.trim()?<TechBadge key={i} skill={s}/>:null
                          )}
                          {(item.skillsRequired||"").split(",").length>3&&(
                            <span style={{fontSize:"9px",color:"#64748B",padding:"2px 6px",borderRadius:"99px",background:"#1E293B",border:"1px solid #334155"}}>
                              +{(item.skillsRequired||"").split(",").length-3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        <span style={{background:item.mode==="Online/Remote"?"rgba(34,211,238,0.1)":item.mode==="Physical/On-site"?"rgba(74,222,128,0.1)":"rgba(167,139,250,0.1)",color:item.mode==="Online/Remote"?"#22D3EE":item.mode==="Physical/On-site"?"#4ADE80":"#A78BFA",padding:"2px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:700}}>
                          {item.mode||"N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        <span style={{background:item.timePreference==="Day"?"rgba(251,191,36,0.1)":"rgba(96,165,250,0.1)",color:item.timePreference==="Day"?"#FCD34D":"#93C5FD",padding:"2px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:700}}>
                          {item.timePreference||"N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs" title={item.description}>
                        <div style={{maxWidth:"150px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {item.description||"N/A"}
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
                          <button onClick={()=>openEdit(item)}
                            style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"4px 10px",borderRadius:"7px",background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.2)",color:"#22D3EE",fontSize:"9px",fontWeight:700,cursor:"pointer",transition:"all .15s"}}
                            onMouseEnter={e=>(e.currentTarget.style.background="rgba(34,211,238,0.15)")}
                            onMouseLeave={e=>(e.currentTarget.style.background="rgba(34,211,238,0.08)")}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                            Update
                          </button>
                          <button onClick={()=>setDeleteId(item._id)}
                            style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"4px 10px",borderRadius:"7px",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",color:"#F87171",fontSize:"9px",fontWeight:700,cursor:"pointer",transition:"all .15s"}}
                            onMouseEnter={e=>(e.currentTarget.style.background="rgba(248,113,113,0.15)")}
                            onMouseLeave={e=>(e.currentTarget.style.background="rgba(248,113,113,0.08)")}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
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
          <div className="card w-full mx-4" style={{ maxWidth: "42rem", maxHeight: "90vh", overflowY: "auto", padding: "32px" }}>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Work Mode *</label>
                <select
                  value={editForm.mode}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, mode: e.target.value }))}
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
                  value={editForm.timePreference}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, timePreference: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select time preference</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-slate-400 text-xs font-semibold">Description * (Min 10 characters)</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="input-field resize-none"
              />
              {editForm.description && (
                <span className="text-cyan-400 text-xs font-semibold">{editForm.description.length} characters</span>
              )}
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