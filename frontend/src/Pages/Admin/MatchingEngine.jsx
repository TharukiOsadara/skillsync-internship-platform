import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

export default function MatchingEngine() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/login");
  }, [navigate, user]);

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

  return (
    <div className="flex h-screen bg-[#0B1220] font-syne overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main */}
      <main className="flex-1 h-screen p-8 overflow-y-auto" style={{ minWidth: 0 }}>
        <div style={styles.topBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "1.5rem" }} className="hover:text-cyan-400 transition-colors">←</button>
            <div>
              <h1 style={styles.pageTitle}>Matching Engine</h1>
              <p style={styles.pageSub}>Select an internship to see skill-matched students automatically</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10">Loading data...</div>
        ) : (
          <div style={styles.layout}>
            {/* Left: Internship List */}
            <div style={styles.leftPanel}>
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
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {(item.skillsRequired || "").split(",").slice(0, 3).map((s, i) =>
                          s.trim() ? <span key={i} style={styles.skillTag}>{s.trim()}</span> : null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Match Results */}
            <div style={styles.rightPanel}>
              {!selectedInternship ? (
                <div style={styles.emptyState}>
                  <p style={{ fontSize: "48px", margin: 0 }}></p>
                  <p style={{ color: "#94A3B8", fontSize: "15px", marginTop: "12px" }}>
                    Select an internship on the left to see matched students
                  </p>
                  <p style={{ color: "#334155", fontSize: "13px" }}>
                    The engine compares student skills with internship requirements
                  </p>
                </div>
              ) : matchLoading ? (
                <div style={styles.emptyState}>
                  <p style={{ color: "#22D3EE", fontSize: "16px" }}> Running skill match...</p>
                </div>
              ) : (
                <>
                  <div style={styles.matchHeader}>
                    <div>
                      <h3 style={{ color: "#F8FAFC", fontWeight: "800", margin: "0 0 4px", fontSize: "18px" }}>
                        {selectedInternship.title}
                      </h3>
                      <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>
                        {selectedInternship.company} · Required skills: {selectedInternship.skillsRequired}
                      </p>
                    </div>
                    <div style={styles.matchCount}>
                      <span style={{ color: "#22D3EE", fontSize: "28px", fontWeight: "800" }}>{matches.length}</span>
                      <span style={{ color: "#94A3B8", fontSize: "12px" }}>matches</span>
                    </div>
                  </div>

                  {matches.length === 0 ? (
                    <div style={styles.noMatch}>
                      <p style={{ fontSize: "32px", margin: 0 }}></p>
                      <p style={{ color: "#94A3B8", margin: "8px 0 0" }}>
                        No students matched the required skills for this internship.
                      </p>
                    </div>
                  ) : (
                    <div style={styles.matchList}>
                      {matches.map((student, idx) => (
                        <div key={student._id} style={styles.studentCard}>
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
                                <span key={i} style={styles.matchedSkillTag}>✓ {skill}</span>
                              ))}
                            </div>
                          </div>
                          {/* Match score bar */}
                          <div style={styles.scoreWrap}>
                            <p style={{ color: "#22D3EE", fontWeight: "800", fontSize: "18px", margin: 0 }}>
                              {Math.round((student.matchScore / selectedInternship.skillsRequired.split(",").length) * 100)}%
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
        )}

        {/* Business Rules Box */}
        <div style={styles.rulesBox}>
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
    overflowY: "auto", flex: 1, minHeight: 0, paddingRight: "4px",
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