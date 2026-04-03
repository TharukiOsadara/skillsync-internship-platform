import { useState, useEffect, useCallback } from 'react';
import StudentSidebar from '../../Components/StudentSidebar';
import CVForm from '../../Components/CVForm';
import CVPreview from '../../Components/CVPreview';
import { getUser, authHeaders, saveAuth, getToken } from '../../Utils/auth';

const API_BASE = 'http://localhost:5000';

const PageIcon = ({ children }) => (
  <div style={{
    width: "42px", height: "42px", flexShrink: 0,
    background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
    borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </div>
);

const initialFormData = {
  fullName: '', email: '', phone: '', address: '',
  linkedin: '', github: '', portfolio: '', summary: '',
  skills: '', education: '', experience: '', projects: '',
  certifications: '', languages: '', hobbies: '', references: '',
};

export default function CVBuilderPage() {
  const user = getUser();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasExistingCV, setHasExistingCV] = useState(false);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const res = await fetch(`${API_BASE}/cv`, { headers: authHeaders() });
      const data = await res.json();

      if (data.success && data.data) {
        setFormData({
          fullName:       data.data.fullName       || '',
          email:          data.data.email          || '',
          phone:          data.data.phone          || '',
          address:        data.data.address        || '',
          linkedin:       data.data.linkedin       || '',
          github:         data.data.github         || '',
          portfolio:      data.data.portfolio      || '',
          summary:        data.data.summary        || '',
          skills:         data.data.skills         || '',
          education:      data.data.education      || '',
          experience:     data.data.experience     || '',
          projects:       data.data.projects       || '',
          certifications: data.data.certifications || '',
          languages:      data.data.languages      || '',
          hobbies:        data.data.hobbies        || '',
          references:     data.data.references     || '',
        });
        if (data.data.profileImage) setProfileImage(data.data.profileImage);
        setHasExistingCV(true);
      } else {
        // No CV yet — pre-fill from user profile
        if (user) {
          setFormData(prev => ({
            ...prev,
            fullName:   user.fullName   || '',
            email:      user.gmail      || '',
            phone:      user.phoneNo    || '',
            education:  user.education  || '',
            skills:     user.skills     || '',
            experience: user.experience || '',
            address:    user.address    || '',
          }));
        }
        setHasExistingCV(false);
      }
    } catch (err) {
      console.error('Error fetching CV:', err);
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName:   user.fullName   || '',
          email:      user.gmail      || '',
          phone:      user.phoneNo    || '',
          education:  user.education  || '',
          skills:     user.skills     || '',
          experience: user.experience || '',
          address:    user.address    || '',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const fullNamePattern = /^[A-Za-z\s]+$/;
    const phonePattern = /^\d{10}$/;

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    } else if (!fullNamePattern.test(formData.fullName)) {
      nextErrors.fullName = 'Name can contain letters and spaces only';
    }
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!phonePattern.test(formData.phone)) {
      nextErrors.phone = 'Phone must be exactly 10 digits';
    }
    return nextErrors;
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    let sanitizedValue = value;

    if (name === 'fullName') sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');
    if (name === 'phone')    sanitizedValue = value.replace(/\D/g, '').slice(0, 10);

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    if (message.text) setMessage({ type: '', text: '' });
  }, [errors, message.text]);

  const handleImageChange = useCallback((imageData) => {
    setProfileImage(imageData);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/cv`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...formData, profileImage }),
      });
      const data = await res.json();

      if (data.success) {
        setHasExistingCV(true);

        // ─────────────────────────────────────────────────────────────
        // REAL-TIME GLOBAL SYNC
        // Mirror CV fields that overlap with the user profile so every
        // component (sidebar, welcome banner, suggestions, etc.) that
        // reads from getUser() / auth context sees the updated values
        // immediately — exactly like CV Upload page does after saving.
        // ─────────────────────────────────────────────────────────────
        const currentToken = getToken();
        const updatedUser  = {
          ...user,
          // Core identity fields
          fullName:   formData.fullName   || user?.fullName,
          gmail:      formData.email      || user?.gmail,
          phoneNo:    formData.phone      || user?.phoneNo,
          address:    formData.address    || user?.address,
          // Professional fields — keep profile in sync with CV
          skills:     formData.skills     || user?.skills,
          education:  formData.education  || user?.education,
          experience: formData.experience || user?.experience,
        };

        // Persist to localStorage so all components re-read fresh data
        saveAuth(currentToken, updatedUser);

        // Also update the user profile on the server so other pages
        // (e.g., Suggestions) reflect the latest skills without a refresh
        try {
          await fetch(`${API_BASE}/users/${user._id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({
              fullName:   formData.fullName,
              phoneNo:    formData.phone,
              address:    formData.address,
              skills:     formData.skills,
              education:  formData.education,
              experience: formData.experience,
            }),
          });
        } catch (syncErr) {
          // Non-fatal: CV is saved; profile sync failed silently
          console.warn('Profile sync after CV save failed:', syncErr);
        }

        setMessage({
          type: 'success',
          text: hasExistingCV ? 'CV updated successfully!' : 'CV created successfully!',
        });

        // Dispatch a storage event so any component listening via
        // window.addEventListener('storage', ...) updates instantly
        window.dispatchEvent(new Event('storage'));

      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save CV' });
      }
    } catch (err) {
      console.error('Error saving CV:', err);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans', sans-serif" }}>
        <StudentSidebar />
        <main style={{ flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22D3EE"
              strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-.18-9.77"/>
            </svg>
            <p style={{ color: "#22D3EE", fontSize: "14px", fontWeight: 600, marginTop: "16px" }}>
              Loading your CV...
            </p>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0B1220", fontFamily: "'DM Sans', sans-serif" }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PageIcon>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </PageIcon>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>CV Builder</h1>
              <p style={{ color: "#64748B", fontSize: "12px", margin: "2px 0 0" }}>
                {hasExistingCV ? 'Edit your professional CV' : 'Create your professional CV'} — Live preview
              </p>
            </div>
          </div>

          {hasExistingCV && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)", borderRadius: "8px",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#4ADE80" }}>CV Saved</span>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div style={{
          background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>
            <span style={{ color: "#22D3EE", fontWeight: 600 }}>Synced:</span>{' '}
            Saving your CV also updates your profile skills, education and experience — so your match results stay current everywhere.
          </p>
        </div>

        {/* Success / Error Message */}
        {message.text && (
          <div style={{
            background: message.type === 'success' ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${message.type === 'success' ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={message.type === 'success' ? "#4ADE80" : "#F87171"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {message.type === 'success' ? (
                <><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></>
              ) : (
                <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              )}
            </svg>
            <span style={{ color: message.type === 'success' ? "#4ADE80" : "#F87171", fontSize: "13px", fontWeight: 600 }}>
              {message.text}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
          <CVForm
            formData={formData}
            errors={errors}
            profileImage={profileImage}
            onImageChange={handleImageChange}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
          />

          <div style={{ position: "sticky", top: "32px" }}>
            <CVPreview formData={formData} profileImage={profileImage} />
          </div>
        </div>
      </main>
    </div>
  );
}