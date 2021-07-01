import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Promise from "promise-polyfill";

const MODEL_PATH =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb";
const MODEL_TEXTURE =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg";
const backgroundColor = 0xf1f1f1;

export class ThreeDSpace {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.possibleAnims = null;
    this.neck = null;
    this.waist = null;
    this.idle = null;
    this.mixer = null;
  }

  init = () => {
    this.initScene();
    this.initRender();
    this.initCamera();
    this.addLights();
    this.addFloor();
    this.addSphere();
  };

  initScene = () => {
    // Init the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);
    this.scene.fog = new THREE.Fog(backgroundColor, 60, 100);
  };

  initRender = () => {
    // Init the renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
  };

  initCamera = () => {
    // Add a camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    this.camera.position.x = 0;
    this.camera.position.y = -3;
  };

  loadModel = async () => {
    const loaderAnim = document.getElementById("js-loader");
    const stacy_txt = new THREE.TextureLoader().load(MODEL_TEXTURE);
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true
    });

    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      return loader.load(
        MODEL_PATH,
        gltf => {
          this.model = gltf.scene; // init model
          let fileAnimations = gltf.animations;
          this.model.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
              o.material = stacy_mtl;
            }
            // Reference the neck and waist bones
            if (o.isBone && o.name === "mixamorigNeck") {
              this.neck = o;
            }
            if (o.isBone && o.name === "mixamorigSpine") {
              this.waist = o;
            }
          });

          this.model.scale.set(7, 7, 7);
          this.model.position.y = -11;

          this.scene.add(this.model);

          loaderAnim.remove(); // Remove JS Animation

          this.mixer = new THREE.AnimationMixer(this.model);

          const clips = fileAnimations.filter(val => val.name !== "idle");
          this.possibleAnims = clips.map(val => {
            // TO be animated on later
            let clip = THREE.AnimationClip.findByName(clips, val.name);

            clip.tracks.splice(3, 3);
            clip.tracks.splice(9, 3);

            clip = this.mixer.clipAction(clip);
            return clip;
          });

          const idleAnim = THREE.AnimationClip.findByName(
            fileAnimations,
            "idle"
          );

          idleAnim.tracks.splice(3, 3);
          idleAnim.tracks.splice(9, 3);

          this.idle = this.mixer.clipAction(idleAnim);
          this.idle.play();
          resolve({ idle: this.idle });
        },
        undefined, // We don't need this function
        function(error) {
          reject(error);
        }
      );
    });
  };

  addLights = () => {
    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    this.scene.add(hemiLight);

    const d = 8.25;
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    this.scene.add(dirLight);
  };

  addFloor = () => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    this.scene.add(floor);
  };

  addSphere = () => {
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x9bffaf }); // 0xf2ce2e
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.z = -15;
    sphere.position.y = -2.5;
    sphere.position.x = -0.25;
    this.scene.add(sphere);
  };
}
