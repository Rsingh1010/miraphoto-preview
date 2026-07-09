export interface PhotographerResult {
  id: string;
  name: string;
}

/**
 * Placeholder for the real backend call.
 * Replace with e.g. GET /photographers?q=<query> once the API is ready.
 */
export async function searchPhotographers(
  query: string
): Promise<PhotographerResult[]> {
  console.log("searchPhotographers", query);
  return [];
}
