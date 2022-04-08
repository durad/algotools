import chalk from 'chalk';
import { matrixCreate } from './matrix-create';
import { matrixForeach } from './matrix-foreach';
import { matrixMap } from './matrix-map';
import { matrixReduce } from './matrix-reduce';

interface Section {
  sr: number;
  sc: number;
  color?: string;
  bgColor?: string;
  text: Stringable;
}

interface Position {
  top: number;
  left: number;
}

function zeroPosition(): Position {
  return {
    top: 0,
    left: 0,
  };
}

interface Bounds {
  firstRow: number;
  lastRow: number;
  firstColumn: number;
  lastColumn: number;
}

function zeroBounds(): Bounds {
  return {
    firstRow: 0,
    lastRow: 0,
    firstColumn: 0,
    lastColumn: 0,
  };
}

interface Size {
  height: number;
  width: number;
}

function zeroSize(): Size {
  return {
    height: 0,
    width: 0,
  };
}

interface CellInfo {
  sections: Section[];
  v: Stringable;
  r: number;
  c: number;
  bounds: Bounds;
  rowHeights: Map<number, number>;
  columnWidths: Map<number, number>;
  rowStarts: Map<number, number>;
  columnStarts: Map<number, number>;
  maxHeight: number;
  maxWidth: number;
  outerSize: Size;
  innerSize: Size;
  outerPosition: Position;
  innerPosition: Position;
}

type Align = 'left' | 'center' | 'right';

function getCellInfos(matrix: Stringable[][], options: Options): CellInfo[][] {
  return matrixMap(matrix, (v, r, c) => {
    let sections: Section[] = [];

    if (options.value) {
      const result = options.value(v, r, c);

      if (result instanceof Array) {
        sections = [...sections, ...result];
      } else {
        sections.push({ sr: 0, sc: 0, text: result.toString() });
      }
    } else {
      sections.push({ sr: 0, sc: 0, text: v.toString() });
    }

    if (options.topValue) {
      const result = options.topValue(v, r, c);

      if (result instanceof Array) {
        sections = [...sections, ...result.map(r => ({ ...r, sr: -1, sc: 0 }))];
      } else {
        sections.push({ sr: -1, sc: 0, text: result.toString(), color: 'gray' });
      }

    }

    if (options.rightValue) {
      const result = options.rightValue(v, r, c);
      sections.push({ sr: 0, sc: 1, text: result.toString() });
    }

    if (options.bottomValue) {
      const result = options.bottomValue(v, r, c);
      sections.push({ sr: 1, sc: 0, text: result.toString() });
    }

    if (options.leftValue) {
      const result = options.leftValue(v, r, c);
      sections.push({ sr: 0, sc: -1, text: result.toString() });
    }

    return {
      sections,
      v,
      r,
      c,
      bounds: zeroBounds(),
      rowHeights: new Map<number, number>(),
      columnWidths: new Map<number, number>(),
      rowStarts: new Map<number, number>(),
      columnStarts: new Map<number, number>(),
      maxHeight: 0,
      maxWidth: 0,
      outerSize: zeroSize(),
      innerSize: zeroSize(),
      outerPosition: zeroPosition(),
      innerPosition: zeroPosition(),
    };
  });
}

function getMatrixBounds<T>(matrix: T[][]): Bounds {
  return {
    firstRow: 0,
    firstColumn: 0,
    lastRow: matrix.length - 1,
    lastColumn: matrix.reduce((acc, line) => Math.max(acc, line.length), 0) - 1,
  };
}

function getCellBounds(sections: Section[], options: Options): Bounds {
  const bounds = {
    firstRow: options.includeZeroSection ? 0 : (sections[0].sr ?? 0),
    lastRow: options.includeZeroSection ? 0 : (sections[0].sr ?? 0),
    firstColumn: options.includeZeroSection ? 0 : (sections[0].sc ?? 0),
    lastColumn: options.includeZeroSection ? 0 : (sections[0].sc ?? 0),
  };

  for (const section of sections) {
    const { sr, sc } = section;
    bounds.firstRow = Math.min(bounds.firstRow, sr);
    bounds.lastRow = Math.max(bounds.lastRow, sr);
    bounds.firstColumn = Math.min(bounds.firstColumn, sc);
    bounds.lastColumn = Math.max(bounds.lastColumn, sc);
  }

  return bounds;
}

