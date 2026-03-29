import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function StudentInternshipResults() {
  const navigate = useNavigate();
  const locationObj = useLocation();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedBookmarks, setSavedBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarkedInternships") || "[]")
  );

  const [currentSort, setCurrentSort] = useState("newest");
  const [toast, setToast] = useState({ show: false, message: "" });

  const [filters, setFilters] = useState({
    location: "",
    role: "",
    duration: "",
    mode: "",
    timePref: "",
  });

  // Read filters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(locationObj.search);
    setFilters({
      location: urlParams.get("location") || "",
      role: urlParams.get("role") || "",
      duration: urlParams.get("duration") || "",
      mode: urlParams.get("mode") || "",
      timePref: urlParams.get("timePreference") || urlParams.get("time") || "",
    });
  }, [locationObj.search]);

  // Fetch internships from backend
  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (filters.location) params.append("location", filters.location);
        if (filters.duration) params.append("duration", filters.duration);

        // your backend search uses "keyword"
        if (filters.role) params.append("keyword", filters.role);

        const res = await fetch(
          `http://localhost:5000/internships/search?${params.toString()}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch internships");
        }

        setInternships(data.internships || []);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError(err.message || "Failed to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [filters.location, filters.duration, filters.role]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
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
      day: "numeric",
    });

  const filteredAndSorted = useMemo(() => {
    let filtered = [...internships];

    // frontend fallback filtering for fields not yet supported in backend
    if (filters.mode) {
      filtered = filtered.filter((i) => i.mode === filters.mode);
    }

    if (filters.timePref) {
      filtered = filtered.filter(
        (i) =>
          i.timePreference === filters.timePref ||
          i.timePref === filters.timePref
      );
    }

    filtered = filtered.map((i) => ({
      ...i,
      id: i._id || i.id,
      closingSoon: isClosingSoon(i.deadline),
      timePref: i.timePreference || i.timePref || "",
    }));

    switch (currentSort) {
      case "newest":
        return filtered.sort(
          (a, b) => new Date(b.createdAt || b.posted || 0) - new Date(a.createdAt || a.posted || 0)
        );

      case "closing":
        return filtered.sort((a, b) => {
          if (a.closingSoon && !b.closingSoon) return -1;
          if (!a.closingSoon && b.closingSoon) return 1;
          return new Date(a.deadline) - new Date(b.deadline);
        });

      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));

      default:
        return filtered;
    }
  }, [internships, filters.mode, filters.timePref, currentSort]);

  const searchSummary = useMemo(() => {
    const summary = [];
    if (filters.location) summary.push(`📍 ${filters.location}`);
    if (filters.role) summary.push(`💼 ${filters.role}`);
    if (filters.duration) summary.push(`📅 ${filters.duration}`);
    if (filters.mode) summary.push(`🖥️ ${filters.mode}`);
    if (filters.timePref) summary.push(`⏰ ${filters.timePref}`);

    return summary.length > 0
      ? `Showing results for: ${summary.join(" · ")}`
      : "Showing all available internships";
  }, [filters]);

  const toggleBookmark = (id) => {
    let updated;

    if (savedBookmarks.includes(id)) {
      updated = savedBookmarks.filter((item) => item !== id);
      showToast("Removed from bookmarks");
    } else {
      updated = [...savedBookmarks, id];
      showToast("Added to bookmarks!");
    }

    setSavedBookmarks(updated);
    localStorage.setItem("bookmarkedInternships", JSON.stringify(updated));
  };

  const applyForInternship = (title, company) => {
    showToast(`Applied to ${title} at ${company}! Check your email for confirmation.`);
  };

  const viewInternshipDetails = (internship) => {
  navigate(`/student/internship-details?id=${internship.id}`);
};

  const resetFilters = () => {
    setFilters({
      location: "",
      role: "",
      duration: "",
      mode: "",
      timePref: "",
    });
    navigate("/student/internship-results");
    showToast("Filters reset! Showing all internships");
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
          fontSize: "1.1rem",
        }}
      >
        Loading internships...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
        color: "#F8FAFC",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: "96rem", margin: "0 auto", padding: "2rem 2rem 3rem" }}>
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              onClick={() => navigate("/student/internship-search")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#22D3EE",
                textDecoration: "none",
                fontWeight: 600,
                marginBottom: "1.5rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              <i className="fas fa-arrow-left" /> Back to Search
            </span>

            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #FFFFFF, #22D3EE)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Internship Opportunities
            </h1>

            <div style={{ color: "#94A3B8", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              {searchSummary}
            </div>
          </div>

          <button
            onClick={() => navigate("/student/saved-internships")}
            style={{
              background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
              color: "#020617",
              border: "none",
              borderRadius: "14px",
              padding: "0.8rem 1.2rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 10px 25px rgba(34, 211, 238, 0.18)",
            }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>❤</span>
            Saved Internships
          </button>
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
            border: "1px solid #334155",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              style={{
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <i className="fas fa-sort" /> Sort by:
            </label>

            <select
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              style={{
                background: "#020617",
                border: "1px solid #334155",
                color: "#F8FAFC",
                padding: "0.6rem 1rem",
                borderRadius: "14px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="closing">Closing Soon</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: 500 }}>
            {filteredAndSorted.length} internship{filteredAndSorted.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {error ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "#0F172A",
              borderRadius: "20px",
              border: "1px solid #334155",
              color: "#F87171",
            }}
          >
            {error}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              background: "#0F172A",
              borderRadius: "20px",
              border: "1px solid #334155",
            }}
          >
            <i
              className="fas fa-search"
              style={{ fontSize: "4rem", color: "#94A3B8", marginBottom: "1rem" }}
            />
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
              No internships found
            </h3>
            <p style={{ color: "#94A3B8", marginTop: "0.5rem" }}>
              Try adjusting your search filters
            </p>
            <button
              onClick={resetFilters}
              style={{
                marginTop: "1rem",
                background: "#22D3EE",
                border: "none",
                padding: "0.6rem 1.5rem",
                borderRadius: "0.625rem",
                color: "#020617",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {filteredAndSorted.map((internship) => {
              const isBookmarked = savedBookmarks.includes(internship.id);
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
                    position: "relative",
                  }}
                >
                  {internship.closingSoon && (
                    <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #F87171, #DC2626)",
                          color: "white",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "99px",
                        }}
                      >
                        <i className="fas fa-hourglass-half" /> Closing Soon
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ marginBottom: "1rem", paddingRight: "0.5rem", flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "#F8FAFC",
                          marginBottom: "0.5rem",
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
                          gap: "6px",
                        }}
                      >
                        <i className="fas fa-building" /> {internship.company}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(internship.id)}
                      title={isBookmarked ? "Remove from saved" : "Save internship"}
                      style={{
                        background: isBookmarked
                          ? "rgba(248, 113, 113, 0.15)"
                          : "rgba(100, 116, 139, 0.12)",
                        border: isBookmarked
                          ? "1px solid rgba(248, 113, 113, 0.35)"
                          : "1px solid #334155",
                        cursor: "pointer",
                        padding: "0.3rem",
                        borderRadius: "50%",
                        width: "42px",
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: isBookmarked ? "#F87171" : "#94A3B8",
                          fontSize: "1.3rem",
                          lineHeight: 1,
                        }}
                      >
                        {isBookmarked ? "♥" : "♡"}
                      </span>
                    </button>
                  </div>

                  <div
                    style={{
                      margin: "1rem 0",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.6rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                        background: "rgba(34, 211, 238, 0.08)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(34, 211, 238, 0.15)",
                      }}
                    >
                      <i className="fas fa-map-marker-alt" style={{ color: "#22D3EE" }} />{" "}
                      {internship.location}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                        background: "rgba(34, 211, 238, 0.08)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(34, 211, 238, 0.15)",
                      }}
                    >
                      <i className="fas fa-calendar-week" style={{ color: "#22D3EE" }} />{" "}
                      {internship.duration}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                        background: "rgba(34, 211, 238, 0.08)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(34, 211, 238, 0.15)",
                      }}
                    >
                      <i className="fas fa-globe" style={{ color: "#22D3EE" }} />{" "}
                      {internship.mode}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                        background: "rgba(34, 211, 238, 0.08)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "99px",
                        border: "1px solid rgba(34, 211, 238, 0.15)",
                      }}
                    >
                      <i className="fas fa-clock" style={{ color: "#22D3EE" }} />{" "}
                      {internship.timePref}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.8rem",
                      lineHeight: 1.55,
                      marginBottom: "1rem",
                    }}
                  >
                    {internship.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.7rem",
                      paddingTop: "0.8rem",
                      borderTop: "1px solid #334155",
                      marginTop: "0.5rem",
                      color: isUrgent ? "#F87171" : "#94A3B8",
                      fontWeight: isUrgent ? 600 : 400,
                    }}
                  >
                    <i className="fas fa-hourglass-end" style={{ color: "#FBBF24" }} />
                    <span>
                      Application deadline: {formatDate(internship.deadline)} ({daysRemaining})
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      onClick={() => viewInternshipDetails(internship)}
                      style={{
                        padding: "0.7rem",
                        background: "transparent",
                        border: "1px solid #22D3EE",
                        borderRadius: "0.625rem",
                        color: "#22D3EE",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <i className="fas fa-eye" /> View Details
                    </button>

                    <button
                      onClick={() => applyForInternship(internship.title, internship.company)}
                      style={{
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
                        gap: "8px",
                      }}
                    >
                      <i className="fas fa-paper-plane" /> Apply Now
                    </button>
                  </div>
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
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>❤</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}