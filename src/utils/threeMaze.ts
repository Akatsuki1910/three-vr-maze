import {
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  Group,
} from "three";

const PLANE_SIZE = 4;

const geometry = new PlaneGeometry(PLANE_SIZE, PLANE_SIZE);

const materialFloor = new MeshBasicMaterial({
  color: 0xffff00,
  side: DoubleSide,
  wireframe: true,
});

const materialWall = new MeshBasicMaterial({
  color: 0x00ff00,
  side: DoubleSide,
  wireframe: true,
});

const materialWall1 = new MeshBasicMaterial({
  color: 0xff0000,
  side: DoubleSide,
  wireframe: true,
});

const materialWall2 = new MeshBasicMaterial({
  color: 0x0000ff,
  side: DoubleSide,
  wireframe: true,
});

const createWall = (
  i: number,
  j: number,
  dir: "top" | "left" | "bottom" | "right",
  material: MeshBasicMaterial = materialWall
) => {
  const wall = new Mesh(geometry, material);
  const x = j * PLANE_SIZE;
  const y = i * PLANE_SIZE;
  const gap = PLANE_SIZE / 2;

  switch (dir) {
    case "top":
      wall.position.set(x, gap, y - gap);
      break;
    case "left":
      wall.position.set(x - gap, gap, y);
      wall.rotation.y = Math.PI / 2;
      break;
    case "bottom":
      wall.position.set(x, gap, y + gap);
      break;
    case "right":
      wall.position.set(x + gap, gap, y);
      wall.rotation.y = Math.PI / 2;
      break;
  }
  return wall;
};

const createWallBottom = (i: number, j: number) =>
  createWall(i, j, "bottom", materialWall1);

const createWallRight = (i: number, j: number) =>
  createWall(i, j, "right", materialWall2);

export const threeMaze = (wallMaze: number[][]) => {
  const g = new Group();

  for (let i = 0; i < wallMaze.length; i++) {
    for (let j = 0; j < wallMaze[i].length; j++) {
      const plane = new Mesh(geometry, materialFloor);
      plane.position.set(i * PLANE_SIZE, 0, j * PLANE_SIZE);
      plane.rotation.x = -Math.PI / 2;
      g.add(plane);

      if (wallMaze[i][j] === 1) {
        g.add(createWallBottom(i, j));
      }

      if (wallMaze[i][j] === 2) {
        g.add(createWallRight(i, j));
      }

      if (wallMaze[i][j] === 3) {
        g.add(createWallBottom(i, j));
        g.add(createWallRight(i, j));
      }

      if (j === 0) g.add(createWall(i, j, "left"));
      if (i === 0) g.add(createWall(i, j, "top"));
      if (j === wallMaze[i].length - 1) g.add(createWall(i, j, "right"));
      if (i === wallMaze.length - 1) g.add(createWall(i, j, "bottom"));
    }
  }

  return g;
};
