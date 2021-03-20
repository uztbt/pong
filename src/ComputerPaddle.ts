import { Ball } from "./Ball";
import { Entity } from "./Entity";

export class ComputerPaddle extends Entity {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateUv(ball: Ball, canvas: HTMLCanvasElement) {
    if (ball.xuv === -1) {
      this.yuv = 0;
      return;
    }
    if (ball.y < this.y) {
      this.yuv = -1;
      if (this.y <= 20) {
        this.yuv = 0;
      }
    }
    else if (ball.y + ball.height > this.y + this.height) {
      this.yuv = 1;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.yuv = 0;
      }
    } else {
      this.yuv = 0;
    }
  }

  update(ball: Ball, canvas: HTMLCanvasElement) {
    this.updateUv(ball, canvas);
    this.y += this.yuv * this.speed;
  }
}