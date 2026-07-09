import type { EventFormValues } from "@/lib/validation/event";

/**
 * Placeholder for the real backend call.
 * Replace with an actual fetch/axios call to your API once it's ready.
 * Note: cover/gallery images are handled separately from this payload
 * since they're File objects (see EventRsvpForm) — typically you'd
 * upload them via FormData or a signed-upload URL rather than JSON.
 */
export async function saveEvent(data: EventFormValues): Promise<void> {
  console.log(data);
}