function getEncompasingBounds(cellInfosMatrix: CellInfo[][]) {
  const initialBounds = cellInfosMatrix?.[0]?.[0]?.bounds ?? { ...zeroBounds };

  const bounds = matrixReduce(cellInfosMatrix, (acc, v) => ({
    firstRow: Math.min(acc.firstRow, v.bounds.firstRow),
    lastRow: Math.max(acc.lastRow, v.bounds.lastRow),
    firstColumn: Math.min(acc.firstColumn, v.bounds.firstColumn),
    lastColumn: Math.max(acc.lastColumn, v.bounds.lastColumn),
  }), initialBounds);

  return bounds;
}

function measureCellSections(cellInfo: CellInfo, options: Options) {
  const sectionSizes = new Map<string, Size>();

  for (const section of cellInfo.sections) {
    const { sr, sc, text } = section;
    const key = `${sr}:${sc}`;
    const height = Math.max(sectionSizes.get(key)?.height ?? 0, options.minHeight ?? 0) + 1;
    const width = Math.max(sectionSizes.get(key)?.width ?? 0, text.toString().length ?? 0, options.minWidth ?? 0);
    sectionSizes.set(key, { height, width });
    cellInfo.maxHeight = Math.max(cellInfo.maxHeight, height);
    cellInfo.maxWidth = Math.max(cellInfo.maxWidth, width);
  }

  cellInfo.rowHeights = new Map<number, number>();
  cellInfo.columnWidths = new Map<number, number>();

  for (let sr = cellInfo.bounds.firstRow; sr <= cellInfo.bounds.lastRow; sr++) {
    for (let sc = cellInfo.bounds.firstColumn; sc <= cellInfo.bounds.lastColumn; sc++) {
      if (options.equalSectionsInCell) {
        cellInfo.rowHeights.set(sr, cellInfo.maxHeight);
        cellInfo.columnWidths.set(sc, cellInfo.maxWidth);
      } else {
        const key = `${sr}:${sc}`;
        const size = sectionSizes.get(key);
        cellInfo.rowHeights.set(sr, Math.max(cellInfo.rowHeights.get(sr) ?? 0, size?.height ?? 0));
        cellInfo.columnWidths.set(sc, Math.max(cellInfo.columnWidths.get(sc) ?? 0, size?.width ?? 0));
      }
    }
  }
}

function equalizeCellSections(cellInfosMatrix: CellInfo[][]) {
  const maxHeight = matrixReduce(cellInfosMatrix, (acc, v) => Math.max(acc, v.maxHeight), 0);
  const maxWidth = matrixReduce(cellInfosMatrix, (acc, v) => Math.max(acc, v.maxWidth), 0);

  matrixForeach(cellInfosMatrix, (v) => {
    v.rowHeights = new Map([...v.rowHeights.keys()].map(k => [k, maxHeight]));
    v.columnWidths = new Map([...v.columnWidths.keys()].map(k => [k, maxWidth]));
  });
}

function calculateCellInnerSize(cellInfo: CellInfo, options: Options) {
  const { bounds, innerSize, rowHeights, columnWidths } = cellInfo;
  innerSize.height = 0;
  innerSize.width = 0;

  for (let sr = bounds.firstRow; sr <= bounds.lastRow; sr++) {
    innerSize.height += rowHeights.get(sr) ?? 0;

    if (sr !== bounds.lastRow) {
      innerSize.height += options.sectionHorizonalBorder ? 1 : 0;
    }
  }

  for (let sc = bounds.firstColumn; sc <= bounds.lastColumn; sc++) {
    innerSize.width += columnWidths.get(sc) ?? 0;

    if (sc !== bounds.lastColumn) {
      innerSize.width += 1;
    }
  }
}

