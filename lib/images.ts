import type { CropCoordinates } from '@/types/recipeTypes';
import sharp from 'sharp';

const IMAGE_DIMENSIONS = {
  width: 400,
  height: 400,
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
    console.warn('warning: received file that is not an image');
    return;
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

// This is strictly for testing purposes
export const writeImageBufferToFile = async (buffer: Buffer) => {
  console.log(`writing to working directory ${process.cwd()}`);
  sharp(buffer)
    .toFile('transformed_image.png')
    .then(() => console.log('wrote image to transformed_image.png'))
    .catch((e) => {
      console.error('encountered an error writing the file');
      console.error(e?.message);
    });
};
