import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { logger } from "../logger/logger";

export async function createUser(formData: FormData, userId: string) {
  const firstname = String(formData.get("firstName") ?? "").trim();
  const lastname = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const contractId = String(formData.get("contractIntervation") ?? "").trim();
  const date_of_birth = new Date(String(formData.get("dateOfBirth") ?? ""));

  const photo = formData.get("photo");
  let photoName = "";

  if (!firstname || !lastname) {
    throw new Error("Firstname/Lastname required");
  }

  if (photo instanceof File && photo.size > 0) {
    photoName = photo.name;
  }

  try {
  const user = await prisma.$transaction(async (tx) => {
    // ✅ CREATE если нет профиля, иначе UPDATE

    const user = await tx.profile.upsert({
      where: { auth_user_id: userId },
      create: {
        firstname,
        lastname,
        photo: photoName,
        date_of_birth,
        auth_user_id: userId,
      },
      update: {
        firstname,
        lastname,
        date_of_birth,
        ...(photoName ? { photo: photoName } : {}), // не затираем фото пустым
      },
    });

    // ✅ EMAIL: обновляем (без дублей)
    if (email) {
      await tx.email.deleteMany({
        where: { profile_id: user.id },
      });

      await tx.email.create({
        data: {
          email,
          profile_id: user.id,
          email_type_id: 1,
        },
      });
    }

    // ✅ PHONE: обновляем (без дублей)
    if (phone) {
      await tx.phone.deleteMany({
        where: { profile_id: user.id },
      });

      await tx.phone.create({
        data: {
          number: phone,
          profile_id: user.id,
        },
      });
    }

    // ✅ CONTRACT: обновляем (без дублей)
    if (contractId) {
      await tx.user_has_user_type_contract.deleteMany({
        where: { profile_id: user.id },
      });

      await tx.user_has_user_type_contract.create({
        data: {
          profile_id: user.id,
          contract_type_id: Number(contractId),
          user_type_id: 1,
        },
      });
    }

    return user;
  });
  logger.info(`Mise à jour de l'utilisateur`, { table: 'profile', userId: userId })

  // ✅ сохраняем файл после транзакции
  if (photo instanceof File && photo.size > 0) {
    const buffer = Buffer.from(await photo.arrayBuffer());

    const filePath = path.join(
      process.cwd(),
      "privateStorage",
      "img",
      "photo",
      photoName,
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
  }

  return user;

}
  catch(error) {
    logger.error(`Mise à jour de l'utilisateur`, { userId: userId, error })
  }
}
