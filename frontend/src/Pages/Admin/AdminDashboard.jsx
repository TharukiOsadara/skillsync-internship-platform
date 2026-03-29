import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { getUser, authHeaders, getLoggedInAt } from "../../Utils/auth";

const Ico = ({ stroke = "#22D3EE", size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const PageIcon = ({ children }) => (
  <div style={{ width:"44px",height:"44px",flexShrink:0,background:"rgba(34,211,238,0.1)",border:"1px solid rgba(34,211,238,0.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
    <Ico size={20}>{children}</Ico>
  </div>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ background:"none",border:"none",color:"#64748B",fontSize:"20px",cursor:"pointer",padding:0,flexShrink:0,transition:"color .15s" }}
    onMouseEnter={e=>(e.currentTarget.style.color="#22D3EE")}
    onMouseLeave={e=>(e.currentTarget.style.color="#64748B")}>←</button>
);

function getOnlineStatus(lastLoginAt) {
  if (!lastLoginAt) return "offline";
  const minutes = (Date.now() - new Date(lastLoginAt).getTime()) / 1000 / 60;
  if (minutes < 30) return "online";
  return "offline";
}

export default function AdminDashboard() {
  const navigate   = useNavigate();
  const [internships,setInternships] = useState([]);
  const [users,setUsers]             = useState([]);
  const [loading,setLoading]         = useState(true);
  const [entered,setEntered]         = useState(false);
  const [animatedStats,setAnimatedStats] = useState({ total:0, active:0, expired:0, students:0 });
  const [dashboardFilter,setDashboardFilter] = useState("all");
  const [tableSearch,setTableSearch] = useState("");
  const [liveTime,setLiveTime]       = useState(new Date());
  const user       = getUser();
  const loggedInAt = getLoggedInAt();
  const now        = new Date();

  useEffect(()=>{ if(!user||user.role!=="Admin") navigate("/login"); },[]);
  useEffect(()=>{
    const timer = setTimeout(()=>setEntered(true), 80);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const [iRes,uRes]=await Promise.all([
          fetch("http://localhost:5000/internships"),
          fetch("http://localhost:5000/users",{headers:authHeaders()}),
        ]);
        const iData=await iRes.json(); const uData=await uRes.json();
        setInternships(iData.internships||[]); setUsers(uData.users||[]);
      }catch(err){console.error(err);}
      setLoading(false);
    };
    fetchData();
  },[]);

  const activeCount  = internships.filter(i=>new Date(i.deadline)>=now).length;
  const expiredCount = internships.filter(i=>new Date(i.deadline)<now).length;
  const studentCount = users.filter(u=>u.role==="Student").length;
  const recentInternships = [...internships].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const studentRows       = [...users]
    .filter((u)=>u.role==="Student")
    .sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
  const filteredInternships = recentInternships.filter((item)=>{
    const expired = new Date(item.deadline) < now;
    if (dashboardFilter === "active") return !expired;
    if (dashboardFilter === "expired") return expired;
    return true;
  });
  const tableInternships = filteredInternships.filter((item) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(q) ||
      (item.company || "").toLowerCase().includes(q) ||
      (item.location || "").toLowerCase().includes(q)
    );
  }).slice(0, 8);
  const showStudentsTable = dashboardFilter === "students";
  const filteredStudentRows = studentRows.filter((student) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      (student.fullName || "").toLowerCase().includes(q) ||
      (student.gmail || "").toLowerCase().includes(q)
    );
  }).slice(0, 8);

  useEffect(() => {
    if (loading) return;
    const targets = {
      total: internships.length,
      active: activeCount,
      expired: expiredCount,
      students: studentCount,
    };
    const start = Date.now();
    const duration = 420;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setAnimatedStats({
        total: Math.round(targets.total * progress),
        active: Math.round(targets.active * progress),
        expired: Math.round(targets.expired * progress),
        students: Math.round(targets.students * progress),
      });
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [loading, internships.length, activeCount, expiredCount, studentCount]);

  const stats=[
    {
      label:"Total Internships",value:animatedStats.total,color:"#22D3EE",border:"rgba(34,211,238,0.2)",
      filterKey:"all",
      icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    },
    {
      label:"Active", value:animatedStats.active, color:"#4ADE80", border:"rgba(74,222,128,0.2)",
      filterKey:"active",
      icon:<><polyline points="20 6 9 17 4 12"/></>,
    },
    {
      label:"Expired", value:animatedStats.expired, color:"#F87171", border:"rgba(248,113,113,0.2)",
      filterKey:"expired",
      icon:<><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    },
    {
      label:"Students", value:animatedStats.students, color:"#A78BFA", border:"rgba(167,139,250,0.2)",
      filterKey:"students",
      icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    },
  ];

  const quickActions=[
    {to:"/admin/add-internship",      title:"Add Internship",    desc:"Post a new listing",
     icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></>},
    {to:"/admin/manage-internships",  title:"Manage Internships",desc:"Edit, delete, track status",
     icon:<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>},
    {to:"/admin/matching-engine",     title:"Matching Engine",   desc:"See skill-matched students",
     icon:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></>},
  ];

  const revealStyle = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(-16px)",
    transition: `opacity .48s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] font-syne">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto" style={{minWidth:0}}>

        {/* Page header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"28px",...revealStyle(0)}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <BackBtn onClick={()=>navigate(-1)}/>
            <PageIcon>
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </PageIcon>
            <div>
              <h1 style={{fontSize:"28px",fontWeight:800,color:"#F1F5F9",margin:0}}>Dashboard</h1>
              <p style={{color:"#64748B",fontSize:"13px",margin:"3px 0 0"}}>Admin overview and platform metrics</p>
            </div>
          </div>
          <div style={{
            minWidth:"275px",
            borderRadius:"12px",
            padding:"10px 12px",
            border:"1px solid rgba(34,211,238,0.25)",
            background:"linear-gradient(135deg, rgba(34,211,238,0.14), rgba(15,23,42,0.94))",
            boxShadow:"0 10px 24px rgba(34,211,238,0.12)",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateX(0)" : "translateX(24px)",
            transition: "opacity .38s ease 120ms, transform .45s cubic-bezier(0.22, 1, 0.36, 1) 120ms",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{
                width:"34px",height:"34px",flexShrink:0,
                borderRadius:"10px",
                background:"rgba(34,211,238,0.15)",
                border:"1px solid rgba(34,211,238,0.3)",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <Ico size={15} stroke="#22D3EE">
                  <path d="M22 12h-4l-3 8-4-16-3 8H2" />
                </Ico>
              </div>
              <div style={{lineHeight:1.1}}>
                <p style={{color:"#67E8F9",fontSize:"10px",fontWeight:800,letterSpacing:"0.08em",margin:0,textTransform:"uppercase"}}>Welcome Back</p>
                <p style={{color:"#F1F5F9",fontSize:"13px",fontWeight:700,margin:"4px 0 0"}}>{user?.fullName}</p>
              </div>
            </div>
            {loggedInAt&&(
              <div style={{marginTop:"8px",paddingTop:"8px",borderTop:"1px solid rgba(34,211,238,0.2)",display:"flex",alignItems:"center",gap:"6px",color:"#94A3B8",fontSize:"11px"}}>
                <Ico size={12} stroke="#64748B">
                  <circle cx="12" cy="12" r="9"/>
                  <polyline points="12 7 12 12 15 14"/>
                </Ico>
                <span>Logged in at: {loggedInAt.toLocaleString()}</span>
              </div>
            )}
            <div style={{marginTop:"6px",display:"flex",alignItems:"center",gap:"6px",color:"#94A3B8",fontSize:"11px"}}>
              <Ico size={12} stroke="#22D3EE">
                <circle cx="12" cy="12" r="9"/>
                <polyline points="12 8 12 12 15 12"/>
              </Ico>
              <span>Live: {liveTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64" style={revealStyle(140)}>
            <div className="text-slate-400 text-sm animate-pulse">Loading data...</div>
          </div>
        ) : (<>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px",...revealStyle(70)}}>
            {stats.map((s,i)=>(
              <div key={i} onClick={()=>setDashboardFilter(s.filterKey)} style={{background:dashboardFilter===s.filterKey?"rgba(15,23,42,0.98)":"#0F172A",border:`1px solid ${dashboardFilter===s.filterKey?s.color:s.border}`,borderRadius:"14px",padding:"16px",opacity:entered?1:0,transform:entered?"translateY(0)":"translateY(-14px)",boxShadow:dashboardFilter===s.filterKey?`0 10px 24px ${s.border}`:"none",transition:`opacity .45s ease ${120 + (i * 70)}ms, transform .55s cubic-bezier(0.22, 1, 0.36, 1) ${120 + (i * 70)}ms, box-shadow .2s, border-color .2s, background-color .2s`,cursor:"pointer"}}
                onMouseEnter={e=>{
                  e.currentTarget.style.transform="translateY(-3px)";
                  e.currentTarget.style.boxShadow=`0 10px 24px ${s.border}`;
                  e.currentTarget.style.borderColor=s.color;
                  e.currentTarget.style.backgroundColor="rgba(15,23,42,0.98)";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.transform="translateY(0)";
                  e.currentTarget.style.boxShadow=dashboardFilter===s.filterKey?`0 10px 24px ${s.border}`:"none";
                  e.currentTarget.style.borderColor=dashboardFilter===s.filterKey?s.color:s.border;
                  e.currentTarget.style.backgroundColor=dashboardFilter===s.filterKey?"rgba(15,23,42,0.98)":"#0F172A";
                }}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
                  <div style={{width:"34px",height:"34px",borderRadius:"10px",background:`${s.border}`,border:`1px solid ${s.color}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico size={15} stroke={s.color}>{s.icon}</Ico>
                  </div>
                  <p style={{color:"#64748B",fontSize:"11px",margin:0}}>{s.label}</p>
                </div>
                <p style={{fontSize:"32px",fontWeight:800,color:s.color,margin:"0 auto",lineHeight:1,textAlign:"center",width:"100%"}}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 style={{fontSize:"15px",fontWeight:700,color:"#F1F5F9",marginBottom:"12px",...revealStyle(210)}}>Quick Actions</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px",...revealStyle(250)}}>
            {quickActions.map(a=>(
              <Link key={a.to} to={a.to} style={{background:"#0F172A",border:"1px solid #1E293B",borderRadius:"14px",padding:"16px",display:"flex",alignItems:"center",gap:"14px",textDecoration:"none",transition:"border-color .2s, box-shadow .2s, transform .2s, background-color .2s"}}
                onMouseEnter={e=>{
                  e.currentTarget.style.borderColor="rgba(34,211,238,0.6)";
                  e.currentTarget.style.boxShadow="0 12px 28px rgba(34,211,238,0.18)";
                  e.currentTarget.style.transform="translateY(-3px)";
                  e.currentTarget.style.backgroundColor="rgba(15,23,42,0.98)";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.borderColor="#1E293B";
                  e.currentTarget.style.boxShadow="none";
                  e.currentTarget.style.transform="translateY(0)";
                  e.currentTarget.style.backgroundColor="#0F172A";
                }}>
                <div style={{width:"38px",height:"38px",flexShrink:0,background:"rgba(34,211,238,0.08)",border:"1px solid rgba(34,211,238,0.15)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ico size={16}>{a.icon}</Ico>
                </div>
                <div style={{flex:1}}>
                  <p style={{color:"#F1F5F9",fontWeight:700,fontSize:"13px",margin:0}}>{a.title}</p>
                  <p style={{color:"#64748B",fontSize:"11px",margin:"2px 0 0"}}>{a.desc}</p>
                </div>
                <span style={{color:"#22D3EE",fontSize:"16px"}}>→</span>
              </Link>
            ))}
          </div>

          {/* Recent table */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"12px",...revealStyle(300)}}>
            <h2 style={{fontSize:"15px",fontWeight:700,color:"#F1F5F9",margin:0}}>
              {dashboardFilter === "students" ? "Recent Students" : "Recently Added Internships"}
            </h2>
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"#1E293B",border:"1px solid #334155",borderRadius:"9px",padding:"6px 10px",width:"320px"}}>
              <Ico size={12} stroke="#64748B"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ico>
              <input
                value={tableSearch}
                onChange={(e)=>setTableSearch(e.target.value)}
                placeholder={showStudentsTable ? "Search students by name or email..." : "Search internships by title, company, location..."}
                style={{background:"transparent",border:"none",outline:"none",color:"#F1F5F9",fontSize:"11px",width:"100%",fontFamily:"'DM Sans',sans-serif"}}
              />
              {tableSearch && (
                <button onClick={()=>setTableSearch("")} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer",fontSize:"14px",padding:0}}>×</button>
              )}
            </div>
          </div>
          <div className="admin-hover-surface" style={{background:"#0F172A",border:"1px solid #1E293B",borderRadius:"14px",overflow:"hidden",...revealStyle(340)}}>
            <div className="overflow-auto" style={{maxHeight:"calc(100vh - 345px)"}}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{background:"#0B1220"}}>
                  {(showStudentsTable
                    ? ["#","Full Name","Gmail","Age","Last Login","Status"]
                    : ["#","Title","Company","Location","Mode","Time","Deadline","Status"]).map(h=>(

                    <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3"
                      style={{borderBottom:"1px solid #1E293B",position:"sticky",top:0,background:"#0B1220",zIndex:2}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showStudentsTable
                  ? filteredStudentRows.map((student,index)=>{
                      const online = getOnlineStatus(student.lastLoginAt) !== "offline";
                      return (
                        <tr key={student._id} style={{borderBottom:"1px solid #1E293B"}}>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{index+1}</td>
                          <td className="px-5 py-3.5 text-slate-200 text-sm font-semibold">{student.fullName||"-"}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{student.gmail||"-"}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{student.age||"-"}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{student.lastLoginAt?new Date(student.lastLoginAt).toLocaleString():"Never"}</td>
                          <td className="px-5 py-3.5"><span className={online?"badge-active":"badge-expired"}>{online?"Active":"Offline"}</span></td>
                        </tr>
                      );
                    })
                  : tableInternships.map((item,index)=>{
                      const expired=new Date(item.deadline)<now;
                      return (
                        <tr key={item._id} style={{borderBottom:"1px solid #1E293B"}}>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{index+1}</td>
                          <td className="px-5 py-3.5 text-slate-200 text-sm font-semibold">{item.title}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{item.company}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{item.location}</td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">
                            <span style={{background:item.mode==="Online/Remote"?"rgba(34,211,238,0.1)":item.mode==="Physical/On-site"?"rgba(74,222,128,0.1)":"rgba(167,139,250,0.1)",color:item.mode==="Online/Remote"?"#22D3EE":item.mode==="Physical/On-site"?"#4ADE80":"#A78BFA",padding:"2px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:700}}>
                              {item.mode||"N/A"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">
                            <span style={{background:item.timePreference==="Day"?"rgba(251,191,36,0.1)":"rgba(96,165,250,0.1)",color:item.timePreference==="Day"?"#FCD34D":"#93C5FD",padding:"2px 8px",borderRadius:"6px",fontSize:"10px",fontWeight:700}}>
                              {item.timePreference||"N/A"}
                            </span>
                          </td>

                          <td className={`px-5 py-3.5 text-sm ${expired?"text-red-400":"text-slate-400"}`}>{new Date(item.deadline).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5"><span className={expired?"badge-expired":"badge-active"}>{expired?"Expired":"Active"}</span></td>
                        </tr>
                      );
                    })}
                {showStudentsTable && filteredStudentRows.length===0 && (
                  <tr><td colSpan={6} className="text-center text-slate-400 text-sm py-10">No students found</td></tr>
                )}
                {!showStudentsTable && tableInternships.length===0 && (
                  <tr><td colSpan={8} className="text-center text-slate-400 text-sm py-10">No internships found for this filter</td></tr>

                )}
              </tbody>
            </table>
            </div>
          </div>
        </>)}
      </main>
    </div>
  );
}