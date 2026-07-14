"use client";

import type { RosterPlayer } from "@/lib/validation";

interface Props {
  roster: RosterPlayer[];
  onToggleSeeker: (playerId: string, isSeeker: boolean) => void;
}

export function ManualRosterList({ roster, onToggleSeeker }: Props) {
  const sorted = [...roster].sort((a, b) => a.name.localeCompare(b.name));

  if (sorted.length === 0) {
    return <p className="text-sm text-umber">No players have joined yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((player) => (
        <li key={player.id}>
          <button
            type="button"
            onClick={() => onToggleSeeker(player.id, !player.isSeeker)}
            className={`w-full rounded-lg border-2 px-3 py-2 text-left ${
              player.isSeeker ? "border-clay bg-clay text-cream" : "border-fern bg-cream text-umber"
            }`}
          >
            {player.name} — {player.isSeeker ? "seeker" : "hider"}
          </button>
        </li>
      ))}
    </ul>
  );
}
