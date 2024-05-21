import { createMaze } from "../src/utils/createMaze";

const maze = createMaze(5, 5);

const m = document.createElement("main");
maze.forEach((v) => {
  const d = document.createElement("div");
  v.forEach((c) => {
    const e = document.createElement("span");
    if (c >= 1) e.style.borderRightColor = "red";
    if (c >= 2) e.style.borderBottomColor = "red";
    d.appendChild(e);
  });
  m.appendChild(d);
});
document.body.appendChild(m);
