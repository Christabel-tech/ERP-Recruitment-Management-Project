import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAllJobs, submitApplication, checkAlreadyApplied } from '../api';

function SubmitApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobIdFromUrl = queryParams.get('jobId');
  
  const [selectedJobId, setSelectedJobId] = useState(jobIdFromUrl || '');
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cover_letter: ''

  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await getAllJobs();
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs');
    }
  };

  // Check if already applied when job is selected
  useEffect(() => {
    if (selectedJobId) {
      checkApplication();
    }
  }, [selectedJobId]);

  const checkApplication = async () => {
    try {
      const response = await checkAlreadyApplied(selectedJobId);
      if (response.data.alreadyApplied) {
        setError('You have already applied for this job!');
        return;
      }
      setError('');
    } catch (err) {
      console.error('Check failed:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!selectedJobId) {
      setError('Please select a job');
      setLoading(false);
      return;
    }

    if (!resumeFile) {
      setError('Please upload your resume');
      setLoading(false);
      return;
    }

    // Create FormData for file upload
    const data = new FormData();
    data.append('job_id', selectedJobId);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('cover_letter', formData.cover_letter);
    data.append('resume', resumeFile);

    try {
      await submitApplication(data);
      setSuccess('Application submitted successfully!');
      
      // Clear form
      setFormData({ name: '', email: '', phone: '', cover_letter: '' });
      setResumeFile(null);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/applicant-dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2> Submit Job Application</h2>
      
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}>⚠️ {error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', background: '#dfd', borderRadius: '4px' }}>✅ {success}</div>}
        
        <div>
          <label>Select Job:</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            required
          >
            <option value="">-- Select a job --</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} (Deadline: {new Date(job.deadline).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Cover Letter (optional):</label>
          <textarea
            name="cover_letter"
            value={formData.cover_letter}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us why you're a good fit..."
          />
        </div>
        
        <div>
          <label>Resume/CV (PDF, DOC, or TXT):</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/applicant-dashboard">← Back to Dashboard</Link>
      </p>
    </div>
  );
}

export default SubmitApplication;