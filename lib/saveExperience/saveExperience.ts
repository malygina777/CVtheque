import { prisma } from "@/lib/prisma";
import { ExperienceRow } from "../types/type";

export async function saveExperience(
  experiences: ExperienceRow[],
  userId = 16,
) {
  console.debug(experiences);
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
        console.log(`Insertion structure id=${structure.id}`);
      }

      await tx.user_has_worked.create({
        data: {
          user_id: userId,
          structure_id: structure.id,
          general_domain_id: Number(e.domainId),
          nature_of_activity_id: Number(e.activityId),
          structure_type_id: Number(e.typeId),
          start_date: new Date(e.startDate),
          end_date: new Date(e.endDate),
        },
      });
      console.log(`Insertion user_has_worked userId=${userId}`);
    }
    return { ok: true, count: experiences.length };
  });
}
