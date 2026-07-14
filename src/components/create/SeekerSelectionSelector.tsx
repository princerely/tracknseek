"use client";

import { clampNonNegative, type RosterPlayer } from "@/lib/validation";
import { ManualRosterList } from "@/components/create/ManualRosterList";

export interface SeekerSelectionFormState {
  selected: "random" | "manual";
  randomCount: number;
}

interface Props {
  state: SeekerSelectionFormState;
  onChange: (state: SeekerSelectionFormState) => void;
  roster: RosterPlayer[];
  onToggleSeeker: (playerId: string, isSeeker: boolean) => void;
}

export function SeekerSelectionSelector({
  state,
  onChange,
  roster,
  onToggleSeeker,
}: Props) {
  const isRandom = state.selected === "random";
  const isManual = state.selected === "manual";

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 font-medium text-umber">Seeker selection</legend>

      <label
        className={`flex flex-wrap items-center gap-2 rounded-xl border-2 px-4 py-3 ${
          isRandom ? "border-umber bg-sage" : "border-fern bg-cream"
        }`}
      >
        <input
          type="radio"
          name="seeker-selection"
          className="sr-only"
          checked={isRandom}
          onChange={() => onChange({ ...state, selected: "random" })}
        />
        <span>random</span>
        <input
          type="number"
          min={0}
          value={state.randomCount}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onChange({
              ...state,
              randomCount: clampNonNegative(Number(e.target.value)),
            })
          }
          className="w-16 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
        />
        <span>seeker(s)</span>
      </label>

      <label
        className={`flex flex-col gap-3 rounded-xl border-2 px-4 py-3 ${
          isManual ? "border-umber bg-sage" : "border-fern bg-cream"
        }`}
      >
        <span>
          <input
            type="radio"
            name="seeker-selection"
            className="sr-only"
            checked={isManual}
            onChange={() => onChange({ ...state, selected: "manual" })}
          />
          manual assignment
        </span>
        {isManual && (
          <div onClick={(e) => e.stopPropagation()}>
            <ManualRosterList roster={roster} onToggleSeeker={onToggleSeeker} />
          </div>
        )}
      </label>
    </fieldset>
  );
}
