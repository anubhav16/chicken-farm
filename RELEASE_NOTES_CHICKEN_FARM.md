# Chicken Farm — Release Notes

## Version History

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v4.0.0 | 2026-03-19 | Major | Festival calendar (7 multi-faith festivals) + cold storage + govt subsidy event |
| v3.7.0 | 2026-03-19 | Minor | Auto-sell stepper (0-7 day hold period) |
| v3.6.0 | 2026-03-19 | Minor | Auto-cleaner fix + robot animation + P&L costs + Today's Events |
| v3.5.0 | 2026-03-19 | Minor | Visual fixes (name contrast, remove age emoji) + egg spoilage system |
| v3.4.2 | 2026-03-19 | Patch | Fix: Mixpanel SDK crash kills game when CDN blocked |
| v3.4.1 | 2026-03-19 | Patch | Mixpanel JS SDK + session recording + 11 missing events |
| v3.4.0 | 2026-03-19 | Minor | Random events: Festival Bonus, Lucky Day, Mongoose Attack + Guard Dog |
| v3.3.0 | 2026-03-19 | Minor | Kid UX: readable names, poop dirt, button loan UI, no decimals |
| v3.2.1 | 2026-03-18 | Patch | Shop item attention system — wobble/bounce/shimmer alerts for kid engagement |
| v3.2.0 | 2026-03-18 | Minor | Kid-friendly overhaul — pause, big sick indicators, simplified tiles, shortcut bar |
| v3.1.0 | 2026-03-17 | Minor | Sickness stages, vaccination, auto-cleaner |
| v3.0.0 | 2026-03-17 | Major | Hen aging, sickness, cleaning, smart game-over report, 2-panel layout |
| v2.0.0 | 2026-03-17 | Major | Hen grid tiles, egg tray, sick bay, dirt particles, auto-sizing |
| v1.3.0 | 2026-03-17 | Minor | Karnataka/Bangalore realistic pricing, kid-friendly big fonts |
| v1.2.0 | 2026-03-17 | Minor | EMI auto-deduction, daily P&L breakdown, money graph |
| v1.1.0 | 2026-03-17 | Minor | Bank loans, rent/buy farm system, auto-sell, 10x speed |
| v1.0.0 | 2026-03-17 | Major | Full game with CONFIG, SVG chickens, sound, day/night cycle |
| v0.1.0 | 2026-03-17 | Major | Initial prototype — basic chicken farming simulation |

---

## v4.0.0 — Festival Calendar + Cold Storage (Mar 19)

### Scheduled Festival Calendar (NEW — major gameplay system)
- **7 multi-faith Indian festivals** on a 300-day repeating cycle:
  - 🌾 Pongal (day 30), 🌙 Eid (day 70), 🛶 Onam (day 120), 🪔 Diwali (day 170, ₹12/egg, 5 days!), 🙏 Guru Nanak Jayanti (day 210), 🎄 Christmas (day 250), 🎨 Holi (day 280)
- **Advance notifications** at 10 days and 3 days before each festival
- **Info panel countdown** always shows next festival with urgency colors (red ≤3d, orange ≤10d)
- Dynamic egg price per festival (Diwali = ₹12, others = ₹10)
- Teaches planning, stockpiling, and India's multi-faith culture

### Cold Storage Upgrade (NEW)
- ₹2,000 one-time + ₹3/day running cost
- Extends egg shelf life from 7 → 14 days
- Enables festival stockpiling strategy (save eggs for 10+ days before a festival)
- Visual warnings shift to day 12 (warning) and day 13 (urgent)
- Cost shown in daily P&L

### Government Subsidy Event (NEW — replaces random festival)
- Random event: "Karnataka govt offers free feed for 5 days!"
- Player chooses to accept or decline
- Replaces old random festival event (festivals are now scheduled, not random)

---

## v3.7.0 — Auto-sell Stepper (Mar 19)

### Auto-sell Stepper (replaces ON/OFF toggle)
- **Stepper UI**: `−` / `+` buttons to set sell interval from 0-7 days
- 0 = OFF, 1 = DAILY, 2-7 = sell every N days
- **Spoilage warning** at 5+ days: "⚠️ Eggs spoil at 7 days!"
- **A key shortcut** cycles through 0→1→2→...→7→0
- Teaches hold-period economics: accumulate eggs for festivals, balance vs spoilage risk
- Game reset properly clears to 0

---

## v3.6.0 — Auto-cleaner Fix + P&L Costs + Today's Events (Mar 19)

