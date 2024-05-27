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
import { threeMaze } from "./utils/threeMaze";
import { pixiMaze } from "./utils/pixiMaze";
import { createMaze } from "./utils/createMaze";

(async () => {
  const { scene, camera, group, renderer, animate, controllers } = threeInit();

  const far = 1.6;
  const { mesh, app } = await pixiInit(far * camera.aspect * 2, far * 2);
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
  const nowPos = { x: 0, z: 0 };
  animate(async (t, f) => {
    // let delta = clock.getDelta();
    // controls.update(delta);

    const session = renderer.xr.getSession();
    if (session) {
      const axes0 = session.inputSources[0].gamepad?.axes;
      if (axes0) {
        controllers.rotation.y += axes0[2] * 0.1;
      }
      const axes1 = session.inputSources[1].gamepad?.axes;
      if (axes1) {
        const r = camera.rotation.y + controllers.rotation.y;
        controllers.position.x +=
          axes1[2] * 0.1 * Math.cos(r) + axes1[3] * 0.1 * Math.sin(r);
        controllers.position.z +=
          axes1[3] * 0.1 * Math.cos(r) - axes1[2] * 0.1 * Math.sin(r);

        if (controllers.position.x < -2) controllers.position.x = -2;
        if (controllers.position.z < -2) controllers.position.z = -2;
      }
    }

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
    mesh.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);

    xp.text = controllers.position.x;

    // camera.rotation.x += delta / 5;
  });
})();
