
interface CreateMatrixFn {
  <V>(R: number, C: number | ((r: number) => number), v: (r: number, c: number) => V): V[][];
  <V>(R: number, C: number | ((r: number) => number), v: V): V[][];
  (R: number, C: number | ((r: number) => number)): any[][];
  <V>(R: number, C: number | ((r: number) => number)): V[][];
}

export const matrixCreate: CreateMatrixFn = function(R: number, C: number | ((r: number) => number), v?: any | ((r: number, c: number) => any)) {
  const matrix = [];

  for (let y = 0; y < R; y++) {
    const columns = (typeof C === 'number') ? C : C(y);
    const line = [];

    for (let x = 0; x < columns; x++) {
      const value = (v instanceof Function)
        ? v(y, x)
        : v as any;

      line.push(value);
    }

    matrix.push(line);
  }

  return matrix;
}
