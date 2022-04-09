import { bfsNodes } from '../src/bfs-nodes';
import { bfsKeys } from '../src/bfs-keys';
import { matrixPrint } from '../src/matrix-print';
import { nestedLoopsAllArrays, nestedLoopsCbArrays } from '../src/nested-loops';

const m: any = [
  ['A', 'B'],
  ['Q', 'W'],
  [1, 2, 3],
];

const result = nestedLoopsAllArrays(m);
console.log(result);

// type N = { name: string; links: N[] };

// const A: N = { name: 'A', links: [] };
// const B: N = { name: 'B', links: [] };
// const C: N = { name: 'C', links: [] };
// const D: N = { name: 'D', links: [] };

// A.links.push(B);
// B.links.push(D);
// C.links.push(D);

// const result = bfsNodes({
//   initialNodes: [A],
//     visitFn: (node, addNode) => {
//     for (const l of node.links) {
//       addNode(l, l.name);
//     }
//   },
//   // maxLevel: 1
//   // validNode: (node) => node !== C
// });

// console.log(result);
// // console.log(result.getSteps(D));



// const m = [
//   [0, 1, 0, 0, 0],
//   [0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0],
//   [0, 1, 0, 1, 0],
//   [0, 0, 0, 1, 0],
// ];

// const dirs: Record<string, any> = {
//   N: { y: -1, x: 0 },
//   S: { y: 1, x: 0 },
//   E: { y: 0, x: 1 },
//   W: { y: 0, x: -1 },
// };

// const result = bfsKeys({
//   validNode: ({ y, x }) => y >= 0 && y < m.length && x >= 0 && x < m[y].length && m[y][x] === 0,
//   initialNodes: [{ y: 0, x: 0 }],
//   nodeToStr: ({ y, x }) => `${y}:${x}`,
//   visitFn: (node, addNode) => {
//     for (const dkey in dirs) {
//       const ny = node.y + dirs[dkey].y;
//       const nx = node.x + dirs[dkey].x;
//       addNode({ y: ny, x: nx }, dkey);
//     }
//   },
//   maxLevel: 6,
// });

// const chain = result.getChain({ y: 0, x: 3 });
// const map = new Set(chain.map(({ y, x }) => `${y}:${x}`));

// matrixPrint(m, {
//   minWidth: 4,
//   inverse: (v, r, c) => v === 1,
//   value: (v, r, c) => result.visitLevel.get(`${r}:${c}`) ?? '',
//   highlight: (v, r, c) => map.has(`${r}:${c}`),
// });
