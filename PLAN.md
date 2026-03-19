# Feature Implementation Plan

**Overall Progress:** `100%` (All 4 phases complete — Steps 1-16 of 16)

## TLDR
Four phases of improvements: (1) Visual fixes — hen name contrast, remove duplicate age emoji, add 7-day egg spoilage with visual warnings; (2) Auto-cleaner fix — 100% cleaning, gray out manual button, robot animation + P&L missing costs + "Today's Events" section; (3) Auto-sell stepper — replace ON/OFF with 0-7 day hold period; (4) Festival calendar — 7 multi-faith Indian festivals on 300-day cycle with advance warnings + cold storage upgrade.

## Critical Decisions
- **Hen name color**: White `#fff` with dark text-shadow (high contrast on all backgrounds)
- **Age emoji removal**: Remove `ht-age` div entirely; age communicated via border color (green/orange/red) already
- **Egg spoilage**: 7-day shelf life, visual stages at 5d (shimmer) and 6d (wobble), removed at 7d
- **Auto-cleaner**: 100% daily dirt removal (Piaget — kids think in absolutes), gray out Clean Farm button
- **Auto-cleaner visual**: 🤖 sweep animation per day + persistent corner icon
- **P&L costs**: Add cleaning, doctor, vaccination rows. One-time costs in separate "Today's Events" section
- **Auto-sell stepper**: Cap at 7 (matches shelf life), warning at 5+ days
- **Festival calendar**: 7 named multi-faith festivals, 300-day cycle, notifications at 10d and 3d, persistent countdown in info panel
- **Cold storage**: ₹2,000 + ₹3/day, extends egg shelf life from 7→14 days
- **Random festival event**: Remove from EVENT_DEFS, replace with new positive event (e.g., government subsidy)

## Reuse Inventory
- `chicken_farm.html` → `getEggPrice()` (line 808) — returns festival price, no change needed
- `chicken_farm.html` → `updateDirtVisual()` (line 1513) — manages poop/fly particles, extend for robot
- `chicken_farm.html` → `.attn-urgent` / `.attn-warning` / `.attn-info` CSS (lines 223-225) — reuse for egg spoilage visuals
- `chicken_farm.html` → `festivalDaysLeft` (line 840) — reuse as-is for scheduled festivals
- `chicken_farm.html` → `notify()` — for all warnings/notifications
- `chicken_farm.html` → `floatText()` — for "egg spoiled" floating text
- `chicken_farm.html` → shop attention system (`updateShopAttention`) — pattern for stepper UI

## Blast Radius

| At risk | Why | Regression check |
|---|---|---|
| `advanceDay()` egg laying | Egg spoilage adds removal logic near egg creation | Verify hens still lay eggs normally, eggs appear in tray |
| `sellEggs()` | Spoilage could leave stale refs in `eggs` array | Sell eggs after some spoil, verify count and earnings correct |
| `getEggPrice()` | Festival calendar changes who sets `festivalDaysLeft` | Verify price returns ₹6 normally, festival price during festival |
| `autoSell` toggle → stepper | All 3 consumers of `autoSell` boolean change | Verify stepper 0=off, 1=daily sell, 3=every 3rd day |
| `advanceDay()` dirt logic | Auto-cleaner changes from 80%→100% | Verify dirt stays 0 with auto-cleaner, still rises without |
| `updateHUD()` P&L section | Adding new cost rows | Verify P&L totals still sum correctly |
| `EVENT_DEFS` festival | Removing random festival | Verify random events still fire (lucky day, mongoose) |
| `eggAction()` (hatch) | Spoiled eggs must not be hatchable | Verify clicking spoiling egg still works if <7d, gone if >=7d |
| `cleanFarm()` | Grayed out when auto-cleaner active | Verify manual clean still works if auto-cleaner NOT bought |

## Consumer & Ownership Checks
- `autoSell` (boolean → number): consumed at lines 1173, 1492-1495, 2438. All must change from truthiness check to `> 0` check. Line 1173 `if (autoSell)` → `if (autoSellInterval > 0 && day % autoSellInterval === 0)`.
- `festivalDaysLeft` writers: currently only `EVENT_DEFS[0].resolve()` (line 1931/1933). New writer: scheduled calendar check in `advanceDay()`. Old writer removed (festival event removed from EVENT_DEFS). One writer, clean.
- `eggs` array: `layEgg()` pushes, `sellEggs()` filters, `eggAction()` mutates, `advanceDay()` iterates for hatching. New: spoilage filter in `advanceDay()`. Must not break hatching eggs (filter: `!e.hatching`).

