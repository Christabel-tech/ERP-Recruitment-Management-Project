import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllJobs } from '../api';


function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in as applicant
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isApplicant = token && role === 'applicant';

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <section className="hero-section">
          <h1>Welcome to EmployeeRecruit</h1>
          <p className="hero-sub">Find your next opportunity or the perfect candidate!</p>
        </section>
        <section className="info-section">
          <h2>Why Apply With Us?</h2>
          <ul className="info-list">
            <li>Browse jobs without registration</li>
            <li>Easy application process for all roles</li>
            <li>Track your application status after login</li>
            <li>Recruiters post and manage jobs efficiently</li>
          </ul>
        </section>
        <section className="jobs-section">
          <h2>Available Jobs</h2>
          <p>Loading jobs...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <section className="hero-section">
          <h1>Welcome to EmployeeRecruit</h1>
        </section>
        <section className="jobs-section">
          <h2>Available Jobs</h2>
          <div className="error-container">
            <p>⚠️ {error}</p>
            <button onClick={loadJobs}>Retry</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to EmployeeRecruit</h1>
        <p className="hero-sub">Find your next opportunity or the perfect candidate!</p>
      </section>

      <section className="info-section">
        <h2>How to Apply for a Job</h2>
        <ol className="info-list">
          <li>Browse the jobs below and click <b>Apply Now</b> on your preferred job.</li>
          <li>If you are not logged in, you will be prompted to login or register.</li>
          <li>Fill out the application form and upload your resume.</li>
          <li>Track your application status from your dashboard after logging in.</li>
        </ol>
      </section>

      <section className="jobs-section">
        <h2>Available Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs available at the moment. Please check back later.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-description">{job.description}</p>
                <div className="job-details">
                  <div className="job-detail">
                    <strong>Min Applicants Needed:</strong> {job.min_applicants}
                  </div>
                  <div className="job-detail">
                    <strong>Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}
                  </div>
                  <div className="job-detail">
                    <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
                  </div>
                  <div className="job-detail">
                    <strong>Current Applicants:</strong> {job.current_applicants ?? 0}
                  </div>
                </div>
                {isApplicant ? (
                  <Link to={`/submit-application?jobId=${job.id}`}>
                    <button className="apply-btn">Apply Now</button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <button className="apply-btn">Login to Apply</button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;