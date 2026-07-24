import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const dm = await draftMode();
  dm.disable();
  return NextResponse.json({ ok: true });
}
