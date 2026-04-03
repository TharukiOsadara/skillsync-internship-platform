import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      className="min-h-screen text-slate-100 font-syne"
      style={{
        background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)",
        
        /* ✅ ADD THIS */
        height: "100vh",
        overflow: "hidden"
      }}
    >

      <div 
        className="mx-auto flex min-h-screen w-full max-w-[96rem] flex-col"
        
        /* ✅ ADD THIS */
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      >

        <main 
          className="flex-1 flex flex-col"
          
          /* ✅ ADD THIS (IMPORTANT FIX) */
          style={{
            overflowY: "auto"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}