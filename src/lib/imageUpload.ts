/**
 * Pregătește imaginile înainte de încărcare: redimensionare + conversie WebP
 * + generarea unei miniaturi. Totul se întâmplă în browser, deci pe server
 * ajung fișiere mici și rapide.
 */

export interface PreparedImage {
  full: Blob;
  thumb: Blob;
  width: number;
  height: number;
}

const MAX_FULL = 1920;
const MAX_THUMB = 600;

const loadBitmap = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fallback below */
    }
  }
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const draw = (
  source: ImageBitmap | HTMLImageElement,
  maxSize: number,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> => {
  const sw = 'width' in source ? source.width : 0;
  const sh = 'height' in source ? source.height : 0;
  const scale = Math.min(1, maxSize / Math.max(sw, sh));
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponibil');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source as CanvasImageSource, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, width, height }) : reject(new Error('Conversie eșuată'))),
      'image/webp',
      quality,
    );
  });
};

export const prepareImage = async (file: File): Promise<PreparedImage> => {
  const source = await loadBitmap(file);
  const full = await draw(source, MAX_FULL, 0.82);
  const thumb = await draw(source, MAX_THUMB, 0.7);
  if ('close' in source && typeof source.close === 'function') source.close();
  return { full: full.blob, thumb: thumb.blob, width: full.width, height: full.height };
};

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
