import { useState, useRef } from 'react';
import './ProBanner.css';

export default function ProBanner({ visible }) {
  const [dismissed, setDismissed] = useState(false);
  const emailRef = useRef(null);

  if (!visible || dismissed) return null;

  const handleNotify = () => {
    const email = emailRef.current?.value || '';
    const body = email ? `Please add ${email} to the waitlist.` : '';
    const mailtoUrl = `mailto:hello@your-domain.com?subject=WatermarkOut%20Pro%20Waitlist&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="pro-banner fade-in">
      <button 
        className="pro-dismiss" 
        onClick={() => setDismissed(true)} 
        aria-label="Dismiss banner"
      >
        ×
      </button>
      <div className="pro-content">
        <h2 className="pro-heading">Need to process many images?</h2>
        <p className="pro-text">Batch processing and priority queue coming soon — join the waitlist.</p>
        
        <div className="pro-form" role="form">
          <label htmlFor="pro-email" className="sr-only">Email address</label>
          <input 
            id="pro-email"
            type="email" 
            ref={emailRef}
            placeholder="your@email.com" 
            className="pro-input"
          />
          <button type="button" className="pro-submit" onClick={handleNotify}>
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}
