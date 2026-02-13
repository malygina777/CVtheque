import { prisma } from "@/lib/prisma";

export async function getAllUsersWithRolePrisma() {
  const users = await prisma.profile.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      user: {
        select: { role: true },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
    role: u.user?.role,
  }));
}
