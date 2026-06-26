# Ease Health — Style Reference
> Sunlit clinic on white linen. A muted, light-first healthcare surface where one deep forest green does the work of accent, action, and trust, framed by sage washes, dusty-blue panels, and whisper-weight serif headlines.

**Theme:** light

Ease Health uses a clinical-calm language: warm sage and dusty blue surfaces on a near-white canvas, with a single deep forest green carrying every action, icon, and heading accent. The page breathes — generous whitespace, no shadows, thin gray hairlines, and pill-shaped tags that feel like medical labels rather than UI chrome. Typography pairs a delicate serif (Faire Octave) for headline moments with a quiet grotesque (Suisseintl) for everything operational, both set in weight 300 with tight negative tracking so type whispers rather than shouts. Color is rationed: most surfaces are achromatic or barely tinted, and the dark green appears only where the user should act, look, or trust. Components feel light, flat, and confident — the system reads as a calm, premium clinic, not a noisy SaaS dashboard.

## Colors

| Name | Value | Role |
|------|-------|------|
| Forest Ink | `#0f3e17` | Primary action buttons, heading text, brand icons, footer, active states — the only saturated color in the system; deep enough to read as serious clinical authority against the pale surfaces |
| Sage Wash | `#b1dbb8` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Mist Blue | `#b6ced5` | Hero panel background, secondary surface tint, pill badge background — the cool counterpoint to sage, used for product/showcase bands |
| Mint Veil | `#cfe7d3` | Soft card surface tint, subtle highlight wash |
| Linen | `#e1f4df` | Lightest card surface tint, section highlight band |
| Linen White | `#fffefc` | Page canvas, card surfaces, button text — warm off-white, never pure |
| Hairline Gray | `#e5e7eb` | Borders, dividers, link underlines, nav strokes — the single structural neutral |
| Charcoal | `#222222` | Navigation link text — softer than pure black, less clinical |
| Graphite | `#333333` | Secondary image borders, muted link color |
| True Black | `#000000` | Primary body and heading text, decorative SVG fills |

## Typography

### Suisseintl — Suisseintl — detected in extracted data but not described by AI
- **Weights:** 300, 400
- **Sizes:** 12px, 14px, 18px, 23px, 28px, 56px
- **Line height:** 1, 1.3, 1.5
- **Letter spacing:** -0.03

### Faire Octave — Display and section headings only. The serif appears sparingly — two sizes, one weight — to mark narrative moments (hero headline, compliance headline, about headline). Light-weight serif against sans-serif body creates a magazine/editorial cadence; the thin strokes make 74px feel humane rather than corporate.
- **Substitute:** Fraunces, Cormorant Garamond, or Playfair Display at weight 300
- **Weights:** 300
- **Sizes:** 40px, 74px
- **Line height:** 1.05–1.35
- **Letter spacing:** -0.0300em, -0.0100em

### Suisse Int'l — Body, UI, nav, buttons, badges, and the 56px hero headline. Weight 300 is the default for larger sizes (hero, subheadings) — the anti-convention choice of a light grotesque for a 56px headline makes the page feel airy and unhurried. Weight 400 handles everything 18px and below. The consistent -0.03em tracking across all sizes tightens the grotesque into a refined, considered voice.
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 300, 400
- **Sizes:** 
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.42px at 14px, -0.84px at 28px, -1.68px at 56px
- **OpenType features:** `No special features detected`

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 12px | 1.5 | -0.36px |
| body-sm | 14px | 1.5 | -0.42px |
| body | 18px | 1.3 | -0.54px |
| subheading | 23px | 1.3 | -0.69px |
| heading-sm | 28px | 1.3 | -0.84px |
| heading | 40px | 1.35 | -0.4px |
| heading-lg | 56px | 1 | -1.68px |
| display | 74px | 1.05 | -2.22px |

## Spacing & Layout

**Density:** comfortable

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 21px
- **Element gap:** 21px

### Border Radius

- **nav:** 7px
- **cards:** 14px
- **badges:** 999px
- **buttons:** 14px

