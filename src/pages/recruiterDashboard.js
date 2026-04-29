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
  const [jobs, setJobs] = useState([]);
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
      
      const jobsList = jobsRes.data;
      const applications = appsRes.data;
      const pending = applications.filter(app => app.status === 'pending').length;
      const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
      const rejected = applications.filter(app => app.status === 'rejected').length;
      
      setJobs(jobsList);
      setStats({
        totalJobs: jobsList.length,
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

      {/* All Posted Jobs Section */}
      <section style={{ marginTop: '3rem' }}>
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Your Posted Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs posted yet. <Link to="/post-job" style={{ color: '#007bff', textDecoration: 'underline' }}>Post your first job</Link></p>
        ) : (
          <div className="jobs-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {jobs.map(job => (
              <div key={job.id} className="job-card" style={{
                border: '1px solid #ddd',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#f9f9f9'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#007bff' }}>{job.title}</h4>
                <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.95rem' }}>{job.description}</p>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Min Applicants Needed:</strong> {job.min_applicants}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
                  </div>
                  <div style={{
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#e7f3ff',
                    borderRadius: '4px',
                    color: '#0056b3'
                  }}>
                    <strong>Current Applicants:</strong> {job.current_applicants ?? 0}
                  </div>
                </div>
                <Link to={`/view-applications`} style={{ marginTop: '1rem', display: 'inline-block' }}>
                  <button style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>
                    View Applications
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecruiterDashboard;