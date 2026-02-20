import { prisma } from "../prisma";
import { logger } from "@/lib/logger/logger";

export type DiplomaPayload = {
  rncpId: number;
  year: number;
};

export async function createUserRncp(
  profileId: number,
  diplomas: DiplomaPayload[],
) {
  try {
   return prisma.user_has_rncp.createMany({
    data: diplomas.map((d) => ({
      profile_id: profileId,
      rncp_id: d.rncpId,
      date_of_obtaining: d.year,
    })),
    skipDuplicates: true,
  });
  } catch (error) {
    logger.error('Erreur CREATE user_has_rncp', { table: 'user_has_rncp', error });
           throw error;
  }
  
}
