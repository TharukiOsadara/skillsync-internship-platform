import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedInternships() {
  const navigate = useNavigate();

  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedInternships") || "[]");
    const normalized = saved.map((id) => String(id));
    setSavedBookmarks(normalized);
  }, []);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:5000/internships");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch internships");
        }

        const normalizedInternships = (data.internships || []).map((internship) => ({
          ...internship,
          id: String(internship._id || internship.id),
          timePref: internship.timePreference || internship.timePref || ""
        }));

        setAllInternships(normalizedInternships);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError(err.message || "Failed to load saved internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  const isClosingSoon = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

  const savedInternships = useMemo(() => {
    return allInternships
      .filter((internship) => savedBookmarks.includes(String(internship.id)))
      .map((internship) => ({
        ...internship,
        closingSoon: isClosingSoon(internship.deadline)
      }));
  }, [savedBookmarks, allInternships]);

  const removeBookmark = (id) => {
    const updated = savedBookmarks.filter((item) => item !== String(id));
    setSavedBookmarks(updated);
    localStorage.setItem("bookmarkedInternships", JSON.stringify(updated));
    showToast("Removed from saved internships");
  };

  const clearAllBookmarks = () => {
    setSavedBookmarks([]);
    localStorage.setItem("bookmarkedInternships", JSON.stringify([]));
    showToast("All saved internships cleared");
  };

  const applyForInternship = (title, company) => {
    showToast(`Applied to ${title} at ${company}! Check your email for confirmation.`);
  };

  const viewDetails = (internship) => {
    navigate(`/student/internship-details?id=${internship.id}`);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
          color: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.1rem"
        }}
      >
        Loading saved internships...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
        color: "#F8FAFC",
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div style={{ maxWidth: "96rem", margin: "0 auto", padding: "2rem 2rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/student/internship-results")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#22D3EE",
              background: "rgba(34, 211, 238, 0.08)",
              border: "none",
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: "1.5rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "40px"
            }}
          >
            ← Back to Search
          </button>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF, #22D3EE)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <span style={{ color: "#F87171" }}>❤</span>
            <span>My Saved Internships</span>
          </h1>

          <div style={{ color: "#94A3B8", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Your curated collection of internship opportunities
          </div>
        </div>

        <div
          style={{
            background: "#0F172A",
            borderRadius: "20px",
            padding: "1rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            border: "1px solid #334155"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(248, 113, 113, 0.15)",
                padding: "0.4rem 1rem",
                borderRadius: "99px",
                fontWeight: 700,
                color: "#F87171",
                fontSize: "0.8rem",
                border: "1px solid rgba(248, 113, 113, 0.25)"
              }}
            >
              {savedInternships.length} saved
            </span>

            <span style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
              Your saved internship collection
            </span>
          </div>

          {savedInternships.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              style={{
                background: "rgba(248, 113, 113, 0.08)",
                border: "1px solid rgba(248, 113, 113, 0.25)",
                color: "#F87171",
                padding: "0.5rem 1.2rem",
                borderRadius: "40px",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem"
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {error ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "#0F172A",
              borderRadius: "20px",
              border: "1px solid #334155",
              color: "#F87171"
            }}
          >
            {error}
          </div>
        ) : savedInternships.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              background: "#0F172A",
              borderRadius: "20px",
              border: "1px solid #334155"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem", color: "#F87171" }}>♡</div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#F8FAFC" }}>
              No saved internships yet
            </h3>
            <p style={{ color: "#94A3B8", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Start exploring and save your favorite opportunities
            </p>
            <button
              onClick={() => navigate("/student/internship-results")}
              style={{
                background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                border: "none",
                padding: "0.7rem 1.8rem",
                borderRadius: "0.625rem",
                color: "#020617",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Browse Internships
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}
          >
            {savedInternships.map((internship) => {
              const isUrgent = internship.closingSoon;
              const daysRemaining = getDaysRemaining(internship.deadline);

              return (
                <div
                  key={internship.id}
                  style={{
                    background: "#0F172A",
                    borderRadius: "20px",
                    border: "1px solid #334155",
                    padding: "1.5rem",
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                      marginBottom: "1rem"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#F8FAFC",
                          marginBottom: "0.5rem"
                        }}
                      >
                        {internship.title}
                      </h3>

                      <div
                        style={{
                          color: "#22D3EE",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        🏢 {internship.company}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => viewDetails(internship)}
                        title="View Details"
                        style={{
                          background: "rgba(34, 211, 238, 0.08)",
                          color: "#22D3EE",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          borderRadius: "10px",
                          width: "34px",
                          height: "34px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem"
                        }}
                      >
                        👁
                      </button>

                      <button
                        onClick={() => removeBookmark(internship.id)}
                        title="Remove from Saved"
                        style={{
                          background: "rgba(248, 113, 113, 0.08)",
                          color: "#F87171",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          borderRadius: "10px",
                          width: "34px",
                          height: "34px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem"
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      margin: "1rem 0",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.6rem"
                    }}
                  >
                    {[
                      internship.location,
                      internship.duration,
                      internship.mode,
                      internship.timePref
                    ].map((item, index) => (
                      <span
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.7rem",
                          color: "#94A3B8",
                          background: "rgba(34, 211, 238, 0.08)",
                          padding: "0.25rem 0.8rem",
                          borderRadius: "99px",
                          border: "1px solid rgba(34, 211, 238, 0.15)"
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.8rem",
                      lineHeight: 1.55,
                      marginBottom: "1rem"
                    }}
                  >
                    {internship.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.7rem",
                      paddingTop: "0.8rem",
                      borderTop: "1px solid #334155",
                      marginTop: "0.5rem",
                      color: isUrgent ? "#F87171" : "#94A3B8",
                      fontWeight: isUrgent ? 600 : 400
                    }}
                  >
                    <span>
                      Deadline: {formatDate(internship.deadline)} ({daysRemaining})
                    </span>
                  </div>

                  <button
                    onClick={() => applyForInternship(internship.title, internship.company)}
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      padding: "0.7rem",
                      background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                      border: "none",
                      borderRadius: "0.625rem",
                      color: "#020617",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: toast.show
            ? "translateX(-50%) scale(1)"
            : "translateX(-50%) scale(0.9)",
          background: "#1E293B",
          border: "1px solid #22D3EE",
          borderRadius: "50px",
          padding: "0.8rem 1.8rem",
          color: "#22D3EE",
          fontWeight: 500,
          zIndex: 1000,
          opacity: toast.show ? 1 : 0,
          transition: "all 0.2s ease",
          pointerEvents: "none",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span>❤</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}