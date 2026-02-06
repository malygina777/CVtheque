import { prisma } from "@/lib/prisma";

export async function getRole(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  });
}
