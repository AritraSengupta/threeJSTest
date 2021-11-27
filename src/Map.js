import * as THREE from "three";

export class Map {
  constructor(scene, interactingObjects) {
    this.scene = scene;
    this.interactingObjects = interactingObjects || [];

    this.boundary = [
      {
        start: {
          x: -145,
          y: -1,
          z: -145
        },
        end: {
          x: 145,
          y: 30,
          z: 145
        },
        type: "outside"
      },
      {
        type: "inside",
        start: {
          x: -147,
          y: -1,
          z: -47
        },
        end: {
          x: 107,
          y: 30,
          z: -17
        }
      },
      {
        type: "inside",
        start: {
          x: 50,
          y: -1,
          z: -20
        },
        end: {
          x: 110,
          y: 30,
          z: 120
        }
      },
      {
        type: "inside",
        start: {
          x: -100,
          y: -1,
          z: -20
        },
        end: {
          x: 0,
          y: 30,
          z: 120
        }
      }
    ];
  }

  addSphereTarget(name, position) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    sphere.name = name;
    this.scene.add(sphere);
    this.interactingObjects.push(sphere);
  }

  create() {
    const brickTexture = new THREE.TextureLoader().load("./brick.jpg");
    brickTexture.wrapS = THREE.RepeatWrapping;
    brickTexture.wrapT = THREE.RepeatWrapping;
    brickTexture.repeat.set(4, 4);

    const checkeredTexture = new THREE.TextureLoader().load("./checkered.jpg");
    checkeredTexture.wrapS = THREE.RepeatWrapping;
    checkeredTexture.wrapT = THREE.RepeatWrapping;
    checkeredTexture.repeat.set(4, 4);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300, 30, 30),
      new THREE.MeshStandardMaterial({
        // color: 0xffffff
        map: checkeredTexture
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

    const divider1 = new THREE.Mesh(
      new THREE.BoxGeometry(260, 30, 30),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    divider1.position.set(-20, 15, -35);
    divider1.castShadow = true;
    divider1.receiveShadow = true;
    this.scene.add(divider1);

    const box1 = new THREE.Mesh(
      new THREE.BoxGeometry(60, 30, 140),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    box1.position.set(80, 15, 50);
    box1.castShadow = true;
    box1.receiveShadow = true;
    this.scene.add(box1);

    const box2 = new THREE.Mesh(
      new THREE.BoxGeometry(100, 30, 140),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    box2.position.set(-50, 15, 50);
    box2.castShadow = true;
    box2.receiveShadow = true;
    this.scene.add(box2);

    const wall1 = new THREE.Mesh(
      new THREE.BoxGeometry(300, 30, 10),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    wall1.position.set(0, 15, -155);
    wall1.castShadow = true;
    wall1.receiveShadow = true;
    this.scene.add(wall1);

    const wall2 = new THREE.Mesh(
      new THREE.BoxGeometry(300, 30, 10),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    wall2.position.set(0, 15, 155);
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    this.scene.add(wall2);

    const wall3 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 30, 300),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    wall3.name = "wall3";
    wall3.position.set(155, 15, 0);
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    this.scene.add(wall3);

    const wall4 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 30, 300),
      new THREE.MeshStandardMaterial({
        // color: 0xd84444
        map: brickTexture
      })
    );
    wall4.position.set(-155, 15, 0);
    wall4.castShadow = true;
    wall4.receiveShadow = true;
    this.scene.add(wall4);

    this.addSphereTarget("education", { x: 20, y: 8, z: 15 });
    this.addSphereTarget("projects", { x: 60, y: 15, z: 130 });

    const texture = new THREE.TextureLoader().load("./negx.jpg");
    const gplaneGeometry = new THREE.PlaneGeometry(20, 10);
    const material4 = new THREE.MeshBasicMaterial({ map: texture });
    const plane1 = new THREE.Mesh(gplaneGeometry, material4);
    plane1.rotation.y = Math.PI / 2;
    plane1.position.set(1, 20, 15);
    this.scene.add(plane1);
  }

  isBoundaryBreached(currentPosition) {
    let boundaryBreached = false;
    const threshold = 2;
    for (let i = 0; i < this.boundary.length; i += 1) {
      const currentBoundary = this.boundary[i];
      const isInside =
        currentPosition.x + threshold >= currentBoundary.start.x &&
        currentPosition.x - threshold <= currentBoundary.end.x &&
        currentPosition.y + threshold >= currentBoundary.start.y &&
        currentPosition.y - threshold <= currentBoundary.end.y &&
        currentPosition.z + threshold >= currentBoundary.start.z &&
        currentPosition.z - threshold <= currentBoundary.end.z;
      if (currentBoundary.type === "outside" && !isInside) {
        boundaryBreached = true;
      }
      if (currentBoundary.type === "inside" && isInside) {
        boundaryBreached = true;
      }
    }

    return boundaryBreached;
  }
}
