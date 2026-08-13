# LinkedIn Design Reference

> **Source note:** Colors and typeface names are confirmed from LinkedIn's official brand guidelines (brand.linkedin.com). Spacing, animation timing, and component behavior below are reconstructed from close observation of the live product, not extracted from their actual source code — use as a strong reference, not a guaranteed exact match. LinkedIn's colors/marks are trademarked; use this for inspiration/learning, not for a product that could be confused with LinkedIn itself.

---

## 1. Color System

### Core brand
| Name | Hex | RGB | Usage |
|---|---|---|---|
| LinkedIn Blue (current) | `#0A66C2` | 10, 102, 194 | Primary actions, links, active icons, logo box |
| LinkedIn Blue (classic, still seen) | `#0077B5` | 0, 119, 181 | Legacy surfaces, some marketing |
| Hover/Pressed Blue | `#004182` | 0, 65, 130 | Button hover/active state |
| Black | `#000000` | 0, 0, 0 | Primary text |
| White | `#FFFFFF` | 255, 255, 255 | Backgrounds, text on blue |

### Extended accent palette (official)
| Name | Hex |
|---|---|
| Trendy Green | `#83941F` |
| Tulip Tree (amber) | `#E7A33E` |
| Geraldine (coral) | `#F5987E` |
| Blue Bayoux (slate) | `#56687A` |
| Chalet Green | `#44712E` |
| Amber Brown | `#915907` |
| Rust | `#B24020` |
| Charcoal Grey | `#38434F` |

### Tints / surface colors
| Name | Hex | Usage |
|---|---|---|
| Pale Blue tint | `#DCE6F1` | Notification badges, subtle highlight backgrounds |
| Pale Green tint | `#D7EBCE` | Success states |
| Pale Amber tint | `#FCE2BA` | Warning states |
| Pale Coral tint | `#FADFD8` | Alerts |
| Warm Grey | `#E9E5DF` | Card/section dividers on light backgrounds |
| Off-white | `#FDFAF5` | Editorial/blog backgrounds |

### Functional greys (interface, not official brand doc but consistently observed)
| Name | Hex | Usage |
|---|---|---|
| Text primary | `#000000E6` (~90% black) | Body copy |
| Text secondary | `#00000099` (~60% black) | Metadata, timestamps, captions |
| Text disabled | `#0000004D` (~30% black) | Disabled states |
| Border/divider | `#00000014` (~8% black) | Card borders, dividers |
| Surface grey | `#F4F2EE` | App background (feed canvas) |
| Card white | `#FFFFFF` | Post cards, panels |

### Rough proportion of use on a typical feed screen
- ~70% neutral (white cards / `#F4F2EE` canvas / black-ish text)
- ~15% LinkedIn Blue (links, icons, primary CTA)
- ~10% mid-greys (secondary text, borders)
- ~5% accent colors (reactions, badges, skill tags — pulls from extended palette)

---

## 2. Typography

**Primary typeface (official, per brand.linkedin.com): Source Sans (Source Sans 3 / Pro)**
- Weights used: Light → Semibold (brand guidelines explicitly discourage going past Semibold/Bold for most brand use)
- Product UI in practice leans on **system font stacks** for performance rather than always webfont-loading Source Sans:
  `-apple-system, "SF Pro", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Source Serif** — used as a "reader" font for long-form content (LinkedIn Articles/Newsletters)
- **Source Code** — monospace, used sparingly (code blocks, technical posts)

### Type scale (observed, feed/profile UI)
| Role | Size | Weight | Line-height | Color |
|---|---|---|---|---|
| Page/section heading (H1) | 24–28px | 600 (Semibold) | 1.25 | `#000000E6` |
| Card/module heading (H2) | 20px | 600 | 1.3 | `#000000E6` |
| Name / profile title (H3) | 16–18px | 600 | 1.35 | `#000000E6` |
| Body text | 14px | 400 | 1.43 | `#000000E6` |
| Secondary/meta text | 12–13px | 400 | 1.35 | `#00000099` |
| Button label | 14–16px | 600 | 1 | white or `#0A66C2` |
| Micro/badge text | 11–12px | 600 | 1 | context-dependent |

