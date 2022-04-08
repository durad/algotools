
export function matrixMap<T, V>(oldMatrix: T[][], mapFn: (value: T, r: number, c: number) => V): V[][] {
  const newMatrix = [];

  for (let r = 0; r < oldMatrix.length; r++) {
    const line = [];

    for (let c = 0; c < oldMatrix[r].length; c++) {
      const newValue = mapFn(oldMatrix[r][c], r, c);
      line.push(newValue);
    }

    newMatrix.push(line);
  }

  return newMatrix;
}
