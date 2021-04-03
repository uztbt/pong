import { Drawable } from "./Drawable";

export abstract class Movable extends Drawable {
  vx: number;
  vy: number;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
    this.vx = 0;
    this.vy = 0;
  }

  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