Letter-spacing stays near 0 throughout — LinkedIn avoids tracked-out headlines; hierarchy comes from weight/size, not spacing.

---

## 3. Layout & Spacing

- Base spacing unit: **4px**, most gaps built from multiples of 4/8 (8, 12, 16, 24, 32).
- Standard card padding: 16px (mobile), 24px (desktop panels).
- Max content column width (desktop feed): ~552px center column, with fixed-width left rail (~225px) and right rail (~300px).
- Corner radius: 8px on cards, 24px (fully rounded/"pill") on buttons and the search bar.
- Elevation: cards use a very soft shadow, not a hard border — approx `box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)`.

---

## 4. Key Component Patterns

### Top search bar
- Pill-shaped input, `border-radius: 24px`, background `#EEF3F8` (light blue-grey), no visible border until focus.
- Left-aligned magnifying-glass icon, ~16px, grey (`#00000099`).
- **On focus:** background lifts to white, a subtle blue outline/shadow ring appears (`0 0 0 2px rgba(10,102,194,.35)`), and a dropdown panel expands below with recent searches / suggested people — panel slides down with a quick fade+8px translateY, roughly 150–200ms ease-out.
- **On type:** debounced (~150–300ms) live suggestions populate the dropdown; each row highlights with a light grey background on hover (`background 100ms ease`).
- On mobile, tapping search transitions into a **full-screen takeover** (slide-up sheet, ~250ms ease-in-out) rather than an inline dropdown.

### Buttons
- Primary: filled `#0A66C2`, white text, pill radius, hover darkens to `#004182` over ~100ms.
- Secondary/outline: transparent fill, 1–2px `#0A66C2` border, text `#0A66C2`; hover adds a faint blue tint background (`rgba(10,102,194,.08)`).
- "Ghost" icon buttons (like, comment): no fill, circular hover state — a soft grey circle (`rgba(0,0,0,.08)`) fades in behind the icon on hover, ~100–150ms.

### Reactions (Like button)
- Hovering the Like icon triggers a small reaction-picker popover that scales up from 0.8→1 with a slight overshoot (spring-like ease, ~150–200ms) — icons stagger in left-to-right by ~20–30ms each.
- Selecting a reaction: icon does a quick scale-bounce (1 → 1.3 → 1) over ~200ms, plus a color fill transition.

### Notification badge
- Small red/blue dot or count badge, `scale` pop-in animation (0 → 1.15 → 1) when a new item arrives, ~250ms, paired with a subtle bounce easing (`cubic-bezier(.34,1.56,.64,1)`).

### Feed card entrance
- New/loaded posts fade+slide in from ~8px below, opacity 0→1, ~200ms ease-out, often staggered slightly per card when a batch loads.

### Skeleton loading states
- Grey animated shimmer blocks (`background: linear-gradient` sweeping left-to-right, ~1.2–1.5s loop) replace avatars/text lines while content loads — standard shimmer pattern, not a spinner.

### Navigation bar (top, desktop)
- Fixed/sticky, height ~52px, white background, subtle bottom border/shadow on scroll (shadow only appears once the page scrolls past ~0px — a scroll-triggered `box-shadow` fade-in).
- Active tab indicator: a thin bottom border (2px, black or blue) slides/fades in under the active icon rather than the icon itself changing size.

### Modals / "Post" composer
- Opens as a centered modal on desktop (scale 0.95→1 + fade, ~150ms) or a full-screen sheet on mobile (slide-up, ~250ms ease-out).
- Backdrop fades to `rgba(0,0,0,.6)` simultaneously.

---

## 5. Motion Principles (general)

- Most micro-interactions: **100–250ms**, `ease-out` for entrances, `ease-in` for exits.
- Nothing overly bouncy except reaction picker/badge pop — the overall motion language is restrained and fast, prioritizing perceived performance over flourish.
- Hover states are near-instant (~100ms) to feel responsive on a content-dense, high-frequency-interaction surface.

---

## 6. Practical equivalents if you don't want to reproduce Source Sans exactly
Since Source Sans is open-source (SIL Open Font License), you *can* actually use it directly — no substitution needed:
- Google Fonts: "Source Sans 3"
- Pairing: Source Sans (UI) + Source Serif 4 (long-form reading) + Source Code Pro (code)