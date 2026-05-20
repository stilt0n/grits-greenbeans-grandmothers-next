'use client';
import type { CropCoordinates } from '@/lib/translation/schema';

const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;
const JPEG_QUALITY = 0.85;

export const processImageForUpload = async (
  file: File,
  crop: CropCoordinates
): Promise<File> => {
  const bitmap = await createImageBitmap(
    file,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    {
      resizeWidth: TARGET_WIDTH,
      resizeHeight: TARGET_HEIGHT,
      resizeQuality: 'high',
    }
  );

  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Failed to acquire 2D canvas context');
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  );
  if (!blob) {
    throw new Error('Failed to encode image as JPEG');
  }

  return new File([blob], 'image.jpg', { type: 'image/jpeg' });
};
