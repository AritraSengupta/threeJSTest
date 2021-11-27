import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { CharacterFSM } from "./StateMachines";
import { DOMManipulation } from "./DOMManipulation";
import data from "./data";

class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
}
class BasicCharacterControllerInput {
  constructor() {
    this.init();
  }

  init() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      interact: false,
      esc: false
    };
    document.addEventListener("keydown", e => this.onKeyDown(e), false);
    document.addEventListener("keyup", e => this.onKeyUp(e), false);
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 69: //e
        this.keys.interact = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
      case 27: //ESC
        this.keys.esc = true;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 69: //e
        this.keys.interact = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
      case 27: //ESC
        this.keys.esc = false;
    }
  }
}

export class BasicCharacterController {
  constructor(params) {
    this.init(params);
  }

  init(params) {
    this.params = params;
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.interactingObjects = params.interactingObjects;
    this.animations = {};
    this.input = new BasicCharacterControllerInput();
    this.stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this.animations)
    );
    this.domManipulation = new DOMManipulation();
    this.currentData = {};
    this.loadModels();
    this.timer = {
      start: false,
      duration: 0
    };
  }

  loadModels() {
    this.params.loaderStatus.addId("aj.fbx");
    const loader = new FBXLoader();
    loader.load("aj.fbx", fbx => {
      fbx.scale.setScalar(0.05);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.set(10, 0, 0);

      this.target = fbx;
      this.params.scene.add(this.target);

      this.mixer = new THREE.AnimationMixer(this.target);

      this.manager = new THREE.LoadingManager();
      this.manager.onLoad = () => {
        this.params.loaderStatus.removeId("aj.fbx");
        this.stateMachine.setState("idle");
      };

      const onLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this.mixer.clipAction(clip);

        this.params.loaderStatus.removeId(animName);
        this.animations[animName] = {
          clip,
          action
        };
      };

      this.params.loaderStatus.addIds(["run", "walk", "idle", "dance", "jump"]);
      const loader = new FBXLoader(this.manager);
      loader.load("walk.fbx", a => onLoad("walk", a));
      loader.load("run.fbx", a => onLoad("run", a));
      loader.load("idle.fbx", a => onLoad("idle", a));
      loader.load("dance.fbx", a => onLoad("dance", a));
      loader.load("jump.fbx", a => onLoad("jump", a));
    });
  }

  get isGround() {
    // currently its a flat ground
    // can be made more complicated
    // and a function of x and z
    return this._position.y === 0;
  }

  get position() {
    return this._position;
  }

  get rotation() {
    if (!this.target) {
      return new THREE.Quaternion();
    }

    return this.target.quaternion;
  }

  update(timeInSeconds) {
    if (!this.target) {
      return;
    }

    if (this.domManipulation.gameOver) {
      return;
    }

    if (this.domManipulation.currentScore === this.domManipulation.totalScore) {
      // Game Over;
      // show game over
      // show resume
      // set gamover true
      this.domManipulation.animateAchievement(`You've Won`, () => {
        this.domManipulation.showResume();
        this.domManipulation.gameOver = true;
      });
    }

    if (this.timer.start) {
      this.timer.duration += timeInSeconds;
      this.domManipulation.updateTimer(this.timer.duration);
    }

    if (this.params.loaderStatus.loadingArray.length === 0) {
      // All loading complete
      this.domManipulation.removeLoader();
      this.timer.start = true;
    }

    this.stateMachine.update(timeInSeconds, this.input);

    const frameDeccelaration = new THREE.Vector3(
      this.velocity.x * this.decceleration.x,
      this.velocity.y * this.decceleration.y,
      this.velocity.z * this.decceleration.z
    );

    frameDeccelaration.multiplyScalar(timeInSeconds);
    frameDeccelaration.z =
      Math.sign(frameDeccelaration.z) *
      Math.min(Math.abs(frameDeccelaration.z), Math.abs(this.velocity.z));

    this.velocity.add(frameDeccelaration);

    const controlObject = this.target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this.acceleration.clone();
    if (this.input.keys.shift) {
      acc.multiplyScalar(2.0);
    }

    if (
      this.stateMachine.currentState &&
      this.stateMachine.currentState.name === "dance"
    ) {
      acc.multiplyScalar(0.0);
    }

    let colorCount = [];
    let objectIndex = 0;
    const initVelocity = 30;
    const accFactor = 300;
    for (const object of this.interactingObjects) {
      var geometry = object.geometry;
      !geometry.boundingBox && geometry.computeBoundingBox();
      const box = new THREE.Box3();
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld);
      box.getCenter(center);
      box.getSize(size);
      const factor = 3;
      const isInRangePlayer =
        Math.abs(this._position.x - center.x) < (size.x * factor) / 2 &&
        Math.abs(this._position.z - center.z) < (size.z * factor) / 2 &&
        Math.abs(this._position.y - center.y) < 15;

      if (isInRangePlayer) {
        object.material.color.setHex(0x55ff63);
        const resumeData = data.resume[object.name];
        this.domManipulation.collections[object.name] = resumeData;
        this.domManipulation.animateCoin(resumeData.points, () => {
          this.domManipulation.updateScore();
          this.domManipulation.animateAchievement(`
            You gained:
            ${resumeData.title}
          `);
        });
        colorCount.push(object);
        this.params.scene.remove(object);
        // Probably not a good idea to manipulate the object on which we are iterating
        this.interactingObjects.splice(objectIndex, 1);
      } else {
        object.material.color.setHex(0xffff00);
      }
      objectIndex += 1;
    }

    if (this.input.keys.esc) {
      this.domManipulation.resetScreen();
    }

    if (this.input.keys.forward) {
      this.velocity.z += acc.z * timeInSeconds;
    }
    if (this.input.keys.backward) {
      this.velocity.z -= acc.z * timeInSeconds;
    }
    if (this.input.keys.space && this.isGround) {
      this.velocity.y = initVelocity;
      if (this.input.keys.shift) {
        this.velocity.y *= 1.5;
      }
    }
    if (this.input.keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this.acceleration.y);
      _R.multiply(_Q);
    }
    if (this.input.keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this.acceleration.y);
      _R.multiply(_Q);
    }

    if (!this.isGround) {
      this.velocity.y -= acc.y * accFactor * timeInSeconds;
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    const upwards = new THREE.Vector3(0, 1, 0);
    upwards.applyQuaternion(controlObject.quaternion);
    upwards.normalize();

    sideways.multiplyScalar(this.velocity.x * timeInSeconds);
    forward.multiplyScalar(this.velocity.z * timeInSeconds);
    upwards.multiplyScalar(this.velocity.y * timeInSeconds);

    const simulatedNewPosition = new THREE.Vector3();
    simulatedNewPosition.copy(oldPosition);
    simulatedNewPosition.add(forward);
    simulatedNewPosition.add(sideways);
    simulatedNewPosition.add(upwards);

    if (simulatedNewPosition.y < 0) {
      simulatedNewPosition.y = 0;
      this.velocity.y = 0;
    }

    if (!this.params.map.isBoundaryBreached(simulatedNewPosition)) {
      controlObject.position.copy(simulatedNewPosition);
      this._position.copy(simulatedNewPosition);
    }

    if (this.mixer) {
      this.mixer.update(timeInSeconds);
    }
  }
}
