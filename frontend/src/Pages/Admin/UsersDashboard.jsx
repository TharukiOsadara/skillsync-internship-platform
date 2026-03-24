import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
import { authHeaders, getLoggedInAt, getUser } from "../../Utils/auth";

const initialForm = {
  fullName: "",
  gmail: "",
  password: "",
  age: "",
  address: "",
  phoneNo: "",
  skills: "",
  education: "",
  experience: "",
  role: "Student",
};

export default function UsersDashboard() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const loggedInAt = getLoggedInAt();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [updateAdminPassword, setUpdateAdminPassword] = useState("");
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [passwordAdminInput, setPasswordAdminInput] = useState("");
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "Admin").length;
  const studentCount = users.filter((u) => u.role === "Student").length;

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Admin") navigate("/login");
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/users", { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to load users.");
      setUsers(data.users || []);
    } catch (err) {
      setError("Server error while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateUser = (payload) => {
    const hasLetter = (v) => /[A-Za-z]/.test(String(v || ""));
    const emailRx = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneDigits = String(payload.phoneNo || "").replace(/\D/g, "");

    if (!payload.fullName || !payload.gmail || !payload.password || !payload.age || !payload.address || !payload.phoneNo || !payload.education || !payload.experience) {
      return "All required fields must be filled.";
    }
    if (/\d/.test(payload.fullName)) return "Full name cannot contain numbers.";
    if (!emailRx.test(payload.gmail)) return "Gmail must start with a letter and be valid.";
    if (!hasLetter(payload.address)) return "Address cannot be only numbers.";
    if (payload.skills && !hasLetter(payload.skills)) return "Skills cannot be only numbers.";
    if (!hasLetter(payload.education)) return "Education cannot be only numbers.";
    if (!hasLetter(payload.experience)) return "Experience cannot be only numbers.";
    if (phoneDigits.length !== 10) return "Phone number must be exactly 10 digits.";
    if (Number(payload.age) < 16 || Number(payload.age) > 60) return "Age must be between 16 and 60.";
    return null;
  };

  const openEditModal = (user) => {
    setError("");
    setSuccess("");
    setEditUser(user);
    setUpdateAdminPassword("");
    setForm({
      fullName: user.fullName || "",
      gmail: user.gmail || "",
      password: user.password || "",
      age: user.age || "",
      address: user.address || "",
      phoneNo: user.phoneNo || "",
      skills: user.skills || "",
      education: user.education || "",
      experience: user.experience || "",
      role: user.role || "Student",
    });
  };

  const handleUpdateUser = async () => {
    setError("");
    setSuccess("");

    const validationError = validateUser(form);
    if (validationError) return setError(validationError);

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        phoneNo: String(form.phoneNo).replace(/\D/g, ""),
        adminPassword: updateAdminPassword,
      };

      if (!updateAdminPassword) return setError("Admin password is required to update user.");

      const res = await fetch(`http://localhost:5000/users/${editUser._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to update user.");

      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? { ...u, ...data.data } : u)));
      setEditUser(null);
      setUpdateAdminPassword("");
      setSuccess("User updated successfully.");
    } catch (err) {
      setError("Server error while updating user.");
    }
  };

  const handleDeleteUser = async () => {
    setError("");
    setSuccess("");

    if (!adminPassword) return setError("Admin password is required to delete user.");

    try {
      const res = await fetch(`http://localhost:5000/users/${deleteUserId}`, {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify({ adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to delete user.");

      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
      setDeleteUserId(null);
      setAdminPassword("");
      setSuccess("User deleted successfully.");
    } catch (err) {
      setError("Server error while deleting user.");
    }
  };

  const handleRevealPassword = async () => {
    setError("");
    setSuccess("");

    if (!passwordAdminInput) return setError("Admin password is required to view user password.");
    if (!passwordUserId) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${passwordUserId}/view-password`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ adminPassword: passwordAdminInput }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to reveal password.");

      setRevealedPasswords((prev) => ({ ...prev, [passwordUserId]: data.password }));
      setPasswordUserId(null);
      setPasswordAdminInput("");
      setSuccess("Password revealed successfully.");
    } catch (err) {
      setError("Server error while revealing password.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1220] font-syne">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-cyan-400 transition-colors text-2xl">←</button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-200 m-0">Users Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Registered users and login activity</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-200 text-sm font-semibold m-0">Welcome back, {currentUser?.fullName}</p>
            {loggedInAt && <p className="text-slate-400 text-xs mt-1 m-0">Logged in at: {loggedInAt.toLocaleString()}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-cyan-sm" style={{ border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="flex flex-col items-center justify-center">
              <p className="text-slate-400 text-xs m-0">Total Users</p>
              <p className="text-3xl font-extrabold text-cyan-400 m-0">{totalUsers}</p>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-cyan-sm" style={{ border: "1px solid rgba(167,139,250,0.2)" }}>
            <div className="flex flex-col items-center justify-center">
              <p className="text-slate-400 text-xs m-0">Admins</p>
              <p className="text-3xl font-extrabold text-purple-400 m-0">{adminCount}</p>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-cyan-sm" style={{ border: "1px solid rgba(74,222,128,0.2)" }}>
            <div className="flex flex-col items-center justify-center">
              <p className="text-slate-400 text-xs m-0">Students</p>
              <p className="text-3xl font-extrabold text-green-400 m-0">{studentCount}</p>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">⚠️ {error}</div>}
        {success && <div className="bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">✅ {success}</div>}

        {loading ? (
          <div className="text-slate-400 text-sm animate-pulse py-10">Loading users...</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[1700px] border-collapse text-xs">
              <thead>
                <tr className="bg-[#0B1220]">
                  {[
                    "#",
                    "Full Name",
                    "Gmail",
                    "Role",
                    "Password",
                    "Age",
                    "Address",
                    "Phone",
                    "Skills",
                    "Education",
                    "Experience",
                    "Created At",
                    "Updated At",
                    "Last Login",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3 border-b border-navy-800">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b border-navy-800 hover:bg-navy-800/30 transition-colors">
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{index + 1}</td>
                    <td className="px-3 py-3 text-slate-200 font-bold whitespace-nowrap">{user.fullName}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.gmail}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={(user.role || "Student") === "Admin" ? "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20" : "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20"}>
                        {user.role || "Student"}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{revealedPasswords[user._id] ? revealedPasswords[user._id] : "••••••••"}</span>
                        {revealedPasswords[user._id] ? (
                          <button
                            onClick={() => setRevealedPasswords((prev) => ({ ...prev, [user._id]: undefined }))}
                            className="text-slate-400 text-[10px] font-bold bg-navy-800 border border-navy-700 px-2 py-1 rounded-lg hover:border-slate-500 transition-all cursor-pointer"
                          >
                            Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setPasswordUserId(user._id);
                              setPasswordAdminInput("");
                              setError("");
                              setSuccess("");
                            }}
                            className="text-cyan-400 text-[10px] font-bold bg-cyan-400/8 border border-cyan-400/15 px-2 py-1 rounded-lg hover:bg-cyan-400/15 transition-all cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.age}</td>
                    <td className="px-3 py-3 text-slate-400">{user.address}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.phoneNo}</td>
                    <td className="px-3 py-3 text-slate-400">{user.skills}</td>
                    <td className="px-3 py-3 text-slate-400">{user.education}</td>
                    <td className="px-3 py-3 text-slate-400">{user.experience}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(user)} className="text-cyan-400 text-xs font-bold bg-cyan-400/8 border border-cyan-400/15 px-2 py-1 rounded-lg hover:bg-cyan-400/15 transition-all cursor-pointer">
                          Update
                        </button>
                        <button onClick={() => setDeleteUserId(user._id)} className="text-red-400 text-xs font-bold bg-red-400/8 border border-red-400/15 px-2 py-1 rounded-lg hover:bg-red-400/15 transition-all cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center text-slate-400 text-sm py-10">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </main>

      {editUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-6 max-w-3xl w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-4">Update User</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["fullName", "Full Name"],
                ["gmail", "Gmail"],
                ["password", "Password"],
                ["age", "Age"],
                ["address", "Address"],
                ["phoneNo", "Phone Number"],
                ["skills", "Skills"],
                ["education", "Education"],
                ["experience", "Experience"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-slate-400 text-xs">{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="input-field"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-xs">Role</label>
                <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} className="input-field">
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-xs">Admin Password (required)</label>
                <input
                  type="password"
                  value={updateAdminPassword}
                  onChange={(e) => setUpdateAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setEditUser(null); setUpdateAdminPassword(""); }} className="flex-1 py-3 bg-navy-800 border border-navy-700 text-slate-400 font-bold text-sm rounded-xl hover:border-slate-500 cursor-pointer transition-all">
                Cancel
              </button>
              <button onClick={handleUpdateUser} className="flex-1 py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-bold text-sm rounded-xl hover:bg-cyan-400/20 cursor-pointer transition-all">
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-2">Confirm User Delete</h3>
            <p className="text-slate-400 text-sm mb-4">Enter admin password to delete this user.</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin password"
              className="input-field"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setDeleteUserId(null);
                  setAdminPassword("");
                }}
                className="flex-1 py-3 bg-navy-800 border border-navy-700 text-slate-400 font-bold text-sm rounded-xl hover:border-slate-500 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="flex-1 py-3 bg-red-400/10 border border-red-400/30 text-red-400 font-bold text-sm rounded-xl hover:bg-red-400/20 cursor-pointer transition-all">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-slate-200 font-extrabold text-lg mb-2">View User Password</h3>
            <p className="text-slate-400 text-sm mb-4">Enter admin password to reveal the selected user's password.</p>
            <input
              type="password"
              value={passwordAdminInput}
              onChange={(e) => setPasswordAdminInput(e.target.value)}
              placeholder="Admin password"
              className="input-field"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setPasswordUserId(null);
                  setPasswordAdminInput("");
                }}
                className="flex-1 py-3 bg-navy-800 border border-navy-700 text-slate-400 font-bold text-sm rounded-xl hover:border-slate-500 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRevealPassword}
                className="flex-1 py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-bold text-sm rounded-xl hover:bg-cyan-400/20 cursor-pointer transition-all"
              >
                Reveal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
