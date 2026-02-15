export interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'CACTUS_SMALL' | 'CACTUS_LARGE' | 'BIRD';
}

export class ObstacleManager {
    obstacles: Obstacle[] = [];
    spawnTimer: number = 0;
    spawnInterval: number = 100; // Frames
    canvasWidth: number;
    canvasHeight: number;
    groundY: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = canvasHeight - 10;
    }

    update(speed: number) {
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            // Randomize next spawn interval based on speed to make it harder but fair
            // The faster we go, the more space we need, but we can spawn slightly more often too?
            // Actually, standard dino logic: spacing roughly constant or slightly varied.
            this.spawnInterval = Math.random() * (120 - speed) + 60;
            if (this.spawnInterval < 40) this.spawnInterval = 40;
            this.spawnTimer = this.spawnInterval;
        }

        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.x -= speed;

            if (obs.x + obs.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    spawnObstacle() {
        const typeRoll = Math.random();
        let type: Obstacle['type'] = 'CACTUS_SMALL';
        let width = 20;
        let height = 40;
        let y = this.groundY - height;

        if (typeRoll > 0.8) {
            // Bird
            type = 'BIRD';
            width = 40;
            height = 30;
            // Birds fly at different heights
            const heightInidex = Math.floor(Math.random() * 3); // 0, 1, 2
            // 0 = low (duckable), 1 = mid, 2 = high
            // Low: ground - 25 (Jumpable)
            // Mid: ground - 75 (Duckable - head hits at 60, safe at 30)
            // High: ground - 110 (Passable - safe at 60)
            const offsets = [25, 75, 110];
            y = this.groundY - offsets[heightInidex];
        } else if (typeRoll > 0.5) {
            // Large Cactus
            type = 'CACTUS_LARGE';
            width = 30;
            height = 50;
            y = this.groundY - height;
        } else {
            // Small Cactus
            // Could be 1, 2, or 3 cacti group
            const count = Math.floor(Math.random() * 3) + 1;
            width = 20 * count;
            height = 40;
            y = this.groundY - height;
        }

        // Ensure we don't spawn impossible patterns? Simple logic for now.
        this.obstacles.push({
            x: this.canvasWidth,
            y: y,
            width: width,
            height: height,
            type: type
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#ff0055'; // Danger color
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';

        for (const obs of this.obstacles) {
            // Custom drawing based on type
            if (obs.type === 'BIRD') {
                ctx.fillStyle = '#00ccff'; // Birds are blueish
                ctx.shadowColor = '#00ccff';
            } else {
                ctx.fillStyle = '#ff0055';
                ctx.shadowColor = '#ff0055';
            }
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }

        ctx.shadowBlur = 0;
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }
}
