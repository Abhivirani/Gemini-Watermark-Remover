import { useState, useEffect } from 'react';
import './ProcessingStatus.css';

export default function ProcessingStatus({ status, error, meta }) {
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    let timer;
    if (status === 'processing') {
      timer = setTimeout(() => setIsTakingLong(true), 5000);
    } else {
      setIsTakingLong(false);
    }
    return () => clearTimeout(timer);
  }, [status]);

  if (status === 'idle') return null;

  return (
    <div className="status-container fade-in" aria-live="polite">
      {status === 'processing' && (
        <div className="status-processing">
          <div className="pulsing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <p className="status-text">Processing your image...</p>
          {isTakingLong && <p className="status-subtext">This may take a moment for large images...</p>}
        </div>
      )}

      {status === 'done' && meta?.applied === true && (
        <div className="status-success">
          <div className="icon-circle success-circle">✓</div>
          <div className="status-text-group">
            <p className="status-text success-text">Watermark removed successfully</p>
            {meta.decisionTier && <p className="status-subtext">Detection: {meta.decisionTier}</p>}
          </div>
        </div>
      )}

      {status === 'done' && meta?.applied === false && (
        <div className="status-warning">
          <div className="icon-circle warning-circle">i</div>
          <p className="status-text warning-text">No watermark found — original image returned unchanged</p>
        </div>
      )}

      {status === 'error' && (
        <div className="status-error">
          <div className="icon-circle error-circle">!</div>
          <p className="status-text error-text">{error}</p>
        </div>
      )}
    </div>
  );
}
