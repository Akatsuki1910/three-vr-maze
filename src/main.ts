// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  MeshStandardMaterial,
  Mesh,
  ConeGeometry,
  Vector3,
  Clock,
  AxesHelper,
  Euler,
  Quaternion,
} from "three";
import { pixiInit } from "./pixi";
import { threeInit } from "./three";
import { pixiText } from "./utils/pixi/text";
import { PLANE_SIZE, threeMaze } from "./utils/threeMaze";
import { CELL_SIZE, pixiMaze } from "./utils/pixiMaze";
import { createMaze } from "./utils/createMaze";
import { Graphics, Triangle } from "pixi.js";

(async () => {
  const { scene, camera, group, renderer, threeAnimate, controllers } =
    threeInit();

  const far = 1.6;
  const { mesh, app, pixiAnimate } = await pixiInit(
    far * camera.aspect * 2,
    far * 2
  );
  scene.add(mesh);

  // const controls = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  const material = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.0,
  });
  const object = new Mesh(new ConeGeometry(0.2, 0.2, 32), material);
  object.castShadow = true;
  object.receiveShadow = true;
  group.add(object);

  const p = new Graphics();
  p.moveTo(0, -10);
  p.lineTo(5, 10);
  p.lineTo(-5, 10);
  p.fill(0xe60630);
  app.stage.addChild(p);

  const xp = pixiText("0");
  app.stage.addChild(xp);
  const zp = pixiText("0");
  zp.position.y = 30;
  app.stage.addChild(zp);

  const size = 11;
  const { wallMaze } = createMaze(size, size);
  group.add(threeMaze(wallMaze));
  app.stage.addChild(pixiMaze(wallMaze));

  const clock = new Clock();
  threeAnimate(async (t, f) => {
    pixiAnimate(async () => {
      // let delta = clock.getDelta();
      // controls.update(delta);

      const session = renderer.xr.getSession();
      if (session) {
        const axes0 = session.inputSources[0].gamepad?.axes;
        if (axes0) {
          controllers.rotation.y -= axes0[2] * 0.1;
        }
        const axes1 = session.inputSources[1].gamepad?.axes;
        if (axes1) {
          const r = camera.rotation.y + controllers.rotation.y;
          controllers.position.x +=
            axes1[2] * 0.1 * Math.cos(r) + axes1[3] * 0.1 * Math.sin(r);
          controllers.position.z +=
            axes1[3] * 0.1 * Math.cos(r) - axes1[2] * 0.1 * Math.sin(r);
        }
      }

      controllers.position.x = Math.max(
        -PLANE_SIZE / 2,
        Math.min(
          ((size + 1) / 2) * PLANE_SIZE - PLANE_SIZE / 2,
          controllers.position.x
        )
      );
      controllers.position.z = Math.max(
        -PLANE_SIZE / 2,
        Math.min(
          ((size + 1) / 2) * PLANE_SIZE - PLANE_SIZE / 2,
          controllers.position.z
        )
      );

      camera.rotateOnWorldAxis(new Vector3(0, 1, 0), controllers.rotation.y);

      const setFar = new Vector3(
        camera.position.x + controllers.position.x,
        camera.position.y + controllers.position.y,
        camera.position.z + controllers.position.z
      ).addScaledVector(
        new Vector3(0, 0, -1).applyEuler(
          new Euler(camera.rotation.x, camera.rotation.y, camera.rotation.z)
        ),
        far
      );

      mesh.position.set(setFar.x, setFar.y, setFar.z);
      mesh.rotation.set(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z
      );

      p.position.set(
        ((controllers.position.x + PLANE_SIZE / 2) / PLANE_SIZE) * CELL_SIZE,
        ((controllers.position.z + PLANE_SIZE / 2) / PLANE_SIZE) * CELL_SIZE
      );
      p.rotation = -camera.rotation.reorder("YXZ").y;

      xp.text = controllers.position.x.toFixed(2);
      zp.text = controllers.position.z.toFixed(2);
    });
  });
})();
