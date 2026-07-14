"use client";

import { clampNonNegative } from "@/lib/validation";

export interface WinConditionFormState {
  selected: "lastHidersRemaining" | "timeRunsOut";
  lastHidersCount: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Props {
  state: WinConditionFormState;
  onChange: (state: WinConditionFormState) => void;
}

export function WinConditionSelector({ state, onChange }: Props) {
  const isLastHiders = state.selected === "lastHidersRemaining";
  const isTimeRunsOut = state.selected === "timeRunsOut";

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 font-medium text-umber">Win condition</legend>

      <label
        className={`flex flex-wrap items-center gap-2 rounded-xl border-2 px-4 py-3 ${
          isLastHiders ? "border-umber bg-sage" : "border-fern bg-cream"
        }`}
      >
        <input
          type="radio"
          name="win-condition"
          className="sr-only"
          checked={isLastHiders}
          onChange={() => onChange({ ...state, selected: "lastHidersRemaining" })}
        />
        <span>until last</span>
        <input
          type="number"
          min={0}
          value={state.lastHidersCount}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onChange({
              ...state,
              lastHidersCount: clampNonNegative(Number(e.target.value)),
            })
          }
          className="w-16 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
        />
        <span>hider(s) remaining</span>
      </label>

      <label
        className={`flex flex-col gap-2 rounded-xl border-2 px-4 py-3 ${
          isTimeRunsOut ? "border-umber bg-sage" : "border-fern bg-cream"
        }`}
      >
        <span className="flex items-center gap-2">
          <input
            type="radio"
            name="win-condition"
            className="sr-only"
            checked={isTimeRunsOut}
            onChange={() => onChange({ ...state, selected: "timeRunsOut" })}
          />
          time runs out
        </span>
        <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="number"
            min={0}
            value={state.hours}
            onChange={(e) =>
              onChange({ ...state, hours: clampNonNegative(Number(e.target.value)) })
            }
            className="w-14 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
          />
          <span>h</span>
          <input
            type="number"
            min={0}
            value={state.minutes}
            onChange={(e) =>
              onChange({ ...state, minutes: clampNonNegative(Number(e.target.value)) })
            }
            className="w-14 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
          />
          <span>m</span>
          <input
            type="number"
            min={0}
            value={state.seconds}
            onChange={(e) =>
              onChange({ ...state, seconds: clampNonNegative(Number(e.target.value)) })
            }
            className="w-14 rounded border border-umber bg-cream px-2 py-1 text-center text-umber"
          />
          <span>s</span>
        </span>
      </label>
    </fieldset>
  );
}
