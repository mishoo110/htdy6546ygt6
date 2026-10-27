# TikTok Coins Exchange Multi-Screen Replicator

A pixel-perfect, interactive recreation of the 5 TikTok Coins Exchange interface screens depicted in the provided screenshots, featuring direct 1–5 screen switching, an interactive live flow, and real-time customizability of balances, account handles, and exchange parameters.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your clarifications:
> - **Direct Screen Switching**: A dedicated top switcher bar allows direct switching between Screen 1, Screen 2, Screen 3, Screen 4, and Screen 5 at any moment.
> - **Customizable Parameters**: All balances ($978,393,139.26), coin counts (80,858,937,129), usernames (@emirates095, @yb.j83, @kwooo22), exchange coin amounts (100,000), and timestamps default exactly to the uploaded screenshots while offering a quick customizer panel to adjust any value on the fly.

---

### 1. Overview & Core Concept
- **What It Does**: Provides an exact 1:1 replica of the TikTok LIVE Coins Balance Exchange workflow across all five visual phases:
  - **Screen 1**: Main exchange balance dashboard with coin bundles, target username search, exchange calculations, and policies.
  - **Screen 2**: Bottom sheet custom coin keypad with active calculations, "All" balance shortcut, and interactive numeric grid.
  - **Screen 3**: Exchange Confirmation dialog showing recipient handle, follower count, coins exchanged, and deducted amount.
  - **Screen 4**: Blurred backdrop loading state featuring the animated circular loader and "Exchanging..." status.
  - **Screen 5**: Exchange Completed success view with recipient receipt, transaction breakdown, "Start gifter level" card, and green "Go back" action.
- **Audience & Context**: Content creators, UI designers, and QA testers needing exact mockups and interactive flows of the TikTok virtual coins exchange system.

---

### 2. User Experience & Visual Design

#### Screen Breakdown
1. **Screen 1 (Main Exchange)**:
   - Header: Back/close icon `✕`, line indicator, centered `Exchange` with live green dot, profile badge (`emirates095`, `@emirates095`, avatar).
   - Balance section: `TikTok Coins Balance`, massive bold typography `$978,393,139.26`, equivalent coins subtext `= $978,393,139.26 (🪙 80,858,937,129)`, and helper caption.
   - Target User Input: `TikTok username` field pre-filled with `@ yb.j83` and red `Search` button.
   - Coin Bundles: 3 selectable cards (250 coins / $3.03, 500 coins / $6.07, 15,000 coins / $182.04) with custom coin SVG badge and active pink/red outline.
   - Custom Link: `Enter a custom number or amount`.
   - Policy: TikTok Virtual Items Policy & Rewards Policy with red links.
   - Button: High-contrast TikTok red/pink `Exchange` CTA (`#FE2C55`).

2. **Screen 2 (Custom Coins Keypad)**:
   - Custom bottom modal with close button `✕`.
   - Coin icon + number input with `All` quick-fill button.
   - Dynamic conversion showing balance deduction.
   - Realistic mobile keypad (1–9, 00, 0, backspace ⌫) with instant calculation.
   - Live updated `Total` and `Exchange` button.

3. **Screen 3 (Exchange Confirmation Modal)**:
   - Dialog overlay with soft blur backdrop.
   - Title: `Exchange Confirmation`.
   - Rows: TikTok Account (`@kwooo22`), Followers (`—`), Coins (`🪙 100,000 Coins` in bold pink), Amount (`$1210.00`).
   - Actions: Red `Confirm Exchange` CTA + `Cancel` link.

4. **Screen 4 (Exchanging Loader)**:
   - Translucent frosted glass effect over Screen 1.
   - Animated dual-color TikTok spinner (pink/cyan or red) and bold `Exchanging...` typography.

5. **Screen 5 (Exchange Completed)**:
   - Header with `✕` and user profile.
   - Large green check badge circle (`#20D563`).
   - Title: `Exchange Completed!`.
   - Subtitle: `You exchanged for 🪙 100,000 Coins`.
   - Receipt card: Recipient (`@kwooo22`), Coins Exchanged (`100,000 Coins`), Deducted Amount (`$1210.00` in red), Time (`27/10/2026, 11:31:01`).
   - Promo card: `Start gifter level` with music note icon.
   - Solid green `← Go back` button.

#### Color Palette & Typography
- **Primary Red/Pink**: `#FE2C55` / `#E62A50` (TikTok brand action color)
- **Success Green**: `#20D563` (TikTok success color)
- **Coin Gold**: `#FFB800` / `#F59E0B` with 3D gradient coin emblem
- **Backgrounds**: Pure white `#FFFFFF` and subtle slate `#F8F9FA`
- **Typography**: System Pro Neo-Grotesque (`Inter` / `-apple-system, BlinkMacSystemFont, "Segoe UI"`) with `tabular-nums` for all currency and coin counts.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct 1–5 Tab Bar + Live Sequential Flow**:
  - *Chosen Approach*: Provide a clean top navigation bar with buttons `Screen 1`, `Screen 2`, `Screen 3`, `Screen 4`, `Screen 5` allowing the user to view any screen directly as requested, while still supporting natural clicking (e.g. clicking "Exchange" opens modal, etc.).
  - *Why*: Allows instant inspection of each screen while keeping full interactive realism.

- **Decision 2: Customizable Data Panel**:
  - *Chosen Approach*: A collapsible settings toolbar at the top/side to customize balances, handles, and amounts, with an instant "Reset to Screenshot Defaults" button.
  - *Why*: Gives complete control to test different amounts and accounts while staying true to the reference screenshots out of the box.

- **Decision 3: Realistic Mobile Frame with Viewport Toggle**:
  - *Chosen Approach*: Render the interface inside an authentic iPhone viewport container with iOS status bar (time 11:31, battery, Wi-Fi) and home bar, with a toggle to view full-width or side-by-side comparison.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
│  ┌───────────────────────┐       ┌────────────────────────┐ │
│  │   Direct Screen Tabs  │       │  Customize Data Sheet  │ │
│  │  [1] [2] [3] [4] [5]  │       │  (Balances, Handles)   │ │
│  └───────────────────────┘       └────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────▼─────────────┐
                │   Mobile Device Container  │
                │  (Status bar & Home bar)   │
                └──────────────┬─────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐
│ Screen 1: Main  │   │ Screen 2: Sheet │   │ Screen 3: Modal │
│ Balance & Packs │   │ Custom Keypad   │   │ Confirmation    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                                           │
┌────────▼────────┐                         ┌────────▼────────┐
│ Screen 4: Load  │                         │ Screen 5: Done  │
│ Exchanging...   │                         │ Success Receipt │
└─────────────────┘                         └─────────────────┘
```

- **State Management**:
  - `activeScreen`: `1 | 2 | 3 | 4 | 5`
  - `config`:
    - `userBalance`: `$978,393,139.26`
    - `coinBalance`: `80,858,937,129`
    - `userHandle`: `emirates095`
    - `targetHandle`: `yb.j83`
    - `recipientHandle`: `kwooo22`
    - `selectedCoins`: `100000`
    - `deductedAmount`: `$1210.00`
    - `transactionTime`: `27/10/2026, 11:31:01`
