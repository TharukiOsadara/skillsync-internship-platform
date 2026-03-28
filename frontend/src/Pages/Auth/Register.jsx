import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../../Utils/auth";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const Ico = ({ size = 14, stroke = "currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", gmail: "", password: "", confirmPassword: "", age: "", address: "", phoneNo: "", role: "Student", skills: "", education: "", experience: "", mode: "", timePreference: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNo") {
      // Keep leading zeroes and cap at 10 digits.
      const cleaned = String(value).replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, phoneNo: cleaned });
      setError("");
      return;
    }
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validate = () => {
    const { fullName, gmail, password, confirmPassword, age, address, phoneNo, skills, education, experience, mode, timePreference, description } = form;
    const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const hasLetter = (v) => /[A-Za-z]/.test(String(v));
    const phoneDigits = String(phoneNo).replace(/\D/g, "");
    if (!fullName || !gmail || !password || !age || !address || !phoneNo || !education || !experience) return "All basic fields are required.";
    if (form.role === "Student" && (!mode || !timePreference || !description)) return "For Student role, Work Mode, Time Preference, and Description are required.";
    if (/\d/.test(fullName)) return "Full name cannot contain numbers.";
    if (!emailRx.test(gmail)) return "Email must start with a letter and be valid.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (isNaN(age) || age < 16 || age > 60) return "Age must be between 16 and 60.";
    if (phoneDigits.length !== 10) return "Phone number must be exactly 10 digits.";
    if (!hasLetter(address)) return "Address cannot be only numbers.";
    if (skills && !hasLetter(skills)) return "Skills cannot be only numbers.";
    if (!hasLetter(education)) return "Education cannot be only numbers.";
    if (!hasLetter(experience)) return "Experience cannot be only numbers.";
    if (form.role === "Student") {
      if (!mode || !["Online/Remote", "Physical/On-site", "Hybrid"].includes(mode)) return "Please select a valid work mode.";
      if (!timePreference || !["Day", "Night"].includes(timePreference)) return "Please select a valid time preference.";
      if (!description || description.trim().length < 10) return "Description must be at least 10 characters.";
      if (!hasLetter(description)) return "Description cannot be only numbers.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), phoneNo: String(form.phoneNo).replace(/\D/g, "") }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Registration failed.");

      // Support current backend response shape: { success: true, data: user }
      const user = data.user || data.data;
      const token = data.token || "";
      if (!user) return setError("Registration response is invalid.");

      saveAuth(token, user);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate(user.role === "Admin" ? "/admin/dashboard" : "/student/dashboard"), 1200);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#0B1220] min-h-screen font-syne">
      <Header />
      <div className="relative py-12 px-8 flex justify-center">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="w-full max-w-lg relative z-10">
          <div className="card p-10 shadow-cyan">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-5">
              <span className="text-xl font-extrabold text-slate-200">skill</span>
              <span className="text-xl font-extrabold text-cyan-400">sync</span>
              <span className="ml-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">internships</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-200 mb-1">Create your account</h2>
            <p className="text-slate-400 text-sm mb-6">Join thousands of students finding internships</p>

            {error && (
              <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <Ico size={14} stroke="#f87171"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <Ico size={14} stroke="#4ade80"><circle cx="12" cy="12" r="9" /><polyline points="8 12 11 15 16 9" /></Ico>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Role */}
              <div className="grid grid-cols-2 gap-3">
                {["Student", "Admin"].map(r => (
                  (() => {
                    const isActive = form.role === r;
                    const activeCls = r === "Student"
                      ? "bg-cyan-400/10 border-cyan-400 text-cyan-400"
                      : "bg-purple-400/10 border-purple-400 text-purple-400";
                    const iconStroke = isActive
                      ? (r === "Student" ? "#22d3ee" : "#a78bfa")
                      : "#94a3b8";

                    return (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-xl text-sm font-bold border cursor-pointer transition-all ${isActive ? activeCls : "bg-navy-800 border-navy-700 text-slate-400 hover:border-slate-500"}`}>
                    <span className="inline-flex items-center gap-2 justify-center">
                      {r === "Student" ? (
                        <Ico size={14} stroke={iconStroke}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v4.5C6 18.5 8.7 20 12 20s6-1.5 6-3.5V12" /></Ico>
                      ) : (
                        <Ico size={14} stroke={iconStroke}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>
                      )}
                      <span>{r}</span>
                    </span>
                  </button>
                    );
                  })()
                ))}
              </div>

              {/* 2-column grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "fullName", label: "Full Name", placeholder: "Nimal Perera" },
                  { name: "gmail", label: "Email Address", placeholder: "you@example.com" },
                  { name: "password", label: "Password", placeholder: "Min 6 characters", type: "password" },
                  { name: "confirmPassword", label: "Confirm Password", placeholder: "Repeat password", type: "password" },
                  { name: "age", label: "Age", placeholder: "21", type: "number" },
                  { name: "phoneNo", label: "Phone Number", placeholder: "0771234567", type: "text" },
                ].map(f => (
                  <div key={f.name} className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold">{f.label}</label>
                    <input name={f.name} type={f.type || "text"} placeholder={f.placeholder}
                      inputMode={f.name === "phoneNo" ? "numeric" : undefined}
                      maxLength={f.name === "phoneNo" ? 10 : undefined}
                      value={form[f.name]} onChange={handleChange} className="input-field" />
                  </div>
                ))}
              </div>

              {/* Full-width fields */}
              {[
                { name: "address", label: "Address", placeholder: "Colombo, Sri Lanka" },
                { name: "education", label: "Education", placeholder: "BSc IT - SLIIT" },
                { name: "experience", label: "Experience", placeholder: "Intern at ABC Corp, 2023" },
                { name: "skills", label: "Skills (comma separated)", placeholder: "React, Node.js, MongoDB" },
              ].map(f => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold">{f.label}</label>
                  <input name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} className="input-field" />
                </div>
              ))}

              {/* Skill preview */}
              {form.skills && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.split(",").map((s, i) => s.trim() ? <span key={i} className="skill-tag">{s.trim()}</span> : null)}
                </div>
              )}

              {/* Conditionally show mode, timePreference, description for Student role */}
              {form.role === "Student" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Preferred Work Mode *</label>
                      <select
                        name="mode" value={form.mode} onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select work mode</option>
                        <option value="Online/Remote">Online/Remote</option>
                        <option value="Physical/On-site">Physical/On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-semibold">Time Preference *</label>
                      <select
                        name="timePreference" value={form.timePreference} onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select time preference</option>
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold">About You * (Min 10 characters)</label>
                    <textarea
                      name="description" placeholder="Tell us about your career goals and what you're looking for in an internship..."
                      value={form.description} onChange={handleChange}
                      rows="3"
                      className="input-field resize-none"
                    />
                    {form.description && (
                      <span className="text-cyan-400 text-xs font-semibold">{form.description.length} characters</span>
                    )}
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="btn-cyan w-full text-sm mt-1">
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 font-bold no-underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}