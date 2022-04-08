
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { matrixToStr, Options } from '../src/matrix-print';

export function testMatrix(name: string, matrix: (string | number | boolean)[][], printOptions?: Partial<Options>) {
  const colorOptions = { ...printOptions, chalk: new chalk.Instance({ level: 3 }) };
  const matrixStr = matrixToStr(matrix, colorOptions);

  const noColorOptions = { ...printOptions, chalk: new chalk.Instance({ level: 0 }) };
  const matrixStrNoColor = matrixToStr(matrix, noColorOptions);

  const fixturesPath = path.resolve(__dirname, './fixtures');
  const fileName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = path.resolve(fixturesPath, fileName) + '.txt';
  const filePathNoColor = path.resolve(fixturesPath, fileName) + '_nocolor.txt';

  if (process.env.WRITE_FIXTURES) {
    if (fs.existsSync(filePath)) {
      throw new Error(`Fixture for test ${name} already exist. Path: ${filePath}`);
    }

    if (fs.existsSync(filePathNoColor)) {
      throw new Error(`Fixture for test ${name} already exist. Path: ${filePathNoColor}`);
    }

    console.log(`Writting ${fileName}:`);
    console.log(matrixStr);

    fs.writeFileSync(filePathNoColor, matrixStrNoColor, 'utf8');
    fs.writeFileSync(filePath, matrixStr, 'utf8');

    return;
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture for test ${name} does not exist. Searched at path: ${filePath}`);
  }

  if (!fs.existsSync(filePathNoColor)) {
    throw new Error(`Fixture for test ${name} does not exist. Searched at path: ${filePathNoColor}`);
  }

  const fixtureStr = fs.readFileSync(filePath, 'utf8');

  if (matrixStr !== fixtureStr) {
    throw new Error(
      [
        'Fixture is different for the result',
        'Fixture:',
        fixtureStr,
        'Result:',
        matrixStr,
      ].join('\n')
    );
  }

  const fixtureStrNoColor = fs.readFileSync(filePathNoColor, 'utf8');

  if (matrixStrNoColor !== fixtureStrNoColor) {
    throw new Error(
      [
        'Fixture is different for the result',
        'Fixture:',
        fixtureStrNoColor,
        'Result:',
        matrixStrNoColor,
      ].join('\n')
    );
  }
}
