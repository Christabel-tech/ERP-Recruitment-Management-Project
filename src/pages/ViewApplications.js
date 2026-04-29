import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications, updateApplicationStatus } from '../api';

function ViewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, shortlisted, rejected
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getAllApplications();
      setApplications(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div>
      <h2>All Job Applications</h2>
      
      {/* Stats Summary */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <div><strong>Total:</strong> {stats.total}</div>
        <div><strong>Pending:</strong> <span style={{ color: '#856404' }}>{stats.pending}</span></div>
        <div><strong>Shortlisted:</strong> <span style={{ color: '#155724' }}>{stats.shortlisted}</span></div>
        <div><strong>Rejected:</strong> <span style={{ color: '#721c24' }}>{stats.rejected}</span></div>
      </div>
      
      {/* Filter Buttons */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{ backgroundColor: filter === 'all' ? '#007bff' : '#6c757d' }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('pending')}
          style={{ backgroundColor: filter === 'pending' ? '#ffc107' : '#6c757d', color: filter === 'pending' ? '#333' : 'white' }}
        >
          Pending ({stats.pending})
        </button>
        <button 
          onClick={() => setFilter('shortlisted')}
          style={{ backgroundColor: filter === 'shortlisted' ? '#28a745' : '#6c757d' }}
        >
          Shortlisted ({stats.shortlisted})
        </button>
        <button 
          onClick={() => setFilter('rejected')}
          style={{ backgroundColor: filter === 'rejected' ? '#dc3545' : '#6c757d' }}
        >
          Rejected ({stats.rejected})
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant Name</th>
              <th>Job Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CV</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.name}</td>
                <td>{app.job_title}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>
                  <a href={app.cv} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                </td>
                <td>{new Date(app.applied_date).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    display: 'inline-block',
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
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                      disabled={updating === app.id}
                      style={{ backgroundColor: '#28a745', fontSize: '0.8rem' }}
                    >
                      {updating === app.id ? '...' : '✓ Shortlist'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                      disabled={updating === app.id}
                      style={{ backgroundColor: '#dc3545', fontSize: '0.8rem' }}
                    >
                      {updating === app.id ? '...' : '✗ Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <p style={{ marginTop: '2rem' }}>
        <Link to="/recruiter-dashboard">← Back to Dashboard</Link>
      </p>
    </div>
  );
}

export default ViewApplications;