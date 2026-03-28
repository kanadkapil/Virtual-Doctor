# Design System Specification: Clinical Intelligence & Empathetic Clarity

## 1. Overview & Creative North Star
### The Creative North Star: "The Luminous Clinician"
This design system moves away from the cold, sterile rigidity of traditional medical software. Instead, it embraces a "Luminous Clinician" aesthetic—combining the precision of a high-end laboratory with the warmth of a bedside manner. 

To break the "template" look, we employ **Organic Editorial Layouts**. This means shifting away from centered, symmetrical grids toward intentional asymmetry. Large `display-lg` headlines should be paired with generous `spacing-24` white space to let the UI breathe. We use overlapping "Glass" layers to create a sense of depth and high-tech sophistication, ensuring the AI feels like a living, breathing assistant rather than a static database.

---

## 2. Colors & Surface Philosophy
The palette is rooted in health-giving greens and deep, authoritative teals. 

### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders are prohibited for sectioning. 
Structure must be defined through background shifts. For example, a `surface-container-low` card should sit on a `surface` background. If you need to separate content, use a tonal shift or a jump in the spacing scale, never a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent materials.
- **Base Level:** `surface` (#f5f7f9) - The clinical canvas.
- **Mid Level:** `surface-container-low` (#eef1f3) - For secondary grouping.
- **Top Level:** `surface-container-lowest` (#ffffff) - For primary interaction cards.

### The "Glass & Gradient" Rule
Floating AI elements or high-priority triage alerts must use **Glassmorphism**. 
- **Effect:** Apply `backdrop-filter: blur(24px)` with a 60% opacity fill of `surface-container-lowest`.
- **Signature Textures:** Use a subtle linear gradient for primary CTAs: `primary` (#3f6600) to `primary-container` (#b1fe4d). This adds a "soul" to the button, making it feel pressurized and active.

---

## 3. Typography
We use a dual-font strategy to balance authority with readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric but friendly curves. It feels modern and "designed." Use `display-lg` (3.5rem) for welcome screens to create an editorial feel.
*   **Body & Labels (Inter):** The workhorse for medical data. Inter provides the high X-height necessary for reading complex triage reports on small screens.

**Hierarchy as Identity:** 
Use extreme contrast in scale. Pair a `headline-lg` title with `body-sm` metadata to create an authoritative, "Medical Journal" hierarchy. This makes the information feel curated and professional.

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` element should be reserved for the most urgent triage information, creating a natural visual lift.
*   **Ambient Shadows:** If a floating action button (FAB) or glass card requires a shadow, use a "Medical Glow": `box-shadow: 0 20px 40px rgba(44, 47, 49, 0.06)`. The shadow color is a tint of `on-surface` (#2c2f31), never pure black.
*   **The Ghost Border Fallback:** Only if accessibility contrast ratios (WCAG 2.1) require it, use the `outline-variant` token at **15% opacity**. This creates a "breathable" container boundary without the "boxed-in" feel.
*   **Glowing Orbs:** To represent the AI's presence, use large, soft-focus radial gradients of `primary_fixed` (#b1fe4d) at 10% opacity in the background.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), `round-full`, 1.4rem padding. Text is `on-primary-fixed`.
- **Secondary:** `surface-container-high` background with `on-surface` text. No border.
- **Tertiary:** `ghost` style. Only `on-surface` text with a subtle `primary` underline on hover.

### Medical Cards & Lists
- **Rule:** Absolute prohibition of divider lines.
- **Implementation:** Separate list items using `spacing-3` (1rem) of vertical white space or by alternating between `surface` and `surface-container-low` backgrounds.
- **Radius:** All cards must use `round-lg` (2rem) or `round-xl` (3rem) to maintain the "Empathetic" soft-clinical feel.

### Input Fields
- **Style:** Understated. Use `surface-container-highest` as the fill. 
- **Active State:** Instead of a thick border, use a 2px `primary` glow on the bottom edge only.
- **Error:** Use `error` (#b02500) for text, but keep the input background a soft `error_container` to avoid visual "shouting."

### AI Triage Chips
- **Interactive:** Use `secondary_container` (#b5ede7) with a glass blur. These should feel like physical "pills" that can be moved or dismissed.

---

## 6. Do’s and Don'ts

### Do
- **Do** use `round-xl` for large containers to emphasize the soft, modern aesthetic.
- **Do** use `spacing-16` or `spacing-20` for page margins to create a high-end editorial feel.
- **Do** leverage `primary_fixed_dim` for background accents to guide the user's eye toward the "Next Step" in a triage flow.
- **Do** ensure all touch targets are at least 48dp (approx `spacing-12`).

### Don't
- **Don't** use 1px solid borders to separate sections; it breaks the "Luminous" immersion.
- **Don't** use high-opacity black shadows; they feel "dirty" against the clinical green/white palette.
- **Don't** use `display-lg` for anything other than high-level branding or emotional milestones; keep data-heavy reports in `body-md` for maximum density and clarity.
- **Don't** cram components together. If a screen feels full, increase the `spacing` scale rather than shrinking the text.