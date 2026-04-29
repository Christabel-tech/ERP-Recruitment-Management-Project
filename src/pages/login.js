import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import Toast from '../components/Toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant'); // Default to applicant
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
      const { token, role: userRole, name } = response.data;

      // Validate that selected role matches user's actual role
      if (userRole !== role) {
        setError(`This account is registered as a ${userRole}, not a ${role}. Please select the correct role.`);
        setLoading(false);
        return;
      }

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
          <p className="lead">Sign in to access your account and manage your activities.</p>

          <div className="mb-4">
            <h3 className="mb-2">Quick login</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => { setEmail('applicant@test.com'); setPassword('password'); setRole('applicant'); }}>Applicant</button>
              <button className="btn btn-secondary" onClick={() => { setEmail('recruiter@test.com'); setPassword('password'); setRole('recruiter'); }}>Recruiter</button>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: 12 }}> Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-container">{error}</div>}

            <div className="form-row">
              <label>Login as:</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="role"
                    value="applicant"
                    checked={role === 'applicant'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Applicant
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === 'recruiter'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Recruiter
                </label>
              </div>
            </div>

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'applicant' ? 'applicant@test.com' : 'recruiter@test.com'}
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
              {role === 'applicant' && <Link to="/register" className="btn btn-ghost">Register</Link>}
            </div>
          </form>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
}

export default Login;