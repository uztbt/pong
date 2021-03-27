import { UserInteraction } from "./UserInteraction";
import { registerKeyInput } from "./keyEventListeners";
import { Opening } from "./Opening";

export const userInput: { [Key in UserInteraction]: boolean } = {
  ArrowUp: false,
  ArrowDown: false,
  Enter: false,
};
window.addEventListener("keydown", registerKeyInput(true));
window.addEventListener("keyup", registerKeyInput(false));
Opening.init();
requestAnimationFrame(Opening.loop);
