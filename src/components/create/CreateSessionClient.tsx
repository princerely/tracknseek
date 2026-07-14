"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  clampNonNegative,
  isStartEnabled,
  type RosterPlayer,
} from "@/lib/validation";
import {
  WinConditionSelector,
  type WinConditionFormState,
} from "@/components/create/WinConditionSelector";
import {
  SeekerSelectionSelector,
  type SeekerSelectionFormState,
} from "@/components/create/SeekerSelectionSelector";

interface Props {
  sessionId: string;
  code: string;
  initialRoster: RosterPlayer[];
}

interface PlayerRow {
  id: string;
  name: string;
  is_seeker: boolean;
}

export function CreateSessionClient({ sessionId, code, initialRoster }: Props) {
  const [graceMinutes, setGraceMinutes] = useState(0);
  const [graceSeconds, setGraceSeconds] = useState(0);
  const [winCondition, setWinCondition] = useState<WinConditionFormState>({
    selected: "lastHidersRemaining",
    lastHidersCount: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [seekerSelection, setSeekerSelection] =
    useState<SeekerSelectionFormState>({ selected: "random", randomCount: 1 });
  const [roster, setRoster] = useState<RosterPlayer[]>(initialRoster);

  useEffect(() => {
    const channel = supabase
      .channel(`session-${sessionId}-players`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setRoster((prev) => {
            if (payload.eventType === "DELETE") {
              const oldId = (payload.old as { id: string }).id;
              return prev.filter((p) => p.id !== oldId);
            }
            const row = payload.new as PlayerRow;
            const updated: RosterPlayer = {
              id: row.id,
              name: row.name,
              isSeeker: row.is_seeker,
            };
            const index = prev.findIndex((p) => p.id === updated.id);
            if (index === -1) return [...prev, updated];
            const next = [...prev];
            next[index] = updated;
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  async function handleToggleSeeker(playerId: string, isSeekerValue: boolean) {
    await fetch(`/api/sessions/${code}/players/${playerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSeeker: isSeekerValue }),
    });
  }

  const derivedWinCondition = useMemo(
    () =>
      winCondition.selected === "lastHidersRemaining"
        ? {
            type: "lastHidersRemaining" as const,
            count: winCondition.lastHidersCount,
          }
        : {
            type: "timeRunsOut" as const,
            hours: winCondition.hours,
            minutes: winCondition.minutes,
            seconds: winCondition.seconds,
          },
    [winCondition],
  );

  const derivedSeekerSelection = useMemo(
    () =>
      seekerSelection.selected === "random"
        ? { type: "random" as const, count: seekerSelection.randomCount }
        : { type: "manual" as const },
    [seekerSelection],
  );

  const startEnabled = isStartEnabled(
    derivedWinCondition,
    derivedSeekerSelection,
    roster,
  );

  return (
    <div className="flex flex-1 flex-col gap-6 bg-cream px-6 py-8">
      <h1 className="text-2xl font-semibold text-umber">Session settings</h1>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-medium text-umber">Grace period</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={graceMinutes}
            onChange={(e) => setGraceMinutes(clampNonNegative(Number(e.target.value)))}
            className="w-16 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
          />
          <span>m</span>
          <input
            type="number"
            min={0}
            value={graceSeconds}
            onChange={(e) => setGraceSeconds(clampNonNegative(Number(e.target.value)))}
            className="w-16 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
          />
          <span>s</span>
        </div>
      </fieldset>

      <WinConditionSelector state={winCondition} onChange={setWinCondition} />

      <SeekerSelectionSelector
        state={seekerSelection}
        onChange={setSeekerSelection}
        roster={roster}
        onToggleSeeker={handleToggleSeeker}
      />

      <button
        type="button"
        disabled={!startEnabled}
        className={`mt-4 rounded-full px-8 py-3 text-lg font-medium ${
          startEnabled ? "bg-umber text-cream" : "bg-gray-300 text-gray-500"
        }`}
      >
        start session
      </button>
    </div>
  );
}
