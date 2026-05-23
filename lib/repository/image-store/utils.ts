const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

export const fileToImageBuffer = async (
  file: File
): Promise<ProcessedImage | null> => {
  const extension = EXTENSION_BY_MIME[file.type];
  if (!extension) {
    console.error(`Rejected upload: unsupported mime type "${file.type}"`);
    return null;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    console.error(
      `Rejected upload: file is ${file.size} bytes, exceeds limit of ${MAX_UPLOAD_BYTES}`
    );
    return null;
  }

  const arrayBuffer = await file.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: file.type,
    extension,
  };
};