---

## Tasks

### PHASE 1: Visual Fixes + Egg Spoilage

- [ ] **Step 1: Fix hen name color contrast**
  - [ ] Change `.hen-tile.young .ht-status` color from `#86efac` to `#fff`
  - [ ] Remove the green glow text-shadow override, keep base dark shadow from `.ht-status`
  - [ ] Add date-time annotation comment
  - **Acceptance Criteria**: Young hen names display as white text with dark shadow, readable against all 6 farm sky backgrounds (farm0-farm5)
  - **Test Input**: Buy a hen, verify name (e.g., "FANI") is white with dark outline, not light green
  - **Gate**: Do NOT proceed to Step 2 until Step 1 criteria are confirmed PASS

- [ ] **Step 2: Remove duplicate age emoji icon**
  - [ ] Remove the `<div class="ht-age">` from hen tile HTML in `addHenToFarm()` (line 1439)
  - [ ] Remove `ht-age` from chick tile creation (line 1399-1401 area)
  - [ ] Remove all `.ht-age` CSS rules (lines 84, 89, 94, 99, 104)
  - [ ] Remove the age emoji update logic in `updateHUD()` (lines 2230-2234)
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Hen tiles show only SVG body + name text. No 🐔/🐓/👴 emoji below the SVG. Tile still shows border color for age stage (green/orange/red).
  - **Test Input**: Buy hens, advance to day 500+, verify no emoji appears on any tile, border colors still change
  - **Gate**: Do NOT proceed to Step 3 until Step 2 criteria are confirmed PASS

- [ ] **Step 3: Egg spoilage system — data model**
  - [ ] Add `EGG_SHELF_LIFE: 7` to CONFIG
  - [ ] Add `laidDay: day` to egg object in `layEgg()` (line 1361)
  - [ ] In `advanceDay()`, after auto-sell block (line 1178), add spoilage check: remove eggs where `day - e.laidDay >= CONFIG.EGG_SHELF_LIFE` and `!e.hatching`. Show notification with count. Decrement `basketEggCount`.
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Eggs older than 7 days are automatically removed from tray. Hatching eggs are never removed. Notification shows "🤢 X egg(s) went bad! Sell faster next time!" basketEggCount stays accurate.
  - **Test Input**: Disable auto-sell, let 3+ eggs accumulate, advance 7+ days without selling. Verify eggs disappear on day 7, notification fires, basket count correct.
  - **Gate**: Do NOT proceed to Step 4 until Step 3 criteria are confirmed PASS

- [ ] **Step 4: Egg spoilage — visual warnings**
  - [ ] Add CSS classes for tray eggs: `.tray-egg.egg-warning` (orange border, shimmer animation reusing `.attn-info` keyframes) and `.tray-egg.egg-urgent` (red border, wobble animation reusing `.attn-urgent` keyframes)
  - [ ] In `updateHUD()` egg label update section (line 2293+), add age-based styling: days 5-6 → `.egg-warning` + label "5d"/"6d", day 6 → `.egg-urgent` + label "6d!"
  - [ ] Fresh eggs (0-4d): no extra class, label shows "₹6" or "SELL"
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Eggs in tray visually change at day 5 (orange shimmer + "5d" label) and day 6 (red wobble + "6d!" label). Fresh eggs look normal. Hatching eggs unaffected.
  - **Test Input**: Accumulate eggs, advance day by day. At day 5 after laying, egg shimmers orange. At day 6, wobbles red. At day 7, removed.
  - **Gate**: Do NOT proceed to Step 5 until Step 4 criteria are confirmed PASS

- [ ] **Step 5: Phase 1 — Update version + release notes**
  - [ ] Bump version to v3.5.0 in CLAUDE.md and in-game
  - [ ] Update RELEASE_NOTES_CHICKEN_FARM.md with all Phase 1 changes
  - [ ] Git commit: `[chicken-farm] v3.5.0: Visual fixes + egg spoilage system`
  - **Acceptance Criteria**: Version updated in all locations, release notes complete
  - **Gate**: Do NOT proceed to Phase 2 until Phase 1 is committed

---

### PHASE 2: Auto-cleaner Fix + P&L Costs

