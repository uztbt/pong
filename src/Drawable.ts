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
}
