import { prisma } from "../prisma";

export async function getSectors() {
  return await prisma.sectors.findMany({
    select: {
      id: true,
      fullname: true,
    },
    orderBy: {
      fullname: "asc",
    },
  });
}
