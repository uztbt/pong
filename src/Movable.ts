import { areColliding, Drawable } from "./Drawable";

export abstract class Movable extends Drawable {
  vx: number;
  vy: number;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
    this.vx = 0;
    this.vy = 0;
  }

  updatePosition(): void {
    this.x += this.vx;
    this.y += this.vy;
  }

  private clone(): Movable {
    return Object.assign({}, this);
  }

  private willCollide(vx: number, vy: number, drawable: Drawable): boolean {
    const clone = this.clone();
    clone.x += vx;
    clone.y += vy;
    return areColliding(clone, drawable);
  }

  updateVelocityWithReconciliation(vx: number, vy: number, drawables: Drawable[]): void {
    this.vx = vx;
    this.vy = vy;
    drawables.forEach(drawable => {
      if (this.willCollide(vx, vy, drawable)) {
        if (vx < 0) {
          this.vx = Math.max(this.x-drawable.x+drawable.width, vx);
        } else if (vx > 0) {
          this.vx = Math.min(drawable.x-(this.x+this.width), vx);
        }
        if (vy < 0) {
          this.vy = Math.max(drawable.y+drawable.height-this.y, vy);
        } else if (vy > 0){
          this.vy = Math.min(drawable.y-(this.y+this.height), vy);
        }
      }
    });
  }
}
