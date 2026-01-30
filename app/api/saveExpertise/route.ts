import { saveExpertise } from "@/lib/saveExpertise/saveExpertise";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type DataSelected = {
  profileId: number;
  expertisesId: number[];
};

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

    const data = (await req.json()) as DataSelected;

    const res = await saveExpertise(data);
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 },
    );
  }
}
