/**
 * Layout Component
 * ================
 * Main layout wrapper for the SkillSync application.
 * Matches the team's shared visual language from the Calendar & Notification module.
 *
 * What this does:
 *  - Provides bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 (same as teammate)

 *  - Uses <Outlet /> so each page renders its own Header, content, Footer unchanged
 *  - Zero changes to any page logic, CRUD, state, or routing
 *
 * Color mapping (your pages → teammate's Layout):
 *  #0B1220 flat bg  →  gradient from-slate-950 (#020617) via-slate-900 (#0f172a) to-slate-950
 *  #0F172A cards    →  bg-white/5  glassmorphism surface
 *  border #1E293B   →  border-white/10
 *  backdrop         →  backdrop-blur-xl
 *  cyan-400 #22D3EE →  identical in both
 */
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      className="min-h-screen text-slate-100 font-syne"
      style={{ background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)" }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[96rem] flex-col">

        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}