"use client";

import type { CurrentUser } from "@/lib/types/user";
import { EventRsvpForm } from "@/components/event-rsvp-form";

interface EventAccessGateProps {
  currentUser: CurrentUser;
}

export function EventAccessGate({ currentUser }: EventAccessGateProps) {
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

  // TODO(backend): once the backend exists, add a real server-side check
  // here (or in middleware) confirming the organization actually has a
  // completed profile before rendering this form — not just relying on
  // the fact that they were redirected here right after submitting one.
  // This frontend-only gate is easy for anyone to bypass by navigating
  // to /events/new directly.
  return <EventRsvpForm />;
}
