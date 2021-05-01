import { followBall, fromUserInput, Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { Players } from "./Players";
import { config } from "./config";
import { Ending } from "./Ending";
import { EndLine, Line } from "./Line";

export class Game {
  static canvas = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement;
  private static gameContext = Game.canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  private static loopTimestamp: number;
  static playerScore: number;
  static computerScore: number;
  static player1: Paddle;
  static computerPlayer: Paddle;
  private static ballLaunchTimer: number;
  static ball: Ball | null;
  static sideLines: Line[];
  static endLines: EndLine[];

  static init(): void {
    Game.gameContext.font = `${config.points.font.size}px ${config.points.font.name}`;
    Game.loopTimestamp = 0;
    Game.playerScore = 0;
    Game.computerScore = 0;
    Game.ballLaunchTimer = 0;
    Game.ball = null;

    const sidelineWidth = Game.canvas.height - 2 * config.court.offset;
    const endlineWidth = Game.canvas.width - 2 * config.court.offset;
    Game.sideLines = [
      new Line(
        config.court.offset,
        config.court.offset,
        config.line.height,
        sidelineWidth,
        ),
      new Line(
        config.court.offset + endlineWidth - config.line.height,
        config.court.offset,
        config.line.height,
        sidelineWidth
        )
    ];
    Game.endLines = [
      new EndLine(
        config.court.offset,
        config.court.offset,
        endlineWidth,
        config.line.height,
        Players.COMPUTER),
      new EndLine(
        config.court.offset,
        config.court.offset + sidelineWidth - config.line.height,
        endlineWidth,
        config.line.height,
        Players.PLAYER),
    ];

    Game.player1 = new Paddle(
      Game.canvas.width / 2 - config.paddle.width / 2,
      config.court.offset+sidelineWidth
        -(config.line.height+config.paddle.offset+config.paddle.height),
      config.paddle.width,
      config.paddle.height,
      config.player.speed,
      fromUserInput
    );
    Game.computerPlayer = new Paddle(
      Game.canvas.width / 2 - config.paddle.width / 2,
      config.court.offset + config.line.height + config.paddle.offset,
      config.paddle.width,
      config.paddle.height,
      config.computer.speed,
      followBall
    );

    Game.scheduleBallLaunch(60);
  }

  static drawBoardDetails(): void {
    // center line
    Game.gameContext.fillStyle = "#fff";
    const inCourtLength = Game.canvas.width - 2 * (config.court.offset + config.line.height);
    for (let i = 0; i < inCourtLength / (2 * config.centerLine.width); i++) {
      Game.gameContext.fillRect(
        config.court.offset + config.line.height + (2 * i + 0.5) * config.centerLine.width,
        Game.canvas.height / 2 - config.centerLine.height / 2,
        config.centerLine.width,
        config.centerLine.height
        );
    }

    // draw scores
    Game.gameContext.fillText(
      Game.computerScore.toString(),
      config.court.offset + config.line.height + config.points.offset.left,
      Game.canvas.height / 2 -
        (config.centerLine.height / 2 + config.points.offset.centerLine)  
      );
    Game.gameContext.fillText(
      Game.playerScore.toString(),
      config.court.offset + config.line.height + config.points.offset.left,
      Game.canvas.height / 2 + config.centerLine.height / 2 +
        config.points.font.size
    );
  }

  static update(): boolean {
    if (
      Game.playerScore >= config.gamePoint ||
      Game.computerScore >= config.gamePoint
    ) {
      return true;
    }
    Game.player1.update();
    if (Game.ball === null) {
      Game.ballLaunchTimer -= 1;
      if (Game.ballLaunchTimer <= 0) {
        Game.ball = new Ball(
          Game.canvas.width / 2 - config.ball.size / 2,
          Game.canvas.height / 2 - config.ball.size / 2,
          config.ball.size,
          config.ball.size,
          config.ball.speed,
          config.ball.deltaAngle,
          config.ball.acceleration
        );
      }
    } else {
      Game.computerPlayer.update();
      Game.ball.update();
    }
    return false;
  }

  static draw(): void {
    // Fill the background in Black
    Game.gameContext.fillStyle = "#000";
    Game.gameContext.fillRect(
      0,
      0,
      Game.canvas.width,
      Game.canvas.height
    );
    Game.sideLines.forEach(line => line.draw(Game.gameContext));
    Game.endLines.forEach(line => line.draw(Game.gameContext));
    Game.drawBoardDetails();
    Game.player1.draw(Game.gameContext);
    Game.computerPlayer.draw(Game.gameContext);
    if (Game.ball !== null) {
      Game.ball.draw(Game.gameContext);
    }
  }

  static loop(timestamp: number): void {
    if (timestamp - Game.loopTimestamp <= config.secondsPerFrame) {
      requestAnimationFrame(Game.loop);
      return;
    }
    const moveToEnding = Game.update();
    if (moveToEnding) {
      Ending.init(Game.playerScore, Game.computerScore);
      requestAnimationFrame(Ending.loop);
    } else {
      Game.draw();
      requestAnimationFrame(Game.loop);
    }
  }

  public static onScored(entity: Players): void {
    switch (entity) {
      case Players.PLAYER:
        Game.playerScore += 1;
        break;
      case Players.COMPUTER:
        Game.computerScore += 1;
        break;
    }
    Game.scheduleBallLaunch(60);
  }

  private static scheduleBallLaunch(frames: number) {
    Game.ball = null;
    Game.ballLaunchTimer = frames;
  }
}
