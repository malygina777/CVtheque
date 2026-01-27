import { prisma } from "@/lib/prisma";

export async function getStructureCandidatePrisma() {
  return prisma.structure_type.findMany({
    where: {
      user_has_worked: {
        some: {},
      },
    },
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
}
