import { keysPressed } from ".";
import { Game } from "./Game";

export class Opening {
    private static canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    private static context = Opening.canvas.getContext("2d") as CanvasRenderingContext2D;

    static init() {
        Opening.context.font = "30px Orbitron";
    }

    private static update():boolean {
        if (keysPressed.Enter) {
            Game.init();
            requestAnimationFrame(Game.gameLoop);
            return true;
        }
        return false;
    }

    private static draw() {
        // Fill the background in Black
        Opening.context.fillStyle = "#000";
        Opening.context.fillRect(0, 0, Opening.canvas.width, Opening.canvas.height);

        Opening.context.fillStyle = "#fff"
        Opening.context.fillText(
            "PONG",
            Opening.canvas.width/2-60,
            Opening.canvas.height/2-15);
        Opening.context.fillText(
            "PRESS ENTER",
            Opening.canvas.width/2-30*4.5,
            Opening.canvas.height*2/3-15);
    }

    static openingLoop() {
        const moveToGame = Opening.update();
        if (moveToGame === false) {
            Opening.draw();
            requestAnimationFrame(Opening.openingLoop);
        }
    }
}