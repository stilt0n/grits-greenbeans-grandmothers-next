import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// most docs show v4 but v7 is ordered which seems kind of nice
import { v7 as uuidv7 } from 'uuid';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { requireEnv } from '@/types/typeguards';
import { IMAGE_BASE_URL, SITE_URL } from '@/lib/constants';
import type { ProcessedImage } from './utils';

export const isLocalImageStore = () =>
  process.env.LOCAL_IMAGE_STORE === '1' ||
  process.env.LOCAL_IMAGE_STORE === 'true';

const writeImageToLocalDisk = async ({ buffer, extension }: ProcessedImage) => {
  const filename = `${uuidv7()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return {
    response: null,
    imageUrl: `${SITE_URL}/uploads/${filename}`,
  };
};

/**
 * @throws {Error}
 */
export const uploadFileToImageStore = async (image: ProcessedImage) => {
  if (isLocalImageStore()) {
    return writeImageToLocalDisk(image);
  }

  const { buffer, contentType, extension } = image;
  const { aws_access_key_id, aws_secret_access_key, region, endpoint, bucket } =
    requireEnv(
      'aws_access_key_id',
      'aws_secret_access_key',
      'region',
      'endpoint',
      'bucket'
    );

  const b2 = new S3Client({
    credentials: {
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    },
    region,
    endpoint,
  });

  const keyName = `images/${uuidv7()}.${extension}`;

  const response = await b2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: keyName,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    })
  );

  return {
    response,
    imageUrl: `${IMAGE_BASE_URL}/${keyName}`,
  };
};
