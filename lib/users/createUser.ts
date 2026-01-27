import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function createUser(formData: FormData) {
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

  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstname,
        lastname,
        photo: photoName,
        date_of_birth,
      },
    });

    if (email) {
      await tx.email.create({
        data: {
          email,
          user_id: user.id,
          email_type_id: 1,
        },
      });
    }

    if (phone) {
      await tx.phone.create({
        data: {
          number: phone,
          user_id: user.id,
        },
      });
    }

    if (contractId) {
      await tx.user_has_user_type_contract.create({
        data: {
          user_id: user.id,
          contract_type_id: Number(contractId),
          user_type_id: 1,
        },
      });
    }

    return user;
  });

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
