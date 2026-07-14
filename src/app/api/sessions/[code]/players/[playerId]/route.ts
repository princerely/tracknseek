import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, sessions } from "@/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ code: string; playerId: string }> },
) {
  const { code, playerId } = await params;
  const body = await request.json();

  if (typeof body?.isSeeker !== "boolean") {
    return NextResponse.json(
      { error: "isSeeker must be a boolean" },
      { status: 400 },
    );
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.joinCode, code.toUpperCase()));

  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  const [player] = await db
    .update(players)
    .set({ isSeeker: body.isSeeker })
    .where(and(eq(players.id, playerId), eq(players.sessionId, session.id)))
    .returning();

  if (!player) {
    return NextResponse.json({ error: "player not found" }, { status: 404 });
  }

  return NextResponse.json({ player });
}
