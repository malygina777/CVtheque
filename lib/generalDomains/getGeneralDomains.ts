import { prisma } from "@/lib/prisma";
import { logger } from "../logger/logger";

export type GeneralDomain = {
  id: number;
  fullname: string;
  shortname: string | null;
};

export async function getGeneralDomains(): Promise<GeneralDomain[]> {

  try {
    const res = await prisma.general_domain.findMany({
      select: {
        id: true,
        fullname: true,
        shortname: true
      },
      orderBy: {
        fullname: "asc"
      },
    });
    return res;
  }
  catch(error) {
    logger.error('Recherche liste general_domain', { table: 'general_domain', error })
    throw error;
  }
}
