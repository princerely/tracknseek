---
description: Plan a feature before building it. Use whenever I ask for a new feature or non-trivial change, before any code.
---
# Planning phase only — no code

Read and research only. Do not write, edit, or run state-changing commands.
The only artifact is one plan document. The feature to plan is: $ARGUMENTS
(if empty, ask "What feature should I plan?" and stop).

## Context loaded automatically
!`cat CLAUDE.md 2>/dev/null`
!`ls docs/plans/ 2>/dev/null`
!`git status --porcelain 2>/dev/null | head -20`

## Instructions
Steps 1 and 2 are independent — dispatch both subagents in the same turn so
they run in parallel. Steps 3–5 run in sequence. Each subagent is read-only,
in `.claude/agents`, and cannot see this conversation — give each a
self-contained prompt. Only summaries return here; never paste raw output.

1. Dispatch `explorer` (haiku): files, dependencies/blast radius, patterns.
2. Dispatch `researcher` (sonnet): external API/version facts, with sources.
   Skip only if the feature touches nothing external — and say so in the plan.
3. Dispatch `architect` (opus) with both summaries and CLAUDE.md's verification
   section: ordered steps, smallest change, edge cases, what does not change.
4. Dispatch `contrarian` (sonnet) with the draft: attack scope and gaps.
5. Merge into one document at `docs/plans/<short-feature-name>.md`. Adopt every
   contrarian cut unless it breaks a requirement; record rejected cuts and why.

The document is plain language for a non-expert, with exactly these sections:
Goal (one sentence); Ordered steps (files + why); Edge cases handled; What was
cut and why; Verification (from CLAUDE.md plus feature-specific checks). Final
line, exactly: "Awaiting review — no code written yet." Then stop. Do not
implement, do not offer to. Execution starts only after I approve.
