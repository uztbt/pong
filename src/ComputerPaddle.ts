import { Ball } from "./Ball";
import { Entity } from "./Entity";

export class ComputerPaddle extends Entity {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateVelocity(ball: Ball, canvas: HTMLCanvasElement) {
    if (ball.vx < 0) {
      this.vy = 0;
      return;
    }
    if (ball.y < this.y) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    }
    else if (ball.y + ball.height > this.y + this.height) {
      this.vy = this.speed;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.vy = 0;
      }
    } else {
      this.vy = 0;
    }
  }

  update(ball: Ball, canvas: HTMLCanvasElement) {
    this.updateVelocity(ball, canvas);
    this.y += this.vy;
  }
}