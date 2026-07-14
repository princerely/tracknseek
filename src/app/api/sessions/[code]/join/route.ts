import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, sessions } from "@/db/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (name.length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.joinCode, code.toUpperCase()));

  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  const [player] = await db
    .insert(players)
    .values({ sessionId: session.id, name })
    .returning();

  return NextResponse.json({ player });
}
