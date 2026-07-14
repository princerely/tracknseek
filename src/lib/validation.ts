export type WinCondition =
  | { type: "lastHidersRemaining"; count: number }
  | { type: "timeRunsOut"; hours: number; minutes: number; seconds: number };

export type SeekerSelection =
  | { type: "random"; count: number }
  | { type: "manual" };

export interface RosterPlayer {
  id: string;
  name: string;
  isSeeker: boolean;
}

// `min={0}` on an <input> doesn't stop a typed "-5" — every numeric field's
// onChange runs input through this so state never holds a negative value.
export function clampNonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

// Checks only the currently-selected branch's fields — the unselected
// branch's stale values never affect validity.
export function isWinConditionValid(condition: WinCondition): boolean {
  if (condition.type === "lastHidersRemaining") {
    return isNonNegativeInteger(condition.count);
  }
  const { hours, minutes, seconds } = condition;
  if (
    !isNonNegativeInteger(hours) ||
    !isNonNegativeInteger(minutes) ||
    !isNonNegativeInteger(seconds)
  ) {
    return false;
  }
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds > 0;
}

export function isSeekerSelectionValid(
  selection: SeekerSelection,
  roster: RosterPlayer[],
): boolean {
  if (selection.type === "random") {
    return (
      isNonNegativeInteger(selection.count) && selection.count < roster.length
    );
  }
  const seekerCount = roster.filter((p) => p.isSeeker).length;
  const hiderCount = roster.length - seekerCount;
  return seekerCount >= 1 && hiderCount >= 1;
}

export function isStartEnabled(
  winCondition: WinCondition,
  seekerSelection: SeekerSelection,
  roster: RosterPlayer[],
): boolean {
  return (
    isWinConditionValid(winCondition) &&
    isSeekerSelectionValid(seekerSelection, roster)
  );
}
