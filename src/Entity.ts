export class Entity {
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;

  constructor(w: number, h: number, x: number, y: number) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#fff"
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}