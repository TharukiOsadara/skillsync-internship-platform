import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedInternshipsPage.css';

function SavedInternshipsPage() {
  const navigate = useNavigate();

  const internshipsDatabase = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Dialog Axiata',
      location: 'Colombo',
      duration: '3-6 months',
      mode: 'Hybrid',
      timePref: 'Day',
      description:
        'Join our innovative team to work on cutting-edge telecom solutions. Great learning opportunity with mentorship from industry experts. You\'ll work with Java, Spring Boot, and modern cloud technologies.',
      deadline: '2026-04-10',
      posted: '2026-03-20',
    },
    {
      id: 2,
      title: 'Full Stack Developer Intern',
      company: 'WSO2',
      location: 'Colombo',
      duration: '6+ months',
      mode: 'Physical',
      timePref: 'Day',
      description:
        'Work with modern technologies like React, Node.js, and cloud platforms. Perfect for passionate developers who want to build scalable enterprise applications.',
      deadline: '2026-04-25',
      posted: '2026-03-18',
    },
    {
      id: 3,
      title: 'Digital Marketing Intern',
      company: 'Virtusa',
      location: 'Remote',
      duration: '3-6 months',
      mode: 'Online',
      timePref: 'Flexible',
      description:
        'Learn SEO, social media marketing, content strategy, and analytics. Great for creative minds who want to build a career in digital marketing.',
      deadline: '2026-04-05',
      posted: '2026-03-15',
    },
    {
      id: 4,
      title: 'Data Science Intern',
      company: 'IFS',
      location: 'Colombo',
      duration: '6+ months',
      mode: 'Hybrid',
      timePref: 'Day',
      description:
        'Work with big data, machine learning models, and AI projects. Mentorship from industry experts. Python, TensorFlow, and cloud experience preferred.',
      deadline: '2026-05-01',
      posted: '2026-03-22',
    },
    {
      id: 5,
      title: 'UI/UX Design Intern',
      company: 'Sysco LABS',
      location: 'Kandy',
      duration: '3-6 months',
      mode: 'Physical',
      timePref: 'Day',
      description:
        'Create beautiful interfaces and user experiences. Must have Figma/Adobe XD knowledge. Work on real-world products used by millions.',
      deadline: '2026-04-12',
      posted: '2026-03-19',
    },
    {
      id: 6,
      title: 'DevOps Intern',
      company: 'Zone24x7',
      location: 'Colombo',
      duration: '6+ months',
      mode: 'Physical',
      timePref: 'Day',
      description:
        'Learn CI/CD, cloud infrastructure, and automation tools. AWS certification support. Great for those interested in cloud and infrastructure.',
      deadline: '2026-04-28',
      posted: '2026-03-21',
    },
    {
      id: 7,
      title: 'Marketing & Communications Intern',
      company: 'Unilever Sri Lanka',
      location: 'Colombo',
      duration: '1-3 months',
      mode: 'Hybrid',
      timePref: 'Day',
      description:
        'Brand management, campaign coordination, and market research experience. Work with one of Sri Lanka\'s top FMCG brands.',
      deadline: '2026-04-08',
      posted: '2026-03-17',
    },
    {
      id: 8,
      title: 'Cloud Engineering Intern',
      company: 'hSenid Business Solutions',
      location: 'Remote',
      duration: '3-6 months',
      mode: 'Online',
      timePref: 'Flexible',
      description:
        'Work with AWS, Azure, and cloud-native technologies. Certification sponsorship available. Perfect for cloud enthusiasts.',
      deadline: '2026-05-15',
      posted: '2026-03-25',
    },
  ];

  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    isError: false,
  });
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedInternships') || '[]');
    setSavedBookmarks(saved);

    const handleStorageChange = (e) => {
      if (e.key === 'bookmarkedInternships') {
        setSavedBookmarks(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const savedInternships = useMemo(() => {
    return internshipsDatabase.filter((internship) =>
      savedBookmarks.includes(internship.id)
    );
  }, [savedBookmarks]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days left`;
  };

  const isUrgentDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return diffTime <= 7 * 24 * 60 * 60 * 1000 && diffTime >= 0;
  };

  const removeBookmark = (id) => {
    const updated = savedBookmarks.filter((item) => item !== id);
    setSavedBookmarks(updated);
    localStorage.setItem('bookmarkedInternships', JSON.stringify(updated));
    showToast('💔 Removed from saved internships');
  };

  const clearAllBookmarks = () => {
    if (savedBookmarks.length === 0) return;

    const confirmed = window.confirm(
      'Are you sure you want to remove all saved internships?'
    );

    if (confirmed) {
      setSavedBookmarks([]);
      localStorage.setItem('bookmarkedInternships', JSON.stringify([]));
      showToast('🗑️ All saved internships cleared');
    }
  };

  const viewDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  const applyForInternship = (title, company) => {
    showToast(`📝 Applied to ${title} at ${company}! Check your email for confirmation.`);
  };

  const applyFromModal = () => {
    if (selectedInternship) {
      showToast(`📝 Applied to ${selectedInternship.title} at ${selectedInternship.company}!`);
      closeModal();
    }
  };

  return (
    <div className="saved-page">
      <div className="container">
        <div className="saved-header">
          <button className="back-link" onClick={() => navigate('/results')}>
            ← Back to Results
          </button>

          <div className="saved-title">
            <span className="saved-heart">❤️</span>
            <span>My Saved Internships</span>
          </div>

          <div className="saved-subtitle">
            Your curated collection of dream opportunities — revisit and apply anytime
          </div>
        </div>

        <div className="stats-bar">
          <div className="stats-info">
            <span className="saved-count">{savedInternships.length} saved</span>
            <span className="stats-text">🔖 Your special collection</span>
          </div>

          <button className="clear-all-btn" onClick={clearAllBookmarks}>
            🗑️ Clear All
          </button>
        </div>

        {savedInternships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No saved internships yet</h3>
            <p>Start exploring opportunities and click the ❤️ button to save your favorites!</p>
            <button className="browse-btn" onClick={() => navigate('/results')}>
              🔍 Browse Internships
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {savedInternships.map((internship) => {
              const isUrgent = isUrgentDeadline(internship.deadline);
              const daysRemaining = getDaysRemaining(internship.deadline);

              return (
                <div className="saved-card" key={internship.id}>
                  <div className="card-header">
                    <div className="job-info">
                      <h3 className="job-title">{internship.title}</h3>
                      <div className="company-name">🏢 {internship.company}</div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => viewDetails(internship)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn remove-btn"
                        onClick={() => removeBookmark(internship.id)}
                        title="Remove from Saved"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="card-details">
                    <span className="detail-item">📍 {internship.location}</span>
                    <span className="detail-item">📅 {internship.duration}</span>
                    <span className="detail-item">🌐 {internship.mode}</span>
                    <span className="detail-item">⏰ {internship.timePref}</span>
                  </div>

                  <p className="card-description">
                    {internship.description.length > 100
                      ? `${internship.description.substring(0, 100)}...`
                      : internship.description}
                  </p>

                  <div className={`deadline ${isUrgent ? 'urgent' : ''}`}>
                    <span>
                      ⏳ Deadline: {formatDate(internship.deadline)} ({daysRemaining})
                    </span>
                  </div>

                  <button
                    className="apply-btn"
                    onClick={() =>
                      applyForInternship(internship.title, internship.company)
                    }
                  >
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedInternship && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ℹ️ Internship Details</h2>
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-detail-item">
              <strong>Position</strong>
              <p>{selectedInternship.title}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Company</strong>
              <p>{selectedInternship.company}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Location</strong>
              <p>{selectedInternship.location}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Duration</strong>
              <p>{selectedInternship.duration}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Mode</strong>
              <p>{selectedInternship.mode}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Time Preference</strong>
              <p>{selectedInternship.timePref}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Description</strong>
              <p>{selectedInternship.description}</p>
            </div>

            <div className="modal-detail-item">
              <strong>Application Deadline</strong>
              <p className={isUrgentDeadline(selectedInternship.deadline) ? 'urgent-text' : ''}>
                {formatDate(selectedInternship.deadline)} ({getDaysRemaining(selectedInternship.deadline)})
              </p>
            </div>

            <button className="apply-btn modal-apply-btn" onClick={applyFromModal}>
              Apply Now
            </button>
          </div>
        </div>
      )}

      <div className={`toast-message ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default SavedInternshipsPage;