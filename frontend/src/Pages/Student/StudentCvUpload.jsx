import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import StudentWelcomeBack from "../../Components/StudentWelcomeBack";
import { getUser, authHeaders, saveAuth, getToken, getLoggedInAt } from "../../Utils/auth";

const Ico = ({ size = 14, stroke = "currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

// ── Dummy skill extractor (replace with real CV parser when teammate delivers) ─
function extractSkillsFromText(text) {
  const known = [
    "react","node.js","mongodb","express","javascript","python","java","flutter",
    "docker","kubernetes","aws","django","mysql","typescript","redux","firebase",
    "html","css","figma","git","machine learning","ml","rest api","spring boot",
    "react native","angular","vue","php","laravel","android","ios","swift","kotlin",
  ];
  const lower = text.toLowerCase();
  return known.filter(skill => lower.includes(skill)).map(s =>
    s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  );
}

export default function CVUpload() {
  const navigate   = useNavigate();
  const user       = getUser();
  const loggedInAt = getLoggedInAt();
  const fileRef    = useRef(null);

  const [file, setFile]               = useState(null);
  const [extractedSkills, setExtracted] = useState([]);
  const [parsing, setParsing]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [dragOver, setDragOver]       = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"].includes(f.type)) {
      return setError("Please upload a PDF, Word, or text file.");
    }
    setFile(f); setError(""); setSuccess(""); setExtracted([]);
    setParsing(true);

    // ── Read file text for dummy extraction ──────────────────────────────────
    // TODO (teammate): Replace this section with real CV parsing API call
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const text = e.target?.result || "";
        const skills = extractSkillsFromText(String(text));
        setExtracted(skills.length > 0 ? skills : ["React", "JavaScript", "Node.js"]); // fallback demo
        setParsing(false);
      }, 1200); // simulate processing delay
    };
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSaveSkills = async () => {
    if (extractedSkills.length === 0) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ skills: extractedSkills.join(", ") }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to save skills.");
      saveAuth(getToken(), { ...user, skills: extractedSkills.join(", ") });
      setSuccess("Skills saved! Your match results are now updated.");
      setTimeout(() => navigate("/student/suggestions"), 1500);
    } catch { setError("Server error. Please try again."); }
    finally { setSaving(false); }
  };

  const removeSkill = (s) => setExtracted(prev => prev.filter(x => x !== s));

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px", marginBottom:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <PageIcon>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize:"26px", fontWeight:800, color:"#F1F5F9", margin:0 }}>CV Upload</h1>
              <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Upload your CV to extract skills and find matching internships</p>
            </div>
          </div>

          {/* Welcome Back message for student */}
          <StudentWelcomeBack />
        </div>

        {/* How it works */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"28px" }}>
          {[
            { step:"01", title:"Upload CV", desc:"Upload your CV as PDF, Word, or text file", color:"#22D3EE", icon:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></> },
            { step:"02", title:"Extract Skills", desc:"System reads your CV and identifies your technical skills", color:"#A78BFA", icon:<><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M1 12h4M19 12h4"/></> },
            { step:"03", title:"Get Matches", desc:"Matched internships appear on your My Matches page", color:"#4ADE80", icon:<><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> },
          ].map(s => (
            <div key={s.step} style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"18px", display:"flex", alignItems:"flex-start", gap:"14px" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"10px", flexShrink:0, background:`rgba(${s.color==="#22D3EE"?"34,211,238":s.color==="#A78BFA"?"167,139,250":"74,222,128"},0.1)`, border:`1px solid rgba(${s.color==="#22D3EE"?"34,211,238":s.color==="#A78BFA"?"167,139,250":"74,222,128"},0.2)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </div>
              <div>
                <div style={{ fontSize:"8px", fontWeight:700, color:s.color, letterSpacing:".3em", marginBottom:"4px" }}>STEP {s.step}</div>
                <div style={{ fontSize:"13px", fontWeight:700, color:"#F1F5F9" }}>{s.title}</div>
                <div style={{ fontSize:"11px", color:"#64748B", marginTop:"3px" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
          {/* Upload zone */}
          <div>
            <h2 style={{ fontSize:"15px", fontWeight:700, color:"#F1F5F9", marginBottom:"12px" }}>Upload Your CV</h2>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                background: dragOver ? "rgba(34,211,238,0.08)" : "#0F172A",
                border: `2px dashed ${dragOver ? "#22D3EE" : "#1E293B"}`,
                borderRadius:"14px", padding:"40px 24px",
                textAlign:"center", cursor:"pointer",
                transition:"all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; }}
              onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = "#1E293B"; }}
            >
              <div style={{ width:"52px", height:"52px", background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p style={{ color:"#F1F5F9", fontWeight:700, fontSize:"14px", marginBottom:"6px" }}>
                {file ? file.name : "Drop your CV here"}
              </p>
              <p style={{ color:"#64748B", fontSize:"11px", marginBottom:"16px" }}>
                {file ? `${(file.size/1024).toFixed(1)} KB` : "or click to browse · PDF, Word, or TXT"}
              </p>
              <button style={{ background:"linear-gradient(135deg,#22D3EE,#06B6D4)", color:"#060D1A", fontSize:"12px", fontWeight:800, padding:"8px 24px", borderRadius:"99px", border:"none", cursor:"pointer" }}>
                {file ? "Change File" : "Browse File"}
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Teammate placeholder notice */}
            <div style={{ background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:"10px", padding:"12px 16px", marginTop:"14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, marginTop:"1px" }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ color:"#94A3B8", fontSize:"11px", lineHeight:"1.6", margin:0 }}>
                <span style={{ color:"#A78BFA", fontWeight:700 }}>CV Builder integration pending</span> — full skill extraction will be live once the CV Builder module (teammate's component) is connected. Currently using keyword detection as a placeholder.
              </p>
            </div>
          </div>

          {/* Extracted skills */}
          <div>
            <h2 style={{ fontSize:"15px", fontWeight:700, color:"#F1F5F9", marginBottom:"12px" }}>Extracted Skills</h2>
            <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"20px", minHeight:"200px" }}>
              {parsing ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"160px", gap:"12px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" style={{ animation:"spin 1s linear infinite" }}>
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-9.77"/>
                  </svg>
                  <p style={{ color:"#22D3EE", fontSize:"13px", fontWeight:600 }}>Extracting skills from CV...</p>
                  <p style={{ color:"#64748B", fontSize:"11px" }}>Reading your document</p>
                </div>
              ) : extractedSkills.length > 0 ? (
                <>
                  <p style={{ color:"#64748B", fontSize:"11px", marginBottom:"12px" }}>
                    {extractedSkills.length} skills detected — click a skill to remove it
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"18px" }}>
                    {extractedSkills.map(s => (
                      <button key={s} onClick={() => removeSkill(s)}
                        style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", color:"#22D3EE", padding:"4px 10px", borderRadius:"99px", fontSize:"11px", fontWeight:700, cursor:"pointer", transition:"all .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; e.currentTarget.style.color = "#F87171"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,211,238,0.1)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)"; e.currentTarget.style.color = "#22D3EE"; }}>
                        {s} <span style={{ fontSize:"10px" }}>×</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"160px", gap:"8px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <p style={{ color:"#334155", fontSize:"12px", fontWeight:600 }}>No CV uploaded yet</p>
                  <p style={{ color:"#334155", fontSize:"11px" }}>Upload a file to extract your skills</p>
                </div>
              )}
            </div>

            {/* Alerts */}
            {error && (
              <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", color:"#F87171", padding:"10px 14px", borderRadius:"10px", fontSize:"12px", marginTop:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
                <Ico size={14} stroke="#F87171">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </Ico>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", color:"#4ADE80", padding:"10px 14px", borderRadius:"10px", fontSize:"12px", marginTop:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
                <Ico size={14} stroke="#4ADE80">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="8 12 11 15 16 9" />
                </Ico>
                <span>{success}</span>
              </div>
            )}

            {/* Save button */}
            {extractedSkills.length > 0 && !saving && !success && (
              <button onClick={handleSaveSkills}
                style={{ width:"100%", marginTop:"14px", background:"linear-gradient(135deg,#22D3EE,#06B6D4)", color:"#060D1A", fontSize:"13px", fontWeight:800, padding:"11px", borderRadius:"10px", border:"none", cursor:"pointer" }}>
                Save Skills & Find Matches →
              </button>
            )}
            {saving && (
              <div style={{ textAlign:"center", marginTop:"14px", color:"#22D3EE", fontSize:"12px", fontWeight:600 }}>Saving skills...</div>
            )}
          </div>
        </div>

        {/* Current skills */}
        {user?.skills && (
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"18px", marginTop:"20px" }}>
            <p style={{ color:"#64748B", fontSize:"11px", fontWeight:600, marginBottom:"10px" }}>YOUR CURRENT SKILLS (from profile)</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {user.skills.split(",").map((s,i) => s.trim() ? (
                <span key={i} style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ADE80", padding:"3px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700 }}>{s.trim()}</span>
              ) : null)}
            </div>
          </div>
        )}

        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </main>
    </div>
  );
}