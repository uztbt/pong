import { keysPressed } from ".";

export const registerKeyInput = (isKeyDown: boolean) => (e:KeyboardEvent) => {
  switch(e.key) {
    case "ArrowUp":
      keysPressed.ArrowUp = isKeyDown;
    case "ArrowDown":
      keysPressed.ArrowDown = isKeyDown;
    case "Enter":
      keysPressed.Enter = isKeyDown;
  }
}
