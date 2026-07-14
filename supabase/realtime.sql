-- Enables live roster updates for the session-settings page.
-- Run once against the project's Supabase database (SQL editor or CLI).
-- Skipping this fails silently: writes succeed, but the roster never
-- live-updates for connected clients.

alter publication supabase_realtime add table players;

alter table players enable row level security;

create policy "read players" on players
  for select
  to anon
  using (true);
