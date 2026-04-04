import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";

export default function StudentInternshipDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentInternshipId = searchParams.get("id");

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedBookmarks, setSavedBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarkedInternships") || "[]").map((id) =>
      String(id)
    )
  );

  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:5000/internships");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch internship");
        }

        const found = (data.internships || []).find(
          (i) => String(i._id) === String(currentInternshipId)
        );

        if (!found) {
          throw new Error("Internship not found");
        }

        setInternship({
          ...found,
          id: String(found._id),
          timePreference: found.timePreference || "",
          applicants: "100+ applied",
        });
      } catch (err) {
        console.error("Error fetching internship:", err);
        setError(err.message || "Failed to load internship");
      } finally {
        setLoading(false);
      }
    };

    if (currentInternshipId) {
      fetchInternship();
    } else {
      setLoading(false);
      setError("Invalid internship id");
    }
  }, [currentInternshipId]);

  const isBookmarked = savedBookmarks.includes(String(currentInternshipId));

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 2500);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    return `${diffDays} days left`;
  };

  const formatDateLong = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const toggleBookmark = () => {
    let updated;

    if (isBookmarked) {
      updated = savedBookmarks.filter((id) => id !== String(currentInternshipId));
      showToast("Removed from saved internships");
    } else {
      updated = [...savedBookmarks, String(currentInternshipId)];
      showToast("Added to saved internships! View all in your bookmarks.");
    }

    setSavedBookmarks(updated);
    localStorage.setItem("bookmarkedInternships", JSON.stringify(updated));
  };

  const applyForInternship = () => {
    if (!internship) return;
    showToast(
      `Successfully applied to ${internship.title} at ${internship.company}! You'll receive a confirmation email soon.`
    );
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
      color: "#F8FAFC",
      fontFamily: "'DM Sans', sans-serif",
    },
    container: {
      maxWidth: "96rem",
      margin: "0 auto",
      padding: "2rem 2rem 3rem",
    },
    navBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #334155",
      flexWrap: "wrap",
      gap: "1rem",
    },
    backLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      color: "#22D3EE",
      textDecoration: "none",
      fontWeight: 600,
      cursor: "pointer",
      background: "rgba(34, 211, 238, 0.08)",
      padding: "0.6rem 1.2rem",
      borderRadius: "40px",
      fontSize: "0.85rem",
      border: "none",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    logoSpan: {
      background: "linear-gradient(135deg, #F8FAFC, #CBD5E1)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    card: {
      background: "#0F172A",
      borderRadius: "28px",
      border: "1px solid #334155",
      overflow: "hidden",
      marginBottom: "2rem",
    },
    header: {
      background:
        "linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(6, 182, 212, 0.02))",
      padding: "2rem",
      borderBottom: "1px solid #334155",
      position: "relative",
    },
    content: {
      padding: "2rem",
    },
    quickInfo: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "0.8rem",
      marginTop: "1.5rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #334155",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#020617",
      padding: "0.7rem 1rem",
      borderRadius: "14px",
      border: "1px solid #334155",
    },
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#22D3EE",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderLeft: "3px solid #22D3EE",
      paddingLeft: "1rem",
    },
    actionButtons: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      marginTop: "2rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #334155",
    },
    btnPrimary: {
      background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
      border: "none",
      padding: "0.9rem 2rem",
      borderRadius: "0.625rem",
      fontWeight: 800,
      fontSize: "0.9rem",
      color: "#020617",
      cursor: "pointer",
      flex: 1,
      fontFamily: "'DM Sans', sans-serif",
    },
    btnSecondary: {
      background: isBookmarked
        ? "rgba(248, 113, 113, 0.15)"
        : "rgba(34, 211, 238, 0.08)",
      border: `1px solid ${isBookmarked ? "#F87171" : "#334155"}`,
      padding: "0.9rem 2rem",
      borderRadius: "0.625rem",
      fontWeight: 700,
      fontSize: "0.9rem",
      color: isBookmarked ? "#F87171" : "#22D3EE",
      cursor: "pointer",
      flex: 1,
      fontFamily: "'DM Sans', sans-serif",
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
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
  };

  if (loading) {
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
            <StudentSidebar />
            <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
          color: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.1rem",
        }}
      >
        Loading internship details...
      </div>
      </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
            <StudentSidebar />
            <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
          color: "#F87171",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {error}
      </div>
      </main>
      </div>
    );
  }

  if (!internship) return null;

  const daysRemaining = getDaysRemaining(internship.deadline);
  const isUrgent = daysRemaining !== "Expired" && daysRemaining !== "Today";

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
          <StudentSidebar />
          <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.navBar}>
          <button
            style={styles.backLink}
            onClick={() => navigate("/student/internship-results")}
          >
            <i className="fas fa-arrow-left" /> Back to Results
          </button>

          <div style={styles.logo}>
            skill<span style={styles.logoSpan}>sync</span> internships
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <div
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "2rem",
                background: "linear-gradient(135deg, #F87171, #DC2626)",
                color: "white",
                padding: "0.4rem 1rem",
                borderRadius: "99px",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              <i className="fas fa-hourglass-half" /> Closing Soon
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              {internship.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "1rem", color: "#22D3EE", fontWeight: 600 }}>
                <i className="fas fa-building" /> {internship.company}
              </span>

              <span
                style={{
                  background: "rgba(251, 191, 36, 0.12)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "99px",
                  fontSize: "0.7rem",
                  color: "#FBBF24",
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-star" /> 4.8 ★ (245 reviews)
              </span>

              <span
                style={{
                  background: "rgba(74, 222, 128, 0.12)",
                  color: "#4ADE80",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "99px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-certificate" /> Top Employer 2025
              </span>
            </div>

            <div style={styles.quickInfo}>
              {[
                ["fas fa-map-marker-alt", "Location", internship.location],
                ["fas fa-calendar-week", "Duration", internship.duration],
                ["fas fa-globe", "Work Mode", internship.mode],
                ["fas fa-clock", "Time Preference", internship.timePreference],
                ["fas fa-users", "Applicants", internship.applicants],
              ].map(([icon, label, value]) => (
                <div key={label} style={styles.infoItem}>
                  <i
                    className={icon}
                    style={{ fontSize: "1.1rem", color: "#22D3EE", width: 28 }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "#94A3B8",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#F8FAFC",
                        fontSize: "0.85rem",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.content}>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-info-circle" /> About the Internship
              </h3>
              <p style={{ color: "#94A3B8", lineHeight: 1.65, fontSize: "0.9rem" }}>
                {internship.description ||
                  "This internship provides students with an opportunity to gain real-world industry exposure, improve technical and professional skills, and work alongside experienced mentors."}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-code" /> Technical Skills We're Looking For
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                {(internship.skillsRequired
                  ? internship.skillsRequired.split(",").map((s) => s.trim())
                  : ["Communication", "Problem Solving", "Teamwork"]
                ).map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "rgba(34, 211, 238, 0.08)",
                      padding: "0.4rem 1rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      color: "#22D3EE",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(248, 113, 113, 0.08)",
                border: "1px solid rgba(248, 113, 113, 0.25)",
                borderRadius: "14px",
                padding: "1rem 1.2rem",
                margin: "1.5rem 0",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <i
                className="fas fa-calendar-alt"
                style={{ fontSize: "1.3rem", color: "#F87171" }}
              />
              <div
                style={{
                  flex: 1,
                  fontWeight: 500,
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                }}
              >
                <strong>Application Deadline:</strong>{" "}
                <span
                  style={{
                    fontWeight: 800,
                    color: "#F87171",
                    fontSize: "0.95rem",
                  }}
                >
                  {formatDateLong(internship.deadline)}
                </span>
                <span style={{ marginLeft: "0.5rem" }}>({daysRemaining})</span>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button style={styles.btnPrimary} onClick={applyForInternship}>
                <i className="fas fa-paper-plane" /> Apply Now
              </button>

              <button style={styles.btnSecondary} onClick={toggleBookmark}>
                <i className={isBookmarked ? "fas fa-heart" : "far fa-heart"} />{" "}
                {isBookmarked ? "Saved Internship" : "Save Internship"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.toast}>
        <i className="fas fa-heart" />
        <span>{toast.message}</span>
      </div>
    </div>
    </main>
    </div>
  );
}