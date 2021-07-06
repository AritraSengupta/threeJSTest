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
          y: 1,
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

  createTextCanvas(text, parameters = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Prepare the font to be able to measure
    let fontSize = parameters.fontSize || 256;
    ctx.font = `${fontSize}px monospace`;

    const textMetrics = ctx.measureText(text);

    let width = textMetrics.width;
    let height = fontSize;

    // Resize canvas to match text size
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Re-apply font since canvas is resized.
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = parameters.align || "center";
    ctx.textBaseline = parameters.baseline || "middle";

    // Make the canvas transparent for simplicity
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.fillText(text, width / 2, height / 2);

    return canvas;
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

    const geometry = new THREE.CircleGeometry(0.4, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(60, 10, 149);
    circle.rotation.x = Math.PI;
    circle.name = "button1";
    this.scene.add(circle);

    const geometry2 = new THREE.CircleGeometry(0.4, 32);
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const circle2 = new THREE.Mesh(geometry2, material2);
    circle2.position.set(1, 10, 15);
    circle2.rotation.y = Math.PI / 2;
    circle2.name = "button2";
    this.scene.add(circle2);

    const geometry3 = new THREE.CircleGeometry(0.4, 32);
    const material3 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const circle3 = new THREE.Mesh(geometry3, material3);
    circle3.position.set(20, 10, -149);
    circle3.name = "button3";
    this.scene.add(circle3);

    const geometry5 = new THREE.SphereGeometry(1, 16, 16);
    const material5 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere1 = new THREE.Mesh(geometry5, material5);
    sphere1.position.set(20, 8, 15);
    sphere1.name = "education";
    this.scene.add(sphere1);

    this.interactingObjects.push(circle);
    this.interactingObjects.push(circle2);
    this.interactingObjects.push(circle3);
    this.interactingObjects.push(sphere1);

    // const texture = new THREE.Texture(this.createTextCanvas("This is text"));
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
    for (let i = 0; i < this.boundary.length; i += 1) {
      const currentBoundary = this.boundary[i];
      const isInside =
        currentPosition.x >= currentBoundary.start.x &&
        currentPosition.x <= currentBoundary.end.x &&
        currentPosition.y >= currentBoundary.start.y &&
        currentPosition.y <= currentBoundary.end.y &&
        currentPosition.z >= currentBoundary.start.z &&
        currentPosition.z <= currentBoundary.end.z;
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
