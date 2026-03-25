import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

const TECH_STYLES_ME = {
  react:{bg:"rgba(34,211,238,0.1)",border:"rgba(34,211,238,0.2)",color:"#22D3EE"},
  javascript:{bg:"rgba(251,191,36,0.1)",border:"rgba(251,191,36,0.25)",color:"#FCD34D"},
  js:{bg:"rgba(251,191,36,0.1)",border:"rgba(251,191,36,0.25)",color:"#FCD34D"},
  python:{bg:"rgba(59,130,246,0.1)",border:"rgba(59,130,246,0.25)",color:"#60A5FA"},
  node:{bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)",color:"#4ADE80"},
  "node.js":{bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)",color:"#4ADE80"},
  mongodb:{bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)",color:"#4ADE80"},
  docker:{bg:"rgba(96,165,250,0.1)",border:"rgba(96,165,250,0.2)",color:"#93C5FD"},
  java:{bg:"rgba(251,146,60,0.1)",border:"rgba(251,146,60,0.2)",color:"#FB923C"},
  flutter:{bg:"rgba(99,179,237,0.1)",border:"rgba(99,179,237,0.2)",color:"#63B3ED"},
  aws:{bg:"rgba(251,146,60,0.1)",border:"rgba(251,146,60,0.2)",color:"#FB923C"},
  django:{bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)",color:"#4ADE80"},
  ml:{bg:"rgba(167,139,250,0.1)",border:"rgba(167,139,250,0.2)",color:"#A78BFA"},
  mysql:{bg:"rgba(59,130,246,0.1)",border:"rgba(59,130,246,0.25)",color:"#60A5FA"},
  css:{bg:"rgba(96,165,250,0.1)",border:"rgba(96,165,250,0.2)",color:"#93C5FD"},
  html:{bg:"rgba(251,146,60,0.1)",border:"rgba(251,146,60,0.2)",color:"#FB923C"},
  express:{bg:"rgba(74,222,128,0.1)",border:"rgba(74,222,128,0.2)",color:"#4ADE80"},
  redux:{bg:"rgba(167,139,250,0.1)",border:"rgba(167,139,250,0.2)",color:"#A78BFA"},
  firebase:{bg:"rgba(251,146,60,0.1)",border:"rgba(251,146,60,0.2)",color:"#FB923C"},
  kubernetes:{bg:"rgba(96,165,250,0.1)",border:"rgba(96,165,250,0.2)",color:"#93C5FD"},
};
function TechBadgeME({skill}){
  const k=skill.trim().toLowerCase().replace(/\s+/g,"");
  const s=TECH_STYLES_ME[k]||{bg:"rgba(34,211,238,0.08)",border:"rgba(34,211,238,0.15)",color:"#22D3EE"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:"3px",padding:"2px 8px",borderRadius:"20px",fontSize:"11px",fontWeight:"600",background:s.bg,border:`1px solid ${s.border}`,color:s.color}}>{skill.trim()}</span>;
}



