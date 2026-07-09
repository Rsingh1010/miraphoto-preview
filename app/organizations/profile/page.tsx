import { OrganizationProfileForm } from "@/components/organization-profile-form";
import type { CurrentUser } from "@/lib/types/user";

// TODO: replace with your real session/auth lookup (e.g. getServerSession).
// The Verified Organization switch only renders when role === "admin".
const currentUser: CurrentUser = { role: "organization" };

export default function OrganizationProfilePage() {
  return <OrganizationProfileForm currentUser={currentUser} />;
}
