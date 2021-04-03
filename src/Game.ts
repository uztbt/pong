import { followBall, fromUserInput, Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { Players } from "./Players";
import { config } from "./config";
import { Ending } from "./Ending";
import { Line } from "./Line";

export class Game {
  static gameCanvas = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement;
  private static gameContext = Game.gameCanvas.getContext(
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
  static endLines: Line[];

  static init(): void {
    Game.gameContext.font = "30px Orbitron";
    Game.loopTimestamp = 0;
    Game.playerScore = 0;
    Game.computerScore = 0;
    Game.ballLaunchTimer = 0;
    Game.ball = null;

    Game.player1 = new Paddle(
      config.paddle.width,
      config.paddle.height,
      config.line.offset * 2,
      Game.gameCanvas.height / 2 - config.paddle.height / 2,
      config.player.speed,
      fromUserInput
    );
    Game.computerPlayer = new Paddle(
      config.paddle.width,
      config.paddle.height,
      Game.gameCanvas.width - (config.paddle.width + config.line.offset * 2),
      Game.gameCanvas.height / 2 - config.paddle.height / 2,
      config.computer.speed,
      followBall
    );
    Game.sideLines = [
      new Line(
        Game.gameCanvas.width - config.line.offset * 2,
        config.line.width,
        config.line.offset,
        config.line.offset - config.line.width),
      new Line(
        Game.gameCanvas.width - config.line.offset * 2,
        config.line.width,
        config.line.offset,
        Game.gameCanvas.height - config.line.offset)
    ];
    Game.endLines = [
      new Line(
        config.line.width,
        Game.gameCanvas.height - (config.line.offset - config.line.width) * 2,
        config.line.offset - config.line.width,
        config.line.offset - config.line.width),
      new Line(
        config.line.width,
        Game.gameCanvas.height - (config.line.offset - config.line.width) * 2,
        Game.gameCanvas.width - config.line.offset,
        config.line.offset - config.line.width),
    ];
    Game.scheduleBallLaunch(60);
  }

  static drawBoardDetails(): void {
    // center line
    for (let i = 0; i < Game.gameCanvas.height - 30; i += 30) {
      Game.gameContext.fillStyle = "#fff";
      Game.gameContext.fillRect(Game.gameCanvas.width / 2 - 10, i + 10, 15, 20);
    }

    // draw scores
    Game.gameContext.fillText(Game.playerScore.toString(), Game.gameCanvas.width/2-50, 50);
    Game.gameContext.fillText(Game.computerScore.toString(), Game.gameCanvas.width/2+20, 50);
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
          config.ball.size,
          config.ball.size,
          Game.gameCanvas.width / 2 - config.ball.size / 2,
          Game.gameCanvas.height / 2 - config.ball.size / 2,
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
      Game.gameCanvas.width,
      Game.gameCanvas.height
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