function getIndexes(cells: CellInfo[][], matrixBounds: Bounds, options: Options) {
  const rowIndexes = new Map<number, string[]>();

  if (options.rowIndexes) {
    options.rowIndexes = typeof options.rowIndexes === 'function' ? options.rowIndexes : (r => `${r} `);

    for (let r = 0; r < cells.length; r++) {
      const rowIndex = options.rowIndexes(r);
      const rowIndexesValues = rowIndex instanceof Array ? rowIndex.map(ri => ri.toString()) : [rowIndex.toString()];
      rowIndexes.set(r, rowIndexesValues);
    }
  }

  const columnIndexes = new Map<number, string[]>();

  if (options.columnIndexes) {
    options.columnIndexes = typeof options.columnIndexes === 'function' ? options.columnIndexes : (c => `${c} `);

    for (let c = 0; c <= matrixBounds.lastColumn; c++) {
      const columnIndex = options.columnIndexes(c);
      const columnIndexValues = columnIndex instanceof Array ? columnIndex.map(ci => ci.toString()) : [columnIndex.toString()];
      columnIndexes.set(c, columnIndexValues);
    }
  }

  return {
    rowIndexes,
    columnIndexes,
  };
}

function measureIndexes(rowIndexes: Map<number, string[]>, columnIndexes: Map<number, string[]>, options: Options) {
  const border = options.border ? 1 : 0;

  const columnIndexesWidths = new Map<number, number>([...columnIndexes.entries()].map(([key, value]) => [
    key,
    (value ?? []).reduce((acc, s) => Math.max(acc, s.length), 0) + 2 * border,
  ]));

  const columnIndexesHeight = [...columnIndexes.values()].reduce((acc, value) => Math.max(acc, value.length), 0);

  const rowIndexesHeights = new Map<number, number>([...rowIndexes.entries()].map(([k, v]) => [k, v.length + 2 * border]));
  const rowIndexesWidth = [...rowIndexes.values()].reduce((acc, v) => Math.max(acc, v.reduce((a, v) => Math.max(a, v.length), 0)), 0);

  return {
    rowIndexesHeights,
    rowIndexesWidth,
    columnIndexesHeight,
    columnIndexesWidths,
    rowIndexes,
    columnIndexes,
  };
}

function getOutterRowHeights(cellInfosMatrix: CellInfo[][], rowIndexesHeights: Map<number, number>) {
  const rowOuterHeights = new Map(cellInfosMatrix.map((line, r) => [r, line.reduce((acc, v) => Math.max(acc, v.outerSize.height, rowIndexesHeights.get(r) ?? 0), 0)]));

  return rowOuterHeights;
}

function getOutterColumnWidths(cellInfosMatrix: CellInfo[][], columnIndexesWidths: Map<number, number>) {
  const columnOuterWidths = new Map<number, number>(columnIndexesWidths);

  matrixForeach(cellInfosMatrix, (v, r, c) => {
    columnOuterWidths.set(c, Math.max(columnOuterWidths.get(c) ?? 0, v.outerSize.width));
  });

  return columnOuterWidths;
}

function equalizeCellDimensions(rowHeights: Map<number, number>, columnWidths: Map<number, number>) {
  const maxCellHeight = [...rowHeights.values()].reduce((acc, h) => Math.max(acc, h), 0);
  for (const k of rowHeights.keys()) {
    rowHeights.set(k, maxCellHeight);
  }

  const maxCellWidth = [...columnWidths.values()].reduce((acc, w) => Math.max(acc, w), 0);
  for (const k of columnWidths.keys()) {
    columnWidths.set(k, maxCellWidth);
  }
}

function getCellStarts(rowHeights: Map<number, number>, columnWidths: Map<number, number>, bounds: Bounds, options: Options) {
  const border = (options.border ? 1 : 0);
  const rowSpacing = options.rowSpacing ?? 0;
  const columnSpacing = options.columnSpacing ?? (1 - border);

  const rowStarts = getStarts(bounds.firstRow, bounds.lastRow, rowHeights, border, rowSpacing);
  const columnStarts = getStarts(bounds.firstColumn, bounds.lastColumn, columnWidths, border, columnSpacing);

  return {
    rowStarts,
    columnStarts,
  };
}

