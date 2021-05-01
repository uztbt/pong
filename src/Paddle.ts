import { config } from "./config";
import { Game } from "./Game";
import { Movable } from "./Movable";
import { Command, UserControl } from "./UserControl";
import { scale } from "./utils";

type CommandInput = (paddle: Paddle) => Set<Command.UP | Command.DOWN | Command.LEFT | Command.RIGHT>;
export class Paddle extends Movable {
  private speed: number;
  private commandInput: CommandInput;

  constructor(x: number, y: number, w: number, h: number, speed: number, commandInput: CommandInput) {
    super(x, y, w, h);
    this.speed = speed;
    this.commandInput = commandInput;
  }

  preferredVelocity(): [number, number] {
    const commands = this.commandInput(this);
    let vx = 0;
    if (commands.has(Command.LEFT)) {
      vx = -this.speed;
    } else if (commands.has(Command.RIGHT)) {
      vx = this.speed;
    }
    return [vx, 0];
  }

  update(): void {
    const [vx, vy] = this.preferredVelocity();
    this.updateVelocityWithReconciliation(vx, vy, Game.sideLines);
    this.updatePosition();
  }
}

export function fromUserInput(paddle: Paddle): Set<Command.UP|Command.DOWN|Command.LEFT|Command.RIGHT> {
  const commands = new Set<Command.UP | Command.DOWN | Command.LEFT | Command.RIGHT>();
  if (UserControl.dict[Command.LEFT]) {
    commands.add(Command.LEFT);
  }
  if (UserControl.dict[Command.RIGHT]) {
    commands.add(Command.RIGHT);
  }
  if (UserControl.dict[Command.MOVE]) {
    const preferredX = scale([1, 100],
      [config.court.offset+config.line.height, 390-(config.court.offset+config.line.height+config.paddle.width/2)]
      )(UserControl.scaleValue);
    console.log(`UserControl.scaleValue = ${UserControl.scaleValue}, preferredX = ${preferredX}`);
    if (preferredX < paddle.x + paddle.width / 2 - 10) {
      commands.add(Command.LEFT);
    } else if (preferredX > paddle.x + paddle.width / 2 + 10) {
      commands.add(Command.RIGHT);
    }
  }
  return commands;
}

export function followBall (paddle: Paddle): Set<Command.UP|Command.DOWN|Command.LEFT|Command.RIGHT>{
  const commands = new Set<Command.UP|Command.DOWN|Command.LEFT|Command.RIGHT>();
  const ball = Game.ball;
  if (ball === null || ball.vy > 0) {
    return commands;
  }
  if (ball.x + ball.width < paddle.x) {
    commands.add(Command.LEFT);
  } else if (ball.x > paddle.x + paddle.width) {
    commands.add(Command.RIGHT);
  }
  return commands;
}
