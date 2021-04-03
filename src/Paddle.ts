import { Game } from "./Game";
import { Movable } from "./Movable";
import { Command, UserControl } from "./UserControl";

type CommandInput = (anything: any) => Set<Command.UP | Command.DOWN>;
export class Paddle extends Movable {
  private speed: number;
  private commandInput: CommandInput;

  constructor(w: number, h: number, x: number, y: number, speed: number, commandInput: CommandInput) {
    super(w, h, x, y);
    this.speed = speed;
    this.commandInput = commandInput;
  }

  updateVelocity(canvas: HTMLCanvasElement): void {
    const commands = this.commandInput(this);
    if (commands.has(Command.UP)) {
      this.vy = -this.speed;
      if (this.y <= 20) {
        this.vy = 0;
      }
    } else if (commands.has(Command.DOWN)) {
      this.vy = this.speed;
      if (canvas.height - (this.y + this.height) <= 20) {
        this.vy = 0;
      }
    } else {
      this.vy = 0;
    }
  }

  update(): void {
    const canvas = Game.gameCanvas;
    this.updateVelocity(canvas);
    this.updatePosition();
  }
}

export function fromUserInput(paddle: Paddle): Set<Command.UP|Command.DOWN> {
  const commands = new Set<Command.UP | Command.DOWN>();
  if (UserControl.dict[Command.UP]) {
    commands.add(Command.UP);
  }
  if (UserControl.dict[Command.DOWN]) {
    commands.add(Command.DOWN);
  }
  if (UserControl.dict[Command.MOVE]) {
    const touchY = UserControl.ongoingTouch?.clientY;
    if (touchY !== undefined) {
      if (touchY < paddle.y + paddle.height / 2 - 10) {
        commands.add(Command.UP);
      } else if (touchY > paddle.y + paddle.height / 2 + 10) {
        commands.add(Command.DOWN);
      }
    }
  }
  return commands;
}

export function followBall (paddle: Paddle) {
  const commands = new Set<Command.UP | Command.DOWN>();
  const ball = Game.ball;
  if (ball === null || ball.vx < 0) {
    return commands;
  }
  if (ball.y < paddle.y) {
    commands.add(Command.UP);
  } else if (ball.y + ball.height > paddle.y + paddle.height) {
    commands.add(Command.DOWN);
  }
  return commands;
}
