import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Small delay to ensure storage is cleared
    setTimeout(() => {
      navigate('/login');
    }, 100);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Logging out...</h2>
      <p>Please wait while you are being redirected.</p>
    </div>
  );
}

export default Logout;