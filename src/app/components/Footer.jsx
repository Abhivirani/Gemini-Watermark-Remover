import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-privacy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-icon">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <p>Your images never leave your device — all processing happens locally in your browser.</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/GargantuaX/gemini-watermark-remover" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
        <span className="footer-divider">•</span>
        <span>Engine based on open-source Reverse Alpha Blending algorithm</span>
      </div>
    </footer>
  );
}
