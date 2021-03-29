import './css/index.css'
import { Opening } from "./Opening";
import { UserControl } from "./UserControl";

function detectMob() {
  return ( ( window.innerWidth <= 1000 ) && ( window.innerHeight <= 1000 ) );
}
console.info(innerWidth, innerHeight)
if (detectMob()) {
  const buttons = document.getElementById("control-buttons");
  console.log("detected as mobile")
  if (buttons !== null) {
    console.log("not null, so showing!")
    buttons.style.display = "flex";
    buttons.hidden = false;
  }
}
UserControl.init();
Opening.init();
requestAnimationFrame(Opening.loop);
