import { useEffect, useState } from 'react';
import { getAllJobs } from '../api';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div>
        <h1>Available Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Available Jobs</h1>
        <div className="error-container">
          <p>⚠️ {error}</p>
          <button onClick={loadJobs}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1> Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment. Please check back later.</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong> Min Applicants Needed:</strong> {job.min_applicants}</p>
              <p><strong> Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;