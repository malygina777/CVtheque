import { prisma } from "../prisma";

export async function getContractType() {
  return prisma.contract_type.findMany({
    select: {
      id: true,
      fullname: true,
    },
    orderBy: {
      fullname: "asc",
    },
  });
}
