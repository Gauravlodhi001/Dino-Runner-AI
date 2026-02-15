# 👽 Alien Runner AI

> A modern, AI-powered twist on the classic Chrome Dino game, featuring a procedurally generated alien slug and a smart auto-playing bot.

![Alien Runner](public/vite.svg) (*Replace with a screenshot if you have one!*)

## 🎮 Game Features

-   **Procedural Avatar**: Features a custom-coded "Alien Slug" character (Green/Red) that is drawn in real-time using Canvas API—no sprite files required!
-   **Smart AI Bot**: Toggle the **"Enable AI"** button to watch the computer play perfectly. The AI uses lookahead logic to dodge complex obstacle patterns.
-   **Rich Aesthetics**: Dark mode, neon accents, and glassmorphism UI.
-   **Dynamic Physics**: Tuned jumping and gravity for a heavy, satisfying feel.

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🧠 AI Logic

The AI Controller isn't just random; it uses a heuristic approach:
-   **Distance Detection**: Calculates reaction time based on current game speed.
-   **Obstacle Classification**: 
    -   **Low Birds**: Jumps.
    -   **Mid Birds**: Ducks.
    -   **High Birds**: Ignores (or ducks if a dangerous obstacle is hiding behind).
-   **Lookahead**: Can "see through" safe obstacles to prepare for immediate threats behind them.

## 🛠️ Tech Stack

-   **Vite**: Fast development build tool.
-   **TypeScript**: Type-safe logic.
-   **HTML5 Canvas**: High-performance rendering.
-   **CSS3**: Modern styling with transparency and animations.

---
*Created with ❤️ by Antigravity*
