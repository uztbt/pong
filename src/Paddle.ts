import { Movable } from "./Movable";
import { Command, UserControl } from "./UserControl";

export class Paddle extends Movable {
  private speed: number;

  constructor(w: number, h: number, x: number, y: number, speed: number) {
    super(w, h, x, y);
    this.speed = speed;
  }

  updateVelocity(canvas: HTMLCanvasElement): void {
    if (this.willGoUp()) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    } else if (this.willGoDown()) {
      this.vy = this.speed;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.vy = 0;
      }
    } else {
      this.vy = 0;
    }
  }

  update(canvas: HTMLCanvasElement): void {
    this.updateVelocity(canvas);
    this.y += this.vy;
  }

  willGoUp(): boolean {
    if (UserControl.dict[Command.UP]){
      return true;
    }
    const moveCommandOn = UserControl.dict[Command.MOVE];
    const touchY = UserControl.ongoingTouch?.clientY;
    if (moveCommandOn && touchY !== undefined &&
      touchY < this.y + this.height/2 -10) {
      return true;
    }
    return false;
  }

  willGoDown(): boolean {
    if (UserControl.dict[Command.DOWN]){
      return true;
    }
    const moveCommandOn = UserControl.dict[Command.MOVE];
    const touchY = UserControl.ongoingTouch?.clientY;
    if (moveCommandOn && touchY !== undefined &&
      touchY > this.y + this.height/2 +10) {
      return true;
    }
    return false;
  }
}
