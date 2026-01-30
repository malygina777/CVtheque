import { prisma } from "@/lib/prisma";

export async function profileInitPrisma(
  firstName: string,
  lastName: string,
  email: string,
  userId: string,
) {
  return prisma.$transaction(async (ex) => {
    const profile = await ex.profile.upsert({
      where: { auth_user_id: userId },
      update: { firstname: firstName, lastname: lastName },
      create: {
        auth_user_id: userId,
        firstname: firstName,
        lastname: lastName,
      },
    });

    await ex.email.upsert({
      where: { email: email },
      update: { profile_id: profile.id },
      create: { email, profile_id: profile.id, email_type_id: 2 },
    });
  });
}
