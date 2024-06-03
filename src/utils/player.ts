import { group } from "console";
import { Graphics } from "pixi.js";
import { ConeGeometry, MeshBasicMaterial, Mesh, Group } from "three";

export const createPlayer = (isMe: boolean = false) => {
  const color = isMe ? 0xe60630 : `#${Math.random().toString(16).slice(-6)}`;

  const p = new Graphics();
  p.moveTo(0, -10);
  p.lineTo(5, 10);
  p.lineTo(-5, 10);
  p.fill(color);

  const geometry = new ConeGeometry(0.5, 1, 6);
  const material = new MeshBasicMaterial({ color: color });
  const cone = new Mesh(geometry, material);
  cone.rotation.x = -Math.PI / 2;
  cone.position.y = 1.6;
  const group = new Group();
  group.add(cone);

  return { pixiPlayer: p, threePlayer: group };
};

export const playerMove = (p: Graphics, x: number, y: number, r: number) => {
  p.position.x = x;
  p.position.y = y;
  p.rotation = r;
};
