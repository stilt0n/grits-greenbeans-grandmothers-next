import { describe, it, expect } from 'bun:test';
import { detectImageMime, fileToImageBuffer } from '../utils';

const PNG_HEADER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const PNG_BODY = Buffer.alloc(32, 0); // arbitrary trailing bytes
const PNG_BYTES = Buffer.concat([PNG_HEADER, PNG_BODY]);

describe('detectImageMime', () => {
  it('detects JPEG', () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectImageMime(buf)).toBe('image/jpeg');
  });

  it('detects PNG', () => {
    const buf = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
    ]);
    expect(detectImageMime(buf)).toBe('image/png');
  });

  it('detects GIF87a', () => {
    const buf = Buffer.from('GIF87a\x00\x00', 'ascii');
    expect(detectImageMime(buf)).toBe('image/gif');
  });

  it('detects GIF89a', () => {
    const buf = Buffer.from('GIF89a\x00\x00', 'ascii');
    expect(detectImageMime(buf)).toBe('image/gif');
  });

  it('detects WebP', () => {
    const buf = Buffer.concat([
      Buffer.from('RIFF', 'ascii'),
      Buffer.from([0x00, 0x00, 0x00, 0x00]),
      Buffer.from('WEBP', 'ascii'),
    ]);
    expect(detectImageMime(buf)).toBe('image/webp');
  });

  it('returns null for unrecognized bytes', () => {
    const buf = Buffer.from('not an image at all', 'ascii');
    expect(detectImageMime(buf)).toBeNull();
  });

  it('returns null for empty buffer', () => {
    expect(detectImageMime(Buffer.alloc(0))).toBeNull();
  });

  it('returns null for RIFF without WEBP marker (e.g. .wav)', () => {
    const buf = Buffer.concat([
      Buffer.from('RIFF', 'ascii'),
      Buffer.from([0x00, 0x00, 0x00, 0x00]),
      Buffer.from('WAVE', 'ascii'),
    ]);
    expect(detectImageMime(buf)).toBeNull();
  });
});

describe('fileToImageBuffer', () => {
  it('returns a ProcessedImage when signature matches declared MIME', async () => {
    const file = new File([PNG_BYTES], 'photo.png', { type: 'image/png' });
    const result = await fileToImageBuffer(file);

    expect(result).not.toBeNull();
    expect(result?.contentType).toBe('image/png');
    expect(result?.extension).toBe('png');
    expect(result?.buffer.equals(PNG_BYTES)).toBe(true);
  });

  it('rejects uploads where declared MIME is spoofed', async () => {
    // Real PNG bytes but the client claims it's a JPEG.
    const file = new File([PNG_BYTES], 'sneaky.jpg', { type: 'image/jpeg' });
    const result = await fileToImageBuffer(file);

    expect(result).toBeNull();
  });

  it('rejects uploads whose bytes match no supported format', async () => {
    const garbage = Buffer.from('not an image at all, just text', 'ascii');
    const file = new File([garbage], 'fake.png', { type: 'image/png' });
    const result = await fileToImageBuffer(file);

    expect(result).toBeNull();
  });

  it('rejects uploads with an unsupported declared MIME type', async () => {
    const file = new File([PNG_BYTES], 'photo.bmp', { type: 'image/bmp' });
    const result = await fileToImageBuffer(file);

    expect(result).toBeNull();
  });
});
