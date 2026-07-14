"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormValues } from "@/lib/validation/event";
import { createEvent, uploadImages } from "@/lib/api/event";
import { validateImageFiles } from "@/lib/validation/file";
import { Field } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileInput } from "@/components/ui/file-input";
import { PhotographerSearch } from "@/components/ui/photographer-search";
import { inputClasses } from "@/lib/ui/styles";

type SubmitStatus = "idle" | "success" | "error";

const defaultValues: EventFormValues = {
  // Organization fields — intentionally duplicated from the Organization
  // Profile page (see lib/validation/event.ts for why). Both pages are
  // kept as full, independent forms for review purposes.
  organizationName: "",
  contactPersonName: "",
  contactPersonPhone: "",
  contactPersonEmail: "",
  organizationWebsite: "",
  organizationSocialMedia: "",
  notes: "",

  // Event fields
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
      // TODO(backend): once createEvent/uploadImages are wired to the real
      // API, decide the actual upload order (e.g. images first so their
      // URLs can be included in the createEvent payload, or in parallel).
      const [coverUpload, galleryUpload] = await Promise.all([
        uploadImages(coverImage),
        uploadImages(galleryImages),
      ]);
      console.log("uploaded cover image(s)", coverUpload);
      console.log("uploaded gallery image(s)", galleryUpload);

      await createEvent(data);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">Event RSVP portal</h1>

      

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
          {/*
            Organization details — intentionally duplicated from the
            Organization Profile page. Kept here so this page can stand
            alone; see lib/validation/event.ts for why the schema reuses
            organizationSchema rather than re-typing these rules.
          */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Organization details
            </h2>

            <div className="flex flex-col gap-6">
              <Field
                label="Organization / Company / School name"
                htmlFor="organizationName"
                required
                error={errors.organizationName?.message}
              >
                <input
                  id="organizationName"
                  type="text"
                  placeholder="At least 3 characters"
                  className={inputClasses}
                  aria-invalid={!!errors.organizationName}
                  {...register("organizationName")}
                />
              </Field>

              <Field
                label="Contact person name"
                htmlFor="contactPersonName"
                required
                error={errors.contactPersonName?.message}
              >
                <input
                  id="contactPersonName"
                  type="text"
                  placeholder="Full name"
                  className={inputClasses}
                  aria-invalid={!!errors.contactPersonName}
                  {...register("contactPersonName")}
                />
              </Field>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Contact person phone"
                  htmlFor="contactPersonPhone"
                  required
                  hint="E.164 format, e.g. +13478188801"
                  error={errors.contactPersonPhone?.message}
                >
                  <input
                    id="contactPersonPhone"
                    type="tel"
                    placeholder="+13478188801"
                    className={inputClasses}
                    aria-invalid={!!errors.contactPersonPhone}
                    {...register("contactPersonPhone")}
                  />
                </Field>

                <Field
                  label="Contact person email"
                  htmlFor="contactPersonEmail"
                  required
                  error={errors.contactPersonEmail?.message}
                >
                  <input
                    id="contactPersonEmail"
                    type="email"
                    placeholder="name@organization.org"
                    className={inputClasses}
                    aria-invalid={!!errors.contactPersonEmail}
                    {...register("contactPersonEmail")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Organization website (optional)"
                  htmlFor="organizationWebsite"
                  error={errors.organizationWebsite?.message}
                >
                  <input
                    id="organizationWebsite"
                    type="url"
                    placeholder="https://example.org"
                    className={inputClasses}
                    aria-invalid={!!errors.organizationWebsite}
                    {...register("organizationWebsite")}
                  />
                </Field>

                <Field
                  label="Organization social media (optional)"
                  htmlFor="organizationSocialMedia"
                  error={errors.organizationSocialMedia?.message}
                >
                  <input
                    id="organizationSocialMedia"
                    type="url"
                    placeholder="https://instagram.com/yourorg"
                    className={inputClasses}
                    aria-invalid={!!errors.organizationSocialMedia}
                    {...register("organizationSocialMedia")}
                  />
                </Field>
              </div>

              <Field
                label="Notes (optional)"
                htmlFor="notes"
                error={errors.notes?.message}
              >
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Anything else we should know"
                  className={inputClasses}
                  {...register("notes")}
                />
              </Field>
            </div>
          </div>

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