## Components

### Primary CTA Button
**Role:** The single high-contrast action on any page — hero, header, conversion points

Filled Forest Ink (#0f3e17) background, Linen White (#fffefc) text at 14px Suisse Int'l weight 400, 14px border-radius, 21px horizontal padding × 14px vertical padding. Includes a right-arrow icon (→) inset in a slightly lighter green outlined square. The dark green-on-warm-white contrast (14.6:1) is the system’s loudest moment by design.

### Header Navigation
**Role:** Top-level site navigation

Linen White background, logo on the left (dark green wordmark), nav links centered or right-aligned in Charcoal (#222222) at 14px Suisse Int'l 400 with 7px border-radius on link containers. 11px horizontal padding on nav items. Book-a-Demo CTA in the top-right using the Primary CTA Button pattern. No background fill, no shadow — sits directly on the canvas.

### Pill Badge / Tag
**Role:** Category labels above section headings (e.g. 'Broad clinical support', 'Standards and reporting')

Mist Blue (#b6ced5) background, Charcoal or black text at 12–14px Suisse Int'l 400, 999px border-radius (full pill), 7–14px vertical padding × 14px horizontal padding. The pill shape echoes medical labeling and stays visually quiet against the white canvas.

### Check Icon Badge
**Role:** Compliance/feature list markers

Forest Ink (#0f3e17) square 32–40px, 7px border-radius, containing a white checkmark. The dark green square is the only spot where the brand color becomes a small visual anchor inside a bulleted list — it earns attention without text.

### Hero Left Panel (Sage)
**Role:** Headline + subtext + CTA in the hero

Sage Wash (#b1dbb8) background filling a full-height left column. Display heading in Faire Octave weight 300 at 74px, Forest Ink (#0f3e17) text, -2.22px tracking. Subtext at 18px Suisse Int'l 400, Charcoal (#222222). The Primary CTA Button sits below with 42px top margin.

### Hero Right Panel (Product Showcase)
**Role:** Product UI cards on a colored band

Mist Blue (#b6ced5) background, full-height right column. Hosts three white product cards (CRM, EHR, RCM) arranged horizontally with 14px gap. Each card is Linen White with 14px border-radius and 21px padding. Small caption labels (CRM/EHR/RCM) sit in white pill badges below each card.

### Product Card
**Role:** Compact product UI mockup (form, profile, chart)

Linen White (#fffefc) background, 14px border-radius, 21px padding, no border, no shadow. Content includes a small avatar, name heading, status text, and a mini Forest Ink button (e.g. 'Submit Note'). The card reads as a screenshot of the product, not a marketing tile.

### Section Heading Block
**Role:** Title + optional tag introducing each content section

Pill Badge stacked above a Faire Octave heading at 40px weight 300 in Forest Ink. 14px vertical gap between badge and heading. Centered or left-aligned depending on section — the system uses left-align for content sections and center for the stats block.

### Two-Column Feature Grid
**Role:** Compliance feature lists, 2×3 grids

Two equal columns with 56px column gap, 28px row gap. Each item pairs a Check Icon Badge with a 14px Suisse Int'l 400 description. No card containers — items sit directly on the canvas, separated by whitespace.

### Stats Block
**Role:** Large quantitative proof points

Two stats side by side. Number in Suisse Int'l weight 300 at 56px, Forest Ink, tight tracking (-1.68px). Label below in 12px Suisse Int'l 400, Charcoal. No dividers, no backgrounds — the scale contrast between the 56px number and 12px label does the work.

### Investor Logo Strip
**Role:** Social proof band — 'Backed by leading investors'

Centered 14px caption 'Backed by leading investors' above a single row of monochrome (black or Charcoal) investor logos at consistent height, evenly spaced with ~35px horizontal padding per logo. No background fill, no border — logos sit on the canvas with generous vertical breathing room (49px row gap).

### Vertical Category List
**Role:** Side-rail navigation of care categories (OBOT, OTP, Eating Disorder, etc.)

Stacked text labels in Suisse Int'l at ~23–28px weight 300, rendered in a very light gray (near Hairline Gray) as a decorative/atmospheric element. Letterspaced wide, no bullets. Reads as ambient typography rather than functional links.

## Do's and Don'ts

### Do
- Use Forest Ink (#0f3e17) as the only saturated color — apply it to the primary action button, headings, checkmark icons, and the logo. Never introduce a second brand color.
- Set headings 40px and above in Faire Octave weight 300 with tight tracking (-0.01em to -0.03em). Body and UI stay in Suisse Int'l.
- Use 14px border-radius for cards and buttons, 999px for badges and tags, 7px for nav items. Do not mix intermediate values like 8px or 12px.
- Build section rhythm with generous whitespace: 80px between sections, 21px between elements, 21px inside cards. The flatness depends on breathing room.
- Communicate elevation through surface tint shifts (Linen White → Mint Veil → Sage Wash → Mist Blue), never through drop shadows.
- Pair every section heading with a Mist Blue pill badge above it — the badge is the system's recurring label device.
- Use 7px vertical × 14px horizontal padding on pill badges to keep them visually compact, not chunky.

### Don't
- Do not add drop shadows to cards, buttons, or sections — the system is intentionally flat and the absence is the design.
- Do not use pure white (#ffffff) — the canvas is Linen White (#fffefc), a warm off-white. Pure white feels cold and clinical in the wrong way.
- Do not use Sage Wash (#b1dbb8) or Mist Blue (#b6ced5) as button backgrounds — those are surface tints, not action colors. Actions are always Forest Ink.
- Do not set body text above 18px in Suisse Int'l weight 400 — weight 300 is reserved for sizes ≥28px to preserve the light/airy voice.
- Do not introduce new border-radius values. The system uses exactly 7px, 14px, and 999px — adding 8px or 12px breaks the geometric consistency.
- Do not stack multiple saturated colors in the same view. One Forest Ink moment per region; let surfaces and whitespace do the structuring.
- Do not use bold (600+) or semibold (500) weights — the system speaks in 300 and 400 only. Heavier weights would break the quiet, premium register.

## Elevation

No drop shadows anywhere. Elevation is communicated through surface tint shifts (white → mint → sage → mist blue) and thin #e5e7eb hairline borders. This flatness is the design — it reads as clinical cleanliness, not as a missing feature.

## Surfaces

- **Linen White** (`#fffefc`) — Page canvas — warm off-white base
- **Mint Veil** (`#cfe7d3`) — Tinted content card, subtle highlight band
- **Linen Green** (`#e1f4df`) — Lightest card surface tint
- **Sage Wash** (`#b1dbb8`) — Accent spotlight surface — hero left panel, product spotlight cards
- **Mist Blue** (`#b6ced5`) — Hero right panel, product showcase background, pill badges

## Imagery

Pure UI-first visual language — no photography, no illustration, no product hero shots. Imagery is limited to monochrome (black or Charcoal) investor logos in a single row and white product UI mockup cards rendered inside the colored hero panel. The product cards themselves act as the 'imagery' — they show actual UI screens (a form completion card, a patient profile with submit button, a revenue chart) rather than stylized illustrations. Icons are minimal and appear only as functional checkmarks inside Forest Ink squares. The system treats whitespace and surface color as the primary visual content.

## Similar Brands

- **Headspace Health** — Same soft green-and-white clinical palette, same flat surfaces with no shadows, same pill-shaped category tags above section headings
- **Spring Health** — Same whisper-weight serif headlines paired with a clean grotesque body, same light-first healthcare aesthetic with a single deep accent color
- **Calm Health** — Same generous whitespace and section-by-section breathing room, same rationed use of one saturated brand color against pale surfaces
- **Tia** — Same editorial-magazine cadence: large light-weight serif headings, sans-serif body, warm off-white canvas, no drop shadows
- **Quartet Health** — Same behavioral-health SaaS positioning with muted sage surfaces, pill badges, and a dark forest-green as the sole action color
