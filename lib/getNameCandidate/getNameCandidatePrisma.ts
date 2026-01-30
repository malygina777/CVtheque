import { prisma } from "@/lib/prisma";

export async function getNameCandidatePrisma() {
  return prisma.profile.findMany({
    distinct: ["firstname"],
    select: { id: true, firstname: true },
    orderBy: { firstname: "asc" },
  });
}
