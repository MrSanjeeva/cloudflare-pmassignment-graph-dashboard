# Design Document: Cloudflare Live Graph "Nexus"

## 1. Visual Philosophy
Inspired by the "Sci-Fi Command Center" referential image, the design language for the **Cloudflare Live Graph Dashboard** will be **"Nexus Dark"**. It emphasizes high contrast, glowing data points, and a deep space background to make the graph feel like a living constellation of data.

### Core Pillars
-   **Immersive Dark Mode**: Deep gunmetal and black backgrounds to make content pop.
-   **Information Radiance**: Information doesn't just sit; it *glows*. Active nodes pulse; connections flow like optical fibers.
-   **HUD Esthetic**: Floating panels, glassmorphism, and thin, technical borders that mimic a heads-up display.

## 2. Color Palette & Theming
Using the reference image's logic to encode hierarchy through color.

| Role | Color Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `Void Black` | `#020408` | Main canvas background. |
| **Surface** | `Glass Panel` | `#0f172a` | HUD panels (with blur). |
| **Central Node** | `Core Reactor` | `#FF4500` | The Central "Cloudflare Platform" node. 30px glow. |
| **Product** | `Solar Flare` | `#FF6B6B` | Product nodes (Workers, D1). Warm, active. |
| **Category** | `Cyan Data` | `#00F2FF` | Category nodes (Bugs, Features). Cool, structural. |
| **Items** | `Neon Violet` | `#BC13FE` | Ticket/Issue nodes. Distinct, deep. |
| **Text** | `Hologram White`| `#E2E8F0` | Primary text. |

## 3. Layout & UX
The layout follows a "Command Deck" architecture.

### 3.1 The Infinite Canvas (Center Stage)
-   **Library**: `React Flow`
-   **Behavior**: Takes up 100% of the screen behind the HUD.
-   **Background**: Particle dust effect or subtle grid (`#1e293b` lines at 5% opacity).

### 3.2 The HUD (Heads-Up Display)
Floating glass panels positioned at the viewport edges.
-   **Top Bar (Status Deck)**:
    -   Left: "System Status" (Live connection indicator).
    -   Right: "Global Search" (Pill-shaped input with glowing border).
-   **Left Panel (Metrics)**:
    -   Mini-charts showing "Incoming Ticket Velocity" (Line chart from image).
    -   "System Load" sparklines.
-   **Right Panel (Detail view)**:
    -   Slide-over panel when a node is selected.
    -   Shows Ticket details, Classification confidence (AI score), and Tags.

## 4. Component Design
### 4.1 The Nodes
Custom React Flow nodes (`<Node />`).
-   **Shape**: Rounded Rectangle or Capsule (for text readability) vs Circle (icon only).
-   **Effect**:
    -   `box-shadow: 0 0 15px [COLOR]`.
    -   Border: 1px solid `rgba([COLOR], 0.5)`.
    -   **Hover**: Intensity of glow increases to 30px; Scale 1.1x.

### 4.2 The Edges
-   **Style**: Animated SVG paths.
-   **Animation**: "Light packet" travel effect (dashes moving from Source -> Target).
-   **Color**: Gradient transitions from Parent Color -> Child Color.

### 4.3 Typography
-   **Font**: Inter (UI) + JetBrains Mono (Data/Code).
-   **Style**: All caps for headers (HUD style), breathable spacing (`tracking-wide`).

## 5. Animations & Micro-interactions
-   **On Load**: Central node expands from 0 -> 1 scale; children "bloom" outwards sequentially.
-   **Data Ingestion**: When a new ticket arrives via WebSocket/Polling, it "warps" in (scale + opacity fade) with a ripple effect on the graph.

## 6. CSS / Tailwind approach
We will define these custom glow utilities:
```css
.shadow-glow-red { box-shadow: 0 0 20px rgba(255, 69, 0, 0.5); }
.shadow-glow-cyan { box-shadow: 0 0 20px rgba(0, 242, 255, 0.5); }
.glass-panel {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```
