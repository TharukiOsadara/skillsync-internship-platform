import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 font-syne relative">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-10 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-extrabold text-slate-200">skill</span>
              <span className="text-xl font-extrabold text-cyan-400">sync</span>
              <span className="ml-2 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">internships</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5">
              Connecting Sri Lankan students with the best internship opportunities through intelligent skill-based matching.
            </p>
            <div className="flex gap-2">
              {["LinkedIn", "GitHub", "Twitter"].map(s => (
                <a key={s} href="#" className="text-slate-400 text-xs font-semibold bg-navy-800 border border-navy-700 px-3 py-1.5 rounded-lg hover:border-cyan-400/50 hover:text-cyan-400 transition-all no-underline">{s}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: "Platform", links: [{ to: "/", l: "Home" }, { to: "/login", l: "Sign In" }, { to: "/register", l: "Create Account" }] },
              { title: "Students", links: [{ to: "/student/dashboard", l: "My Dashboard" }, { to: "/login", l: "Find Internships" }, { to: "/login", l: "Skill Matching" }] },
              { title: "Admins", links: [{ to: "/admin/dashboard", l: "Admin Panel" }, { to: "/admin/add-internship", l: "Post Internship" }, { to: "/admin/matching-engine", l: "Matching Engine" }] },
            ].map(col => (
              <div key={col.title} className="flex flex-col gap-2">
                <p className="text-slate-200 text-sm font-bold mb-1">{col.title}</p>
                {col.links.map(lk => (
                  <Link key={lk.l} to={lk.to} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors no-underline">{lk.l}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-navy-800 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-navy-700 text-xs font-semibold m-0">
            © {new Date().getFullYear()} SkillSync Internships 
          </p>
          <div className="flex flex-wrap gap-2">
            {["MongoDB", "Express.js", "React", "Node.js", "JWT", "bcrypt", "Tailwind CSS"].map(t => (
              <span key={t} className="skill-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}