# 👽 Alien Runner AI

**Alien Runner AI** is a high-octane, endless runner game that merges retro arcade mechanics with modern procedural generation and artificial intelligence. Built with **TypeScript** and the **HTML5 Canvas API**, this project reimagines the classic Chrome Dino game with a vibrant, neon-soaked aesthetic and a unique twist: a fully autonomous AI autopilot.

Players take control of a procedurally generated **Alien Slug**—rendered in real-time code without static sprite assets—as it dashes through a perilous landscape. The goal is simple: survive as long as possible while the game speed relentlessly increases. But when human reflexes fail, the **Smart AI** takes over.

Powered by a heuristic lookahead algorithm, the AI analyzes obstacle patterns, calculates optimal jump trajectories, and reacts with superhuman precision. It doesn't just see the obstacle in front; it anticipates dangerous combinations, making it a perfect showcase of rule-based game intelligence.

## 🌟 Key Features

-   **Procedural Graphics**: Unique character rendering using raw code.
-   **Intelligent Autopilot**: A toggleable AI that plays perfectly using advanced logic.
-   **Dynamic Physics**: Heavy, satisfying jump mechanics tuned for precision platforming.
-   **Rich UI**: Glassmorphism overlays and smooth, dark-mode visuals.

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

The AI Controller uses a specific heuristic approach:
-   **Distance Detection**: Calculates reaction time based on current game speed.
-   **Lookahead**: Can "see through" safe obstacles (like high birds) to prepare for immediate threats behind them.
-   **Obstacle Classification**: 
    -   **Low Birds**: Jumps.
    -   **Mid Birds**: Ducks.
    -   **High Birds**: Ignores.

## 🛠️ Tech Stack

-   **Vite**
-   **TypeScript**
-   **HTML5 Canvas**
-   **CSS3**

---
*Created with ❤️ by Antigravity*
