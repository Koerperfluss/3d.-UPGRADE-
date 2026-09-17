# Design Tokens

```yaml
colors:
  brand:
    primary: "#00FFCC" # Cyber Mint (Active/Prioritized)
    secondary: "#00D1FF" # Azure (Systems/Secondary)
    accent: "rgba(0, 255, 204, 0.1)" # Glow/Radiance
  background:
    base: "#020203" # Deep Void (Root)
    surface: "#0A0A0C" # Layer 1 (Primary Panels)
    elevated: "#121214" # Layer 2 (Cards/Interaction)
  text:
    primary: "rgba(255, 255, 255, 0.85)" # Adjusted contrast for eye comfort
    secondary: "rgba(255, 255, 255, 0.45)" # Enhanced metadata depth
    muted: "rgba(255, 255, 255, 0.15)" # Improved boundary visibility
  status:
    success: "#059669" # Deep Emerald
    warning: "#D97706" # Bronze Gold
    error: "#DC2626" # Signal Red
    action: "#F97316" # Tactical Orange
  border:
    subtle: "rgba(255, 255, 255, 0.04)"
    strong: "rgba(255, 255, 255, 0.1)"

typography:
  families:
    sans: "Inter, ui-sans-serif, system-ui, sans-serif"
    display: "Space Grotesk, sans-serif"
    mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
  weights:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  sizes:
    xs: "10px" # System metadata
    sm: "12px" # Secondary data
    base: "14px" # Body copy
    lg: "16px" # Small headers
    xl: "20px" # Component headers
    "2xl": "24px" # Feature headers
    "3xl": "30px" # Dashboard headlines

radii:
  sm: "4px" # Technical toggles
  base: "8px" # Global element base
  lg: "12px" # Secondary cards
  xl: "16px" # Primary glass panels
  "2xl": "20px" # Large structural blocks
  full: "9999px" # Tactical indicators

shadows:
  base: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  glass: "0 50px 100px rgba(0, 0, 0, 0.8)" # Elevation depth
  glow: "0 0 15px rgba(0, 255, 204, 0.4)" # Active state aura

motion:
  duration:
    fast: "200ms" # Micro-interactions
    base: "300ms" # Standard transitions
    slow: "700ms" # Heavy layout shifts
  easing:
    standard: "cubic-bezier(0.4, 0, 0.2, 1)"
    out: "cubic-bezier(0, 0, 0.2, 1)" # Fast exit
    in: "cubic-bezier(0.4, 0, 1, 1)" # Slow entry
```

# Visual Identity & Design Intent

## The Look: Cyber Minimalist Glass
The "Förder-Cockpit" (PILOT.AI) architecture is built on the concept of **Cyber Minimalism**. It pairs the stark, high-contrast aesthetics of a futuristic terminal with the organic depth of modern glassmorphism. The interface is designed to function as a "Tactical Operating System" for complex grant landscapes.

### Principles

1. **The Void (Depth Logic)**
   The interface uses a depth-first approach. The background (`bg-base`) is a deep void (#020203). Content sits on floating "glass" surfaces (`glass-panel`) that use high levels of backdrop blur and subtle, semi-transparent borders. Elevation is communicated through border strength rather than just shadows.

2. **Toxic/Neon Accents (Focus Energy)**
   Vibrant neon colors—chiefly **Cyber Mint** (#00FFCC) and **Azure** (#00D1FF)—represent active "energy" and focus. These are used sparingly for success states, active nodes, and key CTAs. Components often feature a "glow" shadow (`shadow-[0_0_15px_rgba(0,255,204,0.3)]`) to signify priority or active calculation states.

3. **Technical Precision (Type Pairings)**
   - **Space Grotesk** (Display) provides a geometric, engineering-first vibe for headlines, often rendered in `italic` to suggest forward motion and agility.
   - **Inter** (Sans) handles body text, ensuring high legibility in a dark environment through strict color-contrast management.
   - **JetBrains Mono** (Mono) is the "heartbeat" of the OS. It is used for all metadata, system logs, IDs, and secondary data strings (e.g., `v4.0 Core`, `[ACTION_REQUIRED]`).

4. **Information Density & Bento Grid**
   The layout utilizes a modular **Bento Grid** structure—blocks of varying sizes that facilitate high information density while maintaining visual order. Spacing is intentional; large paddings (e.g., `p-8`) in primary containers provide room for strategic thought, while tight data rows in sidebars optimize for rapid scanning.

5. **Living Interface (Motion & Animation)**
   Motion grounds the UI in a digital reality. Navigation elements utilize spring physics for a tactile feel. Status-critical elements use a custom `pulse-ring` animation (defined in CSS) to pull visual attention without breaking the user's focus.

## Component Glossary

- **Glass Panels**: The standard container pattern. Rounded (`rounded-xl`), blurred background (`backdrop-blur-sm`), and two-tier borders (subtle vs strong based on hierarchy).
- **Stat Cards**: Dynamic blocks that use color association (Mint, Blue, Orange) to signify the health of a data stream.
- **Progressive Disclosure**: Detailed data is tucked into animated sidebars or overlays, maintaining a clean primary "Cockpit" view.
- **System Metadata Labels**: Small, uppercase, tracking-expanded mono text (e.g., `tracking-[0.2em]`) mimic technical overlays on a futuristic HUD.
- **Pulse Indicators**: Nodes requiring immediate action emit a rhythmic red aura (`animate: pulse-ring`), indicating a systemic "blocker" or high-priority task.
