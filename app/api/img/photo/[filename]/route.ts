import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  try {
    const filePath = path.join(
      process.cwd(),
      "privateStorage",
      "img",
      "photo",
      filename,
    );
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (e) {
    return new NextResponse("File not found", { status: 404 });
  }
}
