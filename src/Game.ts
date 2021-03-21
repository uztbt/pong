import { Paddle } from "./Paddle";
import { ComputerPaddle } from './ComputerPaddle';
import { Ball } from "./Ball";
import { Entities } from "./Entities";
import { config } from "./config";
import { Ending } from "./Ending";

export class Game {
  private static gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private static gameContext = Game.gameCanvas.getContext("2d") as CanvasRenderingContext2D;
  public static playerScore: number;
  public static computerScore: number;
  private static player1: Paddle;
  private static computerPlayer: ComputerPaddle;
  private static ballLaunchTimer: number;
  private static ball: Ball | null;
  
  private constructor () {}
  static init() {
    Game.gameContext.font = "30px Orbitron";
    Game.playerScore = 0;
    Game.computerScore = 0;
    Game.ballLaunchTimer = 0;
    Game.ball = null;
    

    Game.player1 = new Paddle(config.paddle.width, config.paddle.height,
      config.wallOffset, Game.gameCanvas.height/2 - config.paddle.height/2,
      config.player.speed);
    Game.computerPlayer = new ComputerPaddle(config.paddle.width, config.paddle.height,
      Game.gameCanvas.width-(config.paddle.width + config.wallOffset), Game.gameCanvas.height/2-config.paddle.height/2,
      config.computer.speed);
    Game.scheduleBallLaunch(60);

  }

  static drawBoardDetails() {
    // court outline
    Game.gameContext.strokeStyle = "#fff";
    Game.gameContext.lineWidth = 5;
    Game.gameContext.strokeRect(10, 10, Game.gameCanvas.width - 20, Game.gameCanvas.height - 20);

    // center line
    for (let i = 0; i < Game.gameCanvas.height - 30; i+= 30) {
      Game.gameContext.fillStyle = "#fff";
      Game.gameContext.fillRect(Game.gameCanvas.width/2-10, i+10, 15, 20);
    }

    // draw scores
    Game.gameContext.fillText(Game.playerScore.toString(), 280, 50);
    Game.gameContext.fillText(Game.computerScore.toString(), 390, 50);
  }

  static update(): boolean{
    if (Game.playerScore >= config.gamePoint || Game.computerScore >= config.gamePoint) {
      return true;
    }
    Game.player1.update(Game.gameCanvas);
    if (Game.ball === null) {
      Game.ballLaunchTimer -= 1;
      if (Game.ballLaunchTimer <= 0) {
        Game.ball = new Ball(config.ball.size, config.ball.size,
          Game.gameCanvas.width/2-config.ball.size/2, Game.gameCanvas.height/2-config.ball.size/2,
          config.ball.speed, config.ball.deltaAngle, config.ball.acceleration);
      }
    } else {
      Game.computerPlayer.update(Game.ball, Game.gameCanvas);
      Game.ball.update(Game.player1, Game.computerPlayer, Game.gameCanvas);
    }
    return false;
  }

  static draw() {
    // Fill the background in Black
    Game.gameContext.fillStyle = "#000";
    Game.gameContext.fillRect(0, 0, Game.gameCanvas.width, Game.gameCanvas.height);

    Game.drawBoardDetails();
    Game.player1.draw(Game.gameContext);
    Game.computerPlayer.draw(Game.gameContext);
    if (Game.ball !== null) {
      Game.ball.draw(Game.gameContext);
    }
  }
  
  static gameLoop() {
    const moveToEnding = Game.update();
    if (moveToEnding) {
      Ending.init(Game.playerScore, Game.computerScore);
      requestAnimationFrame(Ending.loop);
    } else {
      Game.draw();
      requestAnimationFrame(Game.gameLoop);
    }
  }

  public static onScored(entity: Entities) {
    switch (entity) {
      case Entities.PLAYER:
        Game.playerScore += 1;
        break;
      case Entities.COMPUTER:
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