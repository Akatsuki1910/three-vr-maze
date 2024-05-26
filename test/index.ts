import { createMaze } from "../src/utils/createMaze";

const { maze, wallMaze } = createMaze(11, 11);

const m = document.createElement("main");
maze.forEach((v) => {
  const d = document.createElement("div");
  v.forEach((c) => {
    const e = document.createElement("span");
    e.className = "cell";
    if (c >= 1) e.style.backgroundColor = "red";
    if (c >= 2) e.style.backgroundColor = "yellow";
    if (c >= 3) e.style.backgroundColor = "blue";
    if (c >= 4) e.style.backgroundColor = "green";
    d.appendChild(e);
  });
  m.appendChild(d);
});

document.body.appendChild(m);

const m2 = document.createElement("main");

wallMaze.forEach((v) => {
  const d = document.createElement("div");
  v.forEach((c) => {
    const e = document.createElement("span");
    e.className = "cell2";
    if (c === 1) e.style.borderBottomColor = "red";
    if (c === 2) e.style.borderRightColor = "red";
    if (c === 3) {
      e.style.borderBottomColor = "red";
      e.style.borderRightColor = "red";
    }

    d.appendChild(e);
  });
  m2.appendChild(d);
});

document.body.appendChild(m2);