### Auto-cleaner Fix
- **100% daily cleaning**: Auto-cleaner now sets dirt to 0% (was 80%, confusing for kids — Piaget: kids think in absolutes)
- **Clean Farm button grayed out**: When auto-cleaner installed, manual clean is disabled (opacity 0.4, pointer-events none, "🤖 Auto-cleaner handles it!" message)
- **Shop attention suppressed**: No wobble/shimmer on Clean Farm when auto-cleaner active

### Robot Visual Animation (NEW)
- 🤖 icon appears in farm corner after buying auto-cleaner
- **Daily sweep animation**: Robot slides across farm left→right each day with ✨ sparkle trail
- Gives kids visual feedback that "my ₹5,000 machine is working!"

### Today's Events Section (NEW)
- New panel below Daily P&L showing one-time purchases made today
- Entries: hen purchases, farm upgrades, cleaning, doctor, vaccination, medicine, auto-cleaner, guard dog
- Clears automatically each new day
- Separates one-time CAPEX from recurring daily OPEX (financially accurate P&L)

### Vaccination Tracking (Fix)
- `stats.totalVaccinationSpent` now tracked (was missing)
- Included in game-over spending breakdown and total spent calculation
- Added to Mixpanel game-over event

---

## v3.5.0 — Visual Fixes + Egg Spoilage (Mar 19)

