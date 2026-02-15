export class Dino {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
  jumpForce: number;
  gravity: number;
  isJumping: boolean;
  isDucking: boolean;
  groundY: number;

  constructor(canvasHeight: number) {
    this.width = 60; // Hitbox width (Bigger)
    this.height = 60; // Hitbox height (Bigger)
    this.x = 50;
    this.groundY = canvasHeight - this.height - 10;
    this.y = this.groundY;
    this.dy = 0;
    this.jumpForce = -17; // Stronger jump for bigger body
    this.gravity = 1.0;
    this.isJumping = false;
    this.isDucking = false;
    // No sprite image needed for procedural
  }

  update() {
    // Jump physics
    if (this.isJumping) {
      this.dy += this.gravity;
      this.y += this.dy;

      if (this.y > this.groundY) {
        this.y = this.groundY;
        this.dy = 0;
        this.isJumping = false;
      }
    } else if (this.isDucking) {
      this.height = 30; // Duck hitbox height
      this.width = 70;  // Duck hitbox width
      this.y = this.groundY + (60 - 30); // Adjust for height difference
    } else {
      // Reset dimensions
      this.width = 60;
      this.height = 60;
      this.y = this.groundY;
    }
  }

  jump() {
    if (!this.isJumping && !this.isDucking) {
      this.isJumping = true;
      this.dy = this.jumpForce;
    }
  }

  duck(isDown: boolean) {
    if (!this.isJumping) {
      this.isDucking = isDown;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Visual dimensions (larger than hitbox)
    const visualWidth = 100;
    const visualHeight = 100;

    // Center visual horizontally on hitbox
    const visualX = this.x - (visualWidth - this.width) / 2;
    // Align visual bottom with hitbox bottom + slight offset for "slug" feel
    const visualY = this.y - (visualHeight - this.height) + 10;

    ctx.save();

    // Move to center of visual
    ctx.translate(visualX + visualWidth / 2, visualY + visualHeight / 2);

    // Rotate/Flip? User said "facing opposite side so rotate it 180"
    // Assuming default drawing faces Right.
    // If user wants 180 flip from previous state (which was scale(-1, 1)), 
    // let's just draw it facing Right by default and NOT scale it.
    // Or if they mean it's currently Left and want Right.
    // Let's draw a Right-facing slug.

    // Draw Alien Slug
    // Body
    ctx.fillStyle = '#00ff9d'; // Neon Green
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff9d';

    if (this.isDucking) {
      // Flat Slug
      ctx.beginPath();
      ctx.ellipse(0, 20, 45, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Standing Slug (Blobe)
      ctx.beginPath();
      // Main body
      ctx.ellipse(0, 10, 30, 40, 0, 0, Math.PI * 2);
      // Tail
      ctx.ellipse(-25, 30, 25, 15, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eye (Cyclops)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    const eyeY = this.isDucking ? 15 : -10;
    const eyeX = 15; // Facing Right

    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#ff0055'; // Red Pupil
    ctx.beginPath();
    ctx.arc(eyeX + 3, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    if (!this.isDucking) {
      ctx.strokeStyle = '#00ff9d';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(5, -25);
      ctx.lineTo(10, -50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-5, -25);
      ctx.lineTo(-15, -45);
      ctx.stroke();

      // Tips
      ctx.fillStyle = '#ff0055'; // Red tips
      ctx.beginPath(); ctx.arc(10, -50, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-15, -45, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Debug Hitbox (Optional, comment out in production)
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(-visualWidth/2 + (visualWidth-this.width)/2, -visualHeight/2 + (visualHeight-this.height) - 10, this.width, this.height);

    ctx.restore();
  }

  reset(canvasHeight: number) {
    this.groundY = canvasHeight - 47 - 10;
    this.y = this.groundY;
    this.dy = 0;
    this.isJumping = false;
    this.isDucking = false;
  }
}
