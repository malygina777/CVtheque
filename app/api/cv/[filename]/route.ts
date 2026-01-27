import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;

    const filePath = path.join(process.cwd(), "privateStorage", "cv", filename);

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (e) {
    return new NextResponse("File not found", { status: 404 });
  }
}
