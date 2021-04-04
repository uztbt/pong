export abstract class Drawable {
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(w: number, h: number, x: number, y: number) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#fff";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  isCollidingWith(d: Drawable): boolean {
    return areColliding(d, this);
  }
}

export function areColliding(d1: Drawable, d2: Drawable): boolean {
  return d1.x < d2.x + d2.width && d1.x + d1.width > d2.x &&
    d1.y + d1.height > d2.y && d1.y < d2.y + d2.height;
}