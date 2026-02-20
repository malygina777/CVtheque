import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { saveUploadingDocuments } from "@/lib/saveUploadingDocuments/saveUploadingDocuments";
import { auth } from "@/lib/auth";
import { getProfilePrisma } from "@/lib/getProfile/getProfilePrisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    const profileId = await getProfilePrisma(userId);

    const fd = await req.formData();
const cv = fd.get("cv");
const coverLetter = fd.get("coverLetter");

if (!profileId || !(cv instanceof File)) {
  return NextResponse.json({ ok: false }, { status: 400 });
}

const coverFileMaybe = coverLetter instanceof File ? coverLetter : null;

// --- CV (обязательно)
const cvBuf = Buffer.from(await cv.arrayBuffer());
const cvHash = crypto.createHash("sha256").update(cvBuf).digest("hex");
const dirCV = path.join(process.cwd(), "privateStorage", "cv");
await fs.mkdir(dirCV, { recursive: true });

const cvExt = path.extname(cv.name).replace(".", "");
const cvFile = `cv-${cvHash}.${cvExt}`;
await fs.writeFile(path.join(dirCV, cvFile), cvBuf);

// --- COVER (опционально)
let coverLetterExt: string | null = null;
let coverLetterHash: string | null = null;
let coverFile: string | null = null;

if (coverFileMaybe) {
  const coverBuf = Buffer.from(await coverFileMaybe.arrayBuffer());
  coverLetterHash = crypto.createHash("sha256").update(coverBuf).digest("hex");

  const dirCover = path.join(process.cwd(), "privateStorage", "motivationLetter");
  await fs.mkdir(dirCover, { recursive: true });

  coverLetterExt = path.extname(coverFileMaybe.name).replace(".", "");
  coverFile = `cover-${coverLetterHash}.${coverLetterExt}`; 

  await fs.writeFile(path.join(dirCover, coverFile), coverBuf);
}

    await saveUploadingDocuments(
  {
    cv: {
      fileName: `CV/${cvFile}`,
      ext: cvExt,
      mime: cv.type,
      hash: cvHash,
    },
    ...(coverFileMaybe && coverFile && coverLetterExt && coverLetterHash
      ? {
          cover: {
            fileName: `motivationLetter/${coverFile}`,
            ext: coverLetterExt,
            mime: coverFileMaybe.type,
            hash: coverLetterHash,
          },
        }
      : {}),
  },
  Number(profileId),
);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
