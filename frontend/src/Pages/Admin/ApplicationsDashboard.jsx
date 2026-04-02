import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { authHeaders, getLoggedInAt, getUser } from "../../Utils/auth";

const Ico = ({ stroke = "#22D3EE", size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const PageIcon = ({ children }) => (
  <div style={{ width: "44px", height: "44px", flexShrink: 0, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Ico size={20}>{children}</Ico>
  </div>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ background: "none", border: "none", color: "#64748B", fontSize: "20px", cursor: "pointer", padding: 0, flexShrink: 0, transition: "color .15s" }}
    onMouseEnter={e => (e.currentTarget.style.color = "#22D3EE")}
    onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}>←</button>
);

export default function ApplicationsDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedInAt = getLoggedInAt();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showRows, setShowRows] = useState(false);
  const [entered, setEntered] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());
  const [animatedCounts, setAnimatedCounts] = useState({ all: 1, unread: 1, read: 1 });

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/login");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/internships/applications", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setApplications(data.applications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    const pollTimer = setInterval(() => {
      fetchApplications();
    }, 15000);
    return () => clearInterval(pollTimer);
  }, []);

  const filteredApplications = useMemo(() => {
    const statusFiltered = applications.filter((a) => {
      if (statusFilter === "unread") return !a.isReadByAdmin;
      if (statusFilter === "read") return !!a.isReadByAdmin;
      return true;
    });

    const q = search.trim().toLowerCase();
    if (!q) return statusFiltered;

    return statusFiltered.filter((a) => (
      (a.studentName || "").toLowerCase().includes(q)
      || (a.studentEmail || "").toLowerCase().includes(q)
      || (a.internshipTitle || "").toLowerCase().includes(q)
      || (a.company || "").toLowerCase().includes(q)
    ));
  }, [applications, statusFilter, search]);

  useEffect(() => {
    if (loading) return;
    setShowRows(false);
    const timer = setTimeout(() => setShowRows(true), 60);
    return () => clearTimeout(timer);
  }, [loading, statusFilter, search, applications]);

  const allCount = applications.length;
  const readCount = Math.max(0, allCount - unreadCount);

  const stats = [
    {
      key: "all",
      label: "Total Applications",
      hint: "All submitted records",
      value: animatedCounts.all,
      color: "#67E8F9",
      border: "rgba(34,211,238,0.24)",
      activeBg: "rgba(34,211,238,0.1)",
      icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    },
    {
      key: "unread",
      label: "Unread Alerts",
      hint: "Needs admin review",
      value: animatedCounts.unread,
      color: "#F87171",
      border: "rgba(248,113,113,0.25)",
      activeBg: "rgba(248,113,113,0.12)",
      icon: <><circle cx="12" cy="12" r="8" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" /></>,
    },
    {
      key: "read",
      label: "Reviewed",
      hint: "Already checked",
      value: animatedCounts.read,
      color: "#4ADE80",
      border: "rgba(74,222,128,0.25)",
      activeBg: "rgba(74,222,128,0.12)",
      icon: <><polyline points="20 6 9 17 4 12" /></>,
    },
  ];

  useEffect(() => {
    if (loading) return;
    const targets = {
      all: Math.max(1, allCount),
      unread: Math.max(1, unreadCount),
      read: Math.max(1, readCount),
    };
    const start = Date.now();
    const duration = 460;

    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setAnimatedCounts({
        all: Math.round(1 + (targets.all - 1) * progress),
        unread: Math.round(1 + (targets.unread - 1) * progress),
        read: Math.round(1 + (targets.read - 1) * progress),
      });
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [loading, allCount, unreadCount, readCount]);

  const markAsRead = async (applicationId) => {
    try {
      const res = await fetch(`http://localhost:5000/internships/applications/${applicationId}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) return;

      setApplications((prev) => prev.map((a) => (
        a._id === applicationId ? { ...a, isReadByAdmin: true } : a
      )));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markVisibleAsRead = async () => {
    const ids = filteredApplications.filter((a) => !a.isReadByAdmin).map((a) => a._id);
    if (!ids.length) return;
    await Promise.all(ids.map((id) => markAsRead(id)));
  };

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto" style={{ minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px", ...revealStyle(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <BackBtn onClick={() => navigate(-1)} />
            <PageIcon>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </PageIcon>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>Applications</h1>
              <p style={{ color: "#64748B", fontSize: "13px", margin: "3px 0 0" }}>Student application notifications and review queue</p>
            </div>
          </div>
          <div style={{
            minWidth: "275px",
            borderRadius: "12px",
            padding: "10px 12px",
            border: "1px solid rgba(34,211,238,0.25)",
            background: "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(15,23,42,0.94))",
            boxShadow: "0 10px 24px rgba(34,211,238,0.12)",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateX(0)" : "translateX(24px)",
            transition: "opacity .38s ease 120ms, transform .45s cubic-bezier(0.22, 1, 0.36, 1) 120ms",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "34px", height: "34px", flexShrink: 0,
                borderRadius: "10px",
                background: "rgba(34,211,238,0.15)",
                border: "1px solid rgba(34,211,238,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Ico size={15} stroke="#22D3EE">
                  <path d="M22 12h-4l-3 8-4-16-3 8H2" />
                </Ico>
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ color: "#67E8F9", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>Welcome Back</p>
                <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 700, margin: "4px 0 0" }}>{user?.fullName}</p>
              </div>
            </div>
            {loggedInAt && (
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px" }}>
                <Ico size={12} stroke="#64748B">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </Ico>
                <span>Logged in at: {loggedInAt.toLocaleString()}</span>
              </div>
            )}
            <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px" }}>
              <Ico size={12} stroke="#22D3EE">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 8 12 12 15 12" />
              </Ico>
              <span>Live: {liveTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", marginBottom: "12px", ...revealStyle(70) }}>
          {stats.map((s, i) => (
            <div
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              style={{
                background: statusFilter === s.key ? s.activeBg : "#0F172A",
                border: `1px solid ${statusFilter === s.key ? s.color : s.border}`,
                borderRadius: "12px",
                padding: "12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(-12px)",
                boxShadow: statusFilter === s.key ? `0 10px 24px ${s.border}` : "none",
                transition: `opacity .45s ease ${120 + (i * 70)}ms, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${120 + (i * 70)}ms, box-shadow .2s, border-color .2s, background-color .2s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 10px 24px ${s.border}`;
                e.currentTarget.style.borderColor = s.color;
                e.currentTarget.style.backgroundColor = s.activeBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = statusFilter === s.key ? `0 10px 24px ${s.border}` : "none";
                e.currentTarget.style.borderColor = statusFilter === s.key ? s.color : s.border;
                e.currentTarget.style.backgroundColor = statusFilter === s.key ? s.activeBg : "#0F172A";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `${s.border}`, border: `1px solid ${s.color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ico size={14} stroke={s.color}>{s.icon}</Ico>
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: 0, color: s.color, fontSize: "11px", fontWeight: 700 }}>{s.label}</p>
                  <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "10px" }}>{s.hint}</p>
                </div>
              </div>
              <p style={{ margin: "6px 0 0", color: s.color, fontSize: "26px", fontWeight: 800, width: "100%", textAlign: "center" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#0F172A", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "14px", padding: "14px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap", overflowX: "auto", ...revealStyle(120) }}>
          <button
            onClick={markVisibleAsRead}
            style={{ background: "rgba(34,211,238,0.16)", border: "1px solid rgba(34,211,238,0.35)", color: "#67E8F9", fontSize: "12px", fontWeight: 800, borderRadius: "9px", padding: "8px 12px", cursor: "pointer", flexShrink: 0 }}
          >
            Mark visible as read
          </button>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", background: "#1E293B", border: "1px solid #334155", borderRadius: "9px", padding: "6px 10px", width: "320px", maxWidth: "100%" }}>
            <Ico size={12} stroke="#64748B"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ico>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, role, company..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#F1F5F9", fontSize: "11px", width: "100%", fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
        </div>

        <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "14px", overflow: "hidden", ...revealStyle(170) }}>
          {loading ? (
            <div style={{ color: "#94A3B8", fontSize: "13px", padding: "18px" }}>Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ color: "#64748B", fontSize: "13px", padding: "18px" }}>No applications found for this filter.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
                <thead>
                  <tr style={{ background: "#111827" }}>
                    <th style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 700, textAlign: "left", padding: "12px", borderBottom: "1px solid #1E293B" }}>Student</th>
                    <th style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 700, textAlign: "left", padding: "12px", borderBottom: "1px solid #1E293B" }}>Internship</th>
                    <th style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 700, textAlign: "left", padding: "12px", borderBottom: "1px solid #1E293B" }}>Applied At</th>
                    <th style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 700, textAlign: "left", padding: "12px", borderBottom: "1px solid #1E293B" }}>Status</th>
                    <th style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 700, textAlign: "right", padding: "12px", borderBottom: "1px solid #1E293B" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr
                      key={app._id}
                      style={{
                        borderBottom: "1px solid #1E293B",
                        opacity: showRows ? 1 : 0,
                        transform: showRows ? "translateX(0)" : "translateX(26px)",
                        transition: `opacity .35s ease ${index * 70}ms, transform .5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 70}ms`,
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        <p style={{ margin: 0, color: "#F1F5F9", fontSize: "12px", fontWeight: 700 }}>{app.studentName}</p>
                        <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "11px" }}>{app.studentEmail}</p>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <p style={{ margin: 0, color: "#67E8F9", fontSize: "12px", fontWeight: 700 }}>{app.internshipTitle}</p>
                        <p style={{ margin: "2px 0 0", color: "#94A3B8", fontSize: "11px" }}>{app.company}</p>
                        {app.note && <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "11px" }}>"{app.note}"</p>}
                      </td>
                      <td style={{ padding: "12px", color: "#CBD5E1", fontSize: "12px" }}>{new Date(app.createdAt).toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "4px 9px",
                          borderRadius: "999px",
                          border: `1px solid ${app.isReadByAdmin ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                          background: app.isReadByAdmin ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                          color: app.isReadByAdmin ? "#4ADE80" : "#FCA5A5",
                        }}>
                          {app.isReadByAdmin ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {!app.isReadByAdmin ? (
                          <button
                            onClick={() => markAsRead(app._id)}
                            style={{ background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.4)", color: "#86EFAC", borderRadius: "8px", padding: "6px 10px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
                          >
                            Mark read
                          </button>
                        ) : (
                          <span style={{ color: "#64748B", fontSize: "11px" }}>Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}