import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [scored, setScored]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState("hl");
  const user = getUser();
  const now  = new Date();

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user?._id) { setLoading(false); return; }
      try {
        const res  = await fetch(`http://localhost:5000/internships/suggestions/${user._id}`, { headers: authHeaders() });
        const data = await res.json();
        const all  = data.suggestions || [];
        const userSkills = (user.skills || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const withScore = all.map(item => {
          const required  = (item.skillsRequired || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
          const matched   = required.filter(r => userSkills.some(us => us.includes(r) || r.includes(us)));
          const unmatched = required.filter(r => !matched.includes(r));
          return { ...item, matchedSkills: matched, unmatchedSkills: unmatched,
            matchPct: required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0 };
        }).sort((a, b) => b.matchPct - a.matchPct);
        setScored(withScore);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  let list = [...scored];
  if (sort === "lh") list = list.sort((a, b) => a.matchPct - b.matchPct);
  if (sort === "dl") list = list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans', sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0 }}>

        {/* Page header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <PageIcon>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize:"26px", fontWeight:800, color:"#F1F5F9", margin:0 }}>My Matches</h1>
              <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Internships matched to your skill profile</p>
            </div>
          </div>
          {!loading && (
            <span style={{ background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", color:"#22D3EE", fontSize:"11px", fontWeight:700, padding:"5px 16px", borderRadius:"99px" }}>
              {scored.length} match{scored.length !== 1 ? "es" : ""} found
            </span>
          )}
        </div>

        {/* Info banner */}
        <div style={{ background:"rgba(34,211,238,0.04)", border:"1px solid rgba(34,211,238,0.12)", borderRadius:"12px", padding:"12px 18px", marginBottom:"24px", display:"flex", alignItems:"flex-start", gap:"10px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:"1px" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ color:"#94A3B8", fontSize:"12px", lineHeight:"1.65", margin:0 }}>
            These results are <span style={{ color:"#22D3EE", fontWeight:700 }}>automatically updated</span> based on your skills profile.
            Upload your CV on the <span style={{ color:"#22D3EE", cursor:"pointer", fontWeight:600 }} onClick={() => navigate("/student/cv-upload")}>CV Upload</span> page to improve match accuracy.
          </p>
        </div>

        {/* Sort */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", marginBottom:"18px" }}>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background:"#1E293B", border:"1px solid #334155", color:"#94A3B8", fontSize:"12px", fontWeight:600, padding:"7px 12px", borderRadius:"8px", cursor:"pointer", outline:"none" }}>
            <option value="hl">Sort: High → Low match</option>
            <option value="lh">Sort: Low → High match</option>
            <option value="dl">Sort: Deadline soonest</option>
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"180px" }}>
            <p style={{ color:"#64748B", fontSize:"13px" }}>Finding matches...</p>
          </div>
        ) : scored.length === 0 ? (
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"56px", textAlign:"center" }}>
            <p style={{ fontSize:"42px", marginBottom:"14px" }}>😕</p>
            <p style={{ color:"#F1F5F9", fontWeight:700, fontSize:"15px", marginBottom:"8px" }}>No matched internships found</p>
            <p style={{ color:"#64748B", fontSize:"13px" }}>
              Update your skills in your profile or upload your CV to get matches.
            </p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"14px" }}>
            {list.map(item => {
              const expired = new Date(item.deadline) < now;
              return (
                <div key={item._id} style={{
                  background:   expired ? "rgba(248,113,113,0.03)" : "#0F172A",
                  border:       expired ? "1px solid rgba(248,113,113,0.2)" : "1px solid #1E293B",
                  borderRadius: "13px", padding:"16px",
                  display:"flex", flexDirection:"column", gap:"10px",
                  transition:"border-color .15s",
                }}
                  onMouseEnter={e => { if (!expired) e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; }}
                  onMouseLeave={e => { if (!expired) e.currentTarget.style.borderColor = "#1E293B"; }}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                    <span style={{ background: expired?"rgba(248,113,113,0.15)":"rgba(74,222,128,0.1)", border: expired?"1px solid rgba(248,113,113,0.3)":"1px solid rgba(74,222,128,0.3)", color: expired?"#F87171":"#4ADE80", padding:"2px 9px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>
                      {expired ? "Expired" : "Active"}
                    </span>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"20px", fontWeight:800, color: expired?"#F87171":"#22D3EE" }}>{item.matchPct}%</div>
                      <div style={{ fontSize:"10px", color:"#64748B" }}>{item.duration}</div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize:"13px", fontWeight:700, color: expired?"#F87171":"#F1F5F9", margin:0 }}>{item.title}</h3>
                    <p style={{ fontSize:"11px", color:"#64748B", margin:"3px 0 0" }}>{item.company} · {item.location}</p>
                  </div>
                  <div style={{ height:"4px", background:"#1E293B", borderRadius:"99px", overflow:"hidden" }}>
                    <div style={{ height:"4px", width:`${item.matchPct}%`, background: expired?"#F87171":"linear-gradient(90deg,#22D3EE,#06B6D4)", borderRadius:"99px" }} />
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                    {item.matchedSkills.map((s,i) => (
                      <span key={`m-${i}`} style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ADE80", padding:"2px 7px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>✓ {s}</span>
                    ))}
                    {item.unmatchedSkills.map((s,i) => (
                      <span key={`u-${i}`} style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.15)", color:"#22D3EE", padding:"2px 7px", borderRadius:"99px", fontSize:"9px", fontWeight:700 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"8px", borderTop:"1px solid #1E293B", marginTop:"auto" }}>
                    <p style={{ fontSize:"10px", color: expired?"#F87171":"#64748B", margin:0 }}>
                      📅 {expired ? "Deadline passed" : new Date(item.deadline).toLocaleDateString("en-GB")}
                    </p>
                    {!expired && (
                      <button style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.15)", color:"#22D3EE", fontSize:"10px", fontWeight:700, padding:"5px 13px", borderRadius:"7px", cursor:"pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,211,238,0.16)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(34,211,238,0.08)")}>
                        Apply →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}