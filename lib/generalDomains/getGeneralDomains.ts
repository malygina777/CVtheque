import { prisma } from "@/lib/prisma";

export type GeneralDomain = {
  id: number;
  fullname: string;
  shortname: string | null;
};

export async function getGeneralDomains(): Promise<GeneralDomain[]> {
  return prisma.general_domain.findMany({
    select: { id: true, fullname: true, shortname: true },
    orderBy: { fullname: "asc" },
  });
}
