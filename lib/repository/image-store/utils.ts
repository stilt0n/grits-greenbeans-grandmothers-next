import type { CropCoordinates } from '@/lib/translation/schema';
import sharp from 'sharp';

const IMAGE_DIMENSIONS = {
  width: 1280,
  height: 720,
};

const fileToBuffer = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const fileIsImage = (file: File) => file.type.startsWith('image/');

/**
 * Assumes cropCoordinates values are all integers.
 * You should parse cropCoordinates with the cropCoordinateSchema
 * before passing them to this function.
 * @param imageFile
 * @param cropCoordinates
 * @returns
 */
export const preprocessImage = async (
  imageFile: File,
  cropCoordinates: CropCoordinates
) => {
  if (!fileIsImage(imageFile)) {
    throw new TypeError(
      `preprocessImage expects File to be an image file but received a different type of file. File type received: ${imageFile.type}`
    );
  }

  try {
    const fileBuffer = await fileToBuffer(imageFile);
    return sharp(fileBuffer)
      .extract({
        left: cropCoordinates.x,
        top: cropCoordinates.y,
        width: cropCoordinates.width,
        height: cropCoordinates.height,
      })
      .resize(IMAGE_DIMENSIONS.width, IMAGE_DIMENSIONS.height)
      .toBuffer();
  } catch (error) {
    console.error(
      'encountered an error preprocessing the image! See error message below:'
    );
    console.error((error as any)?.message ?? String(error));
  }
};
