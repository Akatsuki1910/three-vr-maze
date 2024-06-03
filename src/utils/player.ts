import { Graphics } from "pixi.js";

export const createPlayer = (isMe: boolean = false) => {
  const p = new Graphics();
  p.moveTo(0, -10);
  p.lineTo(5, 10);
  p.lineTo(-5, 10);
  p.fill(isMe ? 0xe60630 : `#${Math.random().toString(16).slice(-6)}`);
  return p;
};

export const playerMove = (p: Graphics, x: number, y: number, r: number) => {
  p.position.x = x;
  p.position.y = y;
  p.rotation = r;
};
