import { saveExpertise } from "@/lib/saveExpertise/saveExpertise";
import { NextResponse } from "next/server";

type DataSelected = {
  userId: number;
  expertisesId: number[];
};

export async function POST(req: Request) {
  try {
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
