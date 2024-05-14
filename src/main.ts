// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshStandardMaterial, Mesh, ConeGeometry, Vector3 } from "three";
import { pixiInit } from "./pixi";
import { threeInit } from "./three";
import { XRPlanes } from "./utils/XRPlanes";
import { pixiText } from "./utils/pixi/text";

(async () => {
  const { scene, camera, group, renderer, animate } = threeInit();

  const far = 1.6;
  const { mesh, app } = await pixiInit(far * camera.aspect * 2, far * 2);
  scene.add(mesh);

  // const controls = new OrbitControls(camera, renderer.domElement);

  const material = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.0,
  });
  const object = new Mesh(new ConeGeometry(0.2, 0.2, 32), material);
  object.castShadow = true;
  object.receiveShadow = true;
  group.add(object);

  const planes = new XRPlanes(renderer);
  scene.add(planes);

  // const clock = new Clock();
  const te = pixiText("0");
  app.stage.addChild(te);

  animate(async (t, f) => {
    // let delta = clock.getDelta();
    // controls.update(delta);

    const setFar = new Vector3(
      camera.position.x,
      camera.position.y,
      camera.position.z
    ).addScaledVector(new Vector3(0, 0, -1).applyEuler(camera.rotation), far);
    mesh.position.set(setFar.x, setFar.y, setFar.z);
    mesh.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);

    // planes.update(f);
    te.text = t;

    // camera.rotation.x += delta / 5;
  });
})();
