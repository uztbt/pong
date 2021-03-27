import { userInput } from ".";
import { Entity } from "./Entity";

export class Paddle extends Entity {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateVelocity(canvas: HTMLCanvasElement): void {
    if (userInput.ArrowUp) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    } else if (userInput.ArrowDown) {
      this.vy = this.speed;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.vy = 0;
      }
    } else {
      this.vy = 0;
    }
  }

  update(canvas: HTMLCanvasElement): void {
    this.updateVelocity(canvas);
    this.y += this.vy;
  }
}