- [ ] **Step 6: Auto-cleaner — 100% cleaning + gray out button**
  - [ ] Change line 1252: `dirtLevel - (aliveCount * CONFIG.DIRT_RATE * 0.8)` → `dirtLevel = 0` (set to 0 directly)
  - [ ] In `cleanFarm()` (line 1564), add early return if `hasAutoCleaner`: `notify("🤖 Auto-cleaner handles it!"); return;`
  - [ ] In `updateHUD()` shop attention section, skip 'clean' attention when `hasAutoCleaner`
  - [ ] Gray out Clean Farm button visually when auto-cleaner installed (opacity: 0.4, pointer-events: none style)
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: With auto-cleaner, dirt stays at 0%, Clean Farm button is grayed out and unclickable, poop/flies never appear. Without auto-cleaner, everything works as before.
  - **Test Input**: Buy auto-cleaner, advance 20 days with 5 hens. Dirt should read 0% / "Clean ✨" every day. Click Clean Farm — shows "Auto-cleaner handles it!" Try same flow without auto-cleaner — dirt rises normally, manual clean works.
  - **Gate**: Do NOT proceed to Step 7 until Step 6 criteria are confirmed PASS

- [ ] **Step 7: Auto-cleaner — robot visual animation**
  - [ ] Add a persistent 🤖 icon element in farm-area corner (bottom-right, above fence) when `hasAutoCleaner` is true. Hide when false.
  - [ ] In `advanceDay()`, when auto-cleaner runs (line 1250-1253), trigger a CSS animation: robot slides across farm-area left→right over 1.5s, then returns to corner. Add keyframe `@keyframes robotSweep`.
  - [ ] Add sparkle trail (✨) during sweep using temporary elements
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: After buying auto-cleaner, a 🤖 icon is visible in farm corner. Each day advance triggers a sweep animation across the farm. Animation completes in ~1.5s.
  - **Test Input**: Buy auto-cleaner, advance day. Robot sweeps across farm visually. Advance 5 more days — animation triggers each time.
  - **Gate**: Do NOT proceed to Step 8 until Step 7 criteria are confirmed PASS

- [ ] **Step 8: P&L — add missing cost rows + "Today's Events" section**
  - [ ] Add P&L rows in HTML (after line 436): `🧹 Cleaning` (id=pnl-cleaning), `👨‍⚕️ Doctor` (id=pnl-doctor), `💉 Vaccination` (id=pnl-vaccine)
  - [ ] Track `stats.totalVaccinationSpent` — add to `vaccinateHens()` (line 1647)
  - [ ] In `updatePnL()`, compute and display: cleaning = 0 (one-time, not daily), doctor = 0 (one-time), vaccination = 0 (one-time). These rows show ₹0 in daily P&L.
  - [ ] Add "Today's Events" section below P&L: a div that accumulates one-time spends per day. Entries: cleaning cost, doctor fee, vaccination cost, hen purchases, farm upgrades. Clear on each `advanceDay()`.
  - [ ] Create `addTodayEvent(emoji, text)` helper that appends to the Today section
  - [ ] Call `addTodayEvent()` from: `cleanFarm()`, `callDoctor()`, `vaccinateHens()`, `buyHen()`, `buyFarm()`, `buyAutoCleaner()`, `buyGuardDog()`
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: P&L shows all recurring cost lines (including medicine ₹5/day for treated hens). "Today's Events" section shows one-time purchases made today. Section clears each new day. Total spent in TOTALS section includes all costs.
  - **Test Input**: Buy a hen (₹300), clean farm (₹45), call doctor (₹150), vaccinate (₹100). Verify "Today's Events" shows all four with correct amounts. Advance day — section clears. Verify TOTALS "Total spent" includes all.
  - **Gate**: Do NOT proceed to Step 9 until Step 8 criteria are confirmed PASS

- [ ] **Step 9: Phase 2 — Update version + release notes**
  - [ ] Bump version to v3.6.0
  - [ ] Update RELEASE_NOTES_CHICKEN_FARM.md
  - [ ] Git commit: `[chicken-farm] v3.6.0: Auto-cleaner fix + P&L costs + Today's Events`
  - **Acceptance Criteria**: Version updated, release notes complete
  - **Gate**: Do NOT proceed to Phase 3 until Phase 2 is committed

---

### PHASE 3: Auto-sell Stepper

