import { Game } from "./Game";
import { InterceptKeys } from "./InterceptKeys";
import { registerKeyInput } from "./keyEventListeners";
import { Opening } from "./Opening";

export const keysPressed: {[Key in InterceptKeys]: boolean} = {ArrowUp: false, ArrowDown: false, Enter: false};
window.addEventListener("keydown", registerKeyInput(true))
window.addEventListener("keyup", registerKeyInput(false))
Opening.init();
requestAnimationFrame(Opening.openingLoop);