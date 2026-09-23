# AGENTS.md — Universal Agent Guide
This file serves as the unified protocol for any AI coding assistant (**Antigravity**, **OpenAI Codex**, **Hermes**, **Claude**, etc.) working on this repository across devices.

## 🌿 Project Summary
* **Project Name**: Tri Hita Karana Interactive Web
* **Mission**: An interactive, educational web experience illustrating the Balinese philosophy *Tri Hita Karana* (Harmonious balance between Humans and God, Humans and Humans, Humans and Nature).
* **Tech Stack**:
  * Pure Semantic HTML5 (`<dialog>`, `<figure>`, `<main>`, `role`, `aria-*`)
  * Modern CSS (`css/style.css`) with CSS custom properties (`light-dark()`), grid, container queries, and fluid typography.
  * Vanilla ES6 JavaScript (`js/app.js`) — zero bundler, zero framework overhead.
  * Lightweight Node.js preview server (`server.cjs`) on port `4181`.

---

## 🚀 How to Run & Preview
* **Start Server**: `node server.cjs` or `npm run dev`
* **Access URL**:
  * Local: `http://127.0.0.1:4181` or `http://localhost:4181`
  * LAN / Mobile: `http://<YOUR-IP>:4181`
* **Verify**: Ensure HTTP status is 200 and assets (images, CSS, JS) load without console errors.

---

## 🛠 Directory Structure
```text
Website/
├── index.html            # Main semantic HTML structure
├── css/
│   └── style.css         # Design system, forest green palette, animations, media queries
├── js/
│   └── app.js            # Tab switching, dialog modal, quiz logic, accessibility
├── assets/
│   ├── images/           # hero.webp, hero-user.jpg
│   ├── previews/         # desktop, mobile, dark mode preview screenshots
│   └── prahyangan/       # Curated high-res cultural photos
├── Prahyangan/           # Original photo assets (.avif)
├── server.cjs            # Zero-dependency static dev server
├── package.json          # Project metadata & scripts
├── AGENTS.md             # This agent guide
├── STATUS.md             # State handoff between AI agents
└── README.md             # Human-readable project overview
```

---

## 📋 Agent Rules & Guidelines
1. **Never write files to hidden temporary tool directories** (e.g. `.codex/visualizations`). Always write to this project root or its designated subfolders (`css/`, `js/`, `assets/`).
2. **Keep Zero Dependencies**: Do not introduce heavy frontend frameworks (React, Vue, Tailwind) unless explicitly requested by the user. Vanilla HTML/CSS/JS keeps this fast, readable by all agents, and portable across machines.
3. **Accessibility First**:
   * All interactive elements must support keyboard navigation (`Tab`, `ArrowLeft`, `ArrowRight`, `Escape`).
   * Preserve `role="tablist"`, `role="tabpanel"`, `aria-selected`, and `aria-live` on dynamic status announcements.
   * Respect `@media (prefers-reduced-motion)`.
4. **Handoff Protocol**:
   * When starting work: read `STATUS.md` to understand recent changes and current backlog.
   * When completing work: update `STATUS.md` with what was accomplished, any open decisions, and next steps.
   * Make clear, descriptive Git commits (e.g., `feat: ...`, `fix: ...`, `style: ...`).
