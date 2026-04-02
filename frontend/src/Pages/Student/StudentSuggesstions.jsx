
import StudentSidebar from "../../Components/StudentSidebar";
import StudentWelcomeBack from "../../Components/StudentWelcomeBack";


const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

export default function StudentSuggestions() {
	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans',sans-serif" }}>
			<StudentSidebar />
			<main style={{ flex: 1, padding: "32px", minWidth: 0, overflowY: "auto" }}>

<div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px", marginBottom:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <PageIcon>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </PageIcon>
          <div>
            <h1 style={{ color:"#F1F5F9", fontSize:"26px", fontWeight:800, margin:0 }}>Suggestions</h1>
            <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Personalized recommendations appear here</p>
          </div>
        </div>    
        <StudentWelcomeBack/>
      </div>


				<div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"24px", display:"flex", alignItems:"center", gap:"12px" }}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><circle cx="12" cy="12" r="4"/>
					</svg>
					<p style={{ color:"#94A3B8", fontSize:"13px", margin:0 }}>
						Skill-based suggestion cards will be displayed in this section.
					</p>
				</div>
			</main>
		</div>
	);
}
