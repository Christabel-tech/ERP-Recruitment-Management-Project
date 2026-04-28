import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, getMyApplications } from '../api';

function ApplicantDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userName = localStorage.getItem('userName') || 'Applicant';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        getAllJobs(),
        getMyApplications()
      ]);
      setJobs(jobsRes.data);
      setMyApplications(appsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Get IDs of jobs already applied to
  const appliedJobIds = myApplications.map(app => app.job_id);

  if (loading) {
    return (
      <div>
        <h2>Welcome, {userName}!</h2>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Welcome, {userName}!</h2>
        <div className="error-container">
          <p>⚠️ {error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2> Welcome, {userName}!</h2>
      
      {/* My Applications Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h3> My Applications</h3>
        {myApplications.length === 0 ? (
          <p>You haven't applied for any jobs yet. Check out available jobs below!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.job_title}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: 
                        app.status === 'shortlisted' ? '#d4edda' :
                        app.status === 'rejected' ? '#f8d7da' :
                        '#fff3cd',
                      color:
                        app.status === 'shortlisted' ? '#155724' :
                        app.status === 'rejected' ? '#721c24' :
                        '#856404'
                    }}>
                      {app.status || 'pending'}
                    </span>
                  </td>
                  <td>{new Date(app.applied_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Available Jobs Section */}
      <section>
        <h3> Available Jobs to Apply</h3>
        {jobs.length === 0 ? (
          <p>No jobs available at the moment.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => {
              const alreadyApplied = appliedJobIds.includes(job.id);
              return (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p><strong> Min Applicants:</strong> {job.min_applicants}</p>
                  <p><strong> Start:</strong> {new Date(job.start_date).toLocaleDateString()}</p>
                  <p><strong> Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                  <p><strong> Current:</strong> {job.current_applicants || 0} applied</p>
                  
                  {alreadyApplied ? (
                    <button disabled style={{ backgroundColor: '#6c757d', cursor: 'not-allowed' }}>
                      ✓ Already Applied
                    </button>
                  ) : (
                    <Link to={`/submit-application?jobId=${job.id}`}>
                      <button> Apply Now</button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default ApplicantDashboard;