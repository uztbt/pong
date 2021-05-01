import './css/index.css'
import { Opening } from "./Opening";
import { UserControl } from "./UserControl";

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  const slider = document.getElementById("sliderContainer");
  console.log("detected as mobile")
  if (slider !== null) {
    console.log("not null, so showing!")
    slider.style.display = "flex";
    slider.hidden = false;
  }
}
UserControl.init();
Opening.init();
requestAnimationFrame(Opening.loop);
