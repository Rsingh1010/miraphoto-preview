"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormValues } from "@/lib/validation/event";
import { saveEvent } from "@/lib/api/event";
import { validateImageFiles } from "@/lib/validation/file";
import { Field } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileInput } from "@/components/ui/file-input";
import { PhotographerSearch } from "@/components/ui/photographer-search";
import { inputClasses } from "@/lib/ui/styles";

type SubmitStatus = "idle" | "success" | "error";

const defaultValues: EventFormValues = {
  title: "",
  eventDate: "",
  startTime: "09:00",
  endTime: "17:00",
  city: "",
  state: "",
  photographerName: "",
  photographerId: undefined,
  contactEmail: "",
  contactPhone: "",
  isTicketed: "no",
  description: "",
};

export function EventRsvpForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [coverImage, setCoverImage] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [coverImageError, setCoverImageError] = useState<string | undefined>();
  const [galleryImagesError, setGalleryImagesError] = useState<
    string | undefined
  >();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (data: EventFormValues) => {
    setStatus("idle");

    const coverError = validateImageFiles(coverImage);
    const galleryError = validateImageFiles(galleryImages);
    setCoverImageError(coverError ?? undefined);
    setGalleryImagesError(galleryError ?? undefined);
    if (coverError || galleryError) return;

    try {
      // Images are handled outside the JSON payload — see saveEvent's note.
      await saveEvent(data);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Event RSVP portal</h1>

      <p className="mt-3 text-sm text-gray-500">
        API: <code className="font-mono">https://miraphoto-backend.fly.dev</code>{" "}
        · Override with <code className="font-mono">NEXT_PUBLIC_API_URL</code>{" "}
        for a local backend (e.g. <code className="font-mono">http://localhost:3000</code>).
      </p>

      {/*
        The original screenshot's "No account required" line no longer
        applies once organization profiles are required — replaced with
        accurate copy instead of carrying over a now-false statement.
      */}
      <p className="mt-2 text-gray-700">
        Signed in as your organization. Fields marked{" "}
        <span aria-hidden="true">*</span> are required.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-6">
          <Field
            label="Title"
            htmlFor="title"
            required
            error={errors.title?.message}
          >
            <input
              id="title"
              type="text"
              placeholder="At least 5 characters"
              className={inputClasses}
              aria-invalid={!!errors.title}
              {...register("title")}
            />
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field
              label="Event date"
              htmlFor="eventDate"
              required
              error={errors.eventDate?.message}
            >
              <input
                id="eventDate"
                type="date"
                className={inputClasses}
                aria-invalid={!!errors.eventDate}
                {...register("eventDate")}
              />
            </Field>

            <Field
              label="Start (24h)"
              htmlFor="startTime"
              required
              error={errors.startTime?.message}
            >
              <input
                id="startTime"
                type="time"
                className={inputClasses}
                aria-invalid={!!errors.startTime}
                {...register("startTime")}
              />
            </Field>

            <Field
              label="End (24h)"
              htmlFor="endTime"
              required
              error={errors.endTime?.message}
            >
              <input
                id="endTime"
                type="time"
                className={inputClasses}
                aria-invalid={!!errors.endTime}
                {...register("endTime")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field
              label="City"
              htmlFor="city"
              required
              error={errors.city?.message}
            >
              <input
                id="city"
                type="text"
                placeholder="City"
                className={inputClasses}
                aria-invalid={!!errors.city}
                {...register("city")}
              />
            </Field>

            <Field
              label="State (2 letters)"
              htmlFor="state"
              required
              error={errors.state?.message}
            >
              <input
                id="state"
                type="text"
                placeholder="NY"
                maxLength={2}
                className={inputClasses}
                aria-invalid={!!errors.state}
                {...register("state")}
              />
            </Field>
          </div>

          <Field
            label="Photographer (optional)"
            htmlFor="photographerName"
            hint="Search by name — results load after you pause typing."
            error={errors.photographerName?.message}
          >
            <Controller
              name="photographerName"
              control={control}
              render={({ field }) => (
                <PhotographerSearch
                  id="photographerName"
                  value={field.value ?? ""}
                  onChange={(name, id) => {
                    field.onChange(name);
                    setValue("photographerId", id);
                  }}
                />
              )}
            />
          </Field>

          <Field
            label="Contact email"
            htmlFor="contactEmail"
            required
            error={errors.contactEmail?.message}
          >
            <input
              id="contactEmail"
              type="email"
              className={inputClasses}
              aria-invalid={!!errors.contactEmail}
              {...register("contactEmail")}
            />
          </Field>

          <Field
            label="Phone (E.164, e.g. +13478188801)"
            htmlFor="contactPhone"
            required
            error={errors.contactPhone?.message}
          >
            <input
              id="contactPhone"
              type="tel"
              placeholder="+13478188801"
              className={inputClasses}
              aria-invalid={!!errors.contactPhone}
              {...register("contactPhone")}
            />
          </Field>

          <Controller
            name="isTicketed"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="isTicketed"
                legend="Ticketed event?"
                value={field.value}
                onChange={field.onChange}
                error={errors.isTicketed?.message}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
            )}
          />

          <Field
            label="Cover image (card hero)"
            htmlFor="coverImage"
            hint="JPEG, PNG, or WebP · up to 20MB"
            error={coverImageError}
          >
            <FileInput
              id="coverImage"
              accept="image/jpeg,image/png,image/webp"
              buttonLabel="Choose File"
              files={coverImage}
              onChange={(files) => {
                setCoverImage(files);
                setCoverImageError(validateImageFiles(files) ?? undefined);
              }}
            />
          </Field>

          <Field
            label="Gallery images (optional)"
            htmlFor="galleryImages"
            hint="Multiple images for detail / carousel · up to 20MB each"
            error={galleryImagesError}
          >
            <FileInput
              id="galleryImages"
              accept="image/jpeg,image/png,image/webp"
              buttonLabel="Choose Files"
              multiple
              files={galleryImages}
              onChange={(files) => {
                setGalleryImages(files);
                setGalleryImagesError(validateImageFiles(files) ?? undefined);
              }}
            />
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            required
            error={errors.description?.message}
          >
            <textarea
              id="description"
              rows={6}
              placeholder="At least 20 characters"
              className={inputClasses}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-800 px-8 py-3 font-semibold text-amber-400
              shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed
              disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Submit"}
          </button>

          {status === "success" && (
            <p role="status" className="text-sm font-medium text-green-600">
              Event created.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-sm font-medium text-red-600">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
