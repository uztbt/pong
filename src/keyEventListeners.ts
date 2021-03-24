import { userInput } from ".";

export const registerKeyInput = (isKeyDown: boolean) => (e:KeyboardEvent) => {
  switch(e.key) {
    case "ArrowUp":
      userInput.ArrowUp = isKeyDown;
      break;
    case "ArrowDown":
      userInput.ArrowDown = isKeyDown;
      break;
    case "Enter":
      userInput.Enter = isKeyDown;
      break;
  }
}
