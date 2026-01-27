import { NextResponse } from "next/server";
import { getUserPhotoName } from "@/lib/users/getUserPhoto";
import fs from "fs/promises";
import path from "path";

function getContentType(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";

  return "application/octet-stream";
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = Number(params.userId);

  const photoName = await getUserPhotoName(userId);

  if (!photoName) {
    return new NextResponse("Photo not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "privateStorage",
    "img",
    "photo",
    photoName
  );

  try {
    const file = await fs.readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(photoName),
      },
    });
  } catch {
    new NextResponse("File not found", { status: 404 });
  }
}
