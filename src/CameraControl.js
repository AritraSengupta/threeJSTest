import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { CharacterFSM } from "./StateMachines";
import { ThirdPersonCamera } from "./ThirdPersonCamera";
import { Map } from "./Map";

class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
}

class BasicCharacterController {
  constructor(params) {
    this.init(params);
  }

  init(params) {
    this.params = params;
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();

    this.animations = {};
    this.input = new BasicCharacterControllerInput();
    this.stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this.animations)
    );

    this.loadModels();
  }

  loadModels() {
    const loader = new FBXLoader();
    loader.load("aj.fbx", fbx => {
      fbx.scale.setScalar(0.05);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.set(-50, 0, -50);

      this.target = fbx;
      this.params.scene.add(this.target);

      this.mixer = new THREE.AnimationMixer(this.target);

      this.manager = new THREE.LoadingManager();
      this.manager.onLoad = () => {
        this.stateMachine.setState("idle");
      };

      const onLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this.mixer.clipAction(clip);

        this.animations[animName] = {
          clip,
          action
        };
      };

      const loader = new FBXLoader(this.manager);
      loader.load("walk.fbx", a => onLoad("walk", a));
      loader.load("run.fbx", a => onLoad("run", a));
      loader.load("idle.fbx", a => onLoad("idle", a));
      loader.load("dance.fbx", a => onLoad("dance", a));
    });
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
    // console.log("position", this._position);
    if (!this.target) {
      return;
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

    if (this.input.keys.forward) {
      this.velocity.z += acc.z * timeInSeconds;
    }
    if (this.input.keys.backward) {
      this.velocity.z -= acc.z * timeInSeconds;
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

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(this.velocity.x * timeInSeconds);
    forward.multiplyScalar(this.velocity.z * timeInSeconds);

    const simulatedNewPosition = new THREE.Vector3();
    simulatedNewPosition.copy(oldPosition);
    simulatedNewPosition.add(forward);
    simulatedNewPosition.add(sideways);

    this.params.map.isBoundaryBreached(simulatedNewPosition) &&
      console.log(
        this.params.map.isBoundaryBreached(simulatedNewPosition),
        simulatedNewPosition
      );

    if (!this.params.map.isBoundaryBreached(simulatedNewPosition)) {
      controlObject.position.copy(simulatedNewPosition);
      this._position.copy(simulatedNewPosition);
    }

    if (this.mixer) {
      this.mixer.update(timeInSeconds);
    }
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
      shift: false
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
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
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
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
  }
}

export class CameraControl {
  constructor() {
    this._initialize();
  }

  _initialize() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => this._onWindowResize(), false);

    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 10, 0);

    this.scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.01;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1.0;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = -200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;
    this.scene.add(light);

    light = new THREE.AmbientLight(0x404040);
    this.scene.add(light);

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./posx.jpg",
      "./negx.jpg",
      "./posy.jpg",
      "./negy.jpg",
      "./posz.jpg",
      "./negz.jpg"
    ]);
    texture.encoding = THREE.sRGBEncoding;
    this.scene.background = texture;

    this.map = new Map();

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(30, 30, 30),
      new THREE.MeshStandardMaterial({
        color: 0xd84444
      })
    );
    box.position.set(0, 15, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    this.scene.add(box);

    this.scene.add(plane);

    this.mixers = [];
    this.previousRaf = null;

    this._loadAnimatedModel();

    this._raf();
  }

  _loadAnimatedModel() {
    const params = {
      camera: this.camera,
      scene: this.scene,
      map: this.map
    };

    this.controls = new BasicCharacterController(params);
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.controls
    });
  }

  _loadStaticModel() {
    const loader = new GLTFLoader();
    loader.load("thing.glb", gltf => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });
      this.scene.add(gltf.scene);
    });
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _raf() {
    window.requestAnimationFrame(t => {
      if (this.previousRaf === null) {
        this.previousRaf = t;
      }
      this._raf();
      this.renderer.render(this.scene, this.camera);
      this._step(t - this.previousRaf);
      this.previousRaf = t;
    });
  }

  _step(timeElapsed) {
    const timeElapsedInSeconds = timeElapsed * 0.001;

    if (this.mixers) {
      this.mixers.map(m => m.update(timeElapsedInSeconds));
    }

    if (this.controls) {
      this.controls.update(timeElapsedInSeconds);
    }

    this.thirdPersonCamera.update(timeElapsedInSeconds);
  }
}
