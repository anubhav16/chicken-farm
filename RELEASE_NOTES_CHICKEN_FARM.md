# Chicken Farm — Release Notes

## Version History

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v3.0.0 | 2026-03-17 | Major | Hen aging, sickness, cleaning, smart game-over report, 2-panel layout |
| v2.0.0 | 2026-03-17 | Major | Hen grid tiles, egg tray, sick bay, dirt particles, auto-sizing |
| v1.3.0 | 2026-03-17 | Minor | Karnataka/Bangalore realistic pricing, kid-friendly big fonts |
| v1.2.0 | 2026-03-17 | Minor | EMI auto-deduction, daily P&L breakdown, money graph |
| v1.1.0 | 2026-03-17 | Minor | Bank loans, rent/buy farm system, auto-sell, 10x speed |
| v1.0.0 | 2026-03-17 | Major | Full game with CONFIG, SVG chickens, sound, day/night cycle |
| v0.1.0 | 2026-03-17 | Major | Initial prototype — basic chicken farming simulation |

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
