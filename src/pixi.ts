import {
  CanvasTexture,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  Vector3,
  Euler,
} from "three";
import { pixiTextInit } from "./utils/pixi/text";
import { Application, Graphics } from "pixi.js";

export const pixiInit = async (width: number, height: number) => {
  const app = new Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    // resizeTo: window,
    backgroundAlpha: 0,
  });
  app.canvas.style.position = "absolute";
  app.canvas.style.top = "0px";
  app.canvas.style.left = "0px";

  await pixiTextInit();

  const texture = new CanvasTexture(app.canvas);

  const material = new MeshBasicMaterial({
    map: texture,
    // color: 0xffffff,
    transparent: true,
  });

  const mesh = new Mesh(new PlaneGeometry(width, height), material);
  mesh.position.set(0, 0, 0);
  mesh.material.depthTest = false;
  mesh.renderOrder = 1;

  const bg = new Graphics();
  bg.rect(0, 0, 450, 450 + 30 * 2 + 5);
  bg.fill(0x000000);
  bg.alpha = 0.5;
  app.stage.addChild(bg);

  const pixiAnimate = (anim: () => Promise<void>) => {
    anim();
    material.map!.needsUpdate = true;
  };

  const pixiUpdatePosition = (pos: Vector3, rot: Euler) => {
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.rotation.set(rot.x, rot.y, rot.z, "YXZ");
  };

  return { mesh, app, pixiAnimate, pixiUpdatePosition };
};
