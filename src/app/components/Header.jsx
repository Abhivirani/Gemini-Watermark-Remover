import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-title-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <h1>WatermarkOut</h1>
      </div>
      <p className="header-subtitle">Remove Gemini watermarks instantly — 100% private, processed in your browser</p>
    </header>
  );
}
