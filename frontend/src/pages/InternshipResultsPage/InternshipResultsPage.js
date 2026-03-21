import React, { useEffect, useMemo, useState } from 'react';
import './InternshipResultsPage.css';
import { useNavigate } from 'react-router-dom';

function InternshipResultsPage() {
  const navigate = useNavigate();
  const internshipsData = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Dialog Axiata',
      location: 'Colombo',
      duration: '3-6 months',
      mode: 'Hybrid',
      timePref: 'Day',
      description:
        'Join our innovative team to work on cutting-edge telecom solutions. Great learning opportunity with mentorship.',
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
        'Work with modern technologies like React, Node.js, and cloud platforms. Perfect for passionate developers.',
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
        'Learn SEO, social media marketing, and analytics. Great for creative minds.',
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
        'Work with big data, machine learning models, and AI projects. Mentorship from industry experts.',
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
        'Create beautiful interfaces and user experiences. Must have Figma/Adobe XD knowledge.',
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
        'Learn CI/CD, cloud infrastructure, and automation tools. AWS certification support.',
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
        'Brand management, campaign coordination, and market research experience.',
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
        'Work with AWS, Azure, and cloud-native technologies. Certification sponsorship available.',
      deadline: '2026-05-15',
      posted: '2026-03-25',
    },
  ];

  const [currentFilters, setCurrentFilters] = useState({
    location: '',
    role: '',
    duration: '',
    mode: '',
    timePref: '',
  });

  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [currentSort, setCurrentSort] = useState('newest');
  const [toast, setToast] = useState({
    show: false,
    message: '',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedInternships') || '[]');
    setSavedBookmarks(saved);

    const urlParams = new URLSearchParams(window.location.search);

    setCurrentFilters({
      location: urlParams.get('location') || '',
      role: urlParams.get('role') || '',
      duration: urlParams.get('duration') || '',
      mode: urlParams.get('mode') || '',
      timePref: urlParams.get('time') || '',
    });
  }, []);

  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
      });
    }, 2500);
  };

  const isClosingSoon = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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

  const filteredAndSortedInternships = useMemo(() => {
    let filtered = internshipsData.filter((internship) => {
      const matchesLocation = currentFilters.location
        ? internship.location.toLowerCase().includes(currentFilters.location.toLowerCase())
        : true;

      const matchesRole = currentFilters.role
        ? internship.title.toLowerCase().includes(currentFilters.role.toLowerCase()) ||
          internship.company.toLowerCase().includes(currentFilters.role.toLowerCase())
        : true;

      const matchesDuration = currentFilters.duration
        ? internship.duration === currentFilters.duration
        : true;

      const matchesMode = currentFilters.mode ? internship.mode === currentFilters.mode : true;

      const matchesTimePref = currentFilters.timePref
        ? internship.timePref === currentFilters.timePref
        : true;

      return (
        matchesLocation &&
        matchesRole &&
        matchesDuration &&
        matchesMode &&
        matchesTimePref
      );
    }).map((internship) => ({
      ...internship,
      closingSoon: isClosingSoon(internship.deadline),
    }));

    switch (currentSort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        break;
      case 'closing':
        filtered.sort((a, b) => {
          if (a.closingSoon && !b.closingSoon) return -1;
          if (!a.closingSoon && b.closingSoon) return 1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [currentFilters, currentSort]);

  const summaryText = useMemo(() => {
    const summary = [];

    if (currentFilters.location) summary.push(`📍 ${currentFilters.location}`);
    if (currentFilters.role) summary.push(`💼 ${currentFilters.role}`);
    if (currentFilters.duration) summary.push(`📅 ${currentFilters.duration}`);
    if (currentFilters.mode) summary.push(`🖥️ ${currentFilters.mode}`);
    if (currentFilters.timePref) summary.push(`⏰ ${currentFilters.timePref}`);

    return summary.length > 0
      ? `Showing results for: ${summary.join(' · ')}`
      : 'Showing all available internships';
  }, [currentFilters]);

  const toggleBookmark = (id) => {
    let updatedBookmarks = [];

    if (savedBookmarks.includes(id)) {
      updatedBookmarks = savedBookmarks.filter((item) => item !== id);
      showToast('💔 Removed from bookmarks');
    } else {
      updatedBookmarks = [...savedBookmarks, id];
      showToast('❤️ Added to bookmarks!');
    }

    setSavedBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarkedInternships', JSON.stringify(updatedBookmarks));
  };

  const applyForInternship = (title, company) => {
    showToast(`📝 Applied to ${title} at ${company}! Check your email for confirmation.`);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      location: '',
      role: '',
      duration: '',
      mode: '',
      timePref: '',
    };

    setCurrentFilters(resetFilters);
    window.history.pushState({}, '', window.location.pathname);
    showToast('Filters reset! Showing all internships');
  };

  const handleBackToSearch = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
  <div className="results-page">
    <div className="container">
      <div className="results-header">
        <a href="/" className="back-link" onClick={handleBackToSearch}>
          ← Back to Search
        </a>

        <h1 className="results-title">Internship Opportunities</h1>

        <div className="results-sub-row">
          <div className="search-summary">{summaryText}</div>

          <button
            className="saved-btn"
            onClick={() => navigate('/saved')}
          >
            ❤️ Saved
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="sort-group">
          <label>Sort by:</label>
          <select
            className="sort-select"
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value)}
          >
            <option value="newest">✨ Newest First</option>
            <option value="closing">⚠️ Closing Soon</option>
            <option value="title">📝 Title A-Z</option>
          </select>
        </div>
    

          <div className="results-count">
            {filteredAndSortedInternships.length} internship
            {filteredAndSortedInternships.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {filteredAndSortedInternships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No internships found</h3>
            <p className="empty-subtext">Try adjusting your search filters</p>
            <button className="reset-search-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredAndSortedInternships.map((internship) => {
              const isBookmarked = savedBookmarks.includes(internship.id);
              const daysRemaining = getDaysRemaining(internship.deadline);
              const isUrgent = internship.closingSoon;

              return (
                <div className="internship-card" key={internship.id}>
                  <div className="card-badge">
                    {internship.closingSoon && (
                      <span className="closing-soon-badge">Closing Soon</span>
                    )}
                  </div>

                  <div className="card-top">
                    <div className="card-header">
                      <h3 className="job-title">{internship.title}</h3>
                      <div className="company-name">🏢 {internship.company}</div>
                    </div>

                    <button
                      className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(internship.id)}
                    >
                      ❤️
                    </button>
                  </div>

                  <div className="card-details">
                    <span className="detail-item">📍 {internship.location}</span>
                    <span className="detail-item">📅 {internship.duration}</span>
                    <span className="detail-item">🌐 {internship.mode}</span>
                    <span className="detail-item">⏰ {internship.timePref}</span>
                  </div>

                  <p className="card-description">{internship.description}</p>

                  <div className={`deadline ${isUrgent ? 'urgent' : ''}`}>
                    <span>
                      ⏳ Application deadline: {formatDate(internship.deadline)} ({daysRemaining})
                    </span>
                  </div>

                  <button
                     className="apply-btn"
                     onClick={() => navigate(`/details/${internship.id}`)}
                  >
                     View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`toast-message ${toast.show ? 'show' : ''}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default InternshipResultsPage;