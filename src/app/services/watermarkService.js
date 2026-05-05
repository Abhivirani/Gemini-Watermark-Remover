import { createWatermarkEngine, removeWatermarkFromImage } from '@/sdk/index.js';

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

let enginePromise = null;

export async function loadEngine() {
  try {
    if (!enginePromise) {
      // The SDK does not require asset URLs because the alpha maps are embedded.
      enginePromise = createWatermarkEngine();
    }
    return await enginePromise;
  } catch (error) {
    enginePromise = null;
    throw new Error(`Failed to load engine: ${error.message || String(error)}`);
  }
}

export function validateImage(file) {
  if (!file || !(file instanceof File)) {
    return { valid: false, reason: 'Invalid file provided.' };
  }
  
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { valid: false, reason: 'Unsupported format. Please use JPEG, PNG, or WebP.' };
  }
  
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  if (file.size > MAX_SIZE) {
    return { valid: false, reason: 'File is too large. Maximum size is 20MB.' };
  }
  
  return { valid: true, reason: null };
}

export async function fileToImageElement(file) {
  try {
    if (typeof createImageBitmap !== 'undefined') {
      return await createImageBitmap(file);
    }
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image file.'));
      };
      
      img.src = objectUrl;
    });
  } catch (error) {
    throw new Error(`Failed to decode image file. ${error.message || String(error)}`);
  }
}

export async function processImage(file) {
  try {
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }
    
    const engine = await loadEngine();
    const imgElement = await fileToImageElement(file);
    
    const { canvas, meta } = await removeWatermarkFromImage(imgElement, { engine });
    
    if (!canvas) {
      throw new Error('Watermark processing failed to return a valid canvas.');
    }
    
    let blob;
    if (canvas.convertToBlob) {
      // OffscreenCanvas in Web Worker
      blob = await canvas.convertToBlob({ type: 'image/png' });
    } else if (canvas.toBlob) {
      // HTMLCanvasElement on Main Thread
      blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Failed to encode processed canvas to Blob.'));
          }
        }, 'image/png');
      });
    } else {
      throw new Error('Canvas export not supported in this environment.');
    }
    
    return {
      blob,
      meta: {
        applied: meta?.applied || false,
        decisionTier: meta?.decisionTier || 'unknown'
      }
    };
  } catch (error) {
    throw new Error(`${error.message || String(error)}`);
  }
}

export function blobToObjectUrl(blob) {
  try {
    if (!blob || !(blob instanceof Blob)) {
      throw new Error('Invalid blob provided for ObjectURL creation.');
    }
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error(`Failed to create ObjectURL: ${error.message || String(error)}`);
  }
}