function calculateCellPositions(cellInfosMatrix: CellInfo[][], rowStarts: Map<number, number>, columnStarts: Map<number, number>, rowIndexesWidth: number, columnIndexesHeight: number, options: Options) {
  const border = (options.border ? 1 : 0);
  const rowSpacing = options.rowSpacing ?? 0;
  const columnSpacing = options.columnSpacing ?? (1 - border);

  matrixForeach(cellInfosMatrix, (v, r, c) => {
    v.outerPosition = {
      top: columnIndexesHeight + (rowStarts.get(r) ?? 0),
      left: rowIndexesWidth + options.indent(r) + (columnStarts.get(c) ?? 0),
    };

    v.innerPosition = {
      top: v.outerPosition.top + border,
      left: v.outerPosition.left + border,
    };
  });
}

function calculateSectionStarts(cellInfo: CellInfo, options: Options) {
  const { firstRow, lastRow, firstColumn, lastColumn } = cellInfo.bounds;

  cellInfo.rowStarts.set(firstRow, 0);

  for (let sr = firstRow + 1; sr <= lastRow; sr++) {
    cellInfo.rowStarts.set(sr, (cellInfo.rowStarts.get(sr - 1) ?? 0) + (cellInfo.rowHeights.get(sr - 1) ?? 0) + (options.sectionHorizonalBorder === false ? 0 : 1));
  }

  cellInfo.columnStarts.set(firstColumn, 0);

  for (let sc = firstColumn + 1; sc <= lastColumn; sc++) {
    cellInfo.columnStarts.set(sc, (cellInfo.columnStarts.get(sc - 1) ?? 0) + (cellInfo.columnWidths.get(sc - 1) ?? 0) + 1);
  }
}

function getCanvasSize(cellInfosMatrix: CellInfo[][]): Size {
  const maxSize = matrixReduce(cellInfosMatrix, (acc, v) => ({
    height: Math.max(acc.height, v.outerPosition.top + v.outerSize.height),
    width: Math.max(acc.width, v.outerPosition.left + v.outerSize.width),
  }), zeroSize());

  return maxSize;
}

function getStarts(first: number, last: number, thicnkes: Map<number, number>, border: number, spacing: number): Map<number, number> {
  const starts = new Map<number, number>();
  starts.set(first, 0);

  for (let i = 1; i <= last; i++) {
    let s = (starts.get(i - 1) ?? 0) + (thicnkes.get(i - 1) ?? 0) - border + spacing;
    starts.set(i, s);
  }

  return starts;
}

function setBorderPart(r: number, c: number, dir: number, borderParts: Map<string, number[]>): void {
  const v = borderParts.get(`${r}_${c}`) ?? [0, 0, 0, 0];
  v[dir] = 1;
  borderParts.set(`${r}_${c}`, v);
}

function printBorder(cellInfo: CellInfo, borderParts: Map<string, number[]>, borderSides: [boolean, boolean, boolean, boolean]) {
  const pos = cellInfo.outerPosition;
  const size = cellInfo.outerSize;
  const [top, right, bottom, left] = borderSides;

  if (top) {
    setBorderPart(pos.top, pos.left, 1, borderParts);
    setBorderPart(pos.top, pos.left + size.width - 1, 3, borderParts);
  }

  if (bottom) {
    setBorderPart(pos.top + size.height - 1, pos.left, 1, borderParts);
    setBorderPart(pos.top + size.height - 1, pos.left + size.width - 1, 3, borderParts);
  }

  if (right) {
    setBorderPart(pos.top, pos.left + size.width - 1, 2, borderParts);
    setBorderPart(pos.top + size.height - 1, pos.left + size.width - 1, 0, borderParts);
  }

  if (left) {
    setBorderPart(pos.top, pos.left, 2, borderParts);
    setBorderPart(pos.top + size.height - 1, pos.left, 0, borderParts);
  }

  for (let x = pos.left + 1; x < pos.left + size.width - 1; x++) {
    if (top) {
      setBorderPart(pos.top, x, 3, borderParts);
      setBorderPart(pos.top, x, 1, borderParts);
    }

    if (bottom) {
      setBorderPart(pos.top + size.height - 1, x, 3, borderParts);
      setBorderPart(pos.top + size.height - 1, x, 1, borderParts);
    }
  }

  for (let y = pos.top + 1; y < pos.top + size.height - 1; y++) {
    if (left) {
      setBorderPart(y, pos.left, 0, borderParts);
      setBorderPart(y, pos.left, 2, borderParts);
    }

    if (right) {
      setBorderPart(y, pos.left + size.width - 1, 0, borderParts);
      setBorderPart(y, pos.left + size.width - 1, 2, borderParts);
    }
  }
}

