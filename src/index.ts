import './css/index.css'
import { Opening } from "./Opening";
import { UserControl } from "./UserControl";

function detectMob() {
  return ( ( window.innerWidth <= 1000 ) && ( window.innerHeight <= 1000 ) );
}

if (detectMob()) {
  const buttons = document.getElementById("control-buttons");
  if (buttons !== null) {
    buttons.hidden = false;
  }
}
UserControl.init();
Opening.init();
requestAnimationFrame(Opening.loop);
