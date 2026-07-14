"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  organizationSchema,
  type OrganizationFormValues,
} from "@/lib/validation/organization";
import { saveOrganization } from "@/lib/api/organization";
import { Field } from "@/components/ui/field";
import { inputClasses } from "@/lib/ui/styles";
import type { CurrentUser } from "@/lib/types/user";

interface OrganizationProfileFormProps {
  currentUser: CurrentUser;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const defaultValues: OrganizationFormValues = {
  organizationName: "",
  contactPersonName: "",
  contactPersonPhone: "",
  contactPersonEmail: "",
  organizationWebsite: "",
  organizationSocialMedia: "",
  notes: "",
};

export function OrganizationProfileForm({
  currentUser,
}: OrganizationProfileFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  // TODO(verified-organization): currentUser.role will gate the admin-only
  // Verified Organization switch once that feature is built. Keeping the
  // prop wired now so the calling page doesn't need to change later.
  void currentUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (data: OrganizationFormValues) => {
    setStatus("submitting");
    try {
      await saveOrganization(data);
      setStatus("success");
      // Flow: Organization Sign Up -> Organization Profile -> Event RSVP.
      // Once the profile is saved, send the organization straight to the
      // Event RSVP page to complete registration and host their event.
      router.push("/events/new");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-800">
        Organization profile
      </h1>
      <p className="mt-3 text-gray-500">
        Organizations must complete this profile before they can host events.
        Photographers cannot create or host events.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
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
              aria-describedby={
                errors.organizationName ? "organizationName-error" : undefined
              }
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
              aria-describedby={
                errors.contactPersonName ? "contactPersonName-error" : undefined
              }
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
                aria-describedby={
                  errors.contactPersonPhone
                    ? "contactPersonPhone-error"
                    : undefined
                }
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
                aria-describedby={
                  errors.contactPersonEmail
                    ? "contactPersonEmail-error"
                    : undefined
                }
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
                aria-describedby={
                  errors.organizationWebsite
                    ? "organizationWebsite-error"
                    : undefined
                }
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
                aria-describedby={
                  errors.organizationSocialMedia
                    ? "organizationSocialMedia-error"
                    : undefined
                }
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

          {/*
            TODO(verified-organization): Requirements for the Verified
            Organization label aren't finalized yet. When they are, this is
            where an admin-only Switch should go (gated on
            currentUser.role === "admin"), following the same pattern this
            component used previously — see lib/validation/organization.ts
            for the matching schema TODO. Do not build this UI until the
            requirements are confirmed.
          */}
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
              Organization profile saved.
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