function printBorders(cellInfosMatrix: CellInfo[][], lines: string[][], borderFn: (v: Stringable, r: number, c: number) => [boolean, boolean, boolean, boolean]) {
  const borderChars = new Map<string, number[]>();

  matrixForeach(cellInfosMatrix, cell => {
    const borderSides = borderFn(cell.v, cell.r, cell.c);
    printBorder(cell, borderChars, borderSides);
  });

  const codes: Record<number, string> = {
    3: '\u2510',
    5: '\u2500',
    6: '\u250C',
    7: '\u252C',
    9: '\u2518',
    10: '\u2502',
    11: '\u2524',
    12: '\u2514',
    13: '\u2534',
    14: '\u251C',
    15: '\u253C',
  };

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const v = borderChars.get(`${y}_${x}`);

      if (v === undefined) {
        continue;
      }

      const code = v[0] * 8 + v[1] * 4 + v[2] * 2 + v[3];

      if (code !== 0) {
        lines[y][x] = codes[code] ?? ' ';
      }
    }
  }
}

function printIndexes(
  matrixBounds: Bounds,
  rowIndexes: Map<number, string[]>,
  rowStarts: Map<number, number>,
  rowIndexesWidth: number,
  columnIndexes: Map<number, string[]>,
  columnStarts: Map<number, number>,
  columnIndexesHeight: number,
  columnWidths: Map<number, number>,
  options: Options,
  canvas: string[][],
) {
  const border = options.border ? 1 : 0;
  const color = options.chalk ?? chalk;

  for (let r = 0; r <= matrixBounds.lastRow; r++) {
    const rowIndexLines = rowIndexes.get(r) ?? [];

    for (let i = 0; i < rowIndexLines.length; i++) {
      printText(
        rowIndexLines[i],
        {
          top: columnIndexesHeight + border + (rowStarts.get(r) ?? 0) + i,
          left: 0,
        },
        rowIndexesWidth,
        'left',
        color.gray,
        canvas
      );
    }
  }

  for (let c = 0; c <= matrixBounds.lastColumn; c++) {
    const columnIndexStrs = columnIndexes.get(c) ?? [];

    for (let i = 0; i < columnIndexStrs.length; i++) {
      printText(
        columnIndexStrs[i],
        {
          top: i,
          left: rowIndexesWidth + border + (columnStarts.get(c) ?? 0),
        },
        (columnWidths.get(c) ?? 0) - 2 * border,
        options.align,
        color.gray,
        canvas
      );
    }
  }
}

function getColor(cell: CellInfo, dimmed: boolean, options: Options) {
  let color: chalk.Chalk = options.chalk ?? chalk;

  if (options.highlight !== undefined && options.highlight(cell.v, cell.r, cell.c)) {
    color = color.yellowBright;
  }

  if (options.underline !== undefined && options.underline(cell.v, cell.r, cell.c)) {
    color = color.underline;
  }

  if (options.inverse !== undefined && options.inverse(cell.v, cell.r, cell.c)) {
    color = color.inverse;
  }

  if (dimmed) {
    color = color.dim;
  }

  return color;
}

function printCellBackgrounds(cellInfosMatrix: CellInfo[][], canvas: string[][], options: Options) {
  matrixForeach(cellInfosMatrix, (cell, r, c) => {
    const color = getColor(cell, false, options);

    for (let i = 0; i < cell.innerSize.height; i++) {
      printText(
        '',
        {
          top: cell.innerPosition.top + i,
          left: cell.innerPosition.left
        },
        cell.innerSize.width,
        'left',
        color,
        canvas
      );
    }
  });
}