- [ ] **Step 10: Replace auto-sell toggle with stepper**
  - [ ] Replace `let autoSell = false` (line 831) with `let autoSellInterval = 0` (0=off)
  - [ ] Replace shop button HTML (line 522) with stepper: `[ - ] 0 days [ + ]` layout. Show "OFF" when 0, "DAILY" when 1, "Every Xd" when 2-7.
  - [ ] Replace `toggleAutoSell()` with `changeAutoSellInterval(delta)` — clamps 0-7
  - [ ] At 5+, show inline warning text: "⚠️ Eggs spoil at 7 days!"
  - [ ] Update `advanceDay()` line 1173: `if (autoSellInterval > 0 && day % autoSellInterval === 0)`
  - [ ] Update game-over tip (line 2438) to reference stepper
  - [ ] Update game reset (line 1043) to reset `autoSellInterval = 0`
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Stepper shows 0-7 range. 0=no selling. 1=daily. 3=every 3rd day. Warning appears at 5+. Eggs actually sell on correct interval days. Old `autoSell` boolean fully removed.
  - **Test Input**: Set stepper to 3. Advance days 1-6. Eggs should sell on day 3 and day 6 only. Set to 0 — no auto-selling. Set to 6 — warning text visible.
  - **Gate**: Do NOT proceed to Step 11 until Step 10 criteria are confirmed PASS

- [ ] **Step 11: Phase 3 — Update version + release notes**
  - [ ] Bump version to v3.7.0
  - [ ] Update RELEASE_NOTES_CHICKEN_FARM.md
  - [ ] Git commit: `[chicken-farm] v3.7.0: Auto-sell stepper (0-7 day hold period)`
  - **Acceptance Criteria**: Version updated, release notes complete
  - **Gate**: Do NOT proceed to Phase 4 until Phase 3 is committed

---

### PHASE 4: Festival Calendar + Cold Storage

- [ ] **Step 12: Festival calendar — CONFIG + schedule engine**
  - [ ] Add `FESTIVAL_CALENDAR` to CONFIG:
    ```
    FESTIVAL_CALENDAR: [
      { name: 'Pongal',             day: 30,  emoji: '🌾', price: 10, duration: 3 },
      { name: 'Eid',                day: 70,  emoji: '🌙', price: 10, duration: 3 },
      { name: 'Onam',               day: 120, emoji: '🛶', price: 10, duration: 3 },
      { name: 'Diwali',             day: 170, emoji: '🪔', price: 12, duration: 5 },
      { name: 'Guru Nanak Jayanti', day: 210, emoji: '🙏', price: 10, duration: 3 },
      { name: 'Christmas',          day: 250, emoji: '🎄', price: 10, duration: 3 },
      { name: 'Holi',               day: 280, emoji: '🎨', price: 10, duration: 3 },
    ],
    FESTIVAL_CYCLE: 300,
    FESTIVAL_WARN_EARLY: 10,
    FESTIVAL_WARN_LATE: 3,
    ```
  - [ ] Add `getNextFestival(currentDay)` function — returns `{ name, emoji, price, duration, startsIn }` or null
  - [ ] Add `getActiveFestival(currentDay)` function — returns active festival or null
  - [ ] Update `getEggPrice()` to use `getActiveFestival()` instead of flat `festivalDaysLeft`
  - [ ] In `advanceDay()`, check if a festival starts today. If so, set `festivalDaysLeft` and `currentFestivalPrice`. Show notification: "🪔 Diwali is here! Eggs sell for ₹12 for 5 days!"
  - [ ] In `advanceDay()`, at 10d and 3d before festival, show notification: "🪔 Diwali in 10 days! Egg price ₹12 — start saving eggs!"
  - [ ] Remove festival event from `EVENT_DEFS` array. Replace with new event: `{ id: 'subsidy', emoji: '🏛️', title: 'GOVERNMENT SUBSIDY!', desc: 'Free feed for 5 days!', ... }`
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Festivals fire on correct cycle days (30, 70, 120...). Price changes during festival. Notifications at 10d and 3d before. `getEggPrice()` returns correct festival price. Random events still work (minus old festival). Cycle repeats after day 300.
  - **Test Input**: Advance to day 20 — notification "Pongal in 10 days!" at day 20. At day 27 — "Pongal in 3 days!". At day 30 — "Pongal is here!" Price = ₹10. At day 33 — "Festival over." Price = ₹6. Advance to day 300+ — cycle repeats.
  - **Gate**: Do NOT proceed to Step 13 until Step 12 criteria are confirmed PASS

