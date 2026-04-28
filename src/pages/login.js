import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import Toast from '../components/Toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      const { token, role, name } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', name || email);

      setToast({ message: `Welcome back, ${name || email}!`, type: 'success' });

      // Redirect based on role
      setTimeout(() => {
        if (role === 'applicant') navigate('/applicant-dashboard');
        else if (role === 'recruiter') navigate('/recruiter-dashboard');
      }, 600);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setToast({ message: err.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 820, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
        <div>
          <h1>Welcome back</h1>
          <p className="lead">Sign in to manage applications, post jobs and review candidates.</p>

          <div className="mb-4">
            <h3 className="mb-2">Quick login</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => { setEmail('applicant@test.com'); setPassword('password'); }}>Applicant</button>
              <button className="btn btn-secondary" onClick={() => { setEmail('recruiter@test.com'); setPassword('password'); }}>Recruiter</button>
            </div>
          </div>

          <p className="muted">Use the quick buttons to autofill demo credentials then press Login.</p>
        </div>

        <div>
          <h2 style={{ marginBottom: 12 }}> Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-container">{error}</div>}

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@test.com or recruiter@test.com"
                required
              />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="any password (mock mode)"
                required
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
              <Link to="/register" className="btn btn-ghost">Register</Link>
            </div>
          </form>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
}

export default Login;