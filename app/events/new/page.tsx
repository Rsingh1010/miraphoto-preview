import { EventAccessGate } from "@/components/event-access-gate";
import type { CurrentUser } from "@/lib/types/user";

// TODO: replace with your real session/auth lookup (e.g. getServerSession).
const currentUser: CurrentUser = { role: "organization" };

export default function NewEventPage() {
  return <EventAccessGate currentUser={currentUser} />;
}
