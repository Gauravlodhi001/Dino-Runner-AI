export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.life = 0;
        this.maxLife = Math.random() * 20 + 10;
        this.vx = (Math.random() - 0.5) * 4; // Random spread
        this.vy = -(Math.random() * 2 + 1); // Upward momentum
    }

    update() {
        this.x += this.vx - 4; // Move left with the world (assuming speed ~4-8)
        this.y += this.vy;
        this.life++;
        this.size *= 0.95; // Shrink
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;

        // Fading out
        const alpha = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();

        ctx.globalAlpha = 1.0;
    }
}

export class ParticleManager {
    particles: Particle[] = [];

    spawnDust(x: number, y: number) {
        for (let i = 0; i < 3; i++) {
            this.particles.push(new Particle(x, y, '#94a3b8')); // Gray/Slate dust
        }
    }

    spawnExplosion(x: number, y: number) {
        for (let i = 0; i < 20; i++) {
            const p = new Particle(x, y, '#ff0055'); // Red/Pink explosion
            p.vx = (Math.random() - 0.5) * 10;
            p.vy = (Math.random() - 0.5) * 10;
            p.maxLife = 40;
            this.particles.push(p);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life >= p.maxLife || p.size < 0.5) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const p of this.particles) {
            p.draw(ctx);
        }
    }

    reset() {
        this.particles = [];
    }
}
