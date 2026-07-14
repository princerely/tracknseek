import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema";
import { generateJoinCode } from "@/lib/codes";

const MAX_ATTEMPTS = 5;

export async function POST() {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const joinCode = generateJoinCode();
    try {
      const [session] = await db
        .insert(sessions)
        .values({ joinCode })
        .returning();
      return NextResponse.json({
        sessionId: session.id,
        code: session.joinCode,
      });
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        continue; // join_code collision, regenerate and retry
      }
      throw error;
    }
  }
  return NextResponse.json(
    { error: "Could not generate a unique session code" },
    { status: 500 },
  );
}
