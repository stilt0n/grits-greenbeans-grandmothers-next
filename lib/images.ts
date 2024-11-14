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

export const preprocessImage = async (
  imageFile: File,
  cropCoordinates: CropCoordinates
) => {
  if (!fileIsImage(imageFile)) {
    return;
  }

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
