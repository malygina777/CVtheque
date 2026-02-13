import { prisma } from "@/lib/prisma";

export async function getAllCandidatesPrisma(role: string) {
  const where = role === "teacher" ? { enable: true } : {};
  const users = await prisma.profile.findMany({
    where,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      photo: true,
      enable: true,

      email: { select: { email: true } },
      phone: { select: { number: true } },

      user_has_rncp: {
        select: { rncp: { select: { intitule: true } } },
      },

      user_has_expertise: {
        select: { expertise: { select: { fullname: true } } },
      },

      user_has_worked: {
        select: { structure_type: { select: { fullname: true } } },
      },

      file: {
        select: { file_name: true },
        take: 1,
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    firstname: u.firstname,
    lastname: u.lastname,
    enable: u.enable,
    photoUrl: u.photo ?? null,

    email: u.email[0]?.email ?? null,
    phone: u.phone[0]?.number ?? null,

    diplomas: u.user_has_rncp.map((x) => x.rncp?.intitule ?? ""),
    expertises: u.user_has_expertise.map((x) => x.expertise?.fullname ?? ""),
    structures: u.user_has_worked.map((x) => x.structure_type?.fullname ?? ""),

    cvFileName: u.file[0]?.file_name ?? null,
  }));
}
