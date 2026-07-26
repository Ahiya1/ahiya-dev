// Shared photo-format guards. Used by the submit route (reject junk before it
// is stored) and by the judge (send Anthropic the media_type that the bytes
// actually are, never a hardcoded guess).

export type SupportedImageType = 'image/jpeg' | 'image/png' | 'image/webp';

/** Anything bigger than this is almost certainly an un-downscaled original. */
export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;

/** Identify an image by its leading magic bytes. Returns null for anything we
 * cannot safely hand to the model (HEIC, video, garbage, empty). */
export function sniffImageType(bytes: Uint8Array): SupportedImageType | null {
  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  // WebP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

/** Normalise a stored/served content-type header to a supported image type. */
export function imageTypeFromHeader(header: string | null): SupportedImageType | null {
  const value = (header ?? '').split(';')[0].trim().toLowerCase();
  if (value === 'image/jpeg' || value === 'image/jpg') return 'image/jpeg';
  if (value === 'image/png') return 'image/png';
  if (value === 'image/webp') return 'image/webp';
  return null;
}

/** File extension used when storing a photo blob. */
export function extensionFor(type: SupportedImageType): string {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}
