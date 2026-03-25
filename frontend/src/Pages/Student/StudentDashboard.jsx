import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { getUser, authHeaders } from "../../Utils/auth";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [scored, setScored]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState("hl");  // "hl" | "lh" | "dl"
  const [liveTime, setLiveTime] = useState(new Date());
  const user = getUser();
  const now  = new Date();

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user?._id) { setLoading(false); return; }
      try {
        const res  = await fetch(
          `http://localhost:5000/internships/suggestions/${user._id}`,
          { headers: authHeaders() }
        );
        const data = await res.json();
        const all  = data.suggestions || [];

        // Split user skills into individual terms for matching
        const userSkills = (user.skills || "")
          .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

        const withScore = all.map(item => {
          const required = (item.skillsRequired || "")
            .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

          // matched = skills the user HAS that this internship needs
          const matched   = required.filter(r =>
            userSkills.some(us => us.includes(r) || r.includes(us))
          );
          // unmatched = skills the internship needs but user doesn't have
          const unmatched = required.filter(r => !matched.includes(r));

          return {
            ...item,
            matchedSkills:   matched,
            unmatchedSkills: unmatched,
            matchPct: required.length > 0
              ? Math.round((matched.length / required.length) * 100) : 0,
          };
        }).sort((a, b) => b.matchPct - a.matchPct);  // default: high → low

        setScored(withScore);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-[#0B1220] min-h-screen font-syne">
      <Header />
      <main className="max-w-6xl mx-auto px-8 py-10">

        {/* ── Welcome card ── */}
        <div style={{
          background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px",
          padding: "22px 26px", display: "flex",
          alignItems: "center", gap: "20px", marginBottom: "22px",
        }}>
          {/* Back arrow — bare, cyan on hover */}
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", color: "#64748B", fontSize: "22px", cursor: "pointer", flexShrink: 0, padding: "0", transition: "color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
            onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}
          >←</button>

          {/* Avatar */}
          <div className="w-14 h-14 btn-cyan rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0">
            {(user?.fullName || "S")[0].toUpperCase()}
          </div>

          {/* Name / skills / logged-in / CV badge */}
          <div style={{ flex: 1 }}>
            <h1 className="text-2xl font-extrabold text-slate-200 m-0">
              Hi !! {user?.fullName}
            </h1>
            <p className="text-slate-400 text-sm mt-1 m-0">
              Your skills:{" "}
              <span className="text-cyan-400 font-semibold">
                {user?.skills || "Not set — update your profile"}
              </span>
            </p>
            <p className="text-slate-400 text-xs mt-1 m-0">
              Live time: {liveTime.toLocaleString()}
            </p>
            {/* CV Matched badge — below logged-in time */}
            {user?.skills && (
              <span style={{
                display: "inline-block", marginTop: "7px",
                background: "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "#22D3EE", fontSize: "9px", fontWeight: 700,
                padding: "3px 10px", borderRadius: "99px",
              }}>CV Matched</span>
            )}
          </div>

          {/* Match count on the right */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#22D3EE", lineHeight: 1 }}>
            </div>
          </div>
        </div>

        {/* ── Info banner ── */}
        <div style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.12)", borderRadius: "12px", padding: "12px 18px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ fontSize: "15px", flexShrink: 0 }}>💡</span>
          <p style={{ color: "#94A3B8", fontSize: "12px", lineHeight: "1.65", margin: 0 }}>
            These results are{" "}
            <span style={{ color: "#22D3EE", fontWeight: 700 }}>automatically updated</span>
            {" "}every time you rebuild your CV. Your skills are extracted from the CV and matched
            against all active internship requirements in real time.
          </p>
        </div>

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-extrabold text-slate-200 m-0">Matched Internships</h2>
          {!loading && (
            <span style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "99px" }}>
              {scored.length} match{scored.length !== 1 ? "es" : ""} found
            </span>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-4 mt-1">
          Automatically matched based on your skill profile
        </p>

        {/* ── Sort dropdown ── */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", outline: "none" }}
          >
            <option value="hl">Sort: High → Low match</option>
            <option value="lh">Sort: Low → High match</option>
            <option value="dl">Sort: Deadline soonest</option>
          </select>
        </div>

        {/* ── Cards — all matched internships shown ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-slate-400 text-sm animate-pulse">Finding matches...</p>
          </div>

        ) : scored.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-5xl mb-3">😕</p>
            <p className="text-slate-200 font-bold mb-2">No matched internships found</p>
            <p className="text-slate-400 text-sm m-0">
              Make sure your skills are updated in your profile to get matches.
            </p>
          </div>

        ) : (() => {
          // Sort only — show every internship returned by backend
          let list = [...scored];
          if (sort === "lh") list = list.sort((a, b) => a.matchPct - b.matchPct);
          if (sort === "dl") list = list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(item => {
                const expired = new Date(item.deadline) < now;
                return (
                  <div
                    key={item._id}
                    style={{
                      background:   expired ? "rgba(248,113,113,0.03)" : "#0F172A",
                      border:       expired ? "1px solid rgba(248,113,113,0.2)" : "1px solid #1E293B",
                      borderRadius: "13px", padding: "16px",
                      display: "flex", flexDirection: "column", gap: "10px",
                      transition: "border-color .15s",
                    }}
                    onMouseEnter={e => { if (!expired) e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; }}
                    onMouseLeave={e => { if (!expired) e.currentTarget.style.borderColor = "#1E293B"; }}
                  >
                    {/* Status + match % + duration */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <span style={{
                        background: expired ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.1)",
                        border:     expired ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(74,222,128,0.3)",
                        color:      expired ? "#F87171" : "#4ADE80",
                        padding: "2px 9px", borderRadius: "99px", fontSize: "9px", fontWeight: 700,
                      }}>{expired ? "Expired" : "Active"}</span>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: expired ? "#F87171" : "#22D3EE" }}>
                          {item.matchPct}%
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>{item.duration}</div>
                      </div>
                    </div>

                    {/* Title + company */}
                    <div>
                      <h3 style={{ fontSize: "13px", fontWeight: 700, color: expired ? "#F87171" : "#F1F5F9", margin: 0 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: "11px", color: "#64748B", margin: "3px 0 0" }}>
                        {item.company} · {item.location}
                      </p>
                    </div>

                    {/* Match progress bar */}
                    <div style={{ height: "4px", background: "#1E293B", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{
                        height: "4px", width: `${item.matchPct}%`,
                        background: expired ? "#F87171" : "linear-gradient(90deg,#22D3EE,#06B6D4)",
                        borderRadius: "99px",
                      }} />
                    </div>

                    {/* Skill tags — green ✓ = user has it, cyan = user is missing it */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {item.matchedSkills.map((s, i) => (
                        <span key={`m-${i}`} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", padding: "2px 7px", borderRadius: "99px", fontSize: "9px", fontWeight: 700 }}>
                          ✓ {s}
                        </span>
                      ))}
                      {item.unmatchedSkills.map((s, i) => (
                        <span key={`u-${i}`} style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", color: "#22D3EE", padding: "2px 7px", borderRadius: "99px", fontSize: "9px", fontWeight: 700 }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Footer: deadline + apply */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #1E293B", marginTop: "auto" }}>
                      <p style={{ fontSize: "10px", color: expired ? "#F87171" : "#64748B", margin: 0 }}>
                        📅 {expired ? "Deadline passed" : new Date(item.deadline).toLocaleDateString("en-GB")}
                      </p>
                      {!expired && (
                        <button className="text-cyan-400 text-xs font-bold bg-cyan-400/8 border border-cyan-400/15 px-3 py-1.5 rounded-lg hover:bg-cyan-400/15 transition-all cursor-pointer">
                          Apply →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </main>
      <Footer />
    </div>
  );
}