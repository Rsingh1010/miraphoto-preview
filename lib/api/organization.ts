import type { OrganizationFormValues } from "@/lib/validation/organization";

export interface OrganizationProfile extends OrganizationFormValues {
  isVerified: boolean;
}

/**
 * Placeholder for the real backend call.
 * Replace with an actual fetch/axios call to your API once it's ready.
 */
export async function saveOrganization(
  data: OrganizationFormValues
): Promise<void> {
  console.log(data);
}

/**
 * Placeholder for fetching the signed-in organization's profile.
 * Returns null when no profile exists yet.
 *
 * TODO(backend): this isn't currently called anywhere. Once there's a
 * real backend, EventAccessGate (components/event-access-gate.tsx)
 * should use this (or an equivalent server-side check) to confirm an
 * organization has actually completed their profile before granting
 * access to the Event RSVP page, rather than relying on the frontend
 * redirect that happens right after Organization Profile submission.
 */
export async function getOrganizationProfile(): Promise<OrganizationProfile | null> {
  console.log("getOrganizationProfile");
  return null;
}
