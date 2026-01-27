import { prisma } from "@/lib/prisma";

export async function getExpertiseCandidatePrisma() {
  return prisma.expertise.findMany({
    where: {
      user_has_expertise: {
        some: {},
      },
    },
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
}
