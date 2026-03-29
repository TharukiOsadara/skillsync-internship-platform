import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import { authHeaders, getUser } from "../../Utils/auth";

export default function StudentApplyInternship() {
  const navigate = useNavigate();
  const location = useLocation();
  const { internshipId } = useParams();
  const user = getUser();

  const [internship, setInternship] = useState(location.state?.internship || null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "Student") navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (internship || !internshipId) return;
      try {
        const res = await fetch("http://localhost:5000/internships");
        const data = await res.json();
        const item = (data.internships || []).find((i) => i._id === internshipId);
        if (!item) {
          setError("Internship not found.");
          return;
        }
        setInternship(item);
      } catch {
        setError("Failed to load internship details.");
      }
    };
    load();
  }, [internship, internshipId]);

  const expired = useMemo(() => {
    if (!internship?.deadline) return false;
    return new Date(internship.deadline) < new Date();
  }, [internship]);

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!internship?._id) return;

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/internships/${internship._id}/apply`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Unable to submit application.");
        return;
      }
      setSuccess("Application submitted successfully. Admin has been notified.");
      setTimeout(() => navigate("/student/matches"), 1200);
    } catch {
      setError("Server error while submitting application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: "26px", fontWeight: 800, margin: 0 }}>Apply Internship</h1>
            <p style={{ color: "#64748B", fontSize: "13px", margin: "3px 0 0" }}>Submit your application for this role</p>
          </div>
        </div>

        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px", maxWidth: "760px" }}>
          {internship ? (
            <>
              <h2 style={{ margin: 0, color: "#F1F5F9", fontSize: "18px" }}>{internship.title}</h2>
              <p style={{ margin: "6px 0 14px", color: "#94A3B8", fontSize: "12px" }}>
                {internship.company} · {internship.location}
              </p>
              {expired && (
                <div style={{ marginBottom: "12px", color: "#F87171", fontSize: "12px" }}>
                  This internship is expired. Application is disabled.
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "#94A3B8", margin: 0 }}>Loading internship...</p>
          )}

          <form onSubmit={submitApplication}>
            <label style={{ display: "block", fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>Message to recruiter (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="Write a short message about why you are interested..."
              style={{ width: "100%", background: "#111827", border: "1px solid #334155", color: "#F1F5F9", borderRadius: "10px", padding: "10px 12px", resize: "vertical", outline: "none", fontFamily: "inherit", fontSize: "12px" }}
            />

            {error && <p style={{ color: "#F87171", fontSize: "12px", marginTop: "10px" }}>{error}</p>}
            {success && <p style={{ color: "#4ADE80", fontSize: "12px", marginTop: "10px" }}>{success}</p>}

            <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => navigate(-1)} style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontWeight: 700, fontSize: "12px", borderRadius: "8px", padding: "9px 16px", cursor: "pointer" }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || expired || !internship}
                style={{ background: "linear-gradient(135deg,#22D3EE,#06B6D4)", border: "none", color: "#041421", fontWeight: 800, fontSize: "12px", borderRadius: "8px", padding: "9px 16px", cursor: "pointer", opacity: loading || expired || !internship ? 0.6 : 1 }}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
