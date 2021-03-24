import * as THREE from "three";

export class ModelAnimation {
  constructor(scene, camera, renderer, mixer) {
    this.raycaster = new THREE.Raycaster();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mixer = mixer;
    this.clock = new THREE.Clock();
    this.currentlyAnimating = false;
  }

  update = () => {
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update);
  };

  playOnClick(idle, possibleAnims) {
    const anim = Math.floor(Math.random() * possibleAnims.length) + 0;
    this.playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
  }

  playModifierAnimation(from, fSpeed, to, tSpeed) {
    to.setLoop(THREE.LoopOnce);
    to.reset();
    to.play();
    from.crossFadeTo(to, fSpeed, true);
    setTimeout(() => {
      from.enabled = true;
      to.crossFadeTo(from, tSpeed, true);
      this.currentlyAnimating = false;
    }, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
  }

  getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  moveJoint = (mouse, joint, degreeLimit) => {
    const degrees = this.getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    joint.rotation.y = THREE.Math.degToRad(degrees.x);
    joint.rotation.x = THREE.Math.degToRad(degrees.y);
  };

  getMouseDegrees = (x, y, degreeLimit) => {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

    let w = { x: window.innerWidth, y: window.innerHeight };

    // Left (Rotates neck left between 0 and -degreeLimit)
    // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
      // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x;
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100;
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }

    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      // Note that I cut degreeLimit in half when she looks up
      dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
    }
    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  };

  raycast = (e, touch = false, idle, possibleAnims) => {
    const mouse = {};
    if (touch) {
      mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    } else {
      mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    }
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects[0]) {
      const object = intersects[0].object;

      if (object.name === "stacy") {
        if (!this.currentlyAnimating) {
          this.currentlyAnimating = true;
          this.playOnClick(idle, possibleAnims);
        }
      }
    }
  };

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvasPixelWidth = canvas.width / window.devicePixelRatio;
    const canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
    return needResize;
  }
}
