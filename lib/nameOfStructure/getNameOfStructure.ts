import { prisma } from "@/lib/prisma";

export type NameOfStructure = {
  id: number;
  fullname: string;
};

export async function getNameOfStructure(): Promise<NameOfStructure[]> {
  return prisma.structure.findMany({
    select: { id: true, fullname: true },
    orderBy: { fullname: "asc" },
  });
}
