import { prisma } from "@/lib/prisma";

export async function getLastNameCandidatePrisma() {
  return prisma.profile.findMany({
    distinct: ["lastname"],
    select: { id: true, lastname: true },
    orderBy: { lastname: "asc" },
  });
}
