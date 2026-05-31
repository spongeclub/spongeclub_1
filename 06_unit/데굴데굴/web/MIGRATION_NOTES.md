# Missions slice migration notes

Goal: adapt the existing `06_unit/데굴데굴/web` prototype into the `selfishclub/spongeclub-community` main app shape without replacing it with the deployed community source.

## Source intent

The original prototype source remains in place:

- `src/components/*`
- `src/data/*`
- `src/lib/week-context.tsx`
- `src/lib/types.ts`

The community-shaped copy now lives under:

- `src/app/missions/page.tsx`
- `src/app/missions/_components/*`
- `src/app/missions/_data/*`
- `src/app/missions/_lib/*`
- `src/app/missions/missions.css`

## Why this shape

`spongeclub-community` keeps mission-board code under `src/app/missions`, with route-local components in `_components`. This folder mirrors that structure while preserving the prototype UI and mock data.

The copied slice is intentionally self-contained. Its imports point to `./_components`, `../_data`, and `../_lib` so the maintainer can review or copy the mission-board feature without also chasing the old root-level prototype folders.

## Verification

- `npx eslint src/app/missions`: passed.
- `npm run build`: passed.

Known existing lint outside this slice:

- `src/app/announcements/page.tsx`
- `src/app/materials/page.tsx`
- `src/components/Header.tsx`
- `src/components/MissionHero.tsx`

Those were pre-existing prototype-app lint issues and are not part of the community-shaped `/missions` handoff slice.