function printSectionBorders(cellInfo: CellInfo, canvas: string[][], options: Options) {
  const color = getColor(cellInfo, true, options);

  if (options.sectionVerticalBorder !== false) {
    const verticalBorder = color(options.sectionVerticalBorder);

    for (let sc = cellInfo.bounds.firstColumn + 1; sc <= cellInfo.bounds.lastColumn; sc++) {
      for (let y = cellInfo.innerPosition.top; y < cellInfo.innerPosition.top + cellInfo.innerSize.height; y++) {
        const left = cellInfo.innerPosition.left;
        const linePos = (cellInfo.columnStarts.get(sc) ?? 0) - 1;
        canvas[y][left + linePos] = verticalBorder;
      }
    }
  }

  if (options.sectionHorizonalBorder !== false) {
    const horizontalBorder = color(options.sectionHorizonalBorder);

    for (let sr = cellInfo.bounds.firstRow + 1; sr <= cellInfo.bounds.lastRow; sr++) {
      for (let x = cellInfo.innerPosition.left; x < cellInfo.innerPosition.left + cellInfo.innerSize.width; x++) {
        const top = cellInfo.innerPosition.top;
        const linePos = (cellInfo.rowStarts.get(sr) ?? 0) - 1;
        canvas[top + linePos][x] = horizontalBorder;
      }
    }
  }
}

function printText(text: string, pos: Position, width: number, align: Align, color: chalk.Chalk, canvas: string[][]) {
  const str = [];

  const leftPadding = align === 'left'
    ? 0
    : align === 'center'
      ? Math.floor((width - text.length) / 2)
      : width - text.length;

  for (let i = 0; i < leftPadding; i++) {
    str.push(' ');
  }

  for (let i = 0; i < text.length; i++) {
    str.push(text[i]);
  }

  for (let i = 0; i < width - leftPadding - text.length; i++) {
    str.push(' ');
  }

  for (let i = 0; i < str.length; i++) {
    canvas[pos.top][pos.left + i] = color(str[i]);
  }
}

function printCell(cell: CellInfo, canvas: string[][], options: Options) {
  for (let sr = cell.bounds.firstRow; sr <= cell.bounds.lastRow; sr++) {
    for (let sc = cell.bounds.firstColumn; sc <= cell.bounds.lastColumn; sc++) {
      const color = getColor(cell, false, options);
      const sections = cell.sections.filter(s => s.sr === sr && s.sc === sc);

      for (let i = 0; i < sections.length; i++) {
        const sectionColor = sections[i].color;
        const c = sectionColor ? color.keyword(sectionColor) : color;

        printText(
          sections[i].text.toString(),
          {
            top: cell.innerPosition.top + (cell.rowStarts.get(sr) ?? 0) + i,
            left: cell.innerPosition.left + (cell.columnStarts.get(sc) ?? 0),
          },
          cell.columnWidths.get(sc) ?? 0,
          options.align,
          c,
          canvas
        );
      }
    }
  }
}

type Stringable = string | number | boolean;

export interface Options {
  includeZeroSection: boolean;
  equalBounds: boolean;
  equalSectionsInCell: boolean;
  collapseSections: boolean;
  collapseCells: boolean;
  sectionHorizonalBorder: string | false;
  sectionVerticalBorder: string | false;
  rowSpacing?: number;
  columnSpacing?: number;
  minWidth?: number;
  minHeight?: number;
  align: Align,
  rowIndexes?: true | ((r: number) => Stringable | Stringable[]);
  columnIndexes?: true | ((c: number) => Stringable | Stringable[])
  border?: false | ((v: Stringable, r: number, c: number) => [boolean, boolean, boolean, boolean]);
  indent: (column: number) => number;
  value?: (v: Stringable, r: number, c: number) => Stringable | Section[];
  highlight?: (v: Stringable, r: number, c: number) => boolean;
  underline?: (v: Stringable, r: number, c: number) => boolean;
  inverse?: (v: Stringable, r: number, c: number) => boolean;
  topValue?: ((v: Stringable, r: number, c: number) => Stringable | Section[]);
  rightValue?: (v: Stringable, r: number, c: number) => Stringable;
  bottomValue?: (v: Stringable, r: number, c: number) => Stringable;
  leftValue?: (v: Stringable, r: number, c: number) => Stringable;
  chalk?: chalk.Chalk;
}

