
export function matrixForeach<T>(matrix: T[][], visitFn: (v: T, r: number, c: number) => void) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      visitFn(matrix[r][c], r, c);
    }
  }
}
