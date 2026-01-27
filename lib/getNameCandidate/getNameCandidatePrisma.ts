import { prisma } from "@/lib/prisma";

export async function getNameCandidatePrisma() {
  return prisma.user.findMany({
    distinct: ["firstname"],
    select: { id: true, firstname: true },
    orderBy: { firstname: "asc" },
  });
}
