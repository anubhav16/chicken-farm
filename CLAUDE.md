# Chicken Farm — Claude Code Instructions

## About
A business simulation game for 7-year-olds, teaching farming economics, money management, and business sense. Set in Karnataka/Bangalore with realistic Indian poultry prices.

## Project Structure

| File | Purpose |
|------|---------|
| `chicken_farm.html` | The game (single HTML file, self-contained) |
| `RELEASE_NOTES_CHICKEN_FARM.md` | Version history and changelog |
| `ideas.md` | Game ideas and feature backlog |

## Current Version
**Chicken Farm:** v3.2.1 (2026-03-18)

## Release Notes Protocol

**MANDATORY** on every code change: update `RELEASE_NOTES_CHICKEN_FARM.md` with version bump (patch/minor/major), date, summary, and changes. Update the Version History table at the top.

## Game CONFIG

All game parameters are in a `CONFIG` object at the top of the `<script>` section in `chicken_farm.html`. Prices are based on Karnataka/Bangalore 2025 poultry economics.

Key economics: ₹2 profit per hen per day (₹6 egg - ₹3 food - ₹1 maintenance).

## Code Change Annotations

**MANDATORY** on every code change: add inline comment with date-time and why.
```html
<!-- [2026-03-17 14:00] Added egg hatching timer — business simulation core loop -->
```

## Git Protocol

Commit messages should include version, e.g.:
- `[chicken-farm] v3.1.0: Add vaccination system`
