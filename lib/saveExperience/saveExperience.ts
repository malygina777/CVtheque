import { prisma } from "@/lib/prisma";
import { ExperienceRow } from "../types/type";

export async function saveExperience(
  experiences: ExperienceRow[],
  profileId: number,
) {
  return prisma.$transaction(async (tx) => {
    for (const e of experiences) {
      let structure = await tx.structure.findFirst({
        where: { fullname: e.structureName },
        select: { id: true },
      });

      if (!structure) {
        structure = await tx.structure.create({
          data: { fullname: e.structureName },
          select: { id: true },
        });
      }

      await tx.user_has_worked.create({
        data: {
          profile_id: profileId,
          structure_id: structure.id,
          general_domain_id: Number(e.domainId),
          nature_of_activity_id: Number(e.activityId),
          structure_type_id: Number(e.typeId),
          start_date: new Date(e.startDate),
          end_date: new Date(e.endDate),
        },
      });
    }
    return { ok: true, count: experiences.length };
  });
}
