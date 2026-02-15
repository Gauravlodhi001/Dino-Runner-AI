import { Dino } from './Dino';
import { ObstacleManager } from './ObstacleManager';
import { AIController } from '../ai/AIController';
import { SoundManager } from './SoundManager';
import { ParticleManager } from './ParticleManager';
import { Background } from './Background';

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    dino: Dino;
    obstacleManager: ObstacleManager;
    aiController: AIController;

    width: number;
    height: number;

    speed: number;
    score: number;
    highScore: number;
    gameSpeed: number = 0; // Pixels per frame
    isPlaying: boolean;
    isGameOver: boolean;
    isAIEnabled: boolean;
    soundManager: SoundManager;
    particleManager: ParticleManager;
    background: Background;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.width = 0;
        this.height = 0;
        this.gameSpeed = 0;
        this.soundManager = new SoundManager();
        this.particleManager = new ParticleManager();
        this.background = new Background(this.width, this.height);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.dino = new Dino(this.height, this.soundManager, this.particleManager);
        this.obstacleManager = new ObstacleManager(this.width, this.height);
        this.aiController = new AIController();

        this.speed = 4;
        this.score = 0;
        this.highScore = 0;
        this.isPlaying = false;
        this.isGameOver = false;
        this.isAIEnabled = false;

        // Input handling
        window.addEventListener('keydown', (e) => this.handleInput(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    resize() {
        this.width = this.canvas.parentElement?.clientWidth || 800;
        this.height = this.canvas.parentElement?.clientHeight || 400;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.background) this.background.resize(this.width, this.height);

        if (this.dino) this.dino.groundY = this.height - 47 - 10;
        if (this.obstacleManager) {
            this.obstacleManager.groundY = this.height - 10;
            this.obstacleManager.canvasWidth = this.width;
            this.obstacleManager.canvasHeight = this.height;
        }
    }

    start() {
        if (this.isPlaying) return;
        this.reset();
        this.isPlaying = true;
        this.loop();
        document.getElementById('start-screen')?.classList.add('hidden');
        document.getElementById('game-over-screen')?.classList.add('hidden');
        document.getElementById('game-over-screen')?.classList.remove('flex'); // Just in case
    }

    quit() {
        this.isPlaying = false;
        this.isGameOver = false;
        this.reset();
        document.getElementById('start-screen')?.classList.remove('hidden');
        document.getElementById('game-over-screen')?.classList.add('hidden');
    }



    reset() {
        this.speed = 8;
        this.score = 0;
        this.isGameOver = false;
        this.dino.reset(this.height);
        this.obstacleManager.reset();
        this.particleManager.reset();
    }

    loop() {
        if (!this.isPlaying) return;

        this.update();
        this.draw();

        if (!this.isGameOver) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.gameOver();
        }
    }

    update() {
        const prevScore = Math.floor(this.score);
        this.score += 0.05;
        const newScore = Math.floor(this.score);

        if (newScore > 0 && newScore % 100 === 0 && newScore !== prevScore) {
            this.soundManager.playScore();
        }

        // Speed increases slowly
        this.speed += 0.0005;

        if (this.isAIEnabled) {
            this.aiController.update(this.dino, this.obstacleManager, this.speed);
        }

        this.dino.update();
        this.obstacleManager.update(this.speed);
        this.particleManager.update();
        this.background.update(this.speed);

        // Collision Detection
        for (const obs of this.obstacleManager.obstacles) {
            if (
                this.dino.x < obs.x + obs.width &&
                this.dino.x + this.dino.width > obs.x &&
                this.dino.y < obs.y + obs.height &&
                this.dino.y + this.dino.height > obs.y
            ) {
                this.isGameOver = true;
                this.soundManager.playDie();
                this.particleManager.spawnExplosion(this.dino.x + this.dino.width / 2, this.dino.y + this.dino.height / 2);
            }
        }

        // Update UI
        this.updateUI();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.background.draw(this.ctx);

        // Draw ground
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 10);
        this.ctx.lineTo(this.width, this.height - 10);
        this.ctx.stroke();

        this.dino.draw(this.ctx);
        this.obstacleManager.draw(this.ctx);
        this.particleManager.draw(this.ctx);
    }

    handleInput(e: KeyboardEvent) {
        if (this.isAIEnabled) return; // AI controls input

        if (this.isGameOver || !this.isPlaying) {
            if (e.code === 'Space') this.start();
            return;
        }

        if (e.code === 'Space' || e.code === 'ArrowUp') {
            this.dino.jump();
        } else if (e.code === 'ArrowDown') {
            this.dino.duck(true);
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if (this.isAIEnabled) return;

        if (e.code === 'ArrowDown') {
            this.dino.duck(false);
        }
    }

    toggleAI() {
        this.isAIEnabled = !this.isAIEnabled;
        const status = document.getElementById('ai-status');
        const btn = document.getElementById('ai-toggle-btn');

        if (this.isAIEnabled) {
            status?.classList.remove('hidden');
            btn?.classList.add('active');
            btn!.innerText = 'Disable AI';
        } else {
            status?.classList.add('hidden');
            btn?.classList.remove('active');
            btn!.innerText = 'Enable AI Mode';
        }
    }

    gameOver() {
        this.isPlaying = false;
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('dino-ai-highscore', this.highScore.toString());
        }

        document.getElementById('game-over-screen')?.classList.remove('hidden');
        document.getElementById('final-score')!.innerText = `Score: ${Math.floor(this.score)}`;

        // Sync Game Over AI button state
        const goAiBtn = document.getElementById('game-over-ai-toggle-btn');
        if (goAiBtn) {
            goAiBtn.innerText = this.isAIEnabled ? "Disable AI" : "Enable AI";
            if (this.isAIEnabled) goAiBtn.classList.add('active');
            else goAiBtn.classList.remove('active');
        }
    }

    updateUI() {
        document.getElementById('score')!.innerText = Math.floor(this.score).toString();
        document.getElementById('high-score')!.innerText = Math.floor(this.highScore).toString();
    }
}
