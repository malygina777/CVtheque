import { prisma } from "../prisma";

export async function getDiplomas() {
  return prisma.rncp.findMany({
    select: {
      id: true,
      intitule: true,
    },
    orderBy: {
      intitule: "asc",
    },
  });
}
