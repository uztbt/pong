import { Entity } from "./Entity";
import { Game } from "./Game";

export class Paddle extends Entity{
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateUv(canvas: HTMLCanvasElement){
    if (Game.keysPressed.ArrowUp) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    } else if (Game.keysPressed.ArrowDown) {
      this.vy = this.speed;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.vy = 0;
      }
    } else {
      this.vy = 0;
    }
  }
  
  update(canvas: HTMLCanvasElement) {
    this.updateUv(canvas);    
    this.y += this.vy;
  }
}