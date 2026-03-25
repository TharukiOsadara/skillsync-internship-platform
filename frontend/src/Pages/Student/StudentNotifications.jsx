import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import { getUser, authHeaders } from "../../Utils/auth";

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

// Generate notifications from internship data
function buildNotifications(internships, userSkills) {
  const now     = new Date();
  const notifs  = [];
  const skills  = (userSkills || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

  internships.forEach(item => {
    const deadline    = new Date(item.deadline);
    const daysLeft    = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    const required    = (item.skillsRequired || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const matchCount  = required.filter(r => skills.some(us => us.includes(r) || r.includes(us))).length;
    const matchPct    = required.length > 0 ? Math.round((matchCount / required.length) * 100) : 0;
    const isExpired   = deadline < now;

    // New high match
    if (matchPct >= 75 && !isExpired) {
      notifs.push({
        id:    `match-${item._id}`,
        type:  "match",
        title: `High match — ${item.title}`,
        body:  `${matchPct}% match at ${item.company}. Deadline: ${deadline.toLocaleDateString("en-GB")}`,
        time:  "Just now",
        read:  false,
        color: "#22D3EE",
        bg:    "rgba(34,211,238,0.06)",
        border:"rgba(34,211,238,0.15)",
      });
    }

    // Deadline soon (within 7 days)
    if (!isExpired && daysLeft <= 7 && daysLeft > 0 && matchPct > 0) {
      notifs.push({
        id:    `deadline-${item._id}`,
        type:  "deadline",
        title: `Deadline soon — ${item.title}`,
        body:  `Application closes in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} at ${item.company}.`,
        time:  `${daysLeft}d left`,
        read:  false,
        color: "#F87171",
        bg:    "rgba(248,113,113,0.06)",
        border:"rgba(248,113,113,0.15)",
      });
    }

    // Expired match
    if (isExpired && matchPct > 0) {
      notifs.push({
        id:    `expired-${item._id}`,
        type:  "expired",
        title: `Listing expired — ${item.title}`,
        body:  `${item.company} internship deadline has passed.`,
        time:  "Expired",
        read:  true,
        color: "#64748B",
        bg:    "transparent",
        border:"#1E293B",
      });
    }
  });

  return notifs.sort((a, b) => (a.read ? 1 : -1));
}

export default function Notifications() {
  const navigate = useNavigate();
  const user     = getUser();
  const [notifs,   setNotifs]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("http://localhost:5000/internships");
        const data = await res.json();
        setNotifs(buildNotifications(data.internships || [], user?.skills));
      } catch { setNotifs([]); }
      setLoading(false);
    };
    load();
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = notifs.filter(n => {
    if (filter === "Unread") return !n.read;
    if (filter === "Match")    return n.type === "match";
    if (filter === "Deadline") return n.type === "deadline";
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  const typeIcon = {
    match:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>,
    deadline: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    expired:  <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <PageIcon>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize:"26px", fontWeight:800, color:"#F1F5F9", margin:0 }}>
                Notifications
                {unreadCount > 0 && (
                  <span style={{ marginLeft:"10px", fontSize:"12px", fontWeight:800, background:"rgba(248,113,113,0.15)", border:"1px solid rgba(248,113,113,0.3)", color:"#F87171", padding:"2px 9px", borderRadius:"99px", verticalAlign:"middle" }}>
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Alerts, deadlines and match updates</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)", color:"#22D3EE", fontSize:"12px", fontWeight:700, padding:"7px 16px", borderRadius:"99px", cursor:"pointer" }}>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
          {["All","Unread","Match","Deadline"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"5px 14px", borderRadius:"99px", fontSize:"11px", fontWeight:700, cursor:"pointer",
              background: filter===f?"rgba(34,211,238,0.1)":"#1E293B",
              border: filter===f?"1px solid #22D3EE":"1px solid #334155",
              color: filter===f?"#22D3EE":"#94A3B8",
              transition:"all .15s",
            }}>{f}{f==="Unread"&&unreadCount>0?` (${unreadCount})`:""}</button>
          ))}
        </div>

        {/* Notification list */}
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"200px" }}>
            <p style={{ color:"#64748B", fontSize:"13px" }}>Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"56px", textAlign:"center" }}>
            <p style={{ fontSize:"42px", marginBottom:"12px" }}>🔔</p>
            <p style={{ color:"#F1F5F9", fontWeight:700, fontSize:"15px", marginBottom:"8px" }}>No notifications</p>
            <p style={{ color:"#64748B", fontSize:"13px" }}>You're all caught up! Update your skills to get new match alerts.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {filtered.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                background: n.read ? "#0F172A" : n.bg,
                border: n.read ? "1px solid #1E293B" : `1px solid ${n.border}`,
                borderRadius:"12px", padding:"14px 18px",
                display:"flex", alignItems:"flex-start", gap:"14px",
                cursor:"pointer", transition:"all .15s",
                opacity: n.read ? 0.7 : 1,
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = n.read ? "0.7" : "1")}
              >
                {/* Icon */}
                <div style={{ width:"36px", height:"36px", borderRadius:"10px", flexShrink:0, background: n.read?"rgba(255,255,255,0.04)":`rgba(${n.color==="#22D3EE"?"34,211,238":n.color==="#F87171"?"248,113,113":"100,116,139"},0.12)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={n.read?"#64748B":n.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {typeIcon[n.type]}
                  </svg>
                </div>
                {/* Content */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", flexWrap:"wrap" }}>
                    <p style={{ fontSize:"13px", fontWeight: n.read?600:700, color: n.read?"#94A3B8":"#F1F5F9", margin:0 }}>{n.title}</p>
                    <span style={{ fontSize:"10px", color:"#475569", flexShrink:0 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize:"11px", color:"#64748B", margin:"4px 0 0", lineHeight:"1.5" }}>{n.body}</p>
                </div>
                {/* Unread dot */}
                {!n.read && (
                  <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:n.color, flexShrink:0, marginTop:"4px" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}