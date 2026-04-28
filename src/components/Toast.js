import { useEffect } from 'react';

function Toast({ message = '', type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      {message}
      <button className="toast-close" onClick={() => onClose && onClose()} aria-label="Dismiss">✖</button>
    </div>
  );
}

export default Toast;
