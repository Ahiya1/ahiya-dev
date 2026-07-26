/** Thrown when we could not produce a real JPEG from the picked file.
 * `message` is already Hebrew and safe to show the player. */
export class PhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhotoError";
  }
}

const CONVERSION_FAILED =
  "לא הצלחנו להכין את התמונה (קורה עם תמונות HEIC מהאייפון). נסו לצלם שוב או לבחור תמונה אחרת";

/** A canvas JPEG of a real photo is always far larger than this. Anything
 * smaller means the encode produced an empty or broken blob. */
const MIN_JPEG_BYTES = 512;

/** Client-side: downscale an image to max 1600px (long edge) JPEG via canvas.
 *
 * It deliberately does NOT fall back to the original file: the old fallback
 * shipped undecodable HEIC bytes to the server labelled as JPEG, which the
 * judge then either rejected or scored on garbage. Failing loudly here lets
 * the player retake the photo while they still can. */
export async function downscaleImage(
  file: File,
  maxDim = 1600,
  quality = 0.85,
): Promise<Blob> {
  let url: string | null = null;
  try {
    url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("image load failed"));
      el.src = url as string;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PhotoError(CONVERSION_FAILED);
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    // Verify the conversion actually happened before trusting the bytes.
    if (!blob || blob.type !== "image/jpeg" || blob.size < MIN_JPEG_BYTES) {
      throw new PhotoError(CONVERSION_FAILED);
    }
    return blob;
  } catch (err) {
    throw err instanceof PhotoError ? err : new PhotoError(CONVERSION_FAILED);
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}
