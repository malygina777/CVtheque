import { prisma } from "@/lib/prisma";

export async function toggleCandidatePrisma(id: number) {
  const current = await prisma.profile.findUnique({
    where: { id: id },
    select: { enable: true },
  });

  if (!current) {
    return new Error("Profile not found");
  }

  return await prisma.profile.update({
    where: { id: id },
    data: { enable: !current.enable },
    select: { enable: true },
  });
}
