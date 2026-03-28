import { useState, useEffect } from "react";
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

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ gmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState([]);

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedCredentials");
    if (saved) {
      try {
        setSavedCredentials(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved credentials", e);
      }
    }
  }, []);

  const handleGmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, gmail: value });
    setError("");
    
    if (value.trim().length > 0) {
      const filtered = savedCredentials.filter((cred) =>
        cred.gmail.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (credential) => {
    setForm({ gmail: credential.gmail, password: credential.password });
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gmail || !form.password) return setError("All fields are required.");
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.gmail)) return setError("Please enter a valid email.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid credentials.");
      
      // Save credentials to localStorage
      const existing = savedCredentials.findIndex((c) => c.gmail === form.gmail);
      let updated = [...savedCredentials];
      if (existing >= 0) {
        updated[existing] = form;
      } else {
        updated.push(form);
      }
      localStorage.setItem("savedCredentials", JSON.stringify(updated));
      
      saveAuth(data.token, data.user);
      navigate(data.user.role === "Admin" ? "/admin/dashboard" : "/student/cv-upload");
    } catch { setError("Server error. Make sure backend is running."); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#0B1220] min-h-screen font-syne">
      <Header />
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="card p-10 shadow-cyan">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-6">
              <span className="text-xl font-extrabold text-slate-200">skill</span>
              <span className="text-xl font-extrabold text-cyan-400">sync</span>
              <span className="ml-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">internships</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-200 mb-1">Welcome Back!!</h2>
            <p className="text-slate-400 text-sm mb-7">Sign in with your email and password</p>

            {error && (
              <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                <Ico size={14} stroke="#f87171"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-slate-400 text-xs font-semibold">Email Address</label>
                <input 
                  name="gmail" 
                  placeholder="you@example.com" 
                  value={form.gmail} 
                  onChange={handleGmailChange}
                  onFocus={() => form.gmail.trim().length > 0 && setShowSuggestions(true)}
                  className="input-field" 
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg z-20 shadow-lg">
                    {suggestions.map((cred, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(cred)}
                        className="px-4 py-2 hover:bg-slate-800 cursor-pointer border-b border-slate-700 last:border-b-0 text-slate-300 text-sm"
                      >
                        <p className="font-semibold text-slate-200">{cred.gmail}</p>
                        <p className="text-xs text-slate-500">●●●●●●●●</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold">Password</label>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-cyan w-full mt-1 text-sm">
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Role hints */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                {
                  role: "Admin",
                  desc: "Manage internships & matching",
                  icon: <Ico size={16} stroke="#a78bfa"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>,
                },
                {
                  role: "Student",
                  desc: "View matched internships",
                  icon: <Ico size={16} stroke="#22d3ee"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v4.5C6 18.5 8.7 20 12 20s6-1.5 6-3.5V12" /></Ico>,
                },
              ].map(r => (
                <div key={r.role} className="bg-navy-800 border border-navy-700 rounded-xl p-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/70">{r.icon}</span>
                  <div>
                    <p className="text-slate-200 text-xs font-bold m-0">{r.role}</p>
                    <p className="text-slate-400 text-[10px] m-0">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-slate-400 text-sm mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-cyan-400 font-bold no-underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}