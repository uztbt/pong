import { Entity } from "./Entity";
import { Command, UserControl } from "./UserControl";

export class Paddle extends Entity {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateVelocity(canvas: HTMLCanvasElement): void {
    if (UserControl.dict[Command.UP]) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    } else if (UserControl.dict[Command.DOWN]) {
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
