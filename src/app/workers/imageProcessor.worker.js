// @vite-ignore — this file is a Web Worker, imported with ?worker suffix

import { processImage } from '../services/watermarkService.js';

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  if (type === 'PING') {
    self.postMessage({ type: 'PONG' });
    return;
  }

  if (type === 'PROCESS') {
    try {
      const { file } = payload;
      const { blob, meta } = await processImage(file);
      self.postMessage({ type: 'SUCCESS', payload: { blob, meta } });
    } catch (error) {
      self.postMessage({ type: 'ERROR', payload: { message: error.message || 'Processing failed' } });
    }
  }
});

self.addEventListener('error', (event) => {
  self.postMessage({ type: 'ERROR', payload: { message: 'Worker encountered an unexpected error.' } });
});

self.addEventListener('unhandledrejection', (event) => {
  self.postMessage({ type: 'ERROR', payload: { message: event.reason?.message || 'Unknown error.' } });
});
