export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name}: must be JPEG, PNG, or WebP`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `${file.name}: must be 20MB or smaller`;
  }
  return null;
}

export function validateImageFiles(files: File[]): string | null {
  for (const file of files) {
    const error = validateImageFile(file);
    if (error) return error;
  }
  return null;
}
