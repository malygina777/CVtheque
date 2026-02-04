import { prisma } from "@/lib/prisma";

export async function getSelectedDomain(domainId: number) {
  const data = await prisma.general_domain_has_structure_type.findMany({
    where: { general_domain_id: domainId },
    select: { structure_type_id: true },
    orderBy: { structure_type_id: "asc" },
  });

  return data.map((e) => String(e.structure_type_id));
}
