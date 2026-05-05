import { useState } from 'react';
import './ActionBar.css';

export default function ActionBar({ status, resultUrl, resultBlob, onReset, onToast }) {
  const [copied, setCopied] = useState(false);

  if (status === 'idle' || status === 'processing') return null;

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'watermarkout-result.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 150);
  };

  const handleCopy = async () => {
    if (!resultBlob) return;
    try {
      await navigator.clipboard.write([
        new window.ClipboardItem({ 'image/png': resultBlob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (onToast) {
        onToast("Copy not supported in this browser — please use Download instead");
      }
    }
  };

  return (
    <div className="action-bar fade-in">
      {status === 'done' && (
        <>
          <button className="btn btn-primary" onClick={handleDownload} aria-label="Download processed image">
            Download Image
          </button>
          <button className="btn btn-secondary" onClick={handleCopy} aria-label="Copy processed image to clipboard">
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button className="btn btn-outline" onClick={onReset} aria-label="Process another image">
            Process Another Image
          </button>
        </>
      )}
      {status === 'error' && (
        <button className="btn btn-primary" onClick={onReset} aria-label="Try processing again">
          Try Again
        </button>
      )}
    </div>
  );
}
