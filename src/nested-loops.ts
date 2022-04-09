
export function nestedLoopsCbIndexes(starts: number[], ends: number[], cb: (indexes: number[]) => void): void {
  if (starts.length !== ends.length) {
    throw new Error(`Starts and ends arrays must be of same length`);
  }

  const indexes = [...starts];

  while (true) {
    cb(indexes);

    let j = indexes.length - 1;
    while (j >= 0 && indexes[j] === ends[j]) j--;

    if (j < 0) {
      break;
    }

    indexes[j]++;

    for (let k = j + 1; k < indexes.length; k++) {
      indexes[k] = starts[k];
    }
  }
}


export function nestedLoopsAllIndexes(starts: number[], ends: number[]): number[][] {
  const result: number[][] = [];

  nestedLoopsCbIndexes(starts, ends, (indexes) => result.push([...indexes]));

  return result;
}

export function nestedLoopsCbArrays<T>(arrays: T[][], cb: (state: T[]) => void) {
  const starts = arrays.map(() => 0);
  const ends = arrays.map(arr => arr.length - 1);

  nestedLoopsCbIndexes(starts, ends, (indexes) => cb(arrays.map((arr, i) => arr[indexes[i]])));
}

export function nestedLoopsAllArrays<T>(arrays: T[][]) {
  const result: T[][] = [];

  nestedLoopsCbArrays(arrays, (state) => result.push([...state]));

  return result;
}
