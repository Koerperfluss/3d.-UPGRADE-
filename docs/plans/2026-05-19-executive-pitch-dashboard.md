# Executive Summary Dashboard (Pitch Control Center) Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-impact, visual "Kommando-Zentrale" within the app to support the "Sniper Marketing" strategy for FHs, Universities, and the FFG.

**Architecture:** A new dedicated route `/pitch-deck` containing a sophisticated dashboard with 4 core modules: ROI-Calculator, MDR-Compliance-Shield, Tool-Matrix-Overview, and LTI-Simulation-Trigger.

**Tech Stack:** React, Tailwind CSS, Framer Motion for animations, Lucide-React (or existing IconComponents).

---

### Task 1: Create the PitchDashboardPage Component

**Files:**
- Create: `src/pages/PitchDashboardPage.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Implement the base layout**
Create the page with the signature Gold/Black premium design, using `framer-motion` for entrance animations.

**Step 2: Add the 4 Core Modules (Visual Mocks)**
- **ROI Module:** Visualizing "4h time saved per week/lecturer".
- **MDR-Shield:** A prominent green shield badge with regulatory justification text.
- **Safety Guard Status:** Live-pulse animation showing Gemini integration status.
- **Moodle Integration Preview:** A visual mock of the LTI 1.3 handshake.

**Step 3: Register Route**
Add `/pitch-deck` to `App.tsx`.

### Task 2: Implement the "Moodle Dummy" Simulation Mode

**Files:**
- Create: `src/pages/MoodleSimulationPage.tsx`
- Modify: `src/pages/PitchDashboardPage.tsx` (add link)

**Step 1: Create the Moodle-Style UI**
Build a component that looks like the FH St. Pölten / IMC Krems eCampus (Blue/White, sidebar blocks).

**Step 2: LTI Handshake Animation**
Add a "Launch Körperfluss" button that triggers a loading overlay: "Authenticating via LTI 1.3 Advantage..." before redirecting back to the real dashboard.

### Task 3: Implement the "Virtual Classroom" Mockup

**Files:**
- Create: `src/pages/VirtualClassroomPage.tsx`
- Modify: `src/pages/PitchDashboardPage.tsx` (add link)

**Step 1: Design the Classroom Interface**
Create a page showing a "Live Session" with a shared anatomical 3D model in the center and a "Group Chat" sidebar where the Digital Mentor provides hints to the group.

**Step 2: Add Student Pulse Indicators**
Visualize real-time student performance icons (Green/Yellow/Red) that only the lecturer sees, demonstrating the "Classroom Analytics" USP.

### Task 4: Final Styling & Polish

**Files:**
- Modify: `src/pages/PitchDashboardPage.tsx`
- Modify: `src/components/SidebarLayout.tsx` (optional: add hidden entry point for Sascha)

**Step 1: Add Responsive Fixes**
Ensure the dashboard looks perfect on an iPad/iPhone for mobile pitches.

**Step 2: Testing**
Verify all buttons and transitions work smoothly.

**Step 3: Commit and Deploy**
Execute `deploy.sh`.
