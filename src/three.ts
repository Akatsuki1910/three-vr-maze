import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  HemisphereLight,
  DirectionalLight,
  Group,
  Color,
} from "three";
import { VR } from "./vr";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

export const threeInit = () => {
  const scene = new Scene();
  scene.background = new Color(0x7fbfff);

  const camera = new PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 0);
  // camera.rotation.set(-Math.PI / 2, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const floorGeometry = new PlaneGeometry(4, 4);
  const floorMaterial = new MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0,
  });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  // scene.add(floor);

  scene.add(new HemisphereLight(0x808080, 0x606060));

  const light = new DirectionalLight(0xffffff);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.mapSize.set(4096, 4096);
  scene.add(light);

  const group = new Group();
  scene.add(group);

  const controllers = new Group();
  controllers.add(camera);
  scene.add(controllers);

  const vr = new VR(scene, renderer, group, controllers);

  document.body.appendChild(VRButton.createButton(renderer));

  const threeAnimate = (
    anim: (...props: Parameters<XRFrameRequestCallback>) => Promise<void>
  ) => {
    const loopAnimation: XRFrameRequestCallback = (t, f) => {
      vr.animate();
      anim(t, f);
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(loopAnimation);
  };

  return { scene, camera, group, renderer, threeAnimate, controllers };
};
