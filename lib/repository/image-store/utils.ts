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

// Detect image format from the leading bytes of the buffer. Returns the
// canonical MIME type, or null if the bytes don't match a supported format.
// Signatures sourced from the format specs; all four are stable since the 1990s.
export const detectImageMime = (buffer: Buffer): string | null => {
  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: "GIF87a" or "GIF89a"
  if (buffer.length >= 6) {
    const header = buffer.toString('ascii', 0, 6);
    if (header === 'GIF87a' || header === 'GIF89a') {
      return 'image/gif';
    }
  }

  // WebP: "RIFF"....".WEBP" (4 bytes file size between the two markers)
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
};

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

  // Sniff the header before reading the full payload so spoofed uploads don't
  // force us to materialize the whole buffer in memory.
  const headerBytes = Buffer.from(await file.slice(0, 12).arrayBuffer());
  const detectedMime = detectImageMime(headerBytes);
  if (detectedMime !== file.type) {
    console.error(
      `Rejected upload: declared mime "${file.type}" does not match file signature (${detectedMime ?? 'unknown'})`
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