export function matrixToStr(matrix: Stringable[][], printOptions?: Partial<Options>): string {
  const options: Options = {
    includeZeroSection: true,
    equalBounds: true,
    collapseSections: false,
    collapseCells: false,
    equalSectionsInCell: false,
    sectionHorizonalBorder: '-',
    sectionVerticalBorder: '|',
    align: 'center',
    border: () => ([true, true, true, true]),
    indent: () => 0,
    ...printOptions,
  };

  const cellInfosMatrix = getCellInfos(matrix, options);

  matrixForeach(cellInfosMatrix, (cell) => {
    cell.bounds = getCellBounds(cell.sections, options);
  });

  if (options.equalBounds) {
    const encompasingBounds = getEncompasingBounds(cellInfosMatrix);
    matrixForeach(cellInfosMatrix, (cell) => cell.bounds = { ...encompasingBounds });
  }

  matrixForeach(cellInfosMatrix, (cell) => measureCellSections(cell, options));

  if (!options.collapseSections) {
    equalizeCellSections(cellInfosMatrix);
  }

  matrixForeach(cellInfosMatrix, cell => calculateCellInnerSize(cell, options))

  const border = options.border ? 1 : 0;

  matrixForeach(cellInfosMatrix, (cell) => {
    cell.outerSize = {
      height: cell.innerSize.height + 2 * border,
      width: cell.innerSize.width + 2 * border,
    };
  });

  const matrixBounds = getMatrixBounds(cellInfosMatrix);

  const { rowIndexes, columnIndexes } = getIndexes(cellInfosMatrix, matrixBounds, options);
  const { rowIndexesHeights, rowIndexesWidth, columnIndexesHeight, columnIndexesWidths } = measureIndexes(rowIndexes, columnIndexes, options);

  const rowHeights = getOutterRowHeights(cellInfosMatrix, rowIndexesHeights);
  const columnWidths = getOutterColumnWidths(cellInfosMatrix, columnIndexesWidths);

  if (!options.collapseCells) {
    equalizeCellDimensions(rowHeights, columnWidths);
  }

  matrixForeach(cellInfosMatrix, (cell, r, c) => {
    cell.outerSize = {
      height: rowHeights.get(r) ?? 0,
      width: columnWidths.get(c) ?? 0,
    };
  });

  const { rowStarts, columnStarts } = getCellStarts(rowHeights, columnWidths, matrixBounds, options);

  calculateCellPositions(cellInfosMatrix, rowStarts, columnStarts, rowIndexesWidth, columnIndexesHeight, options);

  matrixForeach(cellInfosMatrix, cell => calculateSectionStarts(cell, options));

  const canvasSize = getCanvasSize(cellInfosMatrix);
  const canvas = matrixCreate(canvasSize.height, canvasSize.width, ' ');

  printIndexes(
    matrixBounds,
    rowIndexes,
    rowStarts,
    rowIndexesWidth,
    columnIndexes,
    columnStarts,
    columnIndexesHeight,
    columnWidths,
    options,
    canvas,
  );

  if (options.border) {
    printBorders(cellInfosMatrix, canvas, options.border);
  }

  printCellBackgrounds(cellInfosMatrix, canvas, options);

  matrixForeach(cellInfosMatrix, (cell) => {
    printSectionBorders(cell, canvas, options);
  });

  matrixForeach(cellInfosMatrix, (cell) => {
    printCell(cell, canvas, options);
  });

  return canvas.map(line => line.join('')).join('\n');
}

export function matrixPrint(matrix: Stringable[][], printOptions?: Partial<Options>) {
  const matrixStr = matrixToStr(matrix, printOptions)
  console.log(
    // chalk.bgBlack(
      matrixStr
    // )
  );
}