export default function MatchingEngine() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [loadingTick, setLoadingTick] = useState(0);
  const [resultEntered, setResultEntered] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({});
  const [animatedMatchCount, setAnimatedMatchCount] = useState(0);
  const [entered, setEntered] = useState(false);
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
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
        const studentList = (uData.users || []).filter((u) => u.role === "Student");
        setStudents(studentList);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!matchLoading) return;
    const timer = setInterval(() => {
      setLoadingTick((prev) => (prev + 1) % 3);
    }, 350);
    return () => clearInterval(timer);
  }, [matchLoading]);

  useEffect(() => {
    setResultEntered(false);
    const timer = setTimeout(() => setResultEntered(true), 25);
    return () => clearTimeout(timer);
  }, [selectedInternship?._id, matchLoading]);

  useEffect(() => {
    if (matchLoading || !selectedInternship || matches.length === 0) {
      setAnimatedScores({});
      return;
    }

    const requiredCount = Math.max(1, (selectedInternship.skillsRequired || "").split(",").filter(Boolean).length);
    const targets = {};
    matches.forEach((m) => {
      targets[m._id] = Math.round((m.matchScore / requiredCount) * 100);
    });

    const start = Date.now();
    const duration = 420;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const next = {};

      Object.keys(targets).forEach((id) => {
        const target = targets[id];
        next[id] = target <= 0 ? 0 : Math.max(1, Math.round(target * progress));
      });

      setAnimatedScores(next);
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [matches, matchLoading, selectedInternship]);

  useEffect(() => {
    if (matchLoading || !selectedInternship) {
      setAnimatedMatchCount(0);
      return;
    }

    const target = matches.length;
    if (target <= 0) {
      setAnimatedMatchCount(0);
      return;
    }

    const start = Date.now();
    const duration = 320;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const next = Math.round(target * progress);
      setAnimatedMatchCount(next);
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [matches, matchLoading, selectedInternship]);

  // Matching logic: find students whose skills overlap with internship skillsRequired
  const runMatching = (internship) => {
    setMatchLoading(true);
    setSelectedInternship(internship);

    const requiredSkills = (internship.skillsRequired || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const matched = students
      .map((student) => {
        const studentSkills = (student.skills || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);

        const overlap = requiredSkills.filter((skill) =>
          studentSkills.some((ss) => ss.includes(skill) || skill.includes(ss))
        );

        return { ...student, matchedSkills: overlap, matchScore: overlap.length };
      })
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setTimeout(() => {
      setMatches(matched);
      setMatchLoading(false);
    }, 400);
  };

  const now = new Date();

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const getMatchPercent = (student) => {
    if (!selectedInternship) return 0;
    const requiredCount = Math.max(1, (selectedInternship.skillsRequired || "").split(",").filter(Boolean).length);
    return Math.round((student.matchScore / requiredCount) * 100);
  };

  const rightItemStyle = (delay = 0) => ({
    opacity: resultEntered ? 1 : 0,
    transform: resultEntered ? "translateY(0)" : "translateY(8px)",
    transition: `opacity .22s ease ${delay}ms, transform .28s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex h-screen bg-[#0B1220] font-syne overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 h-screen p-8 overflow-y-auto" style={{ minWidth: 0 }}>
        <div style={{...styles.topBar, ...revealStyle(0)}}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={()=>navigate(-1)}
              style={{background:"none",border:"none",color:"#64748B",fontSize:"20px",cursor:"pointer",padding:0,transition:"color .15s"}}
              onMouseEnter={e=>(e.currentTarget.style.color="#22D3EE")}
              onMouseLeave={e=>(e.currentTarget.style.color="#64748B")}>←</button>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{width:"44px",height:"44px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <div>
                <h1 style={styles.pageTitle}>Matching Engine</h1>
                <p style={styles.pageSub}>Select an internship to see skill-matched students automatically</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10" style={revealStyle(110)}>Loading data...</div>
        ) : (
          <div style={{...styles.layout, ...revealStyle(110)}}>
            {/* Left: Internship List */}
            <div className="admin-hover-surface" style={styles.leftPanel}>
              <h3 style={styles.panelTitle}> Select Internship</h3>
              <p style={styles.panelSub}>Click to trigger skill matching</p>
              <div style={styles.internshipList}>
                {internships.length === 0 && (
                  <p style={{ color: "#94A3B8", fontSize: "13px", padding: "16px" }}>No internships found.</p>
                )}
                {internships.map((item) => {
                  const expired = new Date(item.deadline) < now;
                  const isSelected = selectedInternship?._id === item._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => runMatching(item)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.borderColor = "rgba(34,211,238,0.45)";
                          e.currentTarget.style.boxShadow = "0 10px 22px rgba(34,211,238,0.14)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "#334155";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                      style={{
                        ...styles.internshipItem,
                        ...(isSelected ? styles.internshipItemSelected : {}),
                        ...(expired ? { opacity: 0.6 } : {}),
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <p style={{ color: isSelected ? "#22D3EE" : "#F8FAFC", fontWeight: "700", margin: "0 0 4px", fontSize: "14px" }}>
                          {item.title}
                        </p>
                        <span style={expired ? styles.expiredDot : styles.activeDot}>
                          {expired ? "Expired" : "Active"}
                        </span>
                      </div>
                      <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 8px" }}>{item.company} · {item.location}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                        {(item.skillsRequired||"").split(",").slice(0,3).map((s,i)=>
                          s.trim()?<TechBadgeME key={i} skill={s}/>:null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Match Results */}
            <div className="admin-hover-surface" style={styles.rightPanel}>
              <div key={`${selectedInternship?._id || "none"}-${matchLoading ? "loading" : "ready"}`} style={{
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                opacity: resultEntered ? 1 : 0,
                transform: resultEntered ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)",
                filter: resultEntered ? "blur(0px)" : "blur(2px)",
                transformOrigin: "top center",
                transition: "opacity .34s ease, transform .42s cubic-bezier(0.22, 1, 0.36, 1), filter .34s ease",
              }}>
                {!selectedInternship ? (
                  <div style={styles.emptyState}>
                    <p style={{ fontSize: "48px", margin: 0, ...rightItemStyle(0) }}></p>
                    <p style={{ color: "#94A3B8", fontSize: "15px", marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", ...rightItemStyle(40) }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span>Select an internship on the left to see matched students</span>
                    </p>
                    <p style={{ color: "#334155", fontSize: "13px", ...rightItemStyle(80) }}>
                      The engine compares student skills with internship requirements
                    </p>
                  </div>
                ) : matchLoading ? (
                  <div style={styles.emptyState}>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"16px 20px",background:"#1E293B",borderRadius:"12px",border:"1px solid rgba(34,211,238,0.15)",...rightItemStyle(30)}}>
                      <div style={{width:"36px",height:"36px",background:"rgba(34,211,238,0.15)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-9.77"/>
                        </svg>
                      </div>
                      <div style={{flex:1}}>
                        <p style={{color:"#22D3EE",fontWeight:700,fontSize:"14px",margin:0}}>
                          Running skill match
                          <span style={{display:"inline-block",width:"20px",textAlign:"left"}}>{".".repeat(loadingTick + 1)}</span>
                        </p>
                        <p style={{color:"#64748B",fontSize:"11px",margin:"3px 0 0"}}>Comparing student profiles against internship requirements</p>
                      </div>
                      <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            style={{
                              width:"6px",
                              height:"6px",
                              background:"#22D3EE",
                              borderRadius:"50%",
                              opacity: loadingTick === i ? 1 : 0.25,
                              transition:"opacity .2s ease",
                            }}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{...styles.matchHeader, ...rightItemStyle(20)}}>
                      <div style={rightItemStyle(45)}>
                        <h3 style={{ color: "#F8FAFC", fontWeight: "800", margin: "0 0 4px", fontSize: "18px" }}>
                          {selectedInternship.title}
                        </h3>
                        <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                          {selectedInternship.company} · Required skills: {selectedInternship.skillsRequired}
                        </p>
                      </div>
                      <div style={{...styles.matchCount, ...rightItemStyle(70)}}>
                        <span style={{ color: "#22D3EE", fontSize: "28px", fontWeight: "800" }}>{animatedMatchCount}</span>
                        <span style={{ color: "#94A3B8", fontSize: "12px" }}>matches</span>
                      </div>
                    </div>

                    {matches.length === 0 ? (
                      <div style={{...styles.noMatch, ...rightItemStyle(95)}}>
                        <p style={{ fontSize: "32px", margin: 0, ...rightItemStyle(115) }}></p>
                        <p style={{ color: "#94A3B8", margin: "8px 0 0", ...rightItemStyle(140) }}>
                          No students matched the required skills for this internship.
                        </p>
                      </div>
                    ) : (
                      <div style={{...styles.matchList, ...rightItemStyle(95)}}>
                        {matches.map((student, idx) => (
                          <div key={student._id} style={{
                            ...styles.studentCard,
                            opacity: resultEntered ? 1 : 0,
                            transform: resultEntered ? "translateY(0)" : "translateY(10px)",
                            transition: `opacity .22s ease ${110 + (idx * 26)}ms, transform .3s cubic-bezier(0.22, 1, 0.36, 1) ${110 + (idx * 26)}ms`,
                          }}>
                            <div style={styles.studentRank}>#{idx + 1}</div>
                            <div style={styles.studentAvatar}>
                              {student.fullName[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: "#F8FAFC", fontWeight: "700", margin: "0 0 2px", fontSize: "15px" }}>
                                {student.fullName}
                              </p>
                              <p style={{ color: "#94A3B8", fontSize: "12px", margin: "0 0 8px" }}>
                                {student.gmail} · {student.education}
                              </p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {student.matchedSkills.map((skill, i) => (
                                  <TechBadgeME key={i} skill={"✓ "+skill}/>
                                ))}
                              </div>
                            </div>
                            {/* Match score bar */}
                            <div style={styles.scoreWrap}>
                              <p style={{ color: "#22D3EE", fontWeight: "800", fontSize: "18px", margin: 0 }}>
                                {(animatedScores[student._id] ?? getMatchPercent(student))}%
                              </p>
                              <p style={{ color: "#94A3B8", fontSize: "11px", margin: 0 }}>match</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Rules Box */}
        <div className="admin-hover-surface" style={{...styles.rulesBox, ...revealStyle(220)}}>
          <p style={styles.rulesTitle}>📌 Matching Engine Rules</p>
          <ul style={styles.rulesList}>
            <li>Only students whose skill tags overlap with internship skill tags are shown</li>
            <li>Students are ranked by match score (highest overlap first)</li>
            <li>Matching triggers automatically when you click an internship</li>
            <li>Match percentage = matched skills ÷ total required skills × 100</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

const styles = {
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  pageTitle: { fontSize: "30px", fontWeight: "800", color: "#F8FAFC", margin: 0 },
  pageSub: { color: "#94A3B8", fontSize: "14px", margin: "4px 0 0" },
  avatar: {
    width: "44px", height: "44px", background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
    borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "800", color: "#0B1220", fontSize: "18px",
  },
  layout: { display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", marginBottom: "24px" },
  leftPanel: {
    background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px",
    padding: "20px", height: "fit-content", maxHeight: "70vh",
    display: "flex", flexDirection: "column",
  },
  panelTitle: { color: "#F8FAFC", fontWeight: "700", margin: "0 0 2px", fontSize: "16px" },
  panelSub: { color: "#94A3B8", fontSize: "12px", margin: "0 0 14px" },
  internshipList: { overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  internshipItem: {
    background: "#1E293B", border: "1px solid #334155", borderRadius: "10px",
    padding: "14px", cursor: "pointer", transition: "all 0.2s",
  },
  internshipItemSelected: {
    background: "rgba(34,211,238,0.08)", border: "1px solid #22D3EE",
  },
  skillTag: {
    background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.15)",
    color: "#22D3EE", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
  },
  activeDot: {
    background: "rgba(74,222,128,0.1)", color: "#4ADE80", padding: "2px 8px",
    borderRadius: "20px", fontSize: "11px", fontWeight: "600",
  },
  expiredDot: {
    background: "rgba(248,113,113,0.1)", color: "#F87171", padding: "2px 8px",
    borderRadius: "20px", fontSize: "11px", fontWeight: "600",
  },
  rightPanel: {
    background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px",
    padding: "24px", minHeight: "400px", maxHeight: "70vh",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    height: "100%", minHeight: "300px", textAlign: "center",
  },
  matchHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #1E293B",
  },
  matchCount: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  noMatch: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "40px", textAlign: "center",
  },
  matchList: {
    display: "flex", flexDirection: "column", gap: "12px",
    overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable", flex: 1, minHeight: 0, paddingRight: "4px",
  },
  studentCard: {
    background: "#1E293B", border: "1px solid #334155", borderRadius: "12px",
    padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "14px",
  },
  studentRank: {
    color: "#22D3EE", fontWeight: "800", fontSize: "13px", minWidth: "28px",
    background: "rgba(34,211,238,0.1)", padding: "4px 8px", borderRadius: "8px",
    border: "1px solid rgba(34,211,238,0.2)",
  },
  studentAvatar: {
    width: "40px", height: "40px", background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
    borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
    color: "#F8FAFC", fontWeight: "800", fontSize: "16px", minWidth: "40px",
  },
  matchedSkillTag: {
    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
    color: "#4ADE80", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
  },
  scoreWrap: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" },
  rulesBox: {
    background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)",
    borderRadius: "14px", padding: "18px 22px",
  },
  rulesTitle: { color: "#22D3EE", fontWeight: "700", fontSize: "14px", margin: "0 0 10px" },
  rulesList: { color: "#94A3B8", fontSize: "13px", paddingLeft: "20px", margin: 0, lineHeight: "1.9" },
};