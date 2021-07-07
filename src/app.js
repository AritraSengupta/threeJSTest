import { WEBGL } from "../_utils/webgl";

import "./style.css";
import "./coin.css";
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
import "./assets/resources/idle.fbx";
import "./assets/resources/thing.glb";
import "./assets/resources/brick.jpg";
import "./assets/resources/checkered.jpg";

import { CameraControl } from "./CameraControl";

window.onload = async function() {
  if (WEBGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    /* const canvas = document.querySelector("#c");
    if (!canvas) {
      throw new Error("Canvas is not setup properly");
    }
    const space = new ThreeDSpace(canvas);

    space.init();
    await space.loadModel();

    const {
      scene,
      camera,
      renderer,
      mixer,
      neck,
      waist,
      idle,
      possibleAnims
    } = space;

    const animation = new ModelAnimation(scene, camera, renderer, mixer);
    animation.update();

    const { raycast, getMousePos, moveJoint } = animation;
    window.addEventListener("click", e =>
      raycast(e, false, idle, possibleAnims)
    );
    window.addEventListener("touchend", e =>
      raycast(e, true, idle, possibleAnims)
    );

    document.addEventListener("mousemove", function(e) {
      const mousecoords = getMousePos(e);
      if (neck && waist) {
        moveJoint(mousecoords, neck, 50);
        moveJoint(mousecoords, waist, 30);
      }
    }); */
    let APP = null;
    // APP = new BasicWorldDemo();
    // APP = new LoadModelDemo();
    // APP = new CharacterController();
    APP = new CameraControl();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
};
