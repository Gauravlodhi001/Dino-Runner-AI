export class Background {
    width: number;
    height: number;
    image: HTMLImageElement;
    x1: number;
    x2: number;
    speedModifier: number; // Parallax factor

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = '/background.png';
        this.x1 = 0;
        this.x2 = this.width;
        this.speedModifier = 0.5; // Scroll at half speed for depth effect
    }

    update(gameSpeed: number) {
        // dynamic speed based on game speed
        const speed = gameSpeed * this.speedModifier;

        this.x1 -= speed;
        this.x2 -= speed;

        // Reset positions when off-screen
        if (this.x1 <= -this.width) {
            this.x1 = this.width + this.x2 - speed; // Seamless connection
        }
        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x1 - speed;
        }

        // Simple reset if gap appears (fallback)
        if (this.x1 <= -this.width) this.x1 = this.width;
        if (this.x2 <= -this.width) this.x2 = this.width;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.image.complete) {
            // Draw two images to loop
            // We force the height to cover the canvas, and width to maintain aspect ratio or stretch
            // For a runner, we usually want to stretch width to fill screen or maintain ratio.
            // Let's assume the background image is wide enough or we stretch it.
            // To ensure it always fills, we can draw it with this.width and this.height

            ctx.drawImage(this.image, this.x1, 0, this.width + 1, this.height);
            ctx.drawImage(this.image, this.x2, 0, this.width + 1, this.height);
        } else {
            // Fallback color
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x1 = 0;
        this.x2 = this.width;
    }
}
