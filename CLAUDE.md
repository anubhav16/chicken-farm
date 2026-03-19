# Chicken Farm — Claude Code Instructions

## About
A business simulation game for 7-year-olds, teaching farming economics, money management, and business sense. Set in Karnataka/Bangalore with realistic Indian poultry prices.

## Project Structure

| File | Purpose |
|------|---------|
| `chicken_farm.html` | The game (single HTML file, self-contained) |
| `test_runtime.js` | Node.js VM smoke test — run after every change (Rule E) |
| `RELEASE_NOTES_CHICKEN_FARM.md` | Version history and changelog |
| `ideas.md` | Game ideas and feature backlog |

## Current Version
**Chicken Farm:** v3.7.0 (2026-03-19)

## ⛔ Hard Rules

### Rule E: RUN IT, DON'T READ IT
After implementing any change, execute the game script in a Node.js VM sandbox before declaring it works. Static analysis (grep, read, pattern-matching) catches syntax — only execution catches runtime failures. Specifically:
1. Extract the `<script>` block from `chicken_farm.html`
2. Run it in `vm.runInContext()` with DOM stubs and **external dependencies deliberately missing**
3. Verify: script loads without crash, key functions exist (`startGame`, `mpTrack`, `getEggPrice`), `mpTrack()` is a safe no-op
4. If it crashes, the ship is **BLOCKED**

**Why**: v3.4.1 shipped with unguarded `mixpanel.init()` that killed the entire game when CDN was blocked. Static review passed. Runtime test would have caught it in 5 seconds.

### Rule F: EXTERNAL DEPS MUST BE GUARDED
Any external `<script>`, `<link>`, or API dependency must be wrapped in `typeof !== 'undefined'` or try/catch. The game must work fully without them. Analytics, CDN libraries, and fonts are best-effort — the game is not.

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
