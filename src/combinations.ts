
export function combinationsCbIndexes(n: number, k: number, cb: (indexes: number[]) => void) {
  const indexes: number[] = [];

  for (let i = 0; i < k; i++) {
    indexes.push(i);
  }

  while (true) {
    cb(indexes);

    let j = indexes.length - 1;

    while (j >= 0 && indexes[j] === (n - k + j)) j--;

    if (j < 0) {
      break;
    }

    indexes[j]++;

    for (let i = j + 1; i < indexes.length; i++) {
      indexes[i] = indexes[j] + (i - j);
    }
  }
}

export function combinationsAllIndexes(n: number, k: number): number[][] {
  const result: number[][] = [];

  combinationsCbIndexes(n, k, (indexes) => result.push([...indexes]));

  return result;
}

export function combinationsCbArrays<T>(elements: T[], k: number, cb: (elements: T[]) => void) {
  combinationsCbIndexes(elements.length, k, (indexes) => cb(indexes.map(i => elements[i])));
}

export function combinationsAllArrays<T>(elements: T[], k: number): T[][] {
  const result: T[][] = [];

  combinationsCbArrays(elements, k, (elements) => result.push(elements));

  return result;
}
