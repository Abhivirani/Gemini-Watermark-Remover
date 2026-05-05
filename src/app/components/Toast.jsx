import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast slide-up" role="status" aria-live="assertive">
      <p>{message}</p>
    </div>
  );
}
