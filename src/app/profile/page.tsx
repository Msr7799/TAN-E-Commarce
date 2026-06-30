import { UserProfile } from "@/features/auth/UserProfile";

export const metadata = {
  title: "My Profile",
  description: "Manage your profile, purchases, and preferences",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#e9e6e2] py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <UserProfile />
      </div>
    </div>
  );
}
