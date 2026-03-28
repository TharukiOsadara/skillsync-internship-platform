import StudentSidebar from "../../Components/StudentSidebar";
import StudentWelcomeBack from "../../Components/StudentWelcomeBack";

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

export default function StudentNotifications() {
	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans',sans-serif" }}>
			<StudentSidebar />
			<main style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>
<div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px", marginBottom:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <PageIcon>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </PageIcon>
          <div>
            <h1 style={{ color:"#F1F5F9", fontSize:"26px", fontWeight:800, margin:0 }}>Notifications</h1>
            <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Important updates and activity alerts</p>
          </div>
        </div>
        <StudentWelcomeBack/>
      </div>

				<div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"24px", display:"flex", alignItems:"center", gap:"12px" }}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
					</svg>
					<p style={{ color:"#94A3B8", fontSize:"13px", margin:0 }}>
						Your professional notification feed will be shown here.
					</p>
				</div>
			</main>
		</div>
	);
}

