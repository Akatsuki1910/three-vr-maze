import * as THREE from "three";
import * as PIXI from "pixi.js";
import { pixiTextInit } from "./utils/pixi/text";

export const pixiInit = async (width: number, height: number) => {
  const app = new PIXI.Application();
  await app.init({
    width,
    height,
    antialias: true,
    resizeTo: window,
    backgroundAlpha: 0,
  });
  app.canvas.style.position = "absolute";
  app.canvas.style.top = "0px";
  app.canvas.style.left = "0px";

  await pixiTextInit();

  // const graphics = new PIXI.Graphics();
  // graphics.moveTo(-200, +200);
  // graphics.lineTo(-200, -200);
  // graphics.lineTo(+200, -200);
  // graphics.lineTo(+200, +200);
  // graphics.fill(0xe60630);

  // app.stage.addChild(graphics);

  const texture = new THREE.CanvasTexture(app.canvas);
  texture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  material.map!.needsUpdate = true;
  material.transparent = true;

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(0, 0, 0);

  const pixiAnimate = (anim: () => Promise<void>) => {
    anim();
    material.map!.needsUpdate = true;
  };

  return { mesh, app, pixiAnimate };
};
