import { prisma } from "../prisma";

export type DiplomaPayload = {
  rncpId: number;
  year: number;
};

export async function createUserRncp(
  profileId: number,
  diplomas: DiplomaPayload[],
) {
  return prisma.user_has_rncp.createMany({
    data: diplomas.map((d) => ({
      profile_id: profileId,
      rncp_id: d.rncpId,
      date_of_obtaining: d.year,
    })),
    skipDuplicates: true,
  });
}
