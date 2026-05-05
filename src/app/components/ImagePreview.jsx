import { useState, useEffect } from 'react';
import './ImagePreview.css';

export default function ImagePreview({ originalFile, resultUrl, isProcessing, meta }) {
  const [originalUrl, setOriginalUrl] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalUrl(null);
    }
  }, [originalFile]);

  const showComparison = originalUrl && resultUrl;

  return (
    <div className="preview-container">
      {showComparison ? (
        <div className="comparison-wrapper">
          <div className="comparison-container">
            <img src={resultUrl} alt="Processed image with watermark removed" className="comparison-img result-img" role="img" />
            <div 
              className="comparison-img original-clip" 
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <img src={originalUrl} alt="Original image before watermark removal" className="comparison-inner-img" role="img" />
            </div>
            <div className="slider-line" style={{ left: `${sliderValue}%` }}></div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(e.target.value)}
              className="comparison-slider"
              aria-label="Before/after comparison slider"
            />
            <div className="badge before-badge">Before</div>
            <div className="badge after-badge">After</div>
          </div>
        </div>
      ) : (
        <div className="panels-wrapper">
          <div className="panel left-panel">
            <div className="badge panel-badge">Before</div>
            {originalUrl ? (
              <img src={originalUrl} alt="Original image before watermark removal" className="panel-img" role="img" />
            ) : (
              <div className="placeholder">
                <p>Upload an image to begin</p>
              </div>
            )}
          </div>
          
          <div className="panel right-panel">
            <div className="badge panel-badge">After</div>
            {isProcessing ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : resultUrl ? (
              <img src={resultUrl} alt="Processed image with watermark removed" className="panel-img" role="img" />
            ) : (
              <div className="placeholder">
                <p>Result will appear here</p>
              </div>
            )}
            {!isProcessing && !resultUrl && meta && meta.applied === false && (
              <div className="notice-overlay">
                <p>No watermark detected — original returned</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
