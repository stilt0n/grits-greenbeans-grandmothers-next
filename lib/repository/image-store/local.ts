// local utility scripts for testing
import sharp from 'sharp';

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
