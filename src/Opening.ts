import { userInput } from ".";
import { config } from "./config";
import { Game } from "./Game";

export class Opening {
  private static canvas = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement;
  private static context = Opening.canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  private static loopTimestamp: number;
  private static elapsedFrame: number;

  static init(): void {
    Opening.context.font = "30px Orbitron";
    Opening.loopTimestamp = 0;
    Opening.elapsedFrame = 0;
  }

  private static update(): boolean {
    if (Opening.elapsedFrame > 60 && userInput.Enter) {
      Game.init();
      requestAnimationFrame(Game.loop);
      return true;
    }
    return false;
  }

  private static draw() {
    // Fill the background in Black
    Opening.context.fillStyle = "#000";
    Opening.context.fillRect(0, 0, Opening.canvas.width, Opening.canvas.height);

    Opening.context.fillStyle = "#fff";
    Opening.context.fillText(
      "PONG",
      Opening.canvas.width / 2 - 60,
      Opening.canvas.height / 2 - 15
    );
    Opening.context.fillText(
      "PRESS ENTER",
      Opening.canvas.width / 2 - 30 * 4.5,
      (Opening.canvas.height * 2) / 3 - 15
    );
  }

  static loop(timestamp: number): void {
    if (timestamp - Opening.loopTimestamp <= config.secondsPerFrame) {
      requestAnimationFrame(Opening.loop);
      return;
    }
    Opening.loopTimestamp = timestamp;
    Opening.elapsedFrame += 1;
    const moveToGame = Opening.update();
    if (moveToGame === false) {
      Opening.draw();
      requestAnimationFrame(Opening.loop);
    }
  }
}
