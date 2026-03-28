import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../Components/StudentSidebar";
import StudentWelcomeBack from "../../Components/StudentWelcomeBack";
import { getUser, authHeaders, saveAuth, getToken, getLoggedInAt } from "../../Utils/auth";

const PageIcon = ({ children }) => (
  <div style={{ width:"42px",height:"42px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </div>
);

const Inp = ({ label, name, value, onChange, type="text", placeholder="" }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
    <label style={{ fontSize:"10px", color:"#64748B", fontWeight:600 }}>{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:"8px", padding:"8px 11px", color:"#F1F5F9", fontSize:"12px", width:"100%", fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color .15s" }}
      onFocus={e => { e.target.style.borderColor="#22D3EE"; e.target.style.boxShadow="0 0 0 3px rgba(34,211,238,0.1)"; }}
      onBlur={e  => { e.target.style.borderColor="#334155"; e.target.style.boxShadow="none"; }}
    />
  </div>
);

export default function StudentProfile() {
  const navigate = useNavigate();
  const user     = getUser();
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    fullName:   user?.fullName   || "",
    gmail:      user?.gmail      || "",
    age:        user?.age        || "",
    address:    user?.address    || "",
    phoneNo:    user?.phoneNo    || "",
    skills:     user?.skills     || "",
    education:  user?.education  || "",
    experience: user?.experience || "",
  });
  const [photo, setPhoto]     = useState(user?.photo || null);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!user || user.role !== "Student") navigate("/login"); }, []);

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.fullName || !form.gmail) return setError("Name and email are required.");
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ ...form, photo }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Update failed.");
      saveAuth(getToken(), { ...user, ...form, photo });
      setSuccess("Profile updated successfully! Your matches will reflect the new skills.");
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const initial = (form.fullName || "S").trim().charAt(0).toUpperCase();

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px", marginBottom:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <PageIcon>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize:"26px", fontWeight:800, color:"#F1F5F9", margin:0 }}>My Profile</h1>
              <p style={{ color:"#64748B", fontSize:"13px", margin:"3px 0 0" }}>Update your personal information and skills</p>
            </div>
          </div>

          <StudentWelcomeBack />

        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth:"680px" }}>

          {/* Avatar card */}
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"20px", display:"flex", alignItems:"center", gap:"20px", marginBottom:"20px" }}>
            <div onClick={() => fileRef.current?.click()} style={{ width:"80px", height:"80px", flexShrink:0, background: photo?"transparent":"linear-gradient(135deg,#22D3EE,#06B6D4)", borderRadius:"20px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"30px", color:"#060D1A", cursor:"pointer", position:"relative", overflow: photo?"hidden":"visible" }}>
              {photo ? <img src={photo} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"20px" }} /> : initial}
              <div style={{ position:"absolute", bottom:"-4px", right:"-4px", width:"24px", height:"24px", background:"#22D3EE", borderRadius:"50%", border:"2px solid #0B1220", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#060D1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                </svg>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
            <div>
              <p style={{ color:"#F1F5F9", fontWeight:700, fontSize:"15px", margin:"0 0 4px" }}>{form.fullName||"Your Name"}</p>
              <p style={{ color:"#64748B", fontSize:"11px", margin:"0 0 8px" }}>{form.gmail}</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)", color:"#22D3EE", fontSize:"11px", fontWeight:700, padding:"5px 14px", borderRadius:"99px", cursor:"pointer" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                Upload new photo
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", color:"#F87171", padding:"10px 14px", borderRadius:"10px", fontSize:"12px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)", color:"#4ADE80", padding:"10px 14px", borderRadius:"10px", fontSize:"12px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 10"/>
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"14px", padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
              <Inp label="Full Name"    name="fullName"   value={form.fullName}   onChange={handleChange} placeholder="Kasun Rajapaksha"/>
              <Inp label="Email"        name="gmail"      value={form.gmail}      onChange={handleChange} type="email" placeholder="you@example.com"/>
              <Inp label="Age"          name="age"        value={form.age}        onChange={handleChange} type="number" placeholder="22"/>
              <Inp label="Phone Number" name="phoneNo"    value={form.phoneNo}    onChange={handleChange} placeholder="0771234567"/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <Inp label="Address"    name="address"    value={form.address}    onChange={handleChange} placeholder="Colombo, Sri Lanka"/>
              <div>
                <Inp label="Skills (comma separated — these drive your match results)" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB"/>
                {form.skills && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginTop:"8px" }}>
                    {form.skills.split(",").map((s,i) => s.trim() ? (
                      <span key={i} style={{ background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", color:"#22D3EE", padding:"2px 9px", borderRadius:"99px", fontSize:"10px", fontWeight:700 }}>{s.trim()}</span>
                    ) : null)}
                  </div>
                )}
              </div>
              <Inp label="Education"  name="education"  value={form.education}  onChange={handleChange} placeholder="BSc IT - SLIIT"/>
              <Inp label="Experience" name="experience" value={form.experience} onChange={handleChange} placeholder="Intern at ABC Corp, 2024"/>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:"10px", marginTop:"16px" }}>
            <button type="button" onClick={() => navigate(-1)} style={{ flex:1, padding:"11px", background:"#1E293B", border:"1px solid #334155", color:"#94A3B8", fontSize:"13px", fontWeight:700, borderRadius:"10px", cursor:"pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex:2, padding:"11px", background:"linear-gradient(135deg,#22D3EE,#06B6D4)", color:"#060D1A", fontSize:"13px", fontWeight:800, borderRadius:"10px", border:"none", cursor:"pointer" }}>
              {loading ? "Saving..." : "Save Changes →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}