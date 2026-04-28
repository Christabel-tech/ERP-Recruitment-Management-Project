import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllJobs, getAllApplications } from '../api';

function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingCount: 0,
    shortlistedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Recruiter';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        getAllJobs(),
        getAllApplications()
      ]);
      
      const applications = appsRes.data;
      const pending = applications.filter(app => app.status === 'pending').length;
      const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
      const rejected = applications.filter(app => app.status === 'rejected').length;
      
      setStats({
        totalJobs: jobsRes.data.length,
        totalApplications: applications.length,
        pendingCount: pending,
        shortlistedCount: shortlisted,
        rejectedCount: rejected
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2> Welcome, {userName}!</h2>
      <p>Here's your recruitment overview.</p>
      
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        margin: '2rem 0'
      }}>
        <div style={{ background: '#007bff', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{stats.totalJobs}</h3>
          <p>Total Jobs Posted</p>
        </div>
        
        <div style={{ background: '#28a745', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{stats.totalApplications}</h3>
          <p>Total Applications</p>
        </div>
        
        <div style={{ background: '#ffc107', color: '#333', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{stats.pendingCount}</h3>
          <p>Pending Review</p>
        </div>
        
        <div style={{ background: '#17a2b8', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{stats.shortlistedCount}</h3>
          <p>Shortlisted</p>
        </div>
        
        <div style={{ background: '#dc3545', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{stats.rejectedCount}</h3>
          <p>Rejected</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <Link to="/post-job">
          <button style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
             Post New Job
          </button>
        </Link>
        
        <Link to="/view-applications">
          <button style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem', backgroundColor: '#28a745' }}>
             View All Applications
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RecruiterDashboard;