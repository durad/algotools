
interface BfsKeysResult<N, S> {
  visited: Set<string>;
  previousNode: Map<string, N>;
  visitIndex: Map<string, number>;
  visitLevel: Map<string, number>;
  getChain: (node: N) => N[];
  getSteps: (node: N) => (S | undefined)[];
}

export function bfsKeys<N, S>(
  options: {
    initialNodes: N[],
    nodeToStr: (node: N) => string,
    visitFn: (node: N, addNode: (newNode: N, step?: S) => void, result: BfsKeysResult<N, S>) => void | boolean,
    validNode?: (node: N) => boolean,
    maxLevel?: number,
  }
): BfsKeysResult<N, S> {
  const { nodeToStr, initialNodes, visitFn } = options;

  const visited = new Set<string>();
  const previousNode = new Map<string, N>();
  const previousStep = new Map<string, S | undefined>();
  const visitIndex = new Map<string, number>();
  const visitLevel = new Map<string, number>();

  const getChain = (node: N): N[] => {
    if (!visited.has(nodeToStr(node))) {
      return [];
    }

    const nodes: N[] = [];

    let n: (N | undefined) = node;
    do {
      nodes.push(n);
      const nKey = nodeToStr(n);
      n = previousNode.get(nKey);
    }
    while (n);

    return nodes.reverse();
  };

  const getSteps = (node: N): (S | undefined)[] => {
    const steps: (S | undefined)[] = [];

    let n: (N | undefined) = node;
    while (n && previousNode.get(nodeToStr(n))) {
      steps.push(previousStep.get(nodeToStr(n)));
      n = previousNode.get(nodeToStr(n));
    }

    return steps.reverse();
  };

  const result: BfsKeysResult<N, S> = {
    visited,
    previousNode,
    visitIndex,
    visitLevel,
    getChain,
    getSteps,
  };

  const queue: N[] = [];

  for (const initialNode of initialNodes) {
    const nKey = nodeToStr(initialNode);
    if (visited.has(nKey)) {
      continue;
    }

    queue.push(initialNode);
    visited.add(nKey);
    visitLevel.set(nKey, 0);
  }

  let currentIndex = 0;

  while (currentIndex < queue.length) {
    const currentNode = queue[currentIndex];
    const currentKey = nodeToStr(currentNode);
    visitIndex.set(currentKey, currentIndex);

    currentIndex++;

    const addedNodes: { node: N, step?: S }[] = [];
    const addNodeFn = (newNode: N, step?: S) => {
      if (!options.validNode || options.validNode(newNode)) {
        addedNodes.push({ node: newNode, step });
      }
    };

    const visitResult = visitFn(currentNode, addNodeFn, result);

    if (visitResult === true) {
      break;
    }

    if (options.maxLevel !== undefined && visitLevel.get(currentKey)! >= options.maxLevel) {
      continue;
    }

    for (const addedNode of addedNodes) {
      const newKey = nodeToStr(addedNode.node);

      if (visited.has(newKey)) {
        continue;
      }

      visited.add(newKey);
      visitLevel.set(newKey, visitLevel.get(currentKey)! + 1);
      previousNode.set(newKey, currentNode);
      previousStep.set(newKey, addedNode.step);
      queue.push(addedNode.node);
    }
  }

  return result;
}
