
import { binSearchFirstPass, binSearchLastFail, binSearchLastPass, binSearchFirstFail } from './../src/bin-search';

function simpleFirstPass(start: number, end: number, test: (i: number) => boolean) {
  for (let i = start; i <= end; i++) {
    if (test(i)) {
      return i;
    }
  }

  return null;
}

function simpleLastFail(start: number, end: number, test: (i: number) => boolean) {
  for (let i = end; i >= start; i--) {
    if (!test(i)) {
      return i;
    }
  }

  return null;
}

function simpleLastPass(start: number, end: number, test: (i: number) => boolean) {
  for (let i = end; i >= start; i--) {
    if (test(i)) {
      return i;
    }
  }

  return null;
}

function simpleFirstFail(start: number, end: number, test: (i: number) => boolean) {
  for (let i = start; i <= end; i++) {
    if (!test(i)) {
      return i;
    }
  }

  return null;
}

function allPairs(cb: (start: number, end: number, mid: number) => void) {
  for (let start = 0; start < 10; start++) {
    for (let end = start; end < 10; end++) {
      for (let mid = start - 1; mid <= end + 1; mid++) {
        cb(start, end, mid);
      }
    }
  }
}

test('binSearchFirstPass', () => {
  allPairs((start, end, mid) => {
    const test = (n: number) => n > mid;

    expect(binSearchFirstPass(start, end, test))
      .toBe(simpleFirstPass(start, end, test));
  });
});

test('binSearchLastFail', () => {
  allPairs((start, end, mid) => {
    const test = (n: number) => n > mid;

    expect(binSearchLastFail(start, end, test))
      .toBe(simpleLastFail(start, end, test));
  });
});

test('binSearchLastPass', () => {
  allPairs((start, end, mid) => {
    const test = (n: number) => n < mid;

    expect(binSearchLastPass(start, end, test))
      .toBe(simpleLastPass(start, end, test));
  });
});

test('binSearchFirstFail', () => {
  allPairs((start, end, mid) => {
    const test = (n: number) => n < mid;

    expect(binSearchFirstFail(start, end, test))
      .toBe(simpleFirstFail(start, end, test));
  });
});
