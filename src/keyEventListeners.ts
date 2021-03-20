import { Game } from "./Game";

export const registerKeyInput = (isKeyDown: boolean) => (e:KeyboardEvent) => {
  switch(e.key) {
    case "ArrowUp":
      Game.keysPressed.ArrowUp = isKeyDown;
    case "ArrowDown":
      Game.keysPressed.ArrowDown = isKeyDown;
  }
}
