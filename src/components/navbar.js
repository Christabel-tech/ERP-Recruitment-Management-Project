import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    // Navigate to home page for applicants, login for others
    if (role === 'applicant') {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">EmployeeRecruit</Link>

        <button
          className="nav-toggle btn btn-ghost"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? '✖' : '☰'}
        </button>

        <div className={`nav-menu ${open ? 'open' : ''}`}>
          {token && role === 'recruiter' ? (
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          ) : (
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          )}
          {!token ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              {role === 'applicant' && (
                <Link to="/applicant-dashboard" onClick={() => setOpen(false)}>My Dashboard</Link>
              )}

              {role === 'recruiter' && (
                <>
                  <Link to="/recruiter-dashboard" onClick={() => setOpen(false)}>Recruiter Panel</Link>
                  <Link to="/post-job" onClick={() => setOpen(false)}>Post Job</Link>
                  <Link to="/view-applications" onClick={() => setOpen(false)}>View Applications</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="nav-right">
        {token ? (
          <button class="btn btn-ghost" onClick={() => { setOpen(false); handleLogout(); }}> Logout</button>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;