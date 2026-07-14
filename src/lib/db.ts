import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
};

// Transaction pool mode (Supabase's pooler, port 6543) doesn't support
// prepared statements — omitting `prepare: false` causes connection errors.
const client =
  globalForDb.postgresClient ??
  postgres(process.env.POSTGRES_URL!, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
