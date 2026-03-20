import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './InternshipSearchPage.css';

function InternshipSearchPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('find-internships');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    isError: false,
  });

  const [userName, setUserName] = useState('Nimal Perera');
  const [userAvatar, setUserAvatar] = useState('NP');

  const [searchData, setSearchData] = useState({
    location: '',
    role: '',
    duration: '',
    mode: '',
    time: '',
  });

  const [profileData, setProfileData] = useState({
    fullName: 'Nimal Perera',
    email: 'nimal.perera@example.com',
    university: 'University of Moratuwa',
    skills: 'JavaScript, Python, React, UI/UX',
    resume: '',
  });

  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Dialog Axiata',
      location: 'Colombo',
    },
    {
      id: 2,
      title: 'Digital Marketing Trainee',
      company: 'Virtusa',
      location: 'Remote',
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'WSO2',
      location: 'Hybrid',
    },
  ]);

  const showToast = (message, isError = false) => {
    setToast({
      show: true,
      message,
      isError,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        isError: false,
      });
    }, 2600);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      showToast('🌙 Welcome to Skill Sync Dark Mode — discover, save & grow!');
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSearchSubmit = (e) => {
  e.preventDefault();

  const query = new URLSearchParams({
    location: searchData.location,
    role: searchData.role,
    duration: searchData.duration,
    mode: searchData.mode,
    time: searchData.time,
  }).toString();

  navigate(`/results?${query}`);
};

  const handleRemoveSaved = (id) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    showToast('Removed from saved');
  };

  const handleProfileSave = () => {
    const name = profileData.fullName.trim();

    if (!name) {
      showToast('Enter name', true);
      return;
    }

    const nameParts = name.split(' ').filter(Boolean);
    const initials = nameParts.map((part) => part[0]).join('').toUpperCase().slice(0, 2);

    setUserName(name);
    setUserAvatar(initials || 'NP');
    showToast('✅ Profile updated successfully!');
  };

  const handleLogout = () => {
    setUserName('Guest User');
    setUserAvatar('GU');
    showToast('🔒 Signed out');
  };

  return (
    <div className="internship-page">
      <div className="app-wrapper">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo">
                skill<span>sync</span> internships
              </div>
              <div className="sidebar-tag">📍 Sri Lanka</div>
            </div>

            <div className="user-profile">
              <div className="avatar">{userAvatar}</div>
              <div className="user-info">
                <h4>{userName}</h4>
                <p>🎓 CS · University of Moratuwa</p>
              </div>
              <span className="chevron">⌄</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeView === 'find-internships' ? 'active' : ''}`}
              onClick={() => setActiveView('find-internships')}
            >
              <span className="nav-icon">🔍</span>
              <span>Find Internships</span>
            </button>

            <button
              className={`nav-item ${activeView === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveView('saved')}
            >
              <span className="nav-icon">🔖</span>
              <span>Saved</span>
            </button>

            <button
              className={`nav-item ${activeView === 'profile-settings' ? 'active' : ''}`}
              onClick={() => setActiveView('profile-settings')}
            >
              <span className="nav-icon">👤</span>
              <span>Profile Settings</span>
            </button>

            <button
              className={`nav-item ${activeView === 'career-inside' ? 'active' : ''}`}
              onClick={() => setActiveView('career-inside')}
            >
              <span className="nav-icon">📈</span>
              <span>Career Inside</span>
            </button>

            <button
              className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveView('calendar')}
            >
              <span className="nav-icon">📅</span>
              <span>Calendar</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="container">
            {activeView === 'find-internships' && (
              <div className="view-panel active-panel">
                <div className="hero">
                  <h1>
                    Find your <span className="highlight">perfect internship</span>
                    <br />
                    in Sri Lanka
                  </h1>
                  <p>
                    Search thousands of premium opportunities — filter by location,
                    role, duration, mode & time preference.
                  </p>
                </div>

                <div className="search-card">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="form-grid">
                      <div className="input-group">
                        <label>📍 Location</label>
                        <input
                          type="text"
                          name="location"
                          value={searchData.location}
                          onChange={handleSearchChange}
                          placeholder="e.g., Colombo, Kandy, Remote"
                        />
                      </div>

                      <div className="input-group">
                        <label>💼 Role / Field</label>
                        <input
                          type="text"
                          name="role"
                          value={searchData.role}
                          onChange={handleSearchChange}
                          placeholder="e.g., Developer, Marketing, Data Science"
                        />
                      </div>

                      <div className="input-group">
                        <label>📅 Duration</label>
                        <select
                          name="duration"
                          value={searchData.duration}
                          onChange={handleSearchChange}
                        >
                          <option value="">Any duration</option>
                          <option value="1-3 months">1-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="6+ months">6+ months</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid form-grid-second">
                      <div className="input-group">
                        <label>🌐 Mode</label>
                        <select
                          name="mode"
                          value={searchData.mode}
                          onChange={handleSearchChange}
                        >
                          <option value="">All modes</option>
                          <option value="Online">Remote / Online</option>
                          <option value="Physical">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>⏰ Time preference</label>
                        <select
                          name="time"
                          value={searchData.time}
                          onChange={handleSearchChange}
                        >
                          <option value="">Any time</option>
                          <option value="Day">Day shifts</option>
                          <option value="Night">Night shifts</option>
                          <option value="Flexible">Flexible hours</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <button type="submit" className="search-btn">
                          🔎 Search internships
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="info-section">
                  <div className="info-card">
                    <div className="info-icon">🏢</div>
                    <h3>600+ Companies</h3>
                    <p>Leading Sri Lankan firms</p>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <h3>All Regions</h3>
                    <p>Colombo, Kandy, Galle, Remote</p>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">🚀</div>
                    <h3>Smart AI Match</h3>
                    <p>Personalized recommendations</p>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'saved' && (
              <div className="view-panel active-panel">
                <h2>🔖 Saved Internships</h2>

                <div className="saved-list">
                  {savedJobs.length > 0 ? (
                    savedJobs.map((job) => (
                      <div className="job-card" key={job.id}>
                        <div>
                          <strong>{job.title}</strong>
                          <br />
                          {job.company} · {job.location}
                        </div>
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleRemoveSaved(job.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="empty-text">No saved internships yet.</p>
                  )}
                </div>

                <p className="helper-text">ℹ️ Save roles while searching</p>
              </div>
            )}

            {activeView === 'profile-settings' && (
              <div className="view-panel active-panel">
                <h2>👤 Profile Settings</h2>

                <div className="profile-form">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>University</label>
                    <input
                      type="text"
                      name="university"
                      value={profileData.university}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Resume Link</label>
                    <input
                      type="text"
                      name="resume"
                      value={profileData.resume}
                      onChange={handleProfileChange}
                      placeholder="Google Drive / LinkedIn"
                    />
                  </div>

                  <button className="search-btn profile-btn" onClick={handleProfileSave}>
                    💾 Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeView === 'career-inside' && (
              <div className="view-panel active-panel">
                <h2>📈 Career Inside</h2>

                <div className="career-tips">
                  <div className="highlight-card">
                    <h3>🔥 Trending in Sri Lanka 2026</h3>
                    <p>
                      🔥 Top roles: Full-Stack Developer, AI Engineer, Cloud Architect,
                      Product Manager.
                    </p>
                    <p className="mt-small">
                      📈 Hiring surge: IFS, Zone24x7, Sysco LABS, hSenid, Wiley.
                    </p>
                  </div>

                  <div>
                    <h3>🎓 Skill Accelerator</h3>
                    <ul>
                      <li>Complete AWS/Azure fundamentals (high demand)</li>
                      <li>Master Data Visualization: Power BI & Tableau</li>
                      <li>Build 3+ GitHub projects to stand out</li>
                    </ul>
                  </div>

                  <div className="success-section">
                    <h3>📊 Internship Success Rate</h3>
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <p className="mt-small">
                      82% of applicants with strong profiles get interview calls
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'calendar' && (
              <div className="view-panel active-panel">
                <h2>📅 Interview & Event Calendar</h2>

                <div className="calendar-container">
                  <div className="calendar-placeholder">
                    <h3>Calendar Preview</h3>
                    <p>Google Interview — 2026-03-25</p>
                    <p>Resume Workshop — 2026-03-28</p>
                    <p>IFS Deadline — 2026-04-05</p>
                  </div>
                </div>

                <p className="helper-text">
                  ➕ Click any date to add internship deadlines or interviews
                </p>
              </div>
            )}

            <footer>
              🔄 Skill Sync Internships — bridging Sri Lankan talent with global
              opportunities
            </footer>
          </div>
        </main>
      </div>

      <div className={`toast-message ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default InternshipSearchPage;