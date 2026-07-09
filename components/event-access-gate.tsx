"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrganizationProfile } from "@/lib/api/organization";
import { EventRsvpForm } from "@/components/event-rsvp-form";
import type { CurrentUser } from "@/lib/types/user";

interface EventAccessGateProps {
  currentUser: CurrentUser;
}

type ProfileCheckStatus = "checking" | "missing" | "ready";

export function EventAccessGate({ currentUser }: EventAccessGateProps) {
  const [status, setStatus] = useState<ProfileCheckStatus>("checking");

  useEffect(() => {
    if (currentUser.role !== "organization") return;

    let cancelled = false;
    getOrganizationProfile().then((profile) => {
      if (!cancelled) setStatus(profile ? "ready" : "missing");
    });

    return () => {
      cancelled = true;
    };
  }, [currentUser.role]);

  if (currentUser.role === "photographer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-800">Event RSVP portal</h1>
        <p className="mt-4 text-gray-500">
          Photographer accounts can&apos;t create or host events. Contact
          your Miraphoto administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  if (currentUser.role === "organization" && status !== "ready") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-800">Event RSVP portal</h1>
        {status === "checking" ? (
          <p className="mt-4 text-gray-500">Checking your organization profile…</p>
        ) : (
          <>
            <p className="mt-4 text-gray-500">
              Complete your organization profile before creating an event.
            </p>
            <Link
              href="/organizations/profile"
              className="mt-6 inline-block rounded-full bg-slate-800 px-8 py-3 font-semibold
                text-amber-400 shadow-sm transition hover:bg-slate-700"
            >
              Complete organization profile
            </Link>
          </>
        )}
      </div>
    );
  }

  // Admins reach the form directly; organizations only reach here once
  // status === "ready".
  return <EventRsvpForm />;
}
