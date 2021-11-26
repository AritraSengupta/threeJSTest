import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ThirdPersonCamera } from "./ThirdPersonCamera";
import { Map } from "./Map";
import { LoaderStatus } from "./LoaderStatus";

import { BasicCharacterController } from "./CharacterController";

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
    light.position.set(10, 100, 10);
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

    light = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(light);

    const loader = new THREE.CubeTextureLoader();
    this.loaderStatus = new LoaderStatus();

    this.loaderStatus.addId("backgrounds");
    const texture = loader.load(
      [
        "./posx.jpg",
        "./negx.jpg",
        "./posy.jpg",
        "./negy.jpg",
        "./posz.jpg",
        "./negz.jpg"
      ],
      () => this.loaderStatus.removeId("backgrounds")
    );
    texture.encoding = THREE.sRGBEncoding;
    this.scene.background = texture;
    this.interactingObjects = [];
    this.map = new Map(this.scene, this.interactingObjects);
    this.map.create();

    this.mixers = [];
    this.previousRaf = null;

    this._loadAnimatedModel();

    this._raf();
  }

  _loadAnimatedModel() {
    const params = {
      camera: this.camera,
      scene: this.scene,
      map: this.map,
      interactingObjects: this.interactingObjects,
      loaderStatus: this.loaderStatus
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
