//https://algoful.com/Archive/Algorithm/MazeExtend

export const createMaze = (rows: number, cols: number) => {
  if (rows < 3) rows = 3;
  if (cols < 3) cols = 3;
  if (rows % 2 === 0) rows++;
  if (cols % 2 === 0) cols++;

  const maze = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  const stack: [number, number][] = [];
  Array.from({ length: (rows - 1) / 2 }).forEach((_, i) =>
    Array.from({ length: (cols - 1) / 2 }).forEach((_, j) =>
      stack.push([i * 2 + 1, j * 2 + 1])
    )
  );

  while (stack.length > 0) {
    const pos = stack.pop()!;
    let x = pos[0];
    let y = pos[1];
    if (maze[x][y] !== 0) continue;

    maze[x][y] = 2;

    const d = [
      [-1, 0], //top
      [0, -1], //left
      [0, 1], //bottom
      [1, 0], //right
    ].sort(() => Math.random() - 0.5);

    for (const i in d) {
      const dx = d[i][0];
      const dy = d[i][1];
      let nx = x + dx;
      let ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols) continue;
      if (maze[nx][ny] !== 0) continue;
      let nnx = nx + dx;
      let nny = ny + dy;
      if (nnx < 0 || nny < 0 || nnx >= rows || nny >= cols) {
        maze[nx][ny] = 1;
        break;
      }
      if (maze[nnx][nny] !== 0) continue;
      maze[nx][ny] = 1;
      stack.push([nnx, nny]);
      break;
    }
  }

  const wallMaze: number[][] = [];
  for (let i = 0; i < rows; i++) {
    if (i % 2 !== 0) continue;
    const rowArr = [];
    for (let l = 0; l < cols; l++) {
      if (l % 2 !== 0) continue;
      let cell = 0;
      if (i + 1 !== rows && maze[i + 1][l] !== 0) cell += 1;
      if (l + 1 !== cols && maze[i][l + 1] !== 0) cell += 2;
      rowArr.push(cell);
    }
    wallMaze.push(rowArr);
  }

  return { maze, wallMaze };
};
