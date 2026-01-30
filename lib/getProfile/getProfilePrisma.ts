import { prisma } from "@/lib/prisma";

export async function getProfilePrisma(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { auth_user_id: userId },
    select: { id: true },
  });
  return profile?.id ?? null;
}
