import { config } from "./config";
import { Opening } from "./Opening";
import { Command, UserControl } from "./UserControl";

export class Ending {
  private static canvas = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement;
  private static context = Ending.canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  private static loopTimestamp: number;
  private static elapsedFrame: number;
  private static playerScore: number;
  private static computerScore: number;

  static init(playerScore: number, computerScore: number): void {
    Ending.loopTimestamp = 0;
    Ending.playerScore = playerScore;
    Ending.computerScore = computerScore;
    Ending.context.font = "30px Orbitron";
    Ending.elapsedFrame = 0;
  }

  private static update(): boolean {
    if (Ending.elapsedFrame > 30 && UserControl.dict[Command.ENTER]) {
      Opening.init();
      requestAnimationFrame(Opening.loop);
      return true;
    }
    return false;
  }

  private static draw() {
    // Fill the background in Black
    Ending.context.fillStyle = "#000";
    Ending.context.fillRect(0, 0, Ending.canvas.width, Ending.canvas.height);

    Ending.context.fillStyle = "#fff";
    const resultMessage =
      Ending.computerScore < Ending.playerScore ? "YOU WIN" : "YOU LOSE";
    Ending.context.fillText(
      resultMessage,
      Ending.canvas.width / 2 - 90,
      Ending.canvas.height / 2 - 45
    );
    Ending.context.fillText(
      `${Ending.playerScore} - ${Ending.computerScore}`,
      Ending.canvas.width / 2 - 45,
      Ending.canvas.height / 2
    );
    Ending.context.fillText(
      "PRESS ENTER",
      Ending.canvas.width / 2 - 30 * 4.5,
      (Ending.canvas.height * 2) / 3 - 15
    );
  }

  static loop(timestamp: number): void {
    if (timestamp - Ending.loopTimestamp > config.secondsPerFrame) {
      Ending.loopTimestamp = timestamp;
      Ending.elapsedFrame += 1;
      const moveToOpening = Ending.update();
      if (moveToOpening === false) {
        Ending.draw();
        requestAnimationFrame(Ending.loop);
      }
    } else {
      requestAnimationFrame(Ending.loop);
      return;
    }
  }
}
