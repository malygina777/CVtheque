import { prisma } from "@/lib/prisma";

export async function updateStructureType(domainId: number, ids: number[]) {
  return prisma.$transaction(async (tx) => {
    await tx.general_domain_has_structure_type.deleteMany({
      where: { general_domain_id: domainId },
    });

    if (ids.length === 0) {
      return { inserted: 0 };
    }
    const created = await tx.general_domain_has_structure_type.createMany({
      data: ids.map((structure_type_id) => ({
        general_domain_id: domainId,
        structure_type_id,
      })),
    });

    return created;
  });
}
