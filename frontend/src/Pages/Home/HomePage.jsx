import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../../Utils/auth";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const pill = {
  display: "inline-block",
  background: "rgba(34,211,238,0.08)",
  border: "1px solid rgba(34,211,238,0.2)",
  color: "#22D3EE",
  fontSize: "9px",
  fontWeight: 700,
  padding: "3px 12px",
  borderRadius: "99px",
  marginBottom: "14px",
  letterSpacing: ".6px",
  textTransform: "uppercase",
};

const FeatureIcon = ({ stroke = "#22D3EE", children }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const RoleIcon = ({ stroke = "#22D3EE", children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const FEATURES = [
  {
    bg: "rgba(34,211,238,0.1)",
    title: "Get matched to the right internship",
    desc: "Stop scrolling through irrelevant listings. You see only the internships that actually fit your skills — ranked from best match to lowest.",
    icon: <FeatureIcon stroke="#22D3EE"><path d="M21 21l-4.35-4.35" /><circle cx="11" cy="11" r="7" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></FeatureIcon>,
  },
  {
    bg: "rgba(74,222,128,0.1)",
    title: "Save hours of searching",
    desc: "No more manually comparing job descriptions. SkillSync does the comparison for you instantly the moment you log in.",
    icon: <FeatureIcon stroke="#4ADE80"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></FeatureIcon>,
  },
  {
    bg: "rgba(99,179,237,0.1)",
    title: "Know exactly how well you fit",
    desc: "Every internship shows a match percentage against your profile so you can confidently prioritize where to apply first.",
    icon: <FeatureIcon stroke="#63B3ED"><path d="M4 20h16" /><path d="M7 20V10" /><path d="M12 20V6" /><path d="M17 20V13" /></FeatureIcon>,
  },
  {
    bg: "rgba(251,191,36,0.1)",
    title: "Never miss a deadline",
    desc: "Expired listings are clearly flagged in red so you always know which opportunities are still open and worth your time.",
    icon: <FeatureIcon stroke="#FBBF24"><circle cx="12" cy="12" r="9" /><polyline points="12 8 12 12 15 12" /></FeatureIcon>,
  },
  {
    bg: "rgba(167,139,250,0.1)",
    title: "Your data stays private",
    desc: "Your profile and skills are stored securely. Only you can see your matches — other students cannot see your profile or applications.",
    icon: <FeatureIcon stroke="#A78BFA"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></FeatureIcon>,
  },
  {
    bg: "rgba(248,113,113,0.1)",
    title: "Build your profile once, match forever",
    desc: "Set up your skills and education one time. Every new internship posted is automatically checked against your profile — no repeat effort.",
    icon: <FeatureIcon stroke="#F87171"><path d="M12 3v18" /><path d="M3 12h18" /><circle cx="12" cy="12" r="9" /></FeatureIcon>,
  },
  {
    bg: "rgba(96,211,186,0.1)",
    title: "See only verified, active listings",
    desc: "Admins review and post all internships. Duplicates are blocked automatically so you never see the same listing twice.",
    icon: <FeatureIcon stroke="#60D3BA"><polyline points="20 6 9 17 4 12" /></FeatureIcon>,
  },
  {
    bg: "rgba(34,211,238,0.1)",
    title: "Start applying in minutes",
    desc: "Register, add your skills, and your personalised internship list is ready immediately. No waiting, no approval process.",
    icon: <FeatureIcon stroke="#22D3EE"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="14 3 14 9 20 9" /><line x1="12" y1="13" x2="12" y2="17" /><line x1="10" y1="15" x2="14" y2="15" /></FeatureIcon>,
  },
];

const STEPS = [
  { num: "01", title: "Create your profile", desc: "Register as a student. Add your skills, education, and work experience to build your match profile.", color: "#22D3EE",  border: "rgba(34,211,238,0.35)",  bg: "rgba(34,211,238,0.06)"  },
  { num: "02", title: "Get matched",         desc: "Our engine scans all active internships and ranks them by how well they match your skill set.",          color: "#A78BFA", border: "rgba(167,139,250,0.35)", bg: "rgba(167,139,250,0.06)" },
  { num: "03", title: "Apply & succeed",     desc: "Review ranked matches on your dashboard and apply to the best opportunities before the deadlines.",      color: "#4ADE80", border: "rgba(74,222,128,0.35)",  bg: "rgba(74,222,128,0.06)"  },
];

const MARQUEE_ITEMS = [
  "Unlock Your Professional Potential: SkillSync bridges the gap between academic learning and industry demands by allowing you to register your technical skills, build a comprehensive digital profile, and let our automated matching engine identify the most relevant internship opportunities tailored specifically for your unique career path.",
];

// Match % positions for the 3 terminal card rows
const DEMO_PCTS = [100, 75, 60];


const HERO_PARTICLES = [
  { width: "3px", height: "3px", top: "16%", left: "10%", animation: "float1 4.2s ease-in-out infinite" },
  { width: "2px", height: "2px", top: "72%", left: "15%", animation: "float2 4.8s ease-in-out infinite .8s" },
  { width: "3px", height: "3px", top: "24%", right: "11%", animation: "float1 3.7s ease-in-out infinite .3s" },
  { width: "2px", height: "2px", top: "78%", right: "17%", animation: "float2 5.1s ease-in-out infinite 1.1s" },
  { width: "2px", height: "2px", top: "45%", left: "4%", animation: "float1 5.6s ease-in-out infinite 1.6s" },
  { width: "3px", height: "3px", top: "38%", right: "5%", animation: "float2 4.6s ease-in-out infinite .6s" },
  { width: "2px", height: "2px", top: "10%", left: "42%", animation: "float1 4.1s ease-in-out infinite .9s" },
  { width: "2px", height: "2px", top: "84%", right: "36%", animation: "float2 4.4s ease-in-out infinite 1.2s" },
  { width: "3px", height: "3px", top: "20%", left: "24%", animation: "float1 4.9s ease-in-out infinite .5s" },
  { width: "2px", height: "2px", top: "63%", left: "28%", animation: "float2 5.2s ease-in-out infinite .7s" },
  { width: "3px", height: "3px", top: "14%", right: "27%", animation: "float1 4.0s ease-in-out infinite 1.0s" },
  { width: "2px", height: "2px", top: "67%", right: "29%", animation: "float2 4.3s ease-in-out infinite .4s" },
  { width: "3px", height: "3px", top: "32%", left: "33%", animation: "float1 5.4s ease-in-out infinite 1.1s" },
  { width: "2px", height: "2px", top: "56%", right: "41%", animation: "float2 4.7s ease-in-out infinite .9s" },
  { width: "3px", height: "3px", top: "87%", left: "46%", animation: "float1 4.5s ease-in-out infinite .2s" },
  { width: "2px", height: "2px", top: "26%", right: "46%", animation: "float2 5.0s ease-in-out infinite 1.3s" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Live state ──────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({ internshipCount: null, studentCount: null, companyCount: null });

  const [animatedStats, setAnimatedStats] = useState({ internshipCount: 1, studentCount: 1, companyCount: 1, accuracy: 1 });
  const [liveMatches, setLiveMatches] = useState([]);   // terminal card rows
  const [animatedMatches, setAnimatedMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  // ── Redirect logged-in users ────────────────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      navigate(user?.role === "Admin" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, []);

  // ── Hash scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [location.hash]);

  // ── Fetch live data from backend ────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Both requests in parallel — /stats is public, /internships is public
        const [statsRes, listRes] = await Promise.all([
          fetch("http://localhost:5000/internships/stats"),
          fetch("http://localhost:5000/internships"),
        ]);

        const statsData = await statsRes.json();
        const listData  = await listRes.json();

        // ── Stats row ─────────────────────────────────────────────────────────
        setStats({
          internshipCount: statsData.internshipCount ?? 0,
          studentCount:    statsData.studentCount    ?? 0,
          companyCount:    statsData.companyCount    ?? 0,
        });

        // ── Terminal card — 3 most recent active internships ──────────────────
        const now = new Date();
        const all = listData.internships || [];

        const active = all
          .filter(i => new Date(i.deadline) >= now)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((item, idx) => ({
            title: item.title,
            co:    `${item.company} · ${item.location}`,
            pct:   DEMO_PCTS[idx] ?? 60,
          }));

        // Fallback: use latest 3 overall if no active found
        const fallback = [...all]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((item, idx) => ({
            title: item.title,
            co:    `${item.company} · ${item.location}`,
            pct:   DEMO_PCTS[idx] ?? 60,
          }));

        setLiveMatches(active.length > 0 ? active : fallback);
      } catch (err) {
        console.error("HomePage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (stats.internshipCount === null || stats.studentCount === null || stats.companyCount === null) return;

    const target = {
      internshipCount: Math.max(0, stats.internshipCount),
      studentCount: Math.max(0, stats.studentCount),
      companyCount: Math.max(0, stats.companyCount),
      accuracy: 95,
    };

    const start = Date.now();
    const duration = 850;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        internshipCount: target.internshipCount > 0 ? Math.max(1, Math.round(target.internshipCount * eased)) : 0,
        studentCount: target.studentCount > 0 ? Math.max(1, Math.round(target.studentCount * eased)) : 0,
        companyCount: target.companyCount > 0 ? Math.max(1, Math.round(target.companyCount * eased)) : 0,
        accuracy: target.accuracy > 0 ? Math.max(1, Math.round(target.accuracy * eased)) : 0,
      });

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [stats.internshipCount, stats.studentCount, stats.companyCount]);

  useEffect(() => {
    if (loading) return;
    if (liveMatches.length === 0) {
      setAnimatedMatches([]);
      return;
    }

    const seeded = liveMatches.map((item) => ({
      ...item,
      animatedPct: item.pct > 0 ? 1 : 0,
    }));
    setAnimatedMatches(seeded);

    const start = Date.now();
    const duration = 900;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedMatches(
        liveMatches.map((item) => ({
          ...item,
          animatedPct: item.pct > 0 ? Math.max(1, Math.round(item.pct * eased)) : 0,
        }))
      );

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [loading, liveMatches]);

  // ── Helpers for display ─────────────────────────────────────────────────────
  const fmt = (n) => (n === null ? "..." : n > 0 ? `${n}+` : "0");

  return (
    <div style={{ background: "#060D1A", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#060D1A", paddingTop: "64px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.04)1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.04)1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.08)0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.06)0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {HERO_PARTICLES.map((p, i) => (
            <div key={i} style={{ ...p, position: "absolute", borderRadius: "50%", background: "rgba(103,232,249,0.9)", boxShadow: "0 0 8px rgba(34,211,238,0.8), 0 0 18px rgba(34,211,238,0.55)" }} />
          ))}
        </div>


        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 40px 70px", display: "flex", alignItems: "center", gap: "56px", minHeight: "calc(100vh - 60px)", flexWrap: "wrap", position: "relative", zIndex: 1 }}>

          {/* LEFT */}
          <div style={{ flex: 1, minWidth: "320px", maxWidth: "540px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", fontSize: "10px", fontWeight: 700, padding: "5px 14px", borderRadius: "99px", marginBottom: "22px" }}>
              <span style={{ width: "6px", height: "6px", background: "#22D3EE", borderRadius: "50%", display: "inline-block" }} />
              Skill-based internship matching · Sri Lanka
            </div>

            <h1 style={{ fontSize: "clamp(40px,5vw,58px)", fontWeight: 800, color: "#F1F5F9", lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: "18px" }}>
              Find Your{" "}
              <span style={{ background: "linear-gradient(135deg,#22D3EE,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Perfect Match
              </span>
              <br />in Sri Lanka
            </h1>

            <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "1.75", marginBottom: "30px", maxWidth: "420px" }}>
              SkillSync intelligently connects students with internships based on their skill profile. No manual searching — the right opportunity surfaces for you.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
              <Link to="/register"
                style={{ background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontWeight: 800, fontSize: "13px", padding: "12px 26px", borderRadius: "10px", textDecoration: "none", display: "inline-block", transition: "all .2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,211,238,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >Get Started Free →</Link>
              <Link to="/login"
                style={{ background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: "13px", padding: "12px 26px", borderRadius: "10px", border: "1px solid #334155", textDecoration: "none", display: "inline-block", transition: "all .2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#CFFAFE"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.6)"; e.currentTarget.style.background = "rgba(34,211,238,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "transparent"; }}
              >Sign In</Link>
            </div>

            {/* ── STATS ROW — live from /internships/stats ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#0A1628", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden" }}>
              {[
                [loading ? "..." : `${animatedStats.internshipCount}+`, "Internships"],
                [loading ? "..." : `${animatedStats.studentCount}+`, "Students"],
                [loading ? "..." : `${animatedStats.companyCount}+`, "Companies"],
                [loading ? "..." : `${animatedStats.accuracy}%`, "Accuracy"],

              ].map(([v, l], i) => (
                <div key={i} style={{ textAlign: "center", padding: "12px 6px", borderRight: i < 3 ? "1px solid #1E293B" : "none" }}>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#22D3EE", transition: "all 0.4s" }}>{v}</div>
                  <div style={{ fontSize: "9px", color: "#64748B", fontWeight: 600, marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — terminal card */}
          <div style={{ flexShrink: 0, width: "320px" }}>
            <div style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "18px", padding: "20px", boxShadow: "0 0 50px rgba(34,211,238,0.07)" }}>
              {/* traffic lights */}
              <div style={{ display: "flex", gap: "5px", marginBottom: "16px" }}>
                {["#F87171","#FBBF24","#4ADE80"].map((c, i) => (
                  <div key={i} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />
                ))}
              </div>

              {/* ── User row — first live match title + company ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", color: "#060D1A", flexShrink: 0 }}>
                  {loading ? "…" : liveMatches.length > 0 ? liveMatches[0].title[0].toUpperCase() : "S"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#F1F5F9", fontSize: "12px", fontWeight: 700 }}>
                    {loading ? "Loading..." : liveMatches.length > 0 ? liveMatches[0].title : "No active internships"}
                  </div>
                  <div style={{ color: "#64748B", fontSize: "10px", marginTop: "1px" }}>
                    {loading ? "..." : liveMatches.length > 0 ? liveMatches[0].co : "Check back soon"}
                  </div>
                </div>
                <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px" }}>
                  Active
                </div>
              </div>

              <div style={{ height: "1px", background: "#1E293B", marginBottom: "12px" }} />
              <div style={{ color: "#64748B", fontSize: "9px", fontWeight: 700, letterSpacing: ".6px", marginBottom: "10px", textTransform: "uppercase" }}>
                Top Matched Internships
              </div>

              {/* ── Match rows — live from /internships ── */}
              {loading ? (
                <div style={{ color: "#64748B", fontSize: "11px", textAlign: "center", padding: "14px 0" }}>
                  Loading...
                </div>
              ) : animatedMatches.length === 0 ? (

                <div style={{ color: "#64748B", fontSize: "11px", textAlign: "center", padding: "14px 0" }}>
                  No active internships yet
                </div>
              ) : (
                animatedMatches.map((m, i) => (

                  <div key={i} style={{ background: "#0F1F38", borderRadius: "9px", padding: "9px 11px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#F1F5F9", fontSize: "11px", fontWeight: 700 }}>{m.title}</div>
                      <div style={{ color: "#64748B", fontSize: "9px", marginTop: "1px" }}>{m.co}</div>
                      <div style={{ height: "4px", background: "#1E293B", borderRadius: "99px", marginTop: "7px", overflow: "hidden" }}>
                        <div style={{ height: "4px", width: `${m.animatedPct}%`, background: "linear-gradient(90deg,#22D3EE,#06B6D4)", borderRadius: "99px", transition: "width .15s linear" }} />
                      </div>
                    </div>
                    <div style={{ color: "#22D3EE", fontSize: "11px", fontWeight: 800, minWidth: "34px", textAlign: "right" }}>{m.animatedPct}%</div>

                  </div>
                ))
              )}

              {/* live badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", color: "#22D3EE", fontSize: "9px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", marginTop: "10px" }}>
                <span style={{ width: "5px", height: "5px", background: "#22D3EE", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                Matching engine active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ──────────────────────────────────────────────────── */}
      <div style={{ background: "#0A1628", borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap" }}>

        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes float1{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.4)}} @keyframes float2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(11px) scale(0.7)}}`}</style>

        <div style={{ display: "inline-block", animation: "marquee 22s linear infinite" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", margin: "0 22px", color: "#475569", fontSize: "11px", fontWeight: 600 }}>
              <span style={{ width: "4px", height: "4px", background: "#22D3EE", borderRadius: "50%", display: "inline-block" }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ background: "#060D1A", padding: "80px 40px", scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={pill}>What You Get</div>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.8px", marginBottom: "10px" }}>
            Why Students Choose SkillSync
          </h2>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "36px", maxWidth: "480px", lineHeight: "1.7" }}>
            We built SkillSync around one goal — getting you to the right internship faster, with less effort and more confidence.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {FEATURES.map((f, i) => (
              <div key={i}
                style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "14px", padding: "22px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s", cursor: "default" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(34,211,238,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#1E293B";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "38px", height: "38px", background: `linear-gradient(135deg, ${f.bg}, rgba(255,255,255,0.03))`, border: "1px solid rgba(34,211,238,0.28)", boxShadow: "0 8px 18px rgba(34,211,238,0.14)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#F1F5F9", marginBottom: "6px" }}>{f.title}</div>
                <div style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.65" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how" style={{ background: "#080F1E", borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B", padding: "80px 40px", scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={pill}>How It Works</div>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.8px", marginBottom: "10px" }}>Three simple steps</h2>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "48px", lineHeight: "1.7" }}>
            From registration to your first internship application in minutes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "48px" }}>
            {[
              { label: "Step 1 instruction", color: "#22D3EE", text: "Complete profile details: skills, education, phone number and experience." },
              { label: "Step 2 instruction", color: "#A78BFA", text: "Review your matched internships and compare role, company, location, and deadline." },
              { label: "Step 3 instruction", color: "#4ADE80", text: "Apply to the top-ranked opportunities before deadlines and keep your profile updated." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0A1628", border: "1px solid #1E293B", borderRadius: "12px", padding: "16px 18px" }}>
                <div style={{ color: s.color, fontSize: "10px", fontWeight: 700, marginBottom: "5px" }}>{s.label}</div>
                <div style={{ color: "#CBD5E1", fontSize: "12px", lineHeight: "1.65" }}>{s.text}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", position: "relative" }}>
            <div style={{ position: "absolute", top: "28px", left: "16.6%", right: "16.6%", height: "1px", background: "linear-gradient(90deg,#22D3EE,rgba(34,211,238,0.1))", zIndex: 0 }} />
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, margin: "0 auto 18px", border: `2px solid ${s.border}`, color: s.color, background: s.bg }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#F1F5F9", marginBottom: "8px" }}>{s.title}</div>
                <div style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.65" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#060D1A", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={pill}>Two Roles</div>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.8px", marginBottom: "10px" }}>
            One platform, two experiences
          </h2>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "36px", maxWidth: "480px", lineHeight: "1.7" }}>
            Whether you're a student looking for opportunities or an admin managing listings — SkillSync works for you.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px", maxWidth: "700px" }}>
            {/* Student */}
            <div style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.06),rgba(6,182,212,0.02))", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "18px", padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.35)", boxShadow: "0 10px 20px rgba(34,211,238,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <RoleIcon stroke="#22D3EE">
                  <path d="M22 10L12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v4.5C6 18.5 8.7 20 12 20s6-1.5 6-3.5V12" />
                </RoleIcon>
              </div>
              <h3 style={{ color: "#F1F5F9", fontSize: "17px", fontWeight: 800, marginBottom: "6px" }}>Student</h3>
              <p style={{ color: "#64748B", fontSize: "11px", marginBottom: "14px", lineHeight: "1.65" }}>Find internships that match your exact skill set with zero effort.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: "7px" }}>
                {["Register with your skill profile","See auto-matched internships","Results ranked by match %","View deadlines & company info"].map(item => (
                  <li key={item} style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <span style={{ color: "#22D3EE", flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/register"
                style={{ display: "block", background: "linear-gradient(135deg,#22D3EE,#06B6D4)", border: "none", color: "#060D1A", fontSize: "12px", fontWeight: 800, padding: "10px 18px", borderRadius: "10px", textDecoration: "none", textAlign: "center", transition: "all .2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(34,211,238,0.26)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >Join as Student →</Link>
            </div>
            {/* Admin */}
            <div style={{ background: "linear-gradient(135deg,rgba(167,139,250,0.06),rgba(124,58,237,0.02))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "18px", padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.35)", boxShadow: "0 10px 20px rgba(167,139,250,0.16)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                <RoleIcon stroke="#A78BFA">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </RoleIcon>
              </div>
              <h3 style={{ color: "#F1F5F9", fontSize: "17px", fontWeight: 800, marginBottom: "6px" }}>Admin</h3>
              <p style={{ color: "#64748B", fontSize: "11px", marginBottom: "14px", lineHeight: "1.65" }}>Post and manage internship opportunities for all students on the platform.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "flex", flexDirection: "column", gap: "7px" }}>
                {["Post new internship listings","Manage active & expired listings","Run the skill matching engine","Track internship deadline status"].map(item => (
                  <li key={item} style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <span style={{ color: "#A78BFA", flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/login"
                style={{ display: "block", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA", fontSize: "12px", fontWeight: 800, padding: "10px 18px", borderRadius: "10px", textDecoration: "none", textAlign: "center", transition: "all .2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(167,139,250,0.2)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(167,139,250,0.1)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; }}
              >Admin Sign In →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#080F1E", borderTop: "1px solid #1E293B", padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "250px", background: "radial-gradient(ellipse,rgba(34,211,238,0.08)0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE", fontSize: "9px", fontWeight: 700, padding: "4px 12px", borderRadius: "99px", marginBottom: "18px", letterSpacing: ".5px" }}>
            <span style={{ width: "5px", height: "5px", background: "#22D3EE", borderRadius: "50%", display: "inline-block" }} />
            Free to get started
          </div>
          <h2 style={{ fontSize: "34px", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.8px", marginBottom: "12px", lineHeight: "1.15" }}>
            Ready to find your perfect internship?
          </h2>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "28px", lineHeight: "1.7" }}>
            Create a free account today and let SkillSync match you with the right opportunity — no manual searching required.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register"
              style={{ background: "linear-gradient(135deg,#22D3EE,#06B6D4)", color: "#060D1A", fontWeight: 800, fontSize: "13px", padding: "12px 26px", borderRadius: "10px", textDecoration: "none", display: "inline-block", transition: "all .2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(34,211,238,0.28)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >Create Free Account →</Link>
            <Link to="/login"
              style={{ background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: "13px", padding: "12px 26px", borderRadius: "10px", border: "1px solid #334155", textDecoration: "none", display: "inline-block", transition: "all .2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#CFFAFE"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.6)"; e.currentTarget.style.background = "rgba(34,211,238,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "transparent"; }}
            >Sign In</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}