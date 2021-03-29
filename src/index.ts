import './css/index.css'
import { Opening } from "./Opening";
import { UserControl } from "./UserControl";

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
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
