import { NextResponse } from "next/server";
import { getSelectedDomain } from "@/lib/general-domains/structure-types/getSelectedDomain";
import { updateNatureActivity } from "@/lib/general-domains/nature-activity/updateNatureActivity";

type Ctx = {
  params: Promise<{ domainId: string }>;
};

export async function GET(_req: Request, { params }: Ctx) {
  const { domainId } = await params;
  const domain_Id = Number(domainId);

  if (!Number.isFinite(domain_Id)) {
    return NextResponse.json({ error: "Invalid domainId" }, { status: 400 });
  }
  const selectedIdDomain = await getSelectedDomain(domain_Id);
  return NextResponse.json(selectedIdDomain);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { domainId } = await params;
  const domain_Id = Number(domainId);
  const body = await req.json();
  const selectedIds: string[] = body.selectedIds ?? [];
  const ids = selectedIds
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  const res = await updateNatureActivity(domain_Id, ids);
  return NextResponse.json(res);
}
