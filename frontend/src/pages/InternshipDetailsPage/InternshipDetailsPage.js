import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './InternshipDetailsPage.css';

function InternshipDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const internshipsDatabase = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Dialog Axiata PLC',
      shortCompany: 'Dialog Axiata',
      location: 'Colombo 02, Sri Lanka',
      shortLocation: 'Colombo',
      duration: '3-6 months',
      mode: 'Hybrid (3 days office / 2 remote)',
      shortMode: 'Hybrid',
      timePref: 'Day shifts (9am - 5pm)',
      shortTimePref: 'Day',
      stipend: 'LKR 35,000 - 45,000 / month',
      applicants: '124+ applied',
      description:
        "Join our innovative engineering team at Dialog Axiata, Sri Lanka's premier telecommunications provider, to work on cutting-edge digital solutions that serve millions of customers across the nation. This internship offers hands-on experience with modern technologies, mentorship from industry veterans, and the opportunity to contribute to real-world projects that make a difference.",
      description2:
        "As a Software Engineering Intern, you'll be part of the Digital Experience team, working on customer-facing applications and backend services. You'll collaborate with experienced engineers, participate in agile development processes, and gain invaluable industry experience.",
      deadline: '2026-04-10',
      posted: '2026-03-20',
      rating: '4.8 ★ (245 reviews)',
      topEmployer: 'Top Employer 2025',
      responsibilities: [
        'Design, develop, and maintain scalable backend services using Java and Spring Boot framework',
        'Build responsive frontend components using React.js and modern JavaScript',
        'Collaborate with cross-functional teams to define, design, and ship new features',
        'Write clean, maintainable, and well-documented code following best practices',
        'Participate in code reviews, technical discussions, and agile ceremonies',
        'Debug and resolve technical issues in production environments',
        'Contribute to system architecture decisions and technical documentation',
      ],
      requirements: [
        'Currently pursuing or recently completed a degree in Computer Science, Software Engineering, IT, or related field',
        'Strong understanding of Object-Oriented Programming concepts and data structures',
        'Proficiency in at least one programming language (Java, Python, or JavaScript)',
        'Familiarity with databases (SQL) and version control systems (Git)',
        'Good problem-solving skills and attention to detail',
        'Excellent communication and teamwork abilities',
        'Eagerness to learn new technologies and adapt to changing requirements',
      ],
      skills: [
        'Java',
        'Spring Boot',
        'React.js',
        'MySQL / PostgreSQL',
        'Git & GitHub',
        'REST APIs',
        'Docker (bonus)',
        'AWS (bonus)',
      ],
      benefits: [
        'Competitive monthly stipend (LKR 35,000 - 45,000)',
        'Hands-on mentorship from senior engineers and tech leads',
        'Opportunity for full-time conversion based on performance',
        'Modern office with state-of-the-art facilities in central Colombo',
        'Free lunch, snacks, and transportation allowance',
        'Access to professional development courses and certifications',
        'Flexible working hours with hybrid work model',
        'Networking opportunities with industry professionals',
      ],
    },
    {
      id: 2,
      title: 'Full Stack Developer Intern',
      company: 'WSO2',
      shortCompany: 'WSO2',
      location: 'Colombo, Sri Lanka',
      shortLocation: 'Colombo',
      duration: '6+ months',
      mode: 'Physical',
      shortMode: 'Physical',
      timePref: 'Day',
      shortTimePref: 'Day',
      stipend: 'LKR 40,000 / month',
      applicants: '96+ applied',
      description:
        'Work with modern technologies like React, Node.js, and cloud platforms. Perfect for passionate developers who want to build scalable enterprise applications.',
      description2:
        'You will work closely with engineering teams and contribute to full-stack product development.',
      deadline: '2026-04-25',
      posted: '2026-03-18',
      rating: '4.7 ★ (188 reviews)',
      topEmployer: 'Top Employer 2025',
      responsibilities: [
        'Build full-stack web features',
        'Develop reusable frontend components',
        'Support backend API development',
      ],
      requirements: [
        'Strong JavaScript fundamentals',
        'Basic knowledge of React and Node.js',
        'Good teamwork and problem solving',
      ],
      skills: ['React.js', 'Node.js', 'JavaScript', 'MongoDB', 'Git'],
      benefits: [
        'Mentorship from senior engineers',
        'Exposure to enterprise technologies',
        'Career growth opportunities',
      ],
    },
    {
      id: 4,
      title: 'Data Science Intern',
      company: 'IFS',
      shortCompany: 'IFS',
      location: 'Colombo, Sri Lanka',
      shortLocation: 'Colombo',
      duration: '6+ months',
      mode: 'Hybrid',
      shortMode: 'Hybrid',
      timePref: 'Day',
      shortTimePref: 'Day',
      stipend: 'LKR 45,000 / month',
      applicants: '81+ applied',
      description:
        'Work with big data, machine learning models, and AI projects. Mentorship from industry experts.',
      description2:
        'Support analytics workflows and build useful data-driven insights for teams.',
      deadline: '2026-05-01',
      posted: '2026-03-22',
      rating: '4.6 ★ (142 reviews)',
      topEmployer: 'Top Employer 2025',
      responsibilities: [
        'Clean and analyze data',
        'Support ML model experiments',
        'Create dashboards and reports',
      ],
      requirements: [
        'Strong Python basics',
        'Interest in AI and machine learning',
        'Analytical thinking',
      ],
      skills: ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Visualization'],
      benefits: [
        'Mentorship',
        'Real project exposure',
        'Hybrid work support',
      ],
    },
    {
      id: 6,
      title: 'DevOps Intern',
      company: 'Zone24x7',
      shortCompany: 'Zone24x7',
      location: 'Colombo, Sri Lanka',
      shortLocation: 'Colombo',
      duration: '6+ months',
      mode: 'Physical',
      shortMode: 'Physical',
      timePref: 'Day',
      shortTimePref: 'Day',
      stipend: 'LKR 38,000 / month',
      applicants: '59+ applied',
      description:
        'Learn CI/CD, cloud infrastructure, and automation tools. AWS certification support.',
      description2:
        'Work with deployment pipelines and infrastructure automation in a fast-paced environment.',
      deadline: '2026-04-28',
      posted: '2026-03-21',
      rating: '4.5 ★ (119 reviews)',
      topEmployer: 'Top Employer 2025',
      responsibilities: [
        'Assist with deployment pipelines',
        'Monitor cloud infrastructure',
        'Support automation tasks',
      ],
      requirements: [
        'Basic Linux knowledge',
        'Interest in cloud and DevOps',
        'Problem-solving ability',
      ],
      skills: ['AWS', 'Docker', 'CI/CD', 'Linux', 'Git'],
      benefits: [
        'Certification support',
        'Mentorship',
        'Hands-on DevOps exposure',
      ],
    },
  ];

  const currentInternship = useMemo(() => {
    return internshipsDatabase.find((item) => item.id === Number(id)) || internshipsDatabase[0];
  }, [id]);

  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    isError: false,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedInternships') || '[]');
    setSavedBookmarks(saved);
  }, []);

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
    }, 2500);
  };

  const isBookmarked = savedBookmarks.includes(currentInternship.id);

  const toggleBookmark = () => {
    let updatedBookmarks = [];

    if (isBookmarked) {
      updatedBookmarks = savedBookmarks.filter((item) => item !== currentInternship.id);
      showToast('💔 Removed from saved internships');
    } else {
      updatedBookmarks = [...savedBookmarks, currentInternship.id];
      showToast('❤️ Added to saved internships! You can view all saved opportunities in the Saved section.');
    }

    setSavedBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarkedInternships', JSON.stringify(updatedBookmarks));
  };

  const applyForInternship = () => {
    showToast(`📝 Successfully applied to ${currentInternship.title} at ${currentInternship.company}! You'll receive a confirmation email within 24 hours.`);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days remaining`;
  };

  const isClosingSoon = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 10 && diffDays >= 0;
  };

  const similarInternships = internshipsDatabase.filter(
    (item) => item.id !== currentInternship.id
  ).slice(0, 3);

  return (
    <div className="details-page">
      <div className="container">
        <div className="nav-bar">
          <button className="back-link" onClick={() => navigate('/results')}>
            ← Back to Results
          </button>
          <div className="logo">
            skill<span>sync</span> internships
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            {isClosingSoon(currentInternship.deadline) && (
              <div className="closing-badge">⏳ Closing Soon</div>
            )}

            <h1 className="job-title">{currentInternship.title}</h1>

            <div className="company-section">
              <span className="company-name">🏢 {currentInternship.company}</span>
              <span className="company-rating">⭐ {currentInternship.rating}</span>
              <span className="company-rating top-employer-badge">
                🏅 {currentInternship.topEmployer}
              </span>
            </div>

            <div className="quick-info">
              <div className="info-item">
                <div>
                  <div className="info-label">Location</div>
                  <div className="info-value">{currentInternship.location}</div>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <div className="info-label">Duration</div>
                  <div className="info-value">{currentInternship.duration}</div>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <div className="info-label">Work Mode</div>
                  <div className="info-value">{currentInternship.mode}</div>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <div className="info-label">Time Preference</div>
                  <div className="info-value">{currentInternship.timePref}</div>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <div className="info-label">Stipend</div>
                  <div className="info-value">{currentInternship.stipend}</div>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <div className="info-label">Applicants</div>
                  <div className="info-value">{currentInternship.applicants}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-content">
            <div className="section">
              <h3 className="section-title">ℹ️ About the Internship</h3>
              <p className="section-content">{currentInternship.description}</p>
              <p className="section-content section-content-space">
                {currentInternship.description2}
              </p>
            </div>

            <div className="section">
              <h3 className="section-title">📋 Key Responsibilities</h3>
              <ul className="requirements-list">
                {currentInternship.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title">🎓 Who Can Apply</h3>
              <ul className="requirements-list">
                {currentInternship.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h3 className="section-title">💻 Technical Skills We're Looking For</h3>
              <div className="skills-container">
                {currentInternship.skills.map((skill, index) => (
                  <span className="skill-tag" key={index}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">🎁 What We Offer</h3>
              <ul className="benefits-list">
                {currentInternship.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="deadline-warning">
              <div className="deadline-text">
                <strong>Application Deadline:</strong>{' '}
                <span className="deadline-date">{currentInternship.deadline}</span>
                <span className="deadline-extra">
                  ({getDaysRemaining(currentInternship.deadline)})
                </span>
              </div>
              <span className="deadline-alert">Limited spots available!</span>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={applyForInternship}>
                Apply Now
              </button>

              <button
                className={`btn-secondary ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={toggleBookmark}
              >
                {isBookmarked ? '❤️ Saved Internship' : '🤍 Save Internship'}
              </button>
            </div>
          </div>
        </div>

        <div className="similar-section">
          <h3 className="similar-title">⚡ You Might Also Like</h3>

          <div className="similar-grid">
            {similarInternships.map((item) => (
              <div
                className="similar-card"
                key={item.id}
                onClick={() => navigate(`/details/${item.id}`)}
              >
                <h4>{item.title}</h4>
                <p>🏢 {item.shortCompany}</p>
                <p>📍 {item.shortLocation}</p>
                <p>⏰ {getDaysRemaining(item.deadline)}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="details-footer">
          🛡️ Skill Sync Internships — Verified opportunities from top Sri Lankan employers
        </footer>
      </div>

      <div className={`toast-message ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default InternshipDetailsPage;