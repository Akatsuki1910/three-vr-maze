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
      stack.push([i + 1, j + 1])
    )
  );

  document.body.innerHTML = JSON.stringify(stack);

  return maze;
};
