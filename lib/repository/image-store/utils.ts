const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export const fileToImageBuffer = async (file: File): Promise<Buffer | null> => {
  if (!file.type.startsWith('image/')) {
    console.error(
      `Rejected upload: expected an image/* mime type but received "${file.type}"`
    );
    return null;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    console.error(
      `Rejected upload: file is ${file.size} bytes, exceeds limit of ${MAX_UPLOAD_BYTES}`
    );
    return null;
  }

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
