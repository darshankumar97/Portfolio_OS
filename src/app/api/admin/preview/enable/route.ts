import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

// Lets the admin see draft (unpublished) content on the live site before
// flipping it to published — see src/lib/content.ts's isPreviewing().
export async function POST() {
  const dm = await draftMode();
  dm.enable();
  return NextResponse.json({ ok: true });
}
