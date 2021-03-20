import { ComputerPaddle } from "./ComputerPaddle";
import { Entities } from "./Entities";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Paddle } from "./Paddle";

export class Ball extends Entity {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.xuv = Math.random()<0.5 ? -1 : 1;
    this.yuv = 1;
    this.speed = speed;
  }

  updateBasedOnCanvasBoundary(canvas: HTMLCanvasElement) {
    if (this.y <= 10) {
      this.yuv = 1;
    }
    
    if (this.y + this.height >= canvas.height - 10) {
      this.yuv = -1;
    }

    if (this.x <= 0) {
      Game.onScored(Entities.COMPUTER);
    }

    if(this.x + this.width >= canvas.width) {
      Game.onScored(Entities.PLAYER);
    }
  }

  updateBasedOnCollision(player: Paddle, computer: ComputerPaddle) {
    if (this.x <= player.x + player.width) {
      if (this.y <= player.y+player.height && this.y + this.height >= player.y) {
        this.xuv = 1;
      }
    }
    if (this.x + this.width >= computer.x) {
      if (this.y <= computer.y+computer.height && this.y + this.height >= computer.y) {
        this.xuv = -1;
      }
    }
  }

  update(player: Paddle, computer: ComputerPaddle, canvas: HTMLCanvasElement) {
    this.updateBasedOnCanvasBoundary(canvas);
    this.updateBasedOnCollision(player, computer);
    this.x += this.xuv * this.speed;
    this.y += this.yuv * this.speed;
  }
}