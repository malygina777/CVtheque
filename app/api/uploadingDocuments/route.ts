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

    if (!profileId || !(cv instanceof File) || !(coverLetter instanceof File)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const cvBuf = Buffer.from(await cv.arrayBuffer());
    const coverBuf = Buffer.from(await coverLetter.arrayBuffer());

    const cvHash = crypto.createHash("sha256").update(cvBuf).digest("hex");
    const coverLetterHash = crypto
      .createHash("sha256")
      .update(coverBuf)
      .digest("hex");

    const dirCV = path.join(process.cwd(), "privateStorage", "cv");
    const dirCover = path.join(
      process.cwd(),
      "privateStorage",
      "motivationLetter",
    );

    await fs.mkdir(dirCV, { recursive: true });
    await fs.mkdir(dirCover, { recursive: true });

    const cvExt = path.extname(cv.name).replace(".", "");
    const coverLetterExt = path.extname(coverLetter.name).replace(".", "");

    const cvFile = `cv-${cvHash}.${cvExt}`;
    const coverFile = `cover-${coverLetterHash}.${coverLetterExt}`;

    await fs.writeFile(path.join(dirCV, cvFile), cvBuf);
    await fs.writeFile(path.join(dirCover, coverFile), coverBuf);

    await saveUploadingDocuments(
      {
        cv: {
          fileName: `CV/${cvFile}`,
          ext: cvExt,
          mime: cv.type,
          hash: cvHash,
        },
        cover: {
          fileName: `motivationLetter/${coverFile}`,
          ext: coverLetterExt,
          mime: coverLetter.type,
          hash: coverLetterHash,
        },
      },
      Number(profileId),
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
