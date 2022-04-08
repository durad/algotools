import { readLine, clearBuffers } from '../src/read-line';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('readLine', () => {
  beforeAll(() => {
    // clearBuffers();
  });

  it('reads single line', async () => {
    process.nextTick(() => {
      process.stdin.emit('data', 'line1\n');
    });

    const a = await readLine();
    expect(a).toBe('line1');
  });

  it('reads multiple lines', async () => {
    process.nextTick(() => {
      process.stdin.emit('data', 'line1\nline2\n');
    });

    const a = await readLine();
    expect(a).toBe('line1');
    const b = await readLine();
    expect(b).toBe('line2');
  });

  it('closes line on end of stream', async () => {
    process.nextTick(async () => {
      process.stdin.emit('data', 'line1\nline2');
      await delay(0);
      process.stdin.emit('end');
    }, 0);

    const a = await readLine();
    expect(a).toBe('line1');
    const b = await readLine();
    expect(b).toBe('line2');
  });

  it('connects line from multiple chunks', async () => {
    process.nextTick(async () => {
      process.stdin.emit('data', 'li');
      await delay(0);
      process.stdin.emit('data', 'ne');
      await delay(0);
      process.stdin.emit('data', '1');
      await delay(0);
      process.stdin.emit('data', '\n');
      await delay(0);
      process.stdin.emit('data', 'li');
      await delay(0);
      process.stdin.emit('data', 'ne');
      await delay(0);
      process.stdin.emit('data', '2');
      await delay(0);
      process.stdin.emit('data', '\n');
      await delay(0);
      process.stdin.emit('end');
    });

    const a = await readLine();
    expect(a).toBe('line1');
    const b = await readLine();
    expect(b).toBe('line2');
  });

  it('splits chunk to multiple lines', async () => {
    process.nextTick(async () => {
      process.stdin.emit('data', 'line1\nline2\nline3\n');
    });

    const a = await readLine();
    expect(a).toBe('line1');
    const b = await readLine();
    expect(b).toBe('line2');
    const c = await readLine();
    expect(c).toBe('line3');
  });
});
