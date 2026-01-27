import { prisma } from "@/lib/prisma";

type Docs = {
  cv: {
    fileName: string;
    ext: string;
    mime: string;
    hash: string;
  };
  cover: {
    fileName: string;
    ext: string;
    mime: string;
    hash: string;
  };
};

const FILE_TYPE_ID_CV = 3;
const FILE_TYPE_ID_COVER = 4;

export async function saveUploadingDocuments(data: Docs) {
  const { cv, cover } = data;
  const userId = 16;

  return prisma.$transaction(async (tx) => {
    await tx.file.create({
      data: {
        user_id: userId,
        file_type_id: FILE_TYPE_ID_CV,
        file_name: cv.fileName,
        extension: cv.ext,
        type_mime: cv.mime,
        hash: cv.hash,
      },
    });

    await tx.file.create({
      data: {
        user_id: userId,
        file_type_id: FILE_TYPE_ID_COVER,
        file_name: cover.fileName,
        extension: cover.ext,
        type_mime: cover.mime,
        hash: cover.hash,
      },
    });
  });
}
