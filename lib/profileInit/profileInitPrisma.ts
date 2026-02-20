import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger/logger";

export async function profileInitPrisma(
  firstName: string,
  lastName: string,
  email: string,
  userId: string,
) {
  try {
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
  } catch (error){
     logger.error('Erreur UPSERT profile,email', { table: 'profile,email', error });
           throw error;
  }
  
}
