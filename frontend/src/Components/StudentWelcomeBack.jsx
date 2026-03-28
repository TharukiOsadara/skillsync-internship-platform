import { useEffect, useState } from "react";
import { getUser, getLoggedInAt } from "../Utils/auth";

export default function StudentWelcomeBack() {
  const user = getUser();
  const loggedInAt = getLoggedInAt();
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minWidth: "280px",
      borderRadius: "12px",
      padding: "10px 12px",
      border: "1px solid rgba(34,211,238,0.25)",
      background: "linear-gradient(135deg, rgba(34,211,238,0.14), rgba(15,23,42,0.94))",
      boxShadow: "0 10px 24px rgba(34,211,238,0.12)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "34px", height: "34px", flexShrink: 0,
          borderRadius: "10px",
          background: "rgba(34,211,238,0.15)",
          border: "1px solid rgba(34,211,238,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 8-4-16-3 8H2" />
          </svg>
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <p style={{ color: "#67E8F9", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", margin: 0, textTransform: "uppercase" }}>Welcome Back</p>
          <p style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: 700, margin: "4px 0 0" }}>{user?.fullName || "Student"}</p>
        </div>
      </div>
      {loggedInAt && (
        <div style={{marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px"}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <polyline points="12 7 12 12 15 14"/>
          </svg>
          <span>Logged in at: {loggedInAt.toLocaleString()}</span>
        </div>
      )}
      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "11px" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 8 12 12 15 12"/>
        </svg>
        <span>Live: {liveTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
