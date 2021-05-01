import { config } from "./config";
import { Players } from "./Players";
import { Movable } from "./Movable";
import { Game } from "./Game";
import { Paddle } from "./Paddle";
import { Drawable } from "./Drawable";
import { EndLine, Line } from "./Line";

function scale([x1, x2]: [number, number], [y1, y2]: [number, number]) {
  return (x: number): number => {
    const a = (y1 - y2) / (x1 - x2);
    const b = y1 - a * x1;
    return a * x + b;
  }
}

export class Ball extends Movable {
  private speed: number;
  private angle: number;
  private deltaAngle: number;
  private acceleration: number;
  private lastHitBy: Players | null;
  private boundLeftwardScale: (x: number) => number;
  private boundRightwardScale: (x: number) => number;
  private boundDownwardScale: (x: number) => number;
  private boundUpwardScale: (x: number) => number;

  constructor(
    w: number,
    h: number,
    x: number,
    y: number,
    speed: number,
    deltaAngle: number,
    acceleration: number
  ) {
    super(w, h, x, y);
    this.speed = speed;
    this.deltaAngle = deltaAngle;
    this.angle = this.randomAngle();
    this.lastHitBy = null;
    this.updateVelocity();
    this.boundLeftwardScale = scale(
      [-config.paddle.height / 2 - h / 2, config.paddle.height / 2 + h / 2],
      [Math.PI / 2 + deltaAngle, (Math.PI * 3) / 2 - deltaAngle]
    );
    this.boundRightwardScale = scale(
      [-config.paddle.height / 2 - h / 2, config.paddle.height / 2 + h / 2],
      [Math.PI / 2 - deltaAngle, -Math.PI / 2 + deltaAngle]
    );
    this.boundDownwardScale = scale(
      [-config.paddle.width / 2 - w / 2, config.paddle.width / 2 + w / 2],
      [Math.PI-deltaAngle, deltaAngle]
    );
    this.boundUpwardScale = scale(
      [-config.paddle.width / 2 - w / 2, config.paddle.width / 2 + w / 2],
      [Math.PI+deltaAngle, 2*Math.PI-deltaAngle]
    );
    this.acceleration = acceleration;
  }

  private updateVelocity() {
    const uvx = Math.cos(this.angle);
    const uvy = Math.sin(this.angle);
    this.vx = this.speed * uvx;
    this.vy = this.speed * uvy;
  }

  private randomAngle(): number {
    const offset = Math.PI + this.deltaAngle;
    const variable = (Math.PI - 2 * this.deltaAngle) * Math.random();
    return offset + variable;
  }

  private flipHorizontally() {
    this.angle = Math.PI - this.angle;
    this.updateVelocity();
  }

  private flipVertically() {
    this.angle = Math.PI - this.angle;
    this.updateVelocity();
  }

  private boundByCollision(paddle: Drawable) {
    const paddleMiddleX = paddle.x + paddle.width / 2;
    const ballMiddleX = this.x + this.width / 2;
    const dx = ballMiddleX - paddleMiddleX;
    const isIncidentDirectionUp = this.vy < 0;
    if (isIncidentDirectionUp) {
      this.angle = this.boundDownwardScale(dx);
    } else {
      this.angle = this.boundUpwardScale(dx);
    }
    this.updateVelocity();
    this.speed *= this.acceleration;
  }

  collisionWithPaddle(paddle: Paddle, player: Players): void {
    if (this.isCollidingWith(paddle) && this.lastHitBy !== player) {
      this.lastHitBy = player;
      this.boundByCollision(paddle);
    }
  }

  private collisionWithSideLines(sideLines: Line[]) {
    // see. https://yuji.page/axis-aligned-bounding-boxes/
    sideLines.forEach(sideLine => {
      if (this.isCollidingWith(sideLine)) {
        const isGoingLeft = this.vx < 0;
        if (isGoingLeft) {
          this.x = sideLine.x + sideLine.width;
        } else {
          this.x = sideLine.x - this.width;
        }
        this.flipHorizontally();
      }
    })
  }

  private collisionWithEndLines(endLines: EndLine[]) {
    endLines.forEach(endLine => {
      if (this.isCollidingWith(endLine)) {
        if (endLine.ownedBy === Players.PLAYER) {
          Game.onScored(Players.COMPUTER);
        } else {
          Game.onScored(Players.PLAYER);
        }
      }
    })
  }

  update(): void {
    const player = Game.player1;
    const computer = Game.computerPlayer;
    const sideLines = Game.sideLines;
    const endLines = Game.endLines;
    this.collisionWithSideLines(sideLines);
    this.collisionWithEndLines(endLines);
    this.collisionWithPaddle(player, Players.PLAYER);
    this.collisionWithPaddle(computer, Players.COMPUTER);
    this.updatePosition();
  }
}