- [ ] **Step 13: Festival countdown in info panel**
  - [ ] Add a "🎉 UPCOMING" section in the left info panel (below FARM section, above TOTALS)
  - [ ] Show: festival emoji + name + "in X days" + price. E.g., "🪔 Diwali in 8 days (₹12/egg)"
  - [ ] During active festival, show: "🪔 Diwali NOW! X days left (₹12/egg)" with golden highlight
  - [ ] Update in `updateHUD()` / `updatePnL()` each tick
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Info panel always shows next upcoming festival with countdown. During festival, shows active state with days remaining. Updates every day.
  - **Test Input**: At day 15, panel shows "🌾 Pongal in 15 days (₹10/egg)". At day 30, shows "🌾 Pongal NOW! 3 days left". At day 33, switches to "🌙 Eid in 37 days".
  - **Gate**: Do NOT proceed to Step 14 until Step 13 criteria are confirmed PASS

- [ ] **Step 14: Cold storage upgrade**
  - [ ] Add CONFIG: `COLD_STORAGE_COST: 2000`, `COLD_STORAGE_DAILY: 3`, `COLD_STORAGE_SHELF_LIFE: 14`
  - [ ] Add `let hasColdStorage = false` state variable
  - [ ] Add shop button in CONTROLS panel (after Auto Cleaner): "❄️ COLD STORAGE ₹2,000 — Eggs last 14 days (₹3/day)"
  - [ ] Add `buyColdStorage()` function (same pattern as `buyAutoCleaner()`)
  - [ ] Modify egg spoilage check in `advanceDay()`: use `hasColdStorage ? CONFIG.COLD_STORAGE_SHELF_LIFE : CONFIG.EGG_SHELF_LIFE`
  - [ ] Modify egg visual warning thresholds: warning at shelfLife-2, urgent at shelfLife-1
  - [ ] Add cold storage daily cost to P&L (new row: ❄️ Cold storage)
  - [ ] Add to `updatePnL()` totalCost sum
  - [ ] Reset on game restart
  - [ ] Add date-time annotation comments
  - **Acceptance Criteria**: Cold storage purchasable for ₹2,000. After purchase, eggs last 14 days instead of 7. Daily cost ₹3 deducted and shown in P&L. Visual warnings shift to day 12 (warning) and day 13 (urgent). Without cold storage, 7-day behavior unchanged.
  - **Test Input**: Buy cold storage. Accumulate eggs, advance 8 days — eggs still alive. Advance to day 13 — warning. Day 14 — spoiled. Check P&L shows ₹3/day cold storage cost.
  - **Gate**: Do NOT proceed to Step 15 until Step 14 criteria are confirmed PASS

- [ ] **Step 15: Phase 4 — Update version + release notes**
  - [ ] Bump version to v4.0.0 (major: new gameplay system)
  - [ ] Update RELEASE_NOTES_CHICKEN_FARM.md
  - [ ] Git commit: `[chicken-farm] v4.0.0: Festival calendar + cold storage`
  - **Acceptance Criteria**: Version updated, release notes complete
  - **Gate**: Do NOT proceed to Final Step until Phase 4 is committed

---

### FINAL: Regression Sweep

- [ ] **Step 16: Full regression sweep**
  - [ ] Verify hens lay eggs normally (buy hen, advance day, egg appears in tray)
  - [ ] Verify sell eggs works (manual sell, check earnings correct at ₹6 normal / ₹10-12 festival)
  - [ ] Verify auto-sell stepper at interval 1 (daily sell) and interval 3 (every 3rd day)
  - [ ] Verify egg hatching still works (click egg, 21-day timer, chick appears)
  - [ ] Verify hatching eggs don't spoil
  - [ ] Verify egg spoilage at 7d (no cold storage) and 14d (with cold storage)
  - [ ] Verify dirt stays 0 with auto-cleaner, rises without
  - [ ] Verify manual clean works when no auto-cleaner, blocked when auto-cleaner installed
  - [ ] Verify robot sweep animation fires each day
  - [ ] Verify P&L totals sum correctly (income - all costs = net)
  - [ ] Verify "Today's Events" shows purchases and clears next day
  - [ ] Verify festival fires at day 30 (Pongal), price = ₹10
  - [ ] Verify festival notification at 10d and 3d before
  - [ ] Verify info panel countdown updates correctly
  - [ ] Verify random events still fire (lucky day, mongoose, new subsidy event)
  - [ ] Verify game reset clears all new state (autoSellInterval, hasColdStorage, festival state)
  - [ ] Verify game-over report includes relevant new stats
  - **Acceptance Criteria**: All 16 checks above show PASS with actual output evidence
  - **Gate**: ALL rows must PASS — BLOCKED until then
