import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Map } from "./Map";

export class BasicWorldDemo {
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
    this.camera.position.set(0, 500, 0);

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

    light = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(light);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.listenToKeyEvents(window);
    controls.update();

    // const plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(100, 100, 10, 10),
    //   new THREE.MeshStandardMaterial({
    //     color: 0xffffff
    //   })
    // );
    // plane.castShadow = false;
    // plane.receiveShadow = true;
    // plane.rotation.x = -Math.PI / 2;

    // this.scene.add(plane);

    const map = new Map(this.scene);
    map.create();

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

    this._raf();
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _raf() {
    window.requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera);
      this._raf();
    });
  }
}
