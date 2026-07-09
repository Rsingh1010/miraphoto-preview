import { z } from "zod";

const STATE_CODE_REGEX = /^[A-Za-z]{2}$/;
// Matches the HH:MM value produced by a native <input type="time">.
const TIME_24H_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export const eventSchema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters"),

    eventDate: z.string().min(1, "Event date is required"),

    startTime: z
      .string()
      .regex(TIME_24H_REGEX, "Enter a valid start time"),

    endTime: z.string().regex(TIME_24H_REGEX, "Enter a valid end time"),

    city: z.string().trim().min(1, "City is required"),

    state: z
      .string()
      .trim()
      .regex(STATE_CODE_REGEX, "Use a 2-letter state code, e.g. NY")
      .transform((value) => value.toUpperCase()),

    photographerName: z.string().trim().optional(),
    photographerId: z.string().optional(),

    contactEmail: z.string().trim().email("Enter a valid email address"),

    contactPhone: z
      .string()
      .trim()
      .regex(
        E164_REGEX,
        "Enter a valid phone number in E.164 format, e.g. +13478188801"
      ),

    isTicketed: z.enum(["yes", "no"]),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters"),
  })
  .refine((data) => data.endTime > data.startTime, {
    // NOTE: this string comparison assumes a same-day event and does not
    // support events that run past midnight. Revisit if overnight events
    // are ever a real use case.
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type EventFormValues = z.infer<typeof eventSchema>;
