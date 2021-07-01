import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

class BasicCharacterControls {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._move = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    document.addEventListener("keydown", e => this._onKeyDown(e), false);
    document.addEventListener("keyup", e => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._move.forward = true;
        break;
      case 65: // a
        this._move.left = true;
        break;
      case 83: // s
        this._move.backward = true;
        break;
      case 68: // d
        this._move.right = true;
        break;
      case 38: // up
      case 37: // left
      case 40: // down
      case 39: // right
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.keyCode) {
      case 87: // w
        this._move.forward = false;
        break;
      case 65: // a
        this._move.left = false;
        break;
      case 83: // s
        this._move.backward = false;
        break;
      case 68: // d
        this._move.right = false;
        break;
      case 38: // up
      case 37: // left
      case 40: // down
      case 39: // right
        break;
    }
  }

  Update(timeInSeconds) {
    const frameDeccelaration = new THREE.Vector3(
      this._velocity.x * this._decceleration.x,
      this._velocity.y * this._decceleration.y,
      this._velocity.z * this._decceleration.z
    );

    frameDeccelaration.multiplyScalar(timeInSeconds);
    frameDeccelaration.z =
      Math.sign(frameDeccelaration.z) *
      Math.min(Math.abs(frameDeccelaration.z), Math.abs(this._velocity.z));

    this._velocity.add(frameDeccelaration);

    const controlObject = this._params.target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    if (this._move.forward) {
      this._velocity.z += this._acceleration.z * timeInSeconds;
    }
    if (this._move.backward) {
      this._velocity.z -= this._acceleration.z * timeInSeconds;
    }
    if (this._move.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._move.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
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

    sideways.multiplyScalar(this._velocity.x * timeInSeconds);
    forward.multiplyScalar(this._velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);
  }
}

export class LoadModelDemo {
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

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.listenToKeyEvents(window);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./posx.jpg",
      "./negx.jpg",
      "./posy.jpg",
      "./negy.jpg",
      "./posz.jpg",
      "./negz.jpg"
    ]);
    this.scene.background = texture;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    this.scene.add(plane);

    this.mixers = [];
    this.previousRaf = null;

    this._loadAnimatedModel();

    this._raf();
  }

  _loadAnimatedModel() {
    const loader = new FBXLoader();
    loader.load("aj.fbx", fbx => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this.camera
      };

      this.controls = new BasicCharacterControls(params);

      const anim = new FBXLoader();
      anim.load("walk.fbx", a => {
        const m = new THREE.AnimationMixer(fbx);
        this.mixers.push(m);
        const idle = m.clipAction(a.animations[0]);
        idle.play();
      });
      this.scene.add(fbx);
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
      this.controls.Update(timeElapsedInSeconds);
    }
  }
}
