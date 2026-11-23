# MOODIFY 🎵
> *"Your emotions. Your music. Your universe."*

Moodify is a next-generation, AI-driven music recommendation and discovery platform built with an editorial dark obsidian aesthetic, warm amber accents, interactive visual graphs, natural language sentiment alignment, and real-time synchronized listening rooms.

---

## 🌌 Platform Overview

Moodify bridges human emotional states with musical frequencies. Rather than relying solely on repetitive genre algorithms, Moodify analyzes mood vectors, acoustic energy, lyrical themes, and harmonic resonances across Tamil, English, and Hindi catalogs.

---

## ✨ Features (Phase 1 Frontend)

### 1. 🔍 Discover Hub (`/` & `/discover`)
- **Editorial Typography:** Editorial serif headlines paired with modern UI elements.
- **Natural Language Quick Search:** Instant search bar routing emotional prompts straight into the Mood Match AI engine.
- **Floating Album Arc:** Dynamic desktop album arc framing the hero section.
- **Multi-Language Tabs:** Instant filtering across `All`, `Tamil`, `English`, `Hindi`, `Telugu`, and `Malayalam`.
- **Curated Sections:** Ranked trending tracks, recently played history (backed by `localStorage`), and curated mood playlists.

### 2. 🗺️ Music Map AI (`/music-map`)
- **Interactive Graph Canvas:** Built with `@xyflow/react` (React Flow), visualizing songs as an interconnected constellation.
- **Dynamic Relational Expansion:** Click any satellite node to animate it to the galactic center and dynamically spawn related tracks connected by animated amber vectors.
- **Acoustic DNA Notes:** Real-time AI explanation of *Why It Connects* (tempo convergence, key resonance, and emotional timbre).
- **Mobile-Optimized:** Direct touch-and-drag graph stacked at `h-[52vh]` with an active track bottom summary card.

### 3. 🎭 Mood Match AI (`/mood-match`)
- **Natural-Language Input:** Type thoughts like a text to a friend (*e.g., "exam tomorrow and overthinking, need calm Tamil melodies"*).
- **33-Mood Matrix Grid:** Categorized into:
  - *Heavy heart* (Heartbroken, Need a good cry, Lonely, Homesick, etc.)
  - *Running on empty* (Burnt out, Bed rotting, Can't sleep, Sunday scaries, etc.)
  - *Wired & restless* (Overthinking, Anxious, Restless, Hyperfocused)
  - *Soft & swoony* (Romantic, Falling in love, Nostalgic, Cozy, Grateful)
  - *Lit up* (Main character, Unstoppable, Happy, Energetic, Hype)
  - *Head in the clouds* (Peaceful, Dreamy, Wandering, Late night, Meditative)
- **AI Vibe Breakdown:** Detailed acoustic synthesis banner with 5 tailored recommendations.

### 4. 🎲 Pick For Me AI (`/pick-for-me`)
- **Interactive Dial Panel:** Filter pills for Language, Mood, Genre, Duration, Energy, and Discovery depth.
- **Smart Filters:** Toggle to skip recently played songs and easily reset.
- **Ranked Shortlist:** AI match percentage scores, acoustic reasoning badges, direct playback, and one-tap *"Surprise Me Again"* reshuffling.

### 5. 🧬 Music Blend AI (`/blend`)
- **Dual-Song Picker:** Pick any two anchor tracks or select from quick-curated pairings (*e.g., After Hours + Kanave Kanave*).
- **Sonic DNA Bridge:** Analyzes tempo convergence, shared atmosphere, and emotional resonance.
- **Equilibrium Recommendations:** Curates 5 tracks that sit harmonically right in between the two anchors.

### 6. 👥 Music Together (`/together` — Phase 2 Preview)
- **Synced Listening Rooms:** Generate a 6-character room code (*e.g., `MD88K2`*) with one-click invite copying.
- **Interactive Countdown:** Animated `3 · 2 · 1 · Play!` synchronization.
- **Live Reactions:** Real-time floating emoji reaction stream (`🔥`, `❤️`, `😭`, `🎧`, `✨`).
- **Shared Queue & Live Chat:** Multi-user queue and real-time chat interface (mock adapter in Phase 1, ready for WebSockets in Phase 2).

### 🎧 Persistent Bottom Player
- **Real HTML5 Audio:** Powered by sample audio streams for instantaneous playback.
- **Mobile Floating Pill Dock:** Dynamic Island / Spotify-style floating player pill with a 2px amber progress line and 5-tab thumb-friendly navigation bar.
- **Desktop Player:** Edge-to-edge audio controls, volume slider popup, and heart/favorite persistence in `localStorage`.

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (custom obsidian `#09090B`, charcoal `#131316`, amber `#F5A623`)
- **Icons:** `lucide-react`
- **Graph Engine:** `@xyflow/react`
- **Routing:** `react-router-dom` (with automatic `ScrollToTop`)
- **HTTP Client:** `axios` (with mock fallback service layer)
- **Deployment:** Vercel SPA ready (`frontend/vercel.json`)

---

## 🚀 Phase 2 Backend Roadmap (`backend/`)

The repository root is prepared for the upcoming Phase 2 backend architecture:
- **Framework:** FastAPI (Python 3.11+)
- **OmniRoute Audio Routing:** Intelligent API gateway dynamically managing Spotify, YouTube Music, and local catalog streams.
- **WebSocket Engine:** Real-time room synchronization for Music Together with broadcast events for audio playback clocks, chats, and reactions.
- **Vector Search / LLM Integration:** Semantic mood embeddings using Gemini API / FAISS for natural language audio retrieval.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Running the Frontend
```bash
# Clone the repository
git clone <your-repo-url>
cd moodify/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
cd moodify/frontend
npm run build
```

---

## 📦 Deployment to Vercel

### Option 1: Root Directory Deployment with Root Directory setting
When importing the project in Vercel:
- **Root Directory:** Set to `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Option 2: Vercel CLI
```bash
cd moodify/frontend
vercel
```
The included `frontend/vercel.json` automatically ensures all client-side routes (`/discover`, `/music-map`, `/mood-match`, `/pick-for-me`, `/blend`, `/together`) resolve to `index.html` without 404 errors.

---

## 📄 License
MIT License © 2026 Moodify.

