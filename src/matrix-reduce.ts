import { matrixForeach } from './matrix-foreach';

export function matrixReduce<T, A>(matrix: T[][], reduceFn: (acc: A, value: T, r: number, c: number) => A, initialAcc: A): A {
  let acc = initialAcc;

  matrixForeach(matrix, (v, r, c) => { acc = reduceFn(acc, v, r, c); });

  return acc;
}
