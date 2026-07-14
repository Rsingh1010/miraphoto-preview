import { z } from "zod";

// E.164 format: leading "+", then 1-15 digits total, first digit 1-9.
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Optional URL field: empty string is allowed (field not filled in),
 * but if something is entered, it must be a valid http(s) URL.
 */
const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || isValidUrl(value), {
    message: "Enter a valid URL, e.g. https://example.org",
  });

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters"),

  contactPersonName: z
    .string()
    .trim()
    .min(1, "Contact person name is required"),

  contactPersonPhone: z
    .string()
    .trim()
    .regex(
      E164_REGEX,
      "Enter a valid phone number in E.164 format, e.g. +13478188801"
    ),

  contactPersonEmail: z.string().trim().email("Enter a valid email address"),

  organizationWebsite: optionalUrl,
  organizationSocialMedia: optionalUrl,

  notes: z.string().trim().optional(),

  // TODO(verified-organization): isVerified is intentionally NOT part of
  // this schema yet. Requirements for the Verified Organization label
  // aren't finalized — re-add it here (as an admin-only, backend-set
  // boolean) once that's confirmed. Do not expose it in this form's UI.
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