### Visual Fixes
- **Hen name contrast**: Young hen names changed from light green (#86efac) to white (#fff) with dark text-shadow — now readable on all sky backgrounds
- **Removed duplicate age emoji**: Tiles no longer show both SVG hen body AND 🐔/🐓/👴 emoji. Age communicated via border color (green=young, orange=declining, red=old)
- **Chick tiles**: Simplified — removed age-in-days display, shows "🐤 Xd" in status text

### Egg Spoilage System (NEW)
- Eggs spoil after **7 days** (`CONFIG.EGG_SHELF_LIFE`) — realistic for unrefrigerated Indian climate
- Each egg tracks `laidDay` for age calculation
- **Visual warnings**: Day 5-6 = orange shimmer outline + age label. Day 6 = red wobble + "6d!" label
- Spoiled eggs auto-removed from tray with notification: "🤢 X egg(s) went bad!"
- Hatching eggs are exempt from spoilage (incubating = different biology)
- Auto-sell protects against spoilage (eggs sold before they can rot)

---

## v3.4.2 — Fix: Mixpanel SDK Crash (Mar 19)

### Critical Fix
- Mixpanel SDK CDN script could fail to load (ad blocker, offline, slow network)
- When it failed, `mixpanel.init()` threw uncaught error, killing entire game script
- All game variables (including `gameRunning`) never initialized → "Cannot access before initialization"
- **Fix**: Guard all Mixpanel calls with `typeof mixpanel !== 'undefined'` check
- Game now works perfectly with or without Mixpanel SDK loaded

---

## v3.4.1 — Mixpanel Full SDK + Complete Event Coverage (Mar 19)

### Mixpanel JS SDK
- Replaced pixel-based tracking with official Mixpanel JS SDK (CDN)
- Session recording enabled at 100% (`record_sessions_percent: 100`)
- `mpTrack()` and `mpEngage()` wrappers preserved — all existing call sites unchanged

### 11 New Events
- `hen_sold`, `farm_cleaned`, `auto_cleaner_bought`, `medicine_given`
- `vaccinated`, `guard_dog_bought`, `loan_repaid`
- `auto_sell_toggled`, `speed_changed`, `mongoose_blocked`
- Added `egg_price` + `is_festival` to existing `eggs_sold` event

### Total Events: 25
Every player decision is now tracked for product analytics.

---

## v3.4.0 — Random Events (Mar 19)

### Event System
- Events pause the game and show a 2-choice modal (big buttons, bouncy emoji)
- Max 1 event per 10 game-days, starts after day 10, 15% chance per eligible day
- Events tracked in Mixpanel (event_shown, event_choice)

### 3 Events
- **Festival Bonus** 🎉 (40% weight): Eggs sell for ₹10! Choice: sell now or save for 3 days
- **Lucky Day** 🍀 (35% weight): Restaurant wants 10 eggs at ₹8. Choice: sell or decline
- **Mongoose Attack** 🦡 (25% weight): Kills 1 hen if no guard dog. Auto-blocked if dog owned

### Guard Dog Shop Item
- 🐕 Guard Dog: ₹500 one-time, permanently protects from mongoose attacks
- Teaches "insurance" concept — invest now to prevent future losses

### Dynamic Egg Price
- `getEggPrice()` replaces all direct `EGG_PRICE` usage
- Festival events temporarily boost egg price to ₹10 for 3 days
- Sell Eggs button shows festival price indicator

### Game Over Report
- Events encountered, festivals enjoyed, lucky deals taken
- Mongoose attacks blocked/unblocked with tip to buy guard dog

---

## v3.3.0 — Kid UX Overhaul (Mar 19)

### Hen Name Contrast
- Added dark text-shadow to `.ht-status` for readability on all backgrounds
- Minimum font size 8px (was 5-6px on large/xl grids)

### Fun Dirty Farm
- Replaced dark brown overlay with scattered 💩 poop emojis that multiply with dirt level
- At filthy level (60%+), 🪰 buzzing flies appear with animated movement
- Clearly distinguishable from night cycle — no more confusion

### Loan Button UI
- Replaced `prompt()` dialogs with in-game modals (Bangers font, neon borders)
- Take loan: 3 big buttons (₹1K, ₹5K, ₹10K) — unaffordable ones greyed out
- Repay: single "Pay Back All" button — shows partial if can't afford full
- Escape key closes modals

### No Decimal Money
- All money displays rounded to whole rupees (₹)
- Internal float preserved for EMI/interest accuracy

---

## v3.2.1 — Shop Item Attention System (Mar 18)

### Playful Alert Animations on Shop Buttons
- **URGENT** (red wobble): Sick untreated hens → Doctor button, Filthy farm (≥70%) → Clean button
- **WARNING** (orange bounce): Unwell hens → Medicine button, Dirty farm (≥30%) → Clean button
- **INFO** (gold shimmer): Eggs ready to sell → Sell Eggs button
- **Resolution reward**: Green flash when condition clears — satisfying "I fixed it!" feedback
- Uses `data-action` attributes for clean DOM querying
- State tracked per-action to detect alert→clear transitions

---

## v3.2.0 — Kid-Friendly Overhaul (Mar 18)

### Spacebar Pause/Resume
- Press Space to pause/resume game — neon overlay with "⏸️ PAUSED" (Ronaldo Chicken style)
- Day counter stops while paused, all timers frozen
- Reset on game over and new game

### Keyboard Shortcuts Bar
- Always-visible bottom bar during gameplay showing all shortcuts
- Styled key icons: [H] Buy Hen, [E] Sell Eggs, [C] Sell Hen, [A] Auto-sell, [U] Upgrade, [L] Loan, [␣] Pause
- Hides on game over

### Simplified Hen Tiles
- All hens now same warm brown color (removed confusing 5-color variants)
- Each hen gets a fun name (Goldie, Pepper, Sunny, Nugget, etc.) — no duplicate names among living hens
- Age shown as emoji stages: 🐔 (young) → 🐓 (declining) → 👴 (old) instead of "127d"
- Tile sizes bumped ~15% at 6-35 hen range for readability

### BIG & LOUD Sick Indicators
- Full-tile color floods: yellow (unwell), red (sick), blue (healing)
- Giant 40px emoji overlays centered on sick tiles (🤧🤒💊🩹)
- Action buttons directly on tiles: "💊 Fix" for unwell, "🚑 Help!" for sick
- Aggressive shake animation for sick tiles (bigger amplitude)
- Sound alerts on health transitions (sine tone for unwell, square two-tone for sick)
- Notifications now include hen name

### Game Starts Immediately
- "BUY YOUR FIRST HEN! 🐔" CTA shows in farm area when 0 hens
- Pulsing gold text with [H] hint, disappears on first hen purchase
- Day counter and rent deduct from game start, creating urgency

---

## v3.1.0 — Sickness Stages, Vaccination & Auto-Cleaner (Mar 17)

### Sickness Stages
- Three-stage system: Unwell (3-day warning) → Sick (needs doctor) → Death (10 days untreated)
- Home medicine: ₹10 with 70% cure rate (unwell stage only)
- Healing speed: 3 days (clean farm) vs 7 days (dirty farm)

### Vaccination
- ₹20/hen, 180 days protection, drops sick chance to 0.5%
- 💉 badge on vaccinated hens

### Auto-Cleaner
- ₹5,000 one-time purchase + ₹5/day running cost
- Cleans 80% of daily dirt automatically

---

## v3.0.0 — Hen Lifecycle, Sickness, Cleaning & Smart Game Over (Mar 17)

### Hen Aging System
- Hens now have a full lifecycle: Young (0-500d) → Declining (500-700d) → Old (700-900d) → Death
- Young hens: 1 egg/day, green border, `🟢 1 egg/day` label
- Declining hens: 50% egg chance, yellow border, `🟡 50% eggs`
- Old hens: 0 eggs, red border, `🔴 No eggs!` — costs food but produces nothing
- Hens die of old age at 900 days
- Old hens sell for ₹100 (vs ₹250 young) — teaches depreciation
- Sell button prioritizes oldest hen first

### Sickness & Doctor
- Hens get sick randomly: 2%/day (clean farm), 4% (dirty), 8% (filthy)
- Sick hens: purple border, shake animation, lay 0 eggs
- Call Doctor: ₹150 one-time + ₹5/day medicine per hen for 5 days
- Untreated sick hens die in 10 days
- Healing hens shown with blue border (no shake)
- Medicine cost tracked in P&L

### Farm Cleaning
- Dirt accumulates per hen per day, proportional to crowding/capacity
- Bigger farms with more space = slower dirt accumulation
- Visual dirt particles (💩🪶🦟🐛🪳) appear on farm
- Dirt overlay gets progressively brown
- Dirt reduces egg production: 80% at dirty, 50% at filthy
- Cleaning cost scales with dirt level: ₹30 (clean) → ₹150 (filthy)

### Smart Game Over Report Card
- **❌ WHY DID I FAIL?** — detects actual bankruptcy causes:
  - Starvation, untreated sickness, dirty farm, over-leveraged loans, old hens, low egg sales, too much hatching, high rent
- **✅ WHAT I DID RIGHT** — positive reinforcement
- **💡 TIPS FOR NEXT TIME** — specific advice based on what went wrong
- **💸 WHERE DID MY MONEY GO?** — full spending breakdown by category
- Tracks 20+ game statistics throughout play

### Income Breakdown by Health
- P&L now shows: Healthy × count, Sick × count (₹0 no eggs), Healing × count (₹0 resting)
- Dirt penalty shown: "⚠️ Dirt penalty: 80% production"

### Sick Display Fix
- Doctor button only counts UNTREATED sick hens
- Display distinguishes: "🤒 3 NEED DOCTOR! + 2 healing" vs "💊 2 healing" vs "✅ All healthy"

---

## v2.0.0 — Grid Layout, Egg Tray, Sick Bay & Auto-Sizing (Mar 17)

### Hen Grid (replaces free-roaming)
- All hens displayed as organized tile grid in center farm area
- Each tile shows SVG chicken, age in days, and health status
- Color-coded borders: green (young), yellow (declining), red (old), purple (sick), blue (healing)
- Auto-sizing tiles shrink smoothly as farm grows:
  - 1-5 hens: 110×120px (big, detailed)
  - 6-15: 82×90px
  - 16-35: 64×72px
  - 36-70: 48×56px
  - 71+: 36×42px (fits 100+ on screen)
- Smooth CSS transition animation when tiles resize

### Egg Tray
- Dedicated horizontal strip at bottom of farm area
- Small SVG eggs line up in a scrollable row
- Click egg to hatch it (turns grey with day countdown)
- Separate from hen grid — eggs clearly visible

### Sick Bay
- Distinct dashed-border section at top of farm
- Sick hens automatically move to sick bay
- Always small tiles (44×52px) regardless of grid size
- Untreated: red border + shake | Healing: blue border, calm
- Recovered hens move back to main grid

### Farm Area Overflow Fix
- Farm area has `overflow: hidden` — prevents frame breaking
- Hen grid has `min-height: 0` for proper flex scrolling
- No more tiles escaping their container at 100 hens

### 2-Panel Layout
- **Left panel (260px):** All information — money, day, P&L, farm status, totals, graph
- **Right panel (240px):** All controls — farm care, buy/sell, farm upgrades, bank, settings
- Center: farm view with hen grid + egg tray
- Farm Care section moved to top of controls (highest priority)

---

## v1.3.0 — Karnataka Pricing & Kid-Friendly Fonts (Mar 17)

### Realistic Karnataka/Bangalore Economics
- Egg price: ₹6 (NECC Bangalore retail ₹5-6)
- Layer hen: ₹300 (KA market ₹250-350)
- Feed: ₹3/hen/day (110g × ₹28/kg)
- Doctor visit: ₹150 (rural KA vet: ₹100-200)
- Cleaning base: ₹30 (rural KA labour rates)
- Loan rate: 9% p.a. (SBI Kisan Credit Card)
- Per-hen daily profit: ₹2 (₹6 egg - ₹3 food - ₹1 maintenance)
- Farm rents adjusted for Karnataka land costs

### Kid-Friendly Fonts (7-year-old target)
- Money display: 32px → 42px
- Day display: 18px → 24px
- Quick stats: 20px → 28px
- P&L rows: 11px → 14px
- P&L totals: 12px → 16-18px
- Farm stats: 11px → 14px
- Shop button names: 14px → 16px
- Shop prices: 11px → 14px (bold)
- Notifications: 22px → 26px
- Rules text: 12px → 16px
- Section titles: 13px → 18px
- Hen tile status: brighter colors with glow for contrast

---

## v1.2.0 — EMI, Daily P&L, Money Graph (Mar 17)

### EMI Auto-Deduction
- Loan EMI calculated using standard formula: `P × r × (1+r)^n / ((1+r)^n - 1)`
- EMI auto-deducted daily from money
- Interest paid first, then principal
- EMI breakdown shown: Principal portion, Interest portion, Principal remaining
- Loan tenure: 730 days (2 years) — keeps EMI manageable
- EMI recalculated on partial repayment
- Can't-pay-EMI warning with penalty interest

### Daily P&L Panel
- Income/day with breakdown
- All cost line items: food, chick food, maintenance, rent, EMI, medicine
- Summary: INCOME/day, COST/day, PROFIT/day
- Totals: Total earned, Total spent, Avg profit/day, Total debt, Net worth

### Money Graph
- Canvas-based line chart tracking money over ALL days
- Y-axis labels with ₹ values, X-axis with day numbers
- Marks highest point (gold), lowest (red), current (green/red)
- Zero line when money goes negative
- Click to resize: small → medium → large
- Green fill when positive, red when negative

---

## v1.1.0 — Loans, Farm Upgrades, Auto-Sell, Speed (Mar 17)

### Bank Loan System
- Take loans at 9% p.a. interest
- Max loan scales with farm level (₹10K per level)
- Prompt-based loan amount input
- Repay loans (interest paid first, then principal)

### Rent/Buy Farm System (replaces simple upgrade)
- 6 farm tiers: Backyard → Small Coop → Ranch → Big Farm → Mega Farm → Chicken Empire
- Rent daily OR buy outright (no more rent!)
- Each farm: different capacity, rent, buy price
- Farm visuals change: sky gradient, ground color, fence, structures
- Economics balanced: rent profitable at ~60% capacity

### Auto-Sell Toggle
- Button to automatically sell all eggs each day
- Green highlight when active

### 10x Speed Toggle
- Button to speed up game 10x (1 second per day)
- Red highlight when active

### Food System Redesign
- Food cost auto-deducted daily (₹3/hen + ₹1/chick)
- No manual "buy food" — automatic if you have money
- No money = hens starve (die in 3 days)

---

## v1.0.0 — Full Game Launch (Mar 17)

### Core Gameplay
- Start with ₹2,000 seed capital
- Buy hens (₹300), they lay 1 egg per day
- Sell eggs (₹6 each) or hatch into chicks (21 days)
- Chicks grow into laying hens in 150 days
- Sell hens for meat (₹250)
- 1 game day = 10 seconds real time

### CONFIG System
- All game parameters in a single CONFIG object at top of script
- Easy to tweak: prices, timelines, rates, farm tiers

### 2D SVG Animals
- Hand-drawn SVG hens (5 random color variations)
- SVG chicks (yellow)
- SVG eggs (cream-colored ovals)

### Visual Design (inspired by Ronaldo Chicken game)
- Sunset gradient sky with clouds
- Green grass ground with fence
- Bangers + Nunito fonts
- Purple/gold/pink neon color scheme
- Day/night cycle with sun/moon
- Farm structures that change with upgrades

### Sound Effects
- Synthesized sounds: buy, sell, egg lay, death, new day, hatch, upgrade, error, cluck
- Web Audio API with graceful fallback

### Game Over
- Triggers when money < 0 and no hens/eggs/chicks left
- Shows survival stats

---

## v0.1.0 — Initial Prototype (Mar 17)

First version — basic chicken farming concept.

- Buy hens and food
- Hens produce eggs
- Sell eggs for income
- Farm capacity system
