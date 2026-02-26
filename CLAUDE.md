# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema to DB (no migration file)
npm run db:migrate   # Create + apply a migration
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio GUI
```

There are no tests currently in this project.

## Architecture Overview

**DreamPaths** is a kids' coding education platform where children (aged 8–14) learn Python by building a real platformer game. Parents manage accounts; children complete missions.

### Key Data Model Relationships

- `Parent` → `Child` (one-to-many) — parents own children accounts
- `Child` → `HeroCharacter` (one-to-one) — pixel art character the child draws
- `Child` → `UserLevel` (one-to-many) — levels designed in the Level Designer
- `Child` → `UserSprite` (one-to-many) — custom sprites (enemies, items)
- `Child` → `Project` → `StepProgress` — coding progress per mission step
- `Path` → `Mission` → `MissionProgress` — structured learning path

### Route Groups

- `(app)/` — authenticated area (guarded by `src/app/(app)/layout.tsx` which redirects to `/login` if no session)
- `(auth)/` — public auth pages (login, register, verify-email)
- `api/` — REST API routes

### Core Application Flow

1. **Onboarding** (`/onboarding`) — selects learning path for child
2. **Create Hero** (`/create-hero`) — child draws a 16×16 pixel art character
3. **Mission: Build Scene** (`/mission/[id]`) — child designs a level in the Level Designer
4. **Mission: Code** (`/code/[levelId]`) — child writes Python that controls their game

### Mission System (`src/lib/missions/`)

The mission pack is defined in `platformer-pack.ts` and exported as `platformerMissionPack`. Missions have three `missionType` values:
- `'creative'` — renders `<CharacterCreator>`
- `'level_design'` — renders `<LevelDesigner>`
- *(default)* — renders the coding workspace (code editor + game preview + step panel)

Mission steps contain `validation` config (`type: 'ast' | 'runtime' | 'ast_and_runtime'`) with checks that run against the child's code.

### Python Execution Pipeline

User code runs in the browser via **Pyodide** (loaded globally as `window.pyodide`). The flow is:

1. `wrapUserCode(code)` (in `src/lib/game-engine/python-api.ts`) prepends `PYTHON_GAME_API` — a Python prelude that bridges `window.gameEngine` calls from Python via Pyodide's `js` module
2. Code runs in `MissionWorkspace.handleRunCode()` — captures stdout and waits for engine events
3. `validateStep()` (in `src/lib/validation/validator.ts`) runs AST checks (regex-based) and runtime checks (against `GameEvent[]` from the engine)

### Game Engine (`src/lib/game-engine/engine.ts`)

`PlatformerEngine` is a Canvas 2D renderer/physics engine instantiated per-page. It is exposed on `window.gameEngine` so Python (via Pyodide) can call methods on it. The engine emits `GameEvent` objects that the validator reads after code runs.

### Code Generator / Lesson Scaffolder (`src/lib/code-generator/`)

`lesson-scaffolder.ts` generates personalized `Lesson` objects from a child's `LevelData` — the starter code in each step references the child's actual level name, theme, platforms, and coin count.

### Auth

NextAuth with credentials provider (email + bcrypt password). JWT session strategy. Email must be verified before login. Email verification uses **Resend** (`src/lib/email.ts`).

### Environment Variables Required

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — JWT secret
- `NEXTAUTH_URL` — App URL
- `RESEND_API_KEY` — For email verification
- `FROM_EMAIL` — Sender address for verification emails

### Path Aliases

`@/` maps to `src/` (configured in tsconfig).

### Component Conventions

- Page components in `app/` are Server Components by default; interactive parts are split into `*-client.tsx` files marked `"use client"`
- Designer components (`LevelDesigner`, `SpriteDesigner`, `CharacterCreator`) are self-contained and communicate results upward via `onSave` callbacks
- The `GamePreview` component in `src/components/coding-journey/game-preview.tsx` wires the Canvas-based engine to React lifecycle

# Claude Code Prompt for Plan Mode
**#prompts**

Review this plan thoroughly before making any code changes. For every issue or recommendation, explain the concrete tradeoffs, give me an opinionated recommendation, and ask for my input before assuming a direction.

## My engineering preferences (use these to guide your recommendations):

- DRY is important — flag repetition aggressively.
- Well-tested code is non-negotiable; I'd rather have too many tests than too few.
- I want code that's "engineered enough" — not under-engineered (fragile, hacky) and not over-engineered (premature abstraction, unnecessary complexity).
- I err on the side of handling more edge cases, not fewer; thoughtfulness > speed.
- Bias toward explicit over clever.

---

# 1. Architecture Review

### Evaluate:

- Overall system design and component boundaries.
- Dependency graph and coupling concerns.
- Data flow patterns and potential bottlenecks.
- Scaling characteristics and single points of failure.
- Security architecture (auth, data access, API boundaries).

---

# 2. Code Quality Review

### Evaluate:

- Code organization and module structure.
- DRY violations — be aggressive here.
- Error handling patterns and missing edge cases (call these out explicitly).
- Technical debt hotspots.
- Areas that are over-engineered or under-engineered relative to my preferences.

---

# 3. Test Review

### Evaluate:

- Test coverage gaps (unit, integration, e2e).
- Test quality and assertion strength.
- Missing edge case coverage — be thorough.
- Untested failure modes and error paths.

---

# 4. Performance Review

### Evaluate:

- N+1 queries and database access patterns.
- Memory-usage concerns.
- Caching opportunities.
- Slow or high-complexity code paths.

---

# For Each Issue You Find

For every specific issue (bug, smell, design concern, or risk):

- Describe the problem concretely, with file and line references.
- Present 2–3 options, including **"do nothing"** where that's reasonable.
- For each option, specify:
  - Implementation effort
  - Risk
  - Impact on other code
  - Maintenance burden
- Give me your recommended option and why, mapped to my preferences above.
- Then explicitly ask whether I agree or want to choose a different direction before proceeding.

---

# Workflow and Interaction

- Do not assume my priorities on timeline or scale.
- After each section, pause and ask for my feedback before moving on.

---

# BEFORE YOU START

Ask if I want one of two options:

### 1. BIG CHANGE
Work through this interactively, one section at a time:

Architecture → Code Quality → Tests → Performance

- At most **4 top issues** in each section.

### 2. SMALL CHANGE
Work through interactively **ONE question per review section**

---

# FOR EACH STAGE OF REVIEW

Output:

- Explanation
- Pros and cons of each stage’s questions
- Your opinionated recommendation and why

Then use:

**AskUserQuestion**

Also:

- NUMBER issues.
- Use LETTERS for options.
- When using AskUserQuestion make sure each option clearly labels:
  - Issue NUMBER
  - Option LETTER

So the user doesn't get confused.

**Make the recommended option always the first option.**
