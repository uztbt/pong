import { Game } from "./Game";
import { Movable } from "./Movable";
import { Command, UserControl } from "./UserControl";

type CommandInput = (paddle: Paddle) => Set<Command.UP | Command.DOWN>;
export class Paddle extends Movable {
  private speed: number;
  private commandInput: CommandInput;

  constructor(w: number, h: number, x: number, y: number, speed: number, commandInput: CommandInput) {
    super(w, h, x, y);
    this.speed = speed;
    this.commandInput = commandInput;
  }

  preferredVelocity(): [number, number] {
    const commands = this.commandInput(this);
    let vy = 0;
    if (commands.has(Command.UP)) {
      vy = -this.speed;
    } else if (commands.has(Command.DOWN)) {
      vy = this.speed;
    }
    return [0, vy];
  }

  update(): void {
    const [vx, vy] = this.preferredVelocity();
    this.updateVelocityWithReconciliation(vx, vy, Game.sideLines);
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

export function followBall (paddle: Paddle): Set<Command.UP | Command.DOWN>{
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
