import { ComputerPaddle } from "./ComputerPaddle";
import { Entities } from "./Entities";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Paddle } from "./Paddle";

export class Ball extends Entity {
  private speed: number;
  private angle: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
    this.angle = Ball.generateAngle();
    this.updateVels();
  }

  private updateVels() {
    const uvx = Math.cos(this.angle);
    const uvy = Math.sin(this.angle);
    this.vx = this.speed*uvx;
    this.vy = this.speed*uvy;
  }

  private static generateAngle():number {
    const a = 2*Math.PI*Math.random();
    const a2 = (a-Math.PI/2)%Math.PI;
    if (a2<Math.PI/10 || a2>Math.PI*9/10) {
      return this.generateAngle()
    } else {
      return a;
    }
  }

  private flipHorizontally() {
    this.angle = 2*Math.PI-this.angle;
    this.updateVels();
  }

  private flipVertically() {
    this.angle = Math.PI-this.angle;
    this.updateVels();
  }

  updateBasedOnCanvasBoundary(canvas: HTMLCanvasElement) {
    if (this.y <= 10) {
      this.flipHorizontally();
    }
    
    if (this.y + this.height >= canvas.height - 10) {
      this.flipHorizontally();
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
        this.flipVertically();
      }
    }
    if (this.x + this.width >= computer.x) {
      if (this.y <= computer.y+computer.height && this.y + this.height >= computer.y) {
        this.flipVertically();
      }
    }
  }

  update(player: Paddle, computer: ComputerPaddle, canvas: HTMLCanvasElement) {
    this.updateBasedOnCanvasBoundary(canvas);
    this.updateBasedOnCollision(player, computer);
    this.x += this.vx;
    this.y += this.vy;
  }
}