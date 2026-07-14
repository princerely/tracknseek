import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, sessions } from "@/db/schema";
import { CreateSessionClient } from "@/components/create/CreateSessionClient";

export default async function CreateSessionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalizedCode = code.toUpperCase();

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.joinCode, normalizedCode));

  if (!session) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-cream">
        <p className="text-umber">Session not found.</p>
      </div>
    );
  }

  const roster = await db
    .select()
    .from(players)
    .where(eq(players.sessionId, session.id));

  const initialRoster = roster
    .map((p) => ({ id: p.id, name: p.name, isSeeker: p.isSeeker }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <CreateSessionClient
      sessionId={session.id}
      code={session.joinCode}
      initialRoster={initialRoster}
    />
  );
}
