import { prisma } from "@/lib/prisma";

type DataSelected = {
  profileId: number;
  expertisesId: number[];
};

export async function saveExpertise(data: DataSelected) {
  const { profileId, expertisesId } = data;
  return prisma.user_has_expertise.createMany({
    data: expertisesId.map((expertiseId) => ({
      profile_id: profileId,
      expertise_id: expertiseId,
    })),
    skipDuplicates: true,
  });
}
