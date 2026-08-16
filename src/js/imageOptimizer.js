/**
 * Client-side Image Optimization & Compression Utility
 * Resizes and compresses images to fit within Firestore (<1MB) and LocalStorage limits
 */

/**
 * Compress and optimize an image file or data URL to lightweight web-ready base64
 * @param {File|Blob|string} imageSource - The File, Blob, or Data URL to compress
 * @param {Object} options - { maxWidth, maxHeight, quality, type }
 * @returns {Promise<string>} - Compressed base64 Data URL
 */
export async function optimizeImage(imageSource, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.82,
    type = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate scaled dimensions keeping aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Render to canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageSource === 'string' ? imageSource : '');
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw background white in case of PNG with transparency to JPEG
      if (type === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export compressed base64
      try {
        const compressedDataUrl = canvas.toDataURL(type, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Fallback to original
        resolve(typeof imageSource === 'string' ? imageSource : '');
      }
    };

    img.onerror = () => {
      // If error loading, fallback to original if string
      resolve(typeof imageSource === 'string' ? imageSource : '');
    };

    if (imageSource instanceof Blob || imageSource instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      resolve('');
    }
  });
}

/**
 * Handle file input with automatic compression tailored for avatars, banners or projects
 */
export async function handleOptimizedUpload(e, type, callback) {
  const file = e.target.files?.[0];
  if (!file) return;

  const presets = {
    avatar: { maxWidth: 400, maxHeight: 400, quality: 0.85, type: 'image/jpeg' },
    banner: { maxWidth: 1280, maxHeight: 600, quality: 0.82, type: 'image/jpeg' },
    project: { maxWidth: 800, maxHeight: 600, quality: 0.80, type: 'image/jpeg' },
    wallet: { maxWidth: 400, maxHeight: 400, quality: 0.85, type: 'image/jpeg' }
  };

  const preset = presets[type] || presets.banner;

  try {
    const compressed = await optimizeImage(file, preset);
    if (compressed && callback) {
      callback(compressed);
    }
  } catch (err) {
    console.warn('Image optimization failed, reading raw:', err);
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }
}
