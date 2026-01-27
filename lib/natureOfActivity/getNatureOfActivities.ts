import { prisma } from "@/lib/prisma";

export type NatureOfActivity = {
  id: number;
  fullname: string;
  shortname: string | null;
};

export async function getNatureOfActivities(
  generalDomainId: number,
): Promise<NatureOfActivity[]> {
  return prisma.nature_of_activity.findMany({
    where: {
      general_domain_has_nature_of_activity: {
        some: {
          general_domain_id: generalDomainId,
        },
      },
    },
    select: { id: true, fullname: true, shortname: true },
    orderBy: { fullname: "asc" },
  });
}
