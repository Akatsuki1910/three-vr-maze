import {
  BoxGeometry,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  WebGLRenderer,
  WebXRManager,
} from "three";

class XRPlanes extends Object3D {
  currentPlanes: Map<XRPlane, Mesh>;
  xr: WebXRManager;
  constructor(renderer: WebGLRenderer) {
    super();

    this.currentPlanes = new Map();
    this.xr = renderer.xr;
  }

  update(f: XRFrame) {
    if (!f) return;
    const planes = f.detectedPlanes || new Set();

    const referenceSpace = this.xr.getReferenceSpace();

    if (!referenceSpace) return;

    for (const [plane, mesh] of this.currentPlanes) {
      if (planes.has(plane) === false) {
        mesh.geometry.dispose();
        (mesh.material as Material).dispose();
        this.remove(mesh);

        this.currentPlanes.delete(plane);
      }
    }

    for (const plane of planes) {
      if (this.currentPlanes.has(plane) === false) {
        const pose = f.getPose(plane.planeSpace, referenceSpace);
        if (!pose) continue;
        this.matrix.fromArray(pose.transform.matrix);

        const polygon = plane.polygon;

        let minX = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let minZ = Number.MAX_SAFE_INTEGER;
        let maxZ = Number.MIN_SAFE_INTEGER;

        for (const point of polygon) {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minZ = Math.min(minZ, point.z);
          maxZ = Math.max(maxZ, point.z);
        }

        const width = maxX - minX;
        const height = maxZ - minZ;

        const geometry = new BoxGeometry(width, 0.01, height);
        const material = new MeshBasicMaterial({
          color: 0xffffff * Math.random(),
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.setFromMatrixPosition(this.matrix);
        mesh.quaternion.setFromRotationMatrix(this.matrix);
        this.add(mesh);

        this.currentPlanes.set(plane, mesh);
      }
    }
  }
}

export { XRPlanes };
