import type { EventFormValues } from "@/lib/validation/event";

export interface UploadedImage {
  url: string;
  fileName: string;
}

/**
 * TODO(backend): Wire this up to the real event-creation endpoint
 * (e.g. POST /events). Currently a mocked promise that just logs the
 * payload. The engineer connecting this to the backend should:
 *   - send `data` as JSON
 *   - attach any uploaded image URLs/IDs from uploadImages() below,
 *     since images are not part of this payload (see uploadImages)
 */
export async function createEvent(data: EventFormValues): Promise<void> {
  console.log("createEvent", data);
  return Promise.resolve();
}

/**
 * TODO(backend): Wire this up to the real image upload endpoint/flow
 * (e.g. signed upload URLs, direct POST to storage, or a
 * multipart/form-data endpoint). Currently a mocked promise that
 * returns fake URLs derived from the file names, so the calling
 * component can be built against a realistic-looking return shape.
 */
export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  console.log(
    "uploadImages",
    files.map((file) => file.name)
  );
  return Promise.resolve(
    files.map((file) => ({
      url: `mock://uploads/${file.name}`,
      fileName: file.name,
    }))
  );
}
