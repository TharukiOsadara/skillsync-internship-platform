import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

export default function Suggestions() {
  const navigate = useNavigate();
  const user     = getUser();
  const now      = new Date();

  const [all, setAll]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [sort, setSort]       = useState("hl");

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) { setLoading(false); return; }
      try {
        const res  = await fetch(`http://localhost:5000/internships/suggestions/${user._id}`, { headers: authHeaders() });
        const data = await res.json();
        const suggestions = data.suggestions || [];
        const userSkills  = (user.skills || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const scored = suggestions.map(item => {
          const required  = (item.skillsRequired || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
          const matched   = required.filter(r => userSkills.some(us => us.includes(r) || r.includes(us)));
          const unmatched = required.filter(r => !matched.includes(r));
          return { ...item, matchedSkills:matched, unmatchedSkills:unmatched,
            matchPct: required.length > 0 ? Math.round((matched.length/required.length)*100) : 0 };
        });
        setAll(scored);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  let list = all.filter(item => {
    const expired = new Date(item.deadline) < now;
    if (filter === "Active")  return !expired;
    if (filter === "High")    return item.matchPct >= 75;
    if (filter === "Expired") return expired;
    return true;
  });
  if (sort === "hl") list = [...list].sort((a,b) => b.matchPct - a.matchPct);
  if (sort === "lh") list = [...list].sort((a,b) => a.matchPct - b.matchPct);
  if (sort === "dl") list = [...list].sort((a,b) => new Date(a.deadline)-new Date(b.deadline));

  const hasSkills = Boolean(user?.skills);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <PageIcon>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize:"26px", fontWeight:800, color:"#F1F5F9", margin:0 }}>Suggestions</h1>
              <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Internships recommended based on your CV skills</p>
            </div>
          </div>
          {!loading && (
            <span style={{ background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.2)", color:"#A78BFA", fontSize:"11px", fontWeight:700, padding:"5px 16px", borderRadius:"99px" }}>
              {all.length} suggestion{all.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* No skills warning */}
        {!hasSkills && (
          <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:"12px", padding:"14px 18px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p style={{ color:"#FCD34D", fontSize:"12px", margin:0 }}>
              No skills found in your profile.{" "}
              <span style={{ textDecoration:"underline", cursor:"pointer" }} onClick={() => navigate("/student/cv-upload")}>Upload your CV</span>
              {" "}or{" "}
              <span style={{ textDecoration:"underline", cursor:"pointer" }} onClick={() => navigate("/student/profile")}>update your profile</span>
              {" "}to get personalised suggestions.
            </p>
          </div>
        )}

        {/* Filter + sort */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {[
              {key:"All",     label:"All"},
              {key:"Active",  label:"✅ Active"},
              {key:"High",    label:"🔥 High match (≥75%)"},
              {key:"Expired", label:"Expired"},
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding:"5px 13px", borderRadius:"99px", fontSize:"11px", fontWeight:700, cursor:"pointer", transition:"all .15s",
                background: filter===f.key ? "rgba(167,139,250,0.12)" : "#1E293B",
                border: filter===f.key ? "1px solid rgba(167,139,250,0.4)" : "1px solid #334155",
                color: filter===f.key ? "#A78BFA" : "#94A3B8",
              }}>{f.label}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background:"#1E293B", border:"1px solid #334155", color:"#94A3B8", fontSize:"12px", fontWeight:600, padding:"7px 12px", borderRadius:"8px", cursor:"pointer", outline:"none" }}>
            <option value="hl">High → Low match</option>
            <option value="lh">Low → High match</option>
            <option value="dl">Deadline soonest</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"200px", flexDirection:"column", gap:"12px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}>
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-9.77"/>
            </svg>
            <p style={{ color:"#64748B", fontSize:"13px" }}>Finding suggestions...</p>
          </div>
        ) : list.length === 0 ? (
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"56px", textAlign:"center" }}>
            <p style={{ fontSize:"42px", marginBottom:"12px" }}>🔍</p>
            <p style={{ color:"#F1F5F9", fontWeight:700, fontSize:"15px", marginBottom:"8px" }}>No suggestions for this filter</p>
            <p style={{ color:"#64748B", fontSize:"13px" }}>Try switching to "All" or uploading your CV.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"14px" }}>
            {list.map(item => {
              const expired = new Date(item.deadline) < now;
              return (
                <div key={item._id} style={{
                  background: expired?"rgba(248,113,113,0.03)":"#0F172A",
                  border: expired?"1px solid rgba(248,113,113,0.2)":"1px solid #1E293B",
                  borderRadius:"13px", padding:"16px",
                  display:"flex", flexDirection:"column", gap:"10px",
                  transition:"border-color .15s",
                }}
                  onMouseEnter={e => { if (!expired) e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; }}
                  onMouseLeave={e => { if (!expired) e.currentTarget.style.borderColor = "#1E293B"; }}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                    <span style={{ background: expired?"rgba(248,113,113,0.15)":"rgba(74,222,128,0.1)", border: expired?"1px solid rgba(248,113,113,0.3)":"1px solid rgba(74,222,128,0.3)", color: expired?"#F87171":"#4ADE80", padding:"2px 9px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>
                      {expired?"Expired":"Active"}
                    </span>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"20px", fontWeight:800, color: expired?"#F87171":"#A78BFA" }}>{item.matchPct}%</div>
                      <div style={{ fontSize:"10px", color:"#64748B" }}>{item.duration}</div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize:"13px", fontWeight:700, color: expired?"#F87171":"#F1F5F9", margin:0 }}>{item.title}</h3>
                    <p style={{ fontSize:"11px", color:"#64748B", margin:"3px 0 0" }}>{item.company} · {item.location}</p>
                  </div>
                  <div style={{ height:"4px", background:"#1E293B", borderRadius:"99px", overflow:"hidden" }}>
                    <div style={{ height:"4px", width:`${item.matchPct}%`, background: expired?"#F87171":"linear-gradient(90deg,#A78BFA,#7C3AED)", borderRadius:"99px" }} />
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                    {item.matchedSkills.map((s,i) => (
                      <span key={`m-${i}`} style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ADE80", padding:"2px 7px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>✓ {s}</span>
                    ))}
                    {item.unmatchedSkills.map((s,i) => (
                      <span key={`u-${i}`} style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.15)", color:"#A78BFA", padding:"2px 7px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"8px", borderTop:"1px solid #1E293B", marginTop:"auto" }}>
                    <p style={{ fontSize:"10px", color: expired?"#F87171":"#64748B", margin:0 }}>
                      📅 {expired?"Deadline passed":new Date(item.deadline).toLocaleDateString("en-GB")}
                    </p>
                    {!expired && (
                      <button style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", color:"#A78BFA", fontSize:"10px", fontWeight:700, padding:"5px 13px", borderRadius:"7px", cursor:"pointer" }}>
                        Apply →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </main>
    </div>
  );
}