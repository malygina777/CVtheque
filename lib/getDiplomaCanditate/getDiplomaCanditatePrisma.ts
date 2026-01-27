import { prisma } from "@/lib/prisma";

export async function getDiplomaCanditatePrisma() {
  return prisma.rncp.findMany({
    where: {
      user_has_rncp: {
        some: {},
      },
    },
    select: { id: true, intitule: true },
    orderBy: { intitule: "asc" },
  });
}
