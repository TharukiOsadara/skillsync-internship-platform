import { useRef } from 'react';

const Ico = ({ size = 14, stroke = "currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const SectionTitle = ({ title, color = "#22D3EE" }) => (
  <h3 style={{
    fontSize: "10px",
    fontWeight: 700,
    color: color,
    letterSpacing: "0.15em",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}>
    <span style={{
      width: "16px",
      height: "2px",
      background: `linear-gradient(90deg, ${color}, transparent)`,
      borderRadius: "1px",
    }}/>
    {title}
  </h3>
);

function CVPreview({ formData, profileImage }) {
  const cvRef = useRef(null);

  // Check if we have any meaningful data to show
  const hasData = formData.fullName || formData.email || formData.phone;

  // Parse skills into array
  const skillsArray = formData.skills
    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Parse languages into array
  const languagesArray = formData.languages
    ? formData.languages.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleDownload = () => {
    if (!hasData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the CV');
      return;
    }

    const styles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #1e293b;
          line-height: 1.6;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .cv-container {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 40px;
          background: white;
        }
        .header {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 24px;
          margin-bottom: 28px;
        }
        .profile-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0891b2;
          flex-shrink: 0;
        }
        .header-info h1 {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .contact {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #64748b;
        }
        .contact span { display: flex; align-items: center; gap: 4px; }
        .links { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px; }
        .links a {
          font-size: 12px;
          color: #0891b2;
          text-decoration: none;
        }
        .section { margin-bottom: 24px; }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #0891b2;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .section-content {
          font-size: 13px;
          color: #475569;
          white-space: pre-line;
          line-height: 1.7;
        }
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          color: #0891b2;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #bae6fd;
        }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media print {
          body { padding: 20px; }
          .cv-container { border: none; padding: 0; }
        }
      </style>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formData.fullName || 'My CV'} - CV</title>
        ${styles}
      </head>
      <body>
        <div class="cv-container">
          <div class="header">
            ${profileImage ? `<img src="${profileImage}" alt="Profile" class="profile-img" />` : ''}
            <div class="header-info">
              <h1>${formData.fullName || 'Your Name'}</h1>
              <div class="contact">
                ${formData.email ? `<span>${formData.email}</span>` : ''}
                ${formData.phone ? `<span>${formData.phone}</span>` : ''}
                ${formData.address ? `<span>${formData.address}</span>` : ''}
              </div>
              ${(formData.linkedin || formData.github || formData.portfolio) ? `
              <div class="links">
                ${formData.linkedin ? `<a href="${formData.linkedin}">LinkedIn</a>` : ''}
                ${formData.github ? `<a href="${formData.github}">GitHub</a>` : ''}
                ${formData.portfolio ? `<a href="${formData.portfolio}">Portfolio</a>` : ''}
              </div>
              ` : ''}
            </div>
          </div>

          ${formData.summary ? `
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="section-content">${formData.summary}</p>
          </div>
          ` : ''}

          ${formData.experience ? `
          <div class="section">
            <h2 class="section-title">Experience</h2>
            <p class="section-content">${formData.experience}</p>
          </div>
          ` : ''}

          ${formData.education ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            <p class="section-content">${formData.education}</p>
          </div>
          ` : ''}

          ${formData.projects ? `
          <div class="section">
            <h2 class="section-title">Projects</h2>
            <p class="section-content">${formData.projects}</p>
          </div>
          ` : ''}

          ${skillsArray.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-container">
              ${skillsArray.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          ${formData.certifications ? `
          <div class="section">
            <h2 class="section-title">Certifications</h2>
            <p class="section-content">${formData.certifications}</p>
          </div>
          ` : ''}

          ${languagesArray.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Languages</h2>
            <div class="skills-container">
              ${languagesArray.map(lang => `<span class="skill">${lang}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          ${formData.hobbies ? `
          <div class="section">
            <h2 class="section-title">Interests</h2>
            <p class="section-content">${formData.hobbies}</p>
          </div>
          ` : ''}

          ${formData.references ? `
          <div class="section">
            <h2 class="section-title">References</h2>
            <p class="section-content">${formData.references}</p>
          </div>
          ` : ''}
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Empty state
  if (!hasData) {
    return (
      <section style={{
        background: "#0F172A",
        border: "2px dashed #1E293B",
        borderRadius: "16px",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "500px",
        textAlign: "center",
      }}>
        <div style={{
          width: "72px", height: "72px",
          background: "rgba(34,211,238,0.1)",
          border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          <Ico size={32} stroke="#22D3EE">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </Ico>
        </div>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "#22D3EE", letterSpacing: "0.2em", marginBottom: "12px" }}>
          LIVE PREVIEW
        </p>
        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#F1F5F9", margin: "0 0 10px" }}>
          Your CV Will Appear Here
        </h3>
        <p style={{ fontSize: "13px", color: "#64748B", maxWidth: "280px", lineHeight: 1.6 }}>
          Start filling in the form to see your CV come to life in real-time
        </p>
      </section>
    );
  }

  // CV Preview with data
  return (
    <section ref={cvRef} style={{
      background: "#0F172A",
      border: "1px solid #1E293B",
      borderRadius: "16px",
      padding: "20px",
      maxHeight: "calc(100vh - 120px)",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "8px", height: "8px",
            background: "#4ADE80", borderRadius: "50%",
            animation: "pulse 2s infinite",
          }}/>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.15em" }}>
            LIVE PREVIEW
          </p>
        </div>
        <button onClick={handleDownload} style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 14px",
          background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
          border: "none", borderRadius: "8px",
          color: "#060D1A", fontSize: "11px", fontWeight: 700,
          cursor: "pointer",
        }}>
          <Ico size={12} stroke="#060D1A">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </Ico>
          Download
        </button>
      </div>

      {/* CV Content */}
      <div style={{
        background: "#0B1220",
        border: "1px solid #1E293B",
        borderRadius: "12px",
        padding: "20px",
      }}>
        {/* Profile Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          paddingBottom: "16px",
          borderBottom: "1px solid #1E293B",
          marginBottom: "20px",
        }}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{
              width: "64px", height: "64px", borderRadius: "50%",
              objectFit: "cover", border: "2px solid #22D3EE", flexShrink: 0,
            }} />
          ) : (
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(34,211,238,0.1)",
              border: "2px solid rgba(34,211,238,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Ico size={28} stroke="#22D3EE">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </Ico>
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#F1F5F9", margin: "0 0 6px" }}>
              {formData.fullName || 'Your Name'}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "11px", color: "#94A3B8" }}>
              {formData.email && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Ico size={10} stroke="#64748B"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Ico>
                  {formData.email}
                </span>
              )}
              {formData.phone && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Ico size={10} stroke="#64748B"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></Ico>
                  {formData.phone}
                </span>
              )}
              {formData.address && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Ico size={10} stroke="#64748B"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ico>
                  {formData.address}
                </span>
              )}
            </div>
            {/* Social Links */}
            {(formData.linkedin || formData.github || formData.portfolio) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {formData.linkedin && (
                  <span style={{
                    fontSize: "10px", color: "#22D3EE",
                    background: "rgba(34,211,238,0.1)",
                    padding: "3px 8px", borderRadius: "4px",
                  }}>LinkedIn</span>
                )}
                {formData.github && (
                  <span style={{
                    fontSize: "10px", color: "#A78BFA",
                    background: "rgba(167,139,250,0.1)",
                    padding: "3px 8px", borderRadius: "4px",
                  }}>GitHub</span>
                )}
                {formData.portfolio && (
                  <span style={{
                    fontSize: "10px", color: "#4ADE80",
                    background: "rgba(74,222,128,0.1)",
                    padding: "3px 8px", borderRadius: "4px",
                  }}>Portfolio</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.summary && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="SUMMARY" color="#A78BFA" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {formData.experience && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="EXPERIENCE" color="#F472B6" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.experience}
            </p>
          </div>
        )}

        {/* Education */}
        {formData.education && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="EDUCATION" color="#4ADE80" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.education}
            </p>
          </div>
        )}

        {/* Projects */}
        {formData.projects && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="PROJECTS" color="#FBBF24" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.projects}
            </p>
          </div>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="SKILLS" color="#22D3EE" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {skillsArray.map((skill, index) => (
                <span key={index} style={{
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#22D3EE",
                  padding: "4px 10px", borderRadius: "99px",
                  fontSize: "10px", fontWeight: 600,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {formData.certifications && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="CERTIFICATIONS" color="#FB923C" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.certifications}
            </p>
          </div>
        )}

        {/* Languages */}
        {languagesArray.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="LANGUAGES" color="#38BDF8" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {languagesArray.map((lang, index) => (
                <span key={index} style={{
                  background: "rgba(56,189,248,0.1)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  color: "#38BDF8",
                  padding: "4px 10px", borderRadius: "99px",
                  fontSize: "10px", fontWeight: 600,
                }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {formData.hobbies && (
          <div style={{ marginBottom: "18px" }}>
            <SectionTitle title="INTERESTS" color="#E879F9" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7 }}>
              {formData.hobbies}
            </p>
          </div>
        )}

        {/* References */}
        {formData.references && (
          <div>
            <SectionTitle title="REFERENCES" color="#94A3B8" />
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {formData.references}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

export default CVPreview;
