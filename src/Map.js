export class Map {
  constructor(scene) {
    this.scene = scene;

    this.boundary = [
      {
        start: {
          x: 50,
          y: 1,
          z: 50
        }
      },
      {
        end: {
          x: -50,
          y: -1,
          z: -50
        }
      },
      {
        start: {
          x: -16,
          y: 1,
          z: -16
        },
        end: {
          x: 16,
          y: -1,
          z: 16
        }
      }
    ];
  }

  create() {}

  isBoundaryBreached(currentPosition) {
    let boundaryBreached = false;

    for (let i = 0; i < this.boundary.length; i += 1) {
      const currentBoundary = this.boundary[i];
      if (!currentBoundary.start) {
        currentBoundary.start = { x: -Infinity, y: -Infinity, z: -Infinity };
      }
      if (!currentBoundary.end) {
        currentBoundary.end = { x: Infinity, y: Infinity, z: Infinity };
      }

      const startBreach =
        currentPosition.x > currentBoundary.start.x ||
        currentPosition.y > currentBoundary.start.y ||
        currentPosition.z > currentBoundary.start.z;
      const endBreach =
        currentPosition.x < currentBoundary.end.x ||
        currentPosition.y < currentBoundary.end.y ||
        currentPosition.z < currentBoundary.end.z;
      if (startBreach && endBreach) {
        // Out of bounds
        boundaryBreached = true;
        break;
      }
    }

    return boundaryBreached;
  }
}
