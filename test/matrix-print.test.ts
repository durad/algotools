
import * as path from 'path';
import fsExtra from 'fs-extra';
import { testMatrix } from './test-matrix';

beforeAll(() => {
  if (process.env.WRITE_FIXTURES) {
    const fixturesPath = path.resolve(__dirname, './fixtures');
    fsExtra.emptyDirSync(fixturesPath);
  }
});

describe('Smoke tests', () => {
  it('Prints matrix with no options', () => {
    testMatrix(
      'no_options',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ]
    );
  });

  it('Prints matrix with no data', () => {
    testMatrix(
      'no_data',
      []
    );
  });

  it('Prints matrix with one row', () => {
    testMatrix(
      'one_row',
      [
        [1, 222, 3],
      ]
    );
  });

  it('Prints matrix with one column', () => {
    testMatrix(
      'one_column',
      [
        [1],
        [222],
        [3],
      ]
    );
  });

  it('Prints matrix with no borders', () => {
    testMatrix(
      'no_borders',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        border: false,
      }
    );
  });

  it('Prints staggered matrix', () => {
    testMatrix(
      'staggered',
      [
        [111, 2, 3],
        [4, 555],
        [7],
      ]
    );
  });

  it('Prints reversed staggered matrix', () => {
    testMatrix(
      'staggered_reverse',
      [
        [111],
        [4, 555],
        [7, 8, 9],
      ],
    );
  });

  it('Prints matrix with empty rows', () => {
    testMatrix(
      'empty_rows',
      [
        [111],
        [],
        [7, 888, 9],
      ],
    );
  });

  it('Prints matrix with empty rows and no border', () => {
    testMatrix(
      'empty_rows_no_border',
      [
        [111],
        [],
        [7, 888, 9],
      ],
      {
        border: false,
      }
    );
  });

  it('Prints matrix with collapsed cells', () => {
    testMatrix(
      'collapse_cells',
      [
        [1, 2, 3, 4],
        [],
        [7, 888, 9],
      ],
    );
  });

  it('Prints matrix with collapsed cells and no border', () => {
    testMatrix(
      'collapse_cells_no_border',
      [
        [1, 2, 3, 4],
        [],
        [7, 888, 9],
      ],
      {
        border: false,
      }
    );
  });

  it('Prints matrix with collapsed cells and no border aligned left', () => {
    testMatrix(
      'collapse_cells_align_left',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        border: false,
        align: 'left'
      }
    );
  });

  it('Prints matrix with collapsed cells and no border aligned right', () => {
    testMatrix(
      'collapse_cells_align_right',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        border: false,
        align: 'left'
      }
    );
  });

  it('Prints indented matrix', () => {
    testMatrix(
      'indented',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        indent: (r) => r * 2,
      }
    );
  });

  it('Prints matrix with top value', () => {
    testMatrix(
      'top_value',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        topValue: (v, r, c) => r + c,
      }
    );
  });

  it('Prints matrix with right value', () => {
    testMatrix(
      'right_value',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        rightValue: (v, r, c) => r + c,
      }
    );
  });

  it('Prints matrix with bottom value', () => {
    testMatrix(
      'bottom_value',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        bottomValue: (v, r, c) => r + c,
      }
    );
  });

  it('Prints matrix with left value', () => {
    testMatrix(
      'left_value',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        leftValue: (v, r, c) => r + c,
      }
    );
  });

  it('Prints matrix with top value and no border', () => {
    testMatrix(
      'top_value_no_border',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        topValue: (v, r, c) => r + c,
        border: false,
      }
    );
  });

  it('Prints matrix with right value and no border', () => {
    testMatrix(
      'right_value_no_border',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        rightValue: (v, r, c) => r + c,
        border: false,
      }
    );
  });

  it('Prints matrix with bottom value and no border', () => {
    testMatrix(
      'bottom_value_no_border',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        bottomValue: (v, r, c) => r + c,
        border: false,
      }
    );
  });

  it('Prints matrix with left value and no border', () => {
    testMatrix(
      'left_value_no_border',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        leftValue: (v, r, c) => r + c,
        border: false,
      }
    );
  });

  it('Prints matrix with top value indented', () => {
    testMatrix(
      'top_value_indented',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        topValue: (v, r, c) => r + c,
        indent: (r) => r * 4,
      }
    );
  });

  it('Prints matrix with right value indented', () => {
    testMatrix(
      'right_value_indented',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        rightValue: (v, r, c) => r + c,
        indent: (r) => r * 4,
      }
    );
  });

  it('Prints matrix with bottom value indented', () => {
    testMatrix(
      'bottom_value_indented',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        bottomValue: (v, r, c) => r + c,
        indent: (r) => r * 4,
      }
    );
  });

  it('Prints matrix with left value indented', () => {
    testMatrix(
      'left_value_indented',
      [
        [1, 2, 3, 4],
        [5, 6],
        [7, 888, 9],
      ],
      {
        leftValue: (v, r, c) => r + c,
        indent: (r) => r * 4,
      }
    );
  });

  it('Prints matrix with left value indented', () => {
    testMatrix(
      'multi_sections',
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      {
        value: (v, r, c) => {
          const sections = [];

          for (let i = 0; i <= r; i++) {
            sections.push({ sc: 0, sr: i, text: `${r}_${c}_${v}` });
          }

          return sections;
        }
      }
    );
  });

  it('Prints matrix with left value indented', () => {
    testMatrix(
      'multi_sections_no_section_border',
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      {
        value: (v, r, c) => {
          const sections = [];

          for (let i = 0; i <= r; i++) {
            sections.push({ sc: 0, sr: i, text: `${r}_${c}_${v}` });
          }

          return sections;
        },
        sectionHorizonalBorder: false,
      }
    );
  });

  it('Prints matrix with highlight', () => {
    testMatrix(
      'highlight',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        highlight: (v, r, c) => r === c,
      }
    );
  });

  it('Prints matrix with inverse', () => {
    testMatrix(
      'inverse',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        inverse: (v, r, c) => r === c,
      }
    );
  });

  it('Prints matrix with underline', () => {
    testMatrix(
      'underline',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        underline: (v, r, c) => r === c,
      }
    );
  });

  it('Prints matrix with highlight, inverse and underline', () => {
    testMatrix(
      'highlight_inverse_underline',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        highlight: (v, r, c) => r === 1,
        inverse: (v, r, c) => c === 1,
        underline: (v, r, c) => r === c,
      }
    );
  });

  it('Prints matrix with conditional borders', () => {
    testMatrix(
      'conditional_borders',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        border: (v, r, c) => r === c ? [true, true, true, true] : [false, false, false, false],
      }
    );
  });

  it('Prints matrix with conditional borders and spacing', () => {
    testMatrix(
      'conditional_borders_spacing',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        border: (v, r, c) => ([
          r * 4 + c % 3 !== 0,
          r * 4 + c % 3 !== 1,
          r * 4 + c % 3 !== 2,
          r * 4 + c % 3 !== 2,
        ]),
        rowSpacing: 1,
        columnSpacing: 2,
      }
    );
  });

  it('Prints matrix with partial borders', () => {
    testMatrix(
      'partial_borders',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        border: (v, r, c) => ([
          false,
          c === 0,
          r === 0,
          false,
        ]),
      }
    );
  });

  it('Prints matrix with column indexes', () => {
    testMatrix(
      'column_indexes',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        columnIndexes: true,
      }
    );
  });

  it('Prints matrix with row indexes', () => {
    testMatrix(
      'row_indexes',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        rowIndexes: true,
      }
    );
  });

  it('Prints matrix with column and row indexes', () => {
    testMatrix(
      'column_row_indexes',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        columnIndexes: true,
        rowIndexes: true,
      }
    );
  });

  it('Prints matrix with custom column and row indexes', () => {
    testMatrix(
      'custom_column_row_indexes',
      [
        [111, 2, 3],
        [4, 555, 6],
        [7, 8, 9],
      ],
      {
        columnIndexes: (c) => `column: ${c}`,
        rowIndexes: (r) => `row: ${r}`,
      }
    );
  });
});
