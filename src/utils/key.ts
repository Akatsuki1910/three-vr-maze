const keys = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
] as const satisfies `Key${string}`[];
type KeyMap = (typeof keys)[number];

export const pressKey: Set<(typeof keys)[number]> = new Set();

const isKey = (key: string): key is KeyMap => keys.some((v) => v === key);

window.addEventListener("keydown", (e) => {
  if (isKey(e.code)) {
    pressKey.add(e.code);
  }
});

window.addEventListener("keyup", (e) => {
  if (isKey(e.code)) {
    pressKey.delete(e.code);
  }
});
