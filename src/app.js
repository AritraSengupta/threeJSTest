import { WEBGL } from "../_utils/webgl";

import "./style.css";
import "./coin.css";
import "./resume.css";
import "./assets/img/rigo-baby.jpg";
import "./assets/resources/negx.jpg";
import "./assets/resources/negy.jpg";
import "./assets/resources/negz.jpg";
import "./assets/resources/posx.jpg";
import "./assets/resources/posy.jpg";
import "./assets/resources/posz.jpg";
import "./assets/resources/aj.fbx";
import "./assets/resources/walk.fbx";
import "./assets/resources/run.fbx";
import "./assets/resources/dance.fbx";
import "./assets/resources/jump.fbx";
import "./assets/resources/idle.fbx";
import "./assets/resources/brick.jpg";
import "./assets/resources/checkered.jpg";

import { CameraControl } from "./CameraControl";

window.onload = async function() {
  if (WEBGL.isWebGLAvailable()) {
    new CameraControl();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
};
