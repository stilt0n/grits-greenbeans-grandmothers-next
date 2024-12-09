import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { loadSharedConfigFiles } from '@smithy/shared-ini-file-loader';
import { requireConfig, requireEnv } from '@/types/typeguards';

const bucketName = requireEnv('bucket').bucket;
const filePath = '../transformed_image.png';
const profile = 'ggg';

const uploadFile = async (bucketName: string, filePath: string) => {
  const sharedConfigFiles = await loadSharedConfigFiles();
  const config = sharedConfigFiles.configFile[profile];
  const { aws_access_key_id, aws_secret_access_key } = requireConfig(
    sharedConfigFiles.credentialsFile[profile],
    'aws_access_key_id',
    'aws_secret_access_key'
  );
  const b2 = new S3Client({
    credentials: {
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    },
    region: config.region,
    endpoint: config.endpoint_url,
  });

  try {
    const file = await Bun.file(filePath);
    const buffer = Buffer.from(await file.arrayBuffer());
    const keyName = 'test_image_pizza.png';
    const response = await b2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: keyName,
        Body: buffer,
        ContentLength: buffer.length,
      })
    );
    console.log(`Success. Got response: ${JSON.stringify(response, null, 2)}`);
  } catch (err) {
    console.error('Error uploading file:', err);
  }
};

if (import.meta.main) {
  uploadFile(bucketName, filePath);
}
