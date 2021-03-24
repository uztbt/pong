import { ComputerPaddle } from "./ComputerPaddle";
import { config } from "./config";
import { Players } from "./Players";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { scale } from "./helpers";
import { Paddle } from "./Paddle";

export class Ball extends Entity {
  private speed: number;
  private angle: number;
  private deltaAngle: number;
  private acceleration: number;
  private lastHitBy: Players | null;
  private boundLeftwardScale: (x: number) => number;
  private boundRightwardScale: (x: number) => number;

  constructor(w: number, h: number, x: number, y: number, speed: number, deltaAngle: number, acceleration: number) {
    super(w, h, x, y);
    this.speed = speed;
    this.deltaAngle = deltaAngle;
    this.angle = this.randomAngle();
    this.lastHitBy = null;
    this.updateVelocity();
    this.boundLeftwardScale = scale(
      [-config.paddle.height/2-h/2, config.paddle.height/2+h/2],
      [Math.PI/2+deltaAngle, Math.PI*3/2-deltaAngle]);
    this.boundRightwardScale = scale(
      [-config.paddle.height/2-h/2, config.paddle.height/2+h/2],
      [Math.PI/2-deltaAngle, -Math.PI/2+deltaAngle]);
    this.acceleration = acceleration;
  }

  private updateVelocity() {
    const uvx = Math.cos(this.angle);
    // The negation below is very important because the y-axis of the canvas is the opposite of
    // that of the normal cartesian system, which I used to calculate the reflection.
    const uvy = -Math.sin(this.angle);
    this.vx = this.speed*uvx;
    this.vy = this.speed*uvy;
  }

  private randomAngle():number {
    const a = Math.PI*(Math.random()-0.5);
    if (a>Math.PI/2-this.deltaAngle || a<-Math.PI/2+this.deltaAngle) {
      return this.randomAngle()
    } else {
      return a;
    }
  }

  private flipHorizontally() {
    this.angle = 2*Math.PI-this.angle;
    this.updateVelocity();
  }

  private flipVertically() {
    this.angle = Math.PI-this.angle;
    this.updateVelocity();
  }

  private boundByCollision(paddle: Entity) {
    const paddleMiddleY = paddle.y + paddle.height/2;
    const ballMiddleY = this.y + this.height/2;
    const dy = ballMiddleY - paddleMiddleY;
    const isIncidentDirectionLeft = this.vx < 0;
    if (isIncidentDirectionLeft) {
      this.angle = this.boundRightwardScale(dy);
    } else {
      this.angle = this.boundLeftwardScale(dy);
    }
    this.updateVelocity();
    this.speed *= this.acceleration;
  }

  private updateBasedOnCanvasBoundary(canvas: HTMLCanvasElement) {
    if (this.y <= 10) {
      this.flipHorizontally();
    }
    
    if (this.y + this.height >= canvas.height - 10) {
      this.flipHorizontally();
    }

    if (this.x <= 0) {
      Game.onScored(Players.COMPUTER);
    }

    if(this.x + this.width >= canvas.width) {
      Game.onScored(Players.PLAYER);
    }
  }

  updateBasedOnCollision(player: Paddle, computer: ComputerPaddle) {
    if (player.x <= this.x && this.x <= player.x + player.width) {
      if (this.y <= player.y+player.height && this.y + this.height >= player.y) {
        if (this.lastHitBy !== Players.PLAYER) {
          this. boundByCollision(player);
          this.lastHitBy = Players.PLAYER;
        }
      }
    }
    if (computer.x <= this.x + this.width && this.x <= computer.x + computer.width) {
      if (this.y <= computer.y+computer.height && this.y + this.height >= computer.y) {
        if (this.lastHitBy !== Players.COMPUTER) {
          this.boundByCollision(computer);
          this.lastHitBy = Players.COMPUTER;
        }
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