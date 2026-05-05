import { useState } from 'react';
import './SharePrompt.css';

export default function SharePrompt({ visible, appUrl }) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const tweetText = "Removed a Gemini watermark in seconds with WatermarkOut — free, private, no upload needed";
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(appUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link");
    }
  };

  return (
    <div className="share-prompt fade-in">
      <h3 className="share-heading">Was this helpful? Share it:</h3>
      <div className="share-buttons">
        <a 
          href={xUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn share-x"
          aria-label="Share on X (Twitter)"
        >
          Share on X (Twitter)
        </a>
        <button 
          className="share-btn share-copy" 
          onClick={handleCopyLink}
          aria-label="Copy Link"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
