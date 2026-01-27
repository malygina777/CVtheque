import prisma from "@/lib/prisma";

export async function getUserPhotoName(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { photo: true },
  });

  return user?.photo ?? null;
}
