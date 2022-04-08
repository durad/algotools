
let bufferedChunks: string[] | null = [];
let bufferedLines: string[] | null = [];

process.stdin.setEncoding('utf8');
process.stdin.pause();

export function clearBuffers() {
  bufferedChunks = [];
  bufferedLines = [];
}

export async function readLine(): Promise<string> {

  if (bufferedChunks === null || bufferedLines === null) {
    throw new Error('OMG!');
  }

  if (bufferedLines.length > 0) {
    const line = bufferedLines[0];
    bufferedLines.shift();

    return line;
  }

  return new Promise((resolve, reject) => {
    process.stdin.on('data', (chunk) => {
      if (bufferedChunks === null || bufferedLines === null) {
        return reject('OMG!');
      }

      const breakIndex = chunk.indexOf('\n');

      if (breakIndex === -1) {
        bufferedChunks.push(chunk.toString('utf8'));
      } else {
        bufferedChunks.push(chunk.toString('utf8').substr(0, breakIndex));
        const result = bufferedChunks.join('');
        const rest = chunk.toString('utf8').substr(breakIndex + 1).split('\n');
        bufferedChunks = [rest[rest.length - 1]];
        bufferedLines = [...bufferedLines, ...rest.slice(0, rest.length - 1)];
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
        process.stdin.removeAllListeners('end');

        return resolve(result);
      }
    });

    process.stdin.on('end', () => {
      if (bufferedChunks === null || bufferedLines === null) {
        return reject('OMG!');
      }

      const result = bufferedChunks.join('');
      bufferedChunks = [];
      bufferedLines = [];
      process.stdin.pause();
      process.stdin.removeAllListeners('data');
      process.stdin.removeAllListeners('end');

      return resolve(result);
    });

    process.stdin.resume();
  });
}
