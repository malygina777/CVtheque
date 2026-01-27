import { NextResponse } from "next/server";
import { getNatureOfActivities } from "@/lib/natureOfActivity/getNatureOfActivities";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get("domainId");

    if (!domainId) {
      return NextResponse.json(
        { message: "domainId is required" },
        { status: 400 },
      );
    }

    const activities = await getNatureOfActivities(Number(domainId));
    return NextResponse.json(activities);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to load nature of activities" },
      { status: 500 },
    );
  }
}
