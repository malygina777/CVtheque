import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

type DataSelected = {
  profileId: number;
  expertisesId: number[];
};

export async function saveExpertise(data: DataSelected) {
  try {
    const { profileId, expertisesId } = data;

  return await prisma.user_has_expertise.createMany({
    data: expertisesId.map((expertiseId) => ({
      profile_id: profileId,
      expertise_id: expertiseId,
    })),
    skipDuplicates: true,
  });
  } catch (error) {
    logger.error('Erreur CREATE user_has_expertise', { table: 'user_has_expertise', error });
           throw error;
  }
  
}
