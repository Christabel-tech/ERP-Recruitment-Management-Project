import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postJob } from '../api';

function PostJob() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    min_applicants: 1,
    start_date: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (new Date(jobData.start_date) > new Date(jobData.deadline)) {
      setError('Start date cannot be after deadline');
      setLoading(false);
      return;
    }

    try {
      await postJob(jobData);
      setSuccess('Job posted successfully!');
      
      // Clear form
      setJobData({
        title: '',
        description: '',
        min_applicants: 1,
        start_date: '',
        deadline: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Post New Job</h2>
      
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}>⚠️ {error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', background: '#dfd', borderRadius: '4px' }}>✅ {success}</div>}
        
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div>
          <label>Job Description:</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            rows="5"
            required
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>
        
        <div>
          <label>Minimum Applicants Needed:</label>
          <input
            type="number"
            name="min_applicants"
            value={jobData.min_applicants}
            onChange={handleChange}
            min="1"
            required
          />
          <small>Number of applicants required before review starts</small>
        </div>
        
        <div>
          <label>Application Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={jobData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Application Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={jobData.deadline}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/recruiter-dashboard">← Back to Dashboard</Link>
      </p>
    </div>
  );
}

export default PostJob;