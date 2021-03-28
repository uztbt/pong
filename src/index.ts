import { Opening } from "./Opening";
import { UserControl } from "./UserControl";

UserControl.init();
Opening.init();
requestAnimationFrame(Opening.loop);
