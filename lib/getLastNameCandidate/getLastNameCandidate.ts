import { prisma } from "@/lib/prisma";

export async function getLastNameCandidatePrisma() {
  return prisma.user.findMany({
    distinct: ["lastname"],
    select: { id: true, lastname: true },
    orderBy: { lastname: "asc" },
  });
}
