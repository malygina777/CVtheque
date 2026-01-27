import { prisma } from "@/lib/prisma";

export async function getExpertise() {
  return prisma.expertise.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
}
