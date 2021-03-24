import { WEBGL } from "../_utils/webgl";
import { ThreeDSpace } from "./3dspace";
import { ModelAnimation } from "./animation";
import { BasicWorldDemo } from "./BasicWorldDemo";

import "./style.css";

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
    APP = new BasicWorldDemo();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
};
