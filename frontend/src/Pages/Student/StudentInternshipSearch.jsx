import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";

export default function StudentInternshipSearch() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [timePreference, setTimePreference] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "Searching internships...",
    isError: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast(
        "✨ Welcome to Skill Sync — find your dream internship in Sri Lanka",
        false
      );
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const buildSearchQuery = () => {
    const params = new URLSearchParams();

    if (location.trim()) params.append("location", location.trim());
    if (role.trim()) params.append("role", role.trim());
    if (duration) params.append("duration", duration);
    if (mode) params.append("mode", mode);
    if (timePreference) params.append("timePreference", timePreference);

    return params.toString();
  };

  const filtersSummary = useMemo(() => {
    const filters = [];
    if (location.trim()) filters.push(`Location: ${location.trim()}`);
    if (role.trim()) filters.push(`Role: ${role.trim()}`);
    if (duration) filters.push(`Duration: ${duration}`);
    if (mode) filters.push(`Mode: ${mode}`);
    if (timePreference) filters.push(`Time: ${timePreference}`);
    return filters.length > 0 ? filters.join(" · ") : "All internships";
  }, [location, role, duration, mode, timePreference]);


  const validateFilters = () => {
  const trimmedLocation = location.trim();
  const trimmedRole = role.trim();

  const locationRegex = /^[A-Za-z\s,-]+$/;
  const roleRegex = /^[A-Za-z\s/&-]+$/;

  if (trimmedLocation) {
    if (!locationRegex.test(trimmedLocation)) {
      showToast(
        "❌ Location can contain only letters, spaces, commas, and hyphens.",
        true
      );
      return false;
    }

    if (/^\d+$/.test(trimmedLocation)) {
      showToast("❌ Location cannot contain only numbers.", true);
      return false;
    }
  }

  if (trimmedRole) {
    if (!roleRegex.test(trimmedRole)) {
      showToast(
        "❌ Role can contain only letters, spaces, /, &, and hyphens.",
        true
      );
      return false;
    }

    if (/^\d+$/.test(trimmedRole)) {
      showToast("❌ Role cannot contain only numbers.", true);
      return false;
    }
  }

  return true;
};

  const handleSubmit = (e) => {
  e.preventDefault();

  const isValid = validateFilters();
  if (!isValid) return;

  const queryString = buildSearchQuery();

  showToast(`🔍 Searching: ${filtersSummary} — Redirecting to results...`, false);
  setIsSubmitting(true);

  if (queryString) {
    sessionStorage.setItem("lastInternshipSearch", queryString);
  }

  setTimeout(() => {
    setIsSubmitting(false);
    showToast(
      `✅ Filters saved! ${queryString ? "Custom filters active" : "Showing all internships"}`,
      false
    );
    navigate(`/student/internship-results${queryString ? `?${queryString}` : ""}`);
  }, 1500);
};


  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
      color: "#F8FAFC",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    },
    container: {
      maxWidth: "96rem",
      margin: "0 auto",
      padding: "2rem 2rem 3rem",
      width: "100%",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1.2rem",
      marginBottom: "3rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #334155",
    },
    logoArea: {
      display: "flex",
      alignItems: "baseline",
      gap: "12px",
      flexWrap: "wrap",
    },
    logo: {
      fontSize: "1.9rem",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      background: "linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    logoSpan: {
      background: "linear-gradient(135deg, #F8FAFC, #CBD5E1)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      fontWeight: 700,
    },
    tagline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#22D3EE",
      background: "rgba(34, 211, 238, 0.12)",
      padding: "0.3rem 1rem",
      borderRadius: "40px",
      border: "1px solid rgba(34, 211, 238, 0.3)",
    },
    navBadge: {
      background: "#0F172A",
      borderRadius: "40px",
      padding: "0.5rem 1.4rem",
      fontSize: "0.8rem",
      fontWeight: 500,
      color: "#94A3B8",
      border: "1px solid #334155",
    },
    hero: {
      marginBottom: "3rem",
      textAlign: "center",
    },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(34,211,238,0.08)",
      border: "1px solid rgba(34,211,238,0.2)",
      color: "#22D3EE",
      fontSize: "0.7rem",
      fontWeight: 700,
      padding: "0.3rem 1rem",
      borderRadius: "99px",
      marginBottom: "1.2rem",
    },
    heroTitle: {
      fontSize: "3.2rem",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      background: "linear-gradient(to right, #FFFFFF, #22D3EE)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      lineHeight: 1.2,
      marginBottom: "1rem",
    },
    heroText: {
      fontSize: "1rem",
      color: "#94A3B8",
      maxWidth: "600px",
      margin: "0 auto",
    },
    searchCard: {
      background: "#0F172A",
      borderRadius: "28px",
      boxShadow: "0 20px 35px -12px rgba(0, 0, 0, 0.5)",
      padding: "2.2rem 2rem",
      border: "1px solid #334155",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1.5rem",
      alignItems: "end",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    },
    label: {
      fontWeight: 700,
      fontSize: "0.7rem",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      color: "#22D3EE",
    },
    input: {
      padding: "0.85rem 1rem",
      borderRadius: "14px",
      border: "1.5px solid #334155",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.9rem",
      background: "#020617",
      outline: "none",
      color: "#F8FAFC",
    },
    button: {
      background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
      border: "none",
      padding: "0.85rem 1.6rem",
      borderRadius: "0.625rem",
      fontWeight: 800,
      fontSize: "0.9rem",
      color: "#020617",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      cursor: "pointer",
      width: "100%",
      fontFamily: "'DM Sans', sans-serif",
      opacity: isSubmitting ? 0.8 : 1,
    },
    infoSection: {
      marginTop: "3rem",
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
    },
    infoCard: {
      background: "#0F172A",
      borderRadius: "20px",
      padding: "1.2rem 1.8rem",
      textAlign: "center",
      border: "1px solid #334155",
      minWidth: "180px",
    },
    featuresSection: {
      margin: "3rem 0 2rem",
    },
    sectionPill: {
      display: "inline-block",
      background: "rgba(34,211,238,0.08)",
      border: "1px solid rgba(34,211,238,0.2)",
      color: "#22D3EE",
      fontSize: "0.7rem",
      fontWeight: 700,
      padding: "0.2rem 1rem",
      borderRadius: "99px",
      marginBottom: "1rem",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.2rem",
      marginTop: "1.8rem",
    },
    featureCard: {
      background: "#0F172A",
      border: "1px solid #334155",
      borderRadius: "1rem",
      padding: "1.4rem",
    },
    featureIcon: {
      width: "42px",
      height: "42px",
      background: "rgba(34,211,238,0.12)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
      color: "#22D3EE",
      fontSize: "1.3rem",
    },
    footer: {
      marginTop: "3rem",
      textAlign: "center",
      paddingTop: "2rem",
      borderTop: "1px solid #334155",
      fontSize: "0.75rem",
      color: "#94A3B8",
    },
    toast: {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: toast.show
        ? "translateX(-50%) scale(1)"
        : "translateX(-50%) scale(0.9)",
      background: "#1E293B",
      border: `1px solid ${toast.isError ? "#F87171" : "#22D3EE"}`,
      borderRadius: "50px",
      padding: "0.8rem 1.8rem",
      color: toast.isError ? "#F87171" : "#22D3EE",
      fontWeight: 500,
      zIndex: 1000,
      opacity: toast.show ? 1 : 0,
      transition: "all 0.2s ease",
      pointerEvents: "none",
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "'DM Sans', sans-serif",
    },
  };

  const infoCards = [
    {
      icon: "fas fa-building",
      title: "500+ Companies",
      text: "Top Sri Lankan employers",
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "All Regions",
      text: "Colombo, Kandy, Galle, Remote",
    },
    {
      icon: "fas fa-rocket",
      title: "Fast Matching",
      text: "AI-powered recommendations",
    },
  ];

  const featureCards = [
    {
      icon: "fas fa-chart-line",
      title: "Get matched to the right internship",
      text: "You see only internships that fit your skills — ranked from best match to lowest.",
    },
    {
      icon: "fas fa-stopwatch",
      title: "Save hours of searching",
      text: "No manual comparing. SkillSync compares job descriptions instantly.",
    },
    {
      icon: "fas fa-percent",
      title: "Know exactly how well you fit",
      text: "Match percentage against your profile so you prioritize applications.",
    },
    {
      icon: "fas fa-calendar-times",
      title: "Never miss a deadline",
      text: "Expired listings flagged — only fresh opportunities.",
    },
    {
      icon: "fas fa-lock",
      title: "Your data stays private",
      text: "Profile stored securely, only you see matches.",
    },
    {
      icon: "fas fa-rocket",
      title: "Build profile once, match forever",
      text: "Set skills once; every new internship is auto-checked.",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: styles.page.background, fontFamily: styles.page.fontFamily, color: styles.page.color }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>
        <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.logoArea}>
            <div style={styles.logo}>
              skill<span style={styles.logoSpan}>sync</span> internships
            </div>
            <div style={styles.tagline}>
              <i className="fas fa-map-marker-alt" /> Sri Lanka · Match Engine
            </div>
          </div>
          <div style={styles.navBadge}>
            <i className="fas fa-chart-line" /> Launch your career
          </div>
        </div>

        <div style={styles.hero}>
          <div style={styles.heroBadge}>
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#22D3EE",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            Skill-based matching · 500+ opportunities
          </div>

          <h1 style={styles.heroTitle}>
            Find your perfect internship
            <br />
            in Sri Lanka
          </h1>

          <p style={styles.heroText}>
            Stop scrolling through irrelevant listings. SkillSync ranks internships
            by match percentage — based on your skills, role, location, and
            preferences.
          </p>
        </div>

        <div style={styles.searchCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="fas fa-location-dot" /> Location
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g., Colombo, Kandy, Remote"
                  autoComplete="off"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="fas fa-briefcase" /> Role / Field
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g., Developer, Marketing, Design"
                  autoComplete="off"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="fas fa-calendar-alt" /> Duration
                </label>
                <select
                  style={styles.input}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Any duration</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div style={{ ...styles.formGrid, marginTop: "1.2rem" }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="fas fa-globe" /> Mode
                </label>
                <select
                  style={styles.input}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="">All modes</option>
                  <option value="Online/Remote">🌐 Online / Remote</option>
                  <option value="Physical/On-site">🏢 Physical / On-site</option>
                  <option value="Hybrid">🔄 Hybrid</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="fas fa-clock" /> Time preference
                </label>
                <select
                  style={styles.input}
                  value={timePreference}
                  onChange={(e) => setTimePreference(e.target.value)}
                >
                  <option value="">Any time</option>
                  <option value="Day">☀️ Day shifts</option>
                  <option value="Night">🌙 Night shifts</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <button type="submit" style={styles.button}>
                  <i
                    className={
                      isSubmitting
                        ? "fas fa-spinner fa-pulse"
                        : "fas fa-magnifying-glass"
                    }
                  />
                  {isSubmitting ? "Matching..." : "Search internships"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div style={styles.infoSection}>
          {infoCards.map((card) => (
            <div key={card.title} style={styles.infoCard}>
              <i
                className={card.icon}
                style={{ fontSize: "1.8rem", color: "#22D3EE", marginBottom: "0.5rem" }}
              />
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                  color: "#F8FAFC",
                }}
              >
                {card.title}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{card.text}</p>
            </div>
          ))}
        </div>

        <div style={styles.featuresSection}>
          <div style={styles.sectionPill}>What You Get</div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
              color: "#F8FAFC",
            }}
          >
            Why Students Choose SkillSync
          </h2>
          <p style={{ color: "#94A3B8", maxWidth: "500px", marginBottom: "1rem" }}>
            Stop scrolling, start matching — intelligent filtering saves hours.
          </p>

          <div style={styles.featuresGrid}>
            {featureCards.map((feature) => (
              <div key={feature.title} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <i className={feature.icon} />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "0.4rem",
                    color: "#F8FAFC",
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#94A3B8",
                    lineHeight: 1.5,
                  }}
                >
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer style={styles.footer}>
          <i className="fas fa-sync-alt" style={{ color: "#22D3EE" }} /> Skill
          Sync Internships — bridging Sri Lankan talent with intelligent matching
        </footer>
        </div>

        <div style={styles.toast}>
          <i className="fas fa-check-circle" />
          <span>{toast.message}</span>
        </div>
      </main>
    </div>
  );
}