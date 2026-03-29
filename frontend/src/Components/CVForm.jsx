import { useRef, useState } from 'react';

const Ico = ({ size = 18, stroke = "currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const SectionHeader = ({ title, icon, color = "#22D3EE" }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #1E293B",
  }}>
    <div style={{
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      background: `${color}15`,
      border: `1px solid ${color}30`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Ico size={16} stroke={color}>{icon}</Ico>
    </div>
    <h3 style={{
      fontSize: "14px",
      fontWeight: 700,
      color: "#F1F5F9",
      margin: 0,
    }}>{title}</h3>
  </div>
);

function CVForm({ formData, errors, profileImage, onImageChange, onChange, onSubmit, saving }) {
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState('personal');

  const sections = [
    { id: 'personal', label: 'Personal', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
    { id: 'summary', label: 'Summary', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
    { id: 'education', label: 'Education', icon: <><path d="M22 10v6M2 10v6"/><path d="M12 2L1 8l11 6 9-4.91"/><path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5"/></> },
    { id: 'experience', label: 'Experience', icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
    { id: 'skills', label: 'Skills', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></> },
    { id: 'additional', label: 'Additional', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></> },
  ];

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = (fieldId) => ({
    width: "100%",
    padding: "12px 14px",
    background: errors[fieldId] ? "rgba(248,113,113,0.05)" : "#0B1220",
    border: errors[fieldId] ? "1px solid rgba(248,113,113,0.4)" : "1px solid #1E293B",
    borderRadius: "10px",
    color: "#F1F5F9",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  });

  const textareaStyle = (fieldId) => ({
    ...inputStyle(fieldId),
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",
  });

  const renderInput = (id, label, placeholder, type = "text", maxLength, helper) => (
    <div key={id} style={{ marginBottom: "14px" }}>
      <label style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "#94A3B8",
        marginBottom: "6px",
      }}>
        {label}
        {!['fullName', 'email', 'phone'].includes(id) && (
          <span style={{ color: "#64748B", fontWeight: 400 }}> (Optional)</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={formData[id] || ''}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={inputStyle(id)}
        onFocus={e => {
          if (!errors[id]) {
            e.target.style.borderColor = "rgba(34,211,238,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)";
          }
        }}
        onBlur={e => {
          if (!errors[id]) {
            e.target.style.borderColor = "#1E293B";
            e.target.style.boxShadow = "none";
          }
        }}
      />
      {helper && !errors[id] && (
        <p style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>{helper}</p>
      )}
      {errors[id] && (
        <p style={{ fontSize: "11px", color: "#F87171", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          <Ico size={12} stroke="#F87171"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Ico>
          {errors[id]}
        </p>
      )}
    </div>
  );

  const renderTextarea = (id, label, placeholder, rows = 4, helper) => (
    <div key={id} style={{ marginBottom: "14px" }}>
      <label style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "#94A3B8",
        marginBottom: "6px",
      }}>
        {label}
        <span style={{ color: "#64748B", fontWeight: 400 }}> (Optional)</span>
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={formData[id] || ''}
        onChange={onChange}
        placeholder={placeholder}
        style={textareaStyle(id)}
        onFocus={e => {
          if (!errors[id]) {
            e.target.style.borderColor = "rgba(34,211,238,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.1)";
          }
        }}
        onBlur={e => {
          if (!errors[id]) {
            e.target.style.borderColor = "#1E293B";
            e.target.style.boxShadow = "none";
          }
        }}
      />
      {helper && (
        <p style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>{helper}</p>
      )}
    </div>
  );

  return (
    <section style={{
      background: "#0F172A",
      border: "1px solid #1E293B",
      borderRadius: "16px",
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "#22D3EE", letterSpacing: "0.2em", marginBottom: "6px" }}>
          CV BUILDER
        </p>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: 0 }}>
          Build Your Professional CV
        </h2>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
          Fill in your details - preview updates in real-time
        </p>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: "flex",
        gap: "6px",
        marginBottom: "20px",
        overflowX: "auto",
        paddingBottom: "4px",
      }}>
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: activeSection === section.id ? "rgba(34,211,238,0.15)" : "transparent",
              border: activeSection === section.id ? "1px solid rgba(34,211,238,0.3)" : "1px solid #1E293B",
              borderRadius: "8px",
              color: activeSection === section.id ? "#22D3EE" : "#64748B",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            <Ico size={14} stroke="currentColor">{section.icon}</Ico>
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate>
        {/* Personal Section */}
        {activeSection === 'personal' && (
          <div>
            <SectionHeader
              title="Personal Information"
              icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
            />

            {/* Profile Image */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px",
              background: "rgba(34,211,238,0.03)",
              border: "1px dashed rgba(34,211,238,0.2)",
              borderRadius: "12px",
              marginBottom: "16px",
              cursor: "pointer",
            }}
            onClick={handleImageClick}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />

              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{
                  width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid #22D3EE",
                }} />
              ) : (
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%", background: "rgba(34,211,238,0.1)",
                  border: "2px dashed rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Ico size={28} stroke="#22D3EE"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ico>
                </div>
              )}

              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#F1F5F9", margin: "0 0 4px" }}>
                  {profileImage ? 'Change Photo' : 'Add Profile Photo'}
                </p>
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>
                  JPG, PNG up to 5MB - Saved with your CV
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {renderInput('fullName', 'Full Name *', 'John Doe')}
              {renderInput('email', 'Email *', 'john@example.com', 'email')}
              {renderInput('phone', 'Phone *', '0771234567', 'tel', 10)}
              {renderInput('address', 'Address', 'Colombo, Sri Lanka')}
              {renderInput('linkedin', 'LinkedIn', 'linkedin.com/in/johndoe')}
              {renderInput('github', 'GitHub', 'github.com/johndoe')}
            </div>
            {renderInput('portfolio', 'Portfolio Website', 'https://johndoe.com')}
          </div>
        )}

        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div>
            <SectionHeader
              title="Professional Summary"
              icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
              color="#A78BFA"
            />
            {renderTextarea('summary', 'About Me / Objective',
              'A passionate software developer with 2+ years of experience in building web applications. Skilled in React, Node.js, and modern web technologies. Looking to contribute to innovative projects and grow as a full-stack developer.',
              5,
              'Write a brief overview of yourself, your career goals, and what makes you unique'
            )}
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div>
            <SectionHeader
              title="Education"
              icon={<><path d="M22 10v6M2 10v6"/><path d="M12 2L1 8l11 6 9-4.91"/><path d="M6 12v5c0 2.5 2.7 4 6 4s6-1.5 6-4v-5"/></>}
              color="#4ADE80"
            />
            {renderTextarea('education', 'Education History',
              `BSc (Hons) in Computer Science
University of Colombo | 2020 - 2024
GPA: 3.8/4.0
- Dean's List 2022, 2023
- Final Year Project: AI-powered Internship Matching System

Advanced Level - Physical Science
Royal College, Colombo | 2017 - 2019
Results: 3A's`,
              8,
              'List your educational qualifications, degrees, certifications, and achievements'
            )}
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div>
            <SectionHeader
              title="Work Experience"
              icon={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>}
              color="#F472B6"
            />
            {renderTextarea('experience', 'Work Experience',
              `Software Developer Intern
TechCorp Solutions | Jun 2023 - Dec 2023
- Developed responsive web applications using React and Node.js
- Collaborated with a team of 5 developers on agile projects
- Improved application performance by 40% through code optimization

Freelance Web Developer
Self-employed | Jan 2022 - Present
- Built 10+ websites for small businesses
- Managed client relationships and project timelines`,
              8,
              'List your work experiences with company name, duration, and key responsibilities'
            )}

            {renderTextarea('projects', 'Projects',
              `E-Commerce Platform (React, Node.js, MongoDB)
- Built a full-stack e-commerce website with payment integration
- Implemented user authentication and admin dashboard
- GitHub: github.com/johndoe/ecommerce

Task Management App (React Native, Firebase)
- Developed cross-platform mobile app for task management
- 500+ downloads on Google Play Store`,
              6,
              'Highlight your personal or academic projects with technologies used'
            )}
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div>
            <SectionHeader
              title="Skills & Expertise"
              icon={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>}
              color="#FBBF24"
            />
            {renderInput('skills', 'Technical Skills',
              'React, Node.js, JavaScript, Python, MongoDB, Git, Docker',
              undefined,
              'Separate each skill with a comma'
            )}
            {renderTextarea('certifications', 'Certifications',
              `AWS Certified Cloud Practitioner - 2023
Google Professional Cloud Developer - 2023
Meta Front-End Developer Certificate - 2022`,
              4,
              'List your professional certifications'
            )}
            {renderInput('languages', 'Languages',
              'English (Fluent), Sinhala (Native), Tamil (Basic)',
              undefined,
              'List languages you speak with proficiency level'
            )}
          </div>
        )}

        {/* Additional Section */}
        {activeSection === 'additional' && (
          <div>
            <SectionHeader
              title="Additional Information"
              icon={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>}
              color="#38BDF8"
            />
            {renderInput('hobbies', 'Hobbies & Interests',
              'Photography, Hiking, Open Source Contributing, Chess',
              undefined,
              'Show your personality with your interests'
            )}
            {renderTextarea('references', 'References',
              `Dr. John Smith
Senior Lecturer, University of Colombo
Email: john.smith@cmb.ac.lk | Phone: 011-2345678

Ms. Sarah Johnson
Tech Lead, TechCorp Solutions
Email: sarah.j@techcorp.com | Phone: 077-1234567`,
              5,
              'Add professional references (or write "Available upon request")'
            )}
          </div>
        )}

        {/* Navigation & Submit */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #1E293B",
        }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {sections.findIndex(s => s.id === activeSection) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  setActiveSection(sections[idx - 1].id);
                }}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  border: "1px solid #1E293B",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
            )}
            {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex(s => s.id === activeSection);
                  setActiveSection(sections[idx + 1].id);
                }}
                style={{
                  padding: "10px 16px",
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  borderRadius: "8px",
                  color: "#22D3EE",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Next Section
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 24px",
              background: saving ? "rgba(34,211,238,0.3)" : "linear-gradient(135deg, #22D3EE, #06B6D4)",
              border: "none",
              borderRadius: "10px",
              color: "#060D1A",
              fontSize: "13px",
              fontWeight: 800,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {saving ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#060D1A" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-9.77"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Ico size={16} stroke="#060D1A">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </Ico>
                Save CV
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

export default CVForm;
