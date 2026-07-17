import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-neutral-400">Manage your account information.</p>
      </div>

      <SettingsForm initialName={user?.name || ""} email={user?.email || ""} />
    </div>
  );
}
