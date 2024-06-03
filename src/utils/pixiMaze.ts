import { Graphics } from "pixi.js";

export let CELL_SIZE = 50;

const createWall = (
  i: number,
  j: number,
  dir: "top" | "left" | "bottom" | "right",
  g: Graphics
) => {
  const x = j * CELL_SIZE;
  const y = i * CELL_SIZE;

  switch (dir) {
    case "top":
      g.moveTo(x, y).lineTo(x + CELL_SIZE, y);
      break;
    case "left":
      g.moveTo(x, y).lineTo(x, y + CELL_SIZE);
      break;
    case "bottom":
      g.moveTo(x, y + CELL_SIZE).lineTo(x + CELL_SIZE, y + CELL_SIZE);
      break;
    case "right":
      g.moveTo(x + CELL_SIZE, y).lineTo(x + CELL_SIZE, y + CELL_SIZE);
      break;
  }
};

export const pixiMaze = (wallMaze: number[][]) => {
  const g = new Graphics();
  CELL_SIZE = 450 / wallMaze.length;

  for (let i = 0; i < wallMaze.length; i++) {
    for (let j = 0; j < wallMaze[i].length; j++) {
      if (wallMaze[i][j] === 1) {
        createWall(i, j, "bottom", g);
      }

      if (wallMaze[i][j] === 2) {
        createWall(i, j, "right", g);
      }

      if (wallMaze[i][j] === 3) {
        createWall(i, j, "bottom", g);
        createWall(i, j, "right", g);
      }

      if (j === 0) createWall(i, j, "left", g);
      if (i === 0) createWall(i, j, "top", g);
      if (j === wallMaze[i].length - 1) createWall(i, j, "right", g);
      if (i === wallMaze.length - 1) createWall(i, j, "bottom", g);
    }
  }

  g.stroke({ width: 2, color: 0xffffff });

  return g;
};
