import { useState, useRef, useEffect, useCallback } from 'react';
import { validateImage } from '../services/watermarkService.js';

export function useImageProcessor() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const workerRef = useRef(null);
  const latestResultRef = useRef(null);

  // Keep latest result in a ref so the cleanup function can access it
  // without needing to include `result` in the useEffect dependencies
  useEffect(() => {
    latestResultRef.current = result;
  }, [result]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/imageProcessor.worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SUCCESS') {
        const { blob, meta } = payload;
        // Enforce the MIME type explicitly in case serialization stripped it
        const typedBlob = new Blob([blob], { type: 'image/png' });
        const objectUrl = URL.createObjectURL(typedBlob);
        setResult({ blob: typedBlob, objectUrl, meta });
        setStatus('done');
      } else if (type === 'ERROR') {
        setError(payload.message || 'An error occurred during processing.');
        setStatus('error');
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (latestResultRef.current && latestResultRef.current.objectUrl) {
        URL.revokeObjectURL(latestResultRef.current.objectUrl);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setResult((prev) => {
      if (prev && prev.objectUrl) {
        URL.revokeObjectURL(prev.objectUrl);
      }
      return null;
    });
    setStatus('idle');
    setError(null);
  }, []);

  const processImage = useCallback((file) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      setStatus('error');
      setError(validation.reason);
      return;
    }

    setStatus('processing');
    setError(null);
    setResult((prev) => {
      if (prev && prev.objectUrl) {
        URL.revokeObjectURL(prev.objectUrl);
      }
      return null;
    });

    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'PROCESS', payload: { file } });
    }
  }, []);

  return { status, result, error, processImage, reset };
}
