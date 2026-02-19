import { logger } from "@/lib/logger/logger";
import { prisma } from "@/lib/prisma";

export async function updateNatureActivity(domainId: number, ids: number[]) {
  return prisma.$transaction(async (tx) => {
    await tx.general_domain_has_nature_of_activity.deleteMany({
      where: { general_domain_id: domainId },
    });

    if (ids.length === 0) {
      return { inserted: 0 };
    }

    try {
      const created = await tx.general_domain_has_nature_of_activity.createMany({
        data: ids.map((nature_of_activity_id) => ({
          general_domain_id: domainId,
          nature_of_activity_id,
        })),
      });
      return created;
    }
    catch(error) {
      logger.error('Insertion dans general_domain_has_nature_of_activity', { table: 'general_domain_has_nature_of_activity', error });
      throw error;
    }
  });
}
