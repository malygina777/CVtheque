import { prisma } from "../prisma";

export type DiplomaPayload = {
  rncpId: number;
  year: number;
};

export async function createUserRncp(userId = 16, diplomas: DiplomaPayload[]) {
  return prisma.user_has_rncp.createMany({
    data: diplomas.map((d) => ({
      user_id: userId,
      rncp_id: d.rncpId,
      date_of_obtaining: d.year,
    })),
    skipDuplicates: true,
  });
}
