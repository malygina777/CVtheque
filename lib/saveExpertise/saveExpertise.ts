import { prisma } from "@/lib/prisma";

type DataSelected = {
  userId: number;
  expertisesId: number[];
};

export async function saveExpertise(data: DataSelected) {
  const { userId, expertisesId } = data;
  return prisma.user_has_expertise.createMany({
    data: expertisesId.map((expertiseId) => ({
      user_id: userId,
      expertise_id: expertiseId,
    })),
    skipDuplicates: true,
  });
}
