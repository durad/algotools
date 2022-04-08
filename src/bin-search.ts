/**
 * 000000[1]111
 * Finds first number i in [start, end] inclusive for which test(i) = 00000111 is passing
 * @param start lower bound of the interval (inclusive)
 * @param end upper bound of the interval (inclusive)
 * @param test testing function
 * @returns first number for which test() passes or null if all are failing
 */
export function binSearchFirstPass(start: number, end: number, test: (i: number) => boolean) {
  let l = start - 1;
  let r = end;

  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      r = m;
    } else {
      l = m;
    }
  }

  return test(r) ? r : null;
}

/**
 * `00000[0]1111`
 * Finds last number i in [start, end] inclusive for which test(i) is failing
 * @param start lower bound of the interval (inclusive)
 * @param end upper bound of the interval (inclusive)
 * @param test testing function
 * @returns last number for which test() fails or null if all are passing
 */
export function binSearchLastFail(start: number, end: number, test: (i: number) => boolean) {
  let l = start;
  let r = end + 1;

  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      r = m;
    } else {
      l = m;
    }
  }

  return test(l) ? null : l;
}

/**
 * 11111[1]0000
 * Finds last number i in [start, end] inclusive for which test(i) = 111111000 is passing
 * @param start lower bound of the interval (inclusive)
 * @param end upper bound of the interval (inclusive)
 * @param test testing function
 * @returns last number for which test() passes or null if all are failing
 */
export function binSearchLastPass(start: number, end: number, test: (i: number) => boolean) {
  let l = start;
  let r = end + 1;

  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      l = m;
    } else {
      r = m;
    }
  }

  return test(l) ? l : null;
}

/**
 * 111111[0]000
 * Finds first number i in [start, end] inclusive for which test(i) = 11111000 is failing
 * @param start lower bound of the interval (inclusive)
 * @param end upper bound of the interval (inclusive)
 * @param test testing function
 * @returns first number for which test() fails or null if all are passing
 */
export function binSearchFirstFail(start: number, end: number, test: (i: number) => boolean) {
  let l = start - 1;
  let r = end;

  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);

    if (test(m)) {
      l = m;
    } else {
      r = m;
    }
  }

  return test(r) ? null : r;
}
