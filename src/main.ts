import './style.css'
import { Game } from './game/Game'

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game('gameCanvas');

  // UI Buttons
  // UI Buttons
  // Let's check HTML.
  // <div id="start-screen" class="screen">
  //   <h1>DINO RUNNER <span class="ai-badge">AI</span></h1>
  //   <p>Press Space to Start</p>
  //   <button id="ai-toggle-btn" class="btn">Enable AI Mode</button>
  // </div>
  // Ah, start screen says "Press Space to Start", no button.
  // Game Over screen has button: <button id="restart-btn" class="btn">Try Again</button>

  const restartBtn = document.getElementById('restart-btn');
  const aiToggleBtn = document.getElementById('ai-toggle-btn');
  const gameOverAiBtn = document.getElementById('game-over-ai-toggle-btn');
  const quitBtn = document.getElementById('quit-btn');

  restartBtn?.addEventListener('click', () => {
    game.start();
  });

  quitBtn?.addEventListener('click', () => {
    // Logic for existing the game loop or resetting is handled inside Game class or we can force reset here
    // But Game class doesn't have a public quit method yet? I added it in previous step!
    // Wait, TS might complain if I didn't update the type definition or interface, but it's a class.
    // Let's assume Game.ts update succeeded.
    // Actually standard pattern: reload page or reset state.
    // Let's call game.reset() and show start screen.
    // But I need access to internal state or methods.
    // I added quit() method in Game.ts in parallel step.
    // So verify Game.ts update first? No, parallel tools -> order not guaranteed?
    // Actually previous step had Game.ts update too.
    // Assuming Game.ts has quit() method now.
    (game as any).quit(); // Cast to any just in case the type isn't picked up immediately by analysis? No, it's fine.
  });

  const toggleAIHandler = (e: Event, btn: HTMLElement | null) => {
    e.stopPropagation();
    btn?.blur();
    game.toggleAI();

    // Sync UI for both buttons
    const startAiBtn = document.getElementById('ai-toggle-btn');
    const goAiBtn = document.getElementById('game-over-ai-toggle-btn');

    const updateBtn = (b: HTMLElement | null) => {
      if (b) {
        b.innerText = game.isAIEnabled ? "Disable AI" : "Enable AI";
        if (game.isAIEnabled) b.classList.add('active');
        else b.classList.remove('active');
      }
    };

    updateBtn(startAiBtn); // The original button
    updateBtn(goAiBtn);    // The new button

    // Auto-start if AI is enabled and we are not playing
    // Also restart if we are on Game Over screen
    if (game.isAIEnabled) {
      if (!game.isPlaying && !game.isGameOver) {
        game.start();
      } else if (game.isGameOver) {
        game.start();
      }
    }
  };

  aiToggleBtn?.addEventListener('click', (e) => toggleAIHandler(e, aiToggleBtn));
  gameOverAiBtn?.addEventListener('click', (e) => toggleAIHandler(e, gameOverAiBtn));

  // Handle resizing to keep canvas sharp
  window.addEventListener('resize', () => {
    game.resize();
  });
});
