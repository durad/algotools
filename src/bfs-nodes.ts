
interface BfsNodesResult<N, S> {
  visited: Set<N>;
  previousNode: Map<N, N>;
  visitIndex: Map<N, number>;
  visitLevel: Map<N, number>;
  getChain: (node: N) => N[];
  getSteps: (node: N) => (S | undefined)[];
}

export function bfsNodes<N, S>(
  options: {
    initialNodes: N[],
    visitFn: (node: N, addNode: (newNode: N, step?: S) => void, result: BfsNodesResult<N, S>) => void | boolean,
    validNode?: (node: N) => boolean,
    maxLevel?: number,
  }
): BfsNodesResult<N, S> {
  const { initialNodes, visitFn } = options;

  const visited = new Set<N>();
  const previousNode = new Map<N, N>();
  const previousStep = new Map<N, S | undefined>();
  const visitIndex = new Map<N, number>();
  const visitLevel = new Map<N, number>();

  const getChain = (node: N): N[] => {
    if (!visited.has(node)) {
      return [];
    }

    const nodes: N[] = [];

    let n: (N | undefined) = node;
    do {
      nodes.push(n);
      n = previousNode.get(n);
    }
    while (n);

    return nodes.reverse();
  };

  const getSteps = (node: N): (S | undefined)[] => {
    const steps: (S | undefined)[] = [];

    let n: (N | undefined) = node;
    while (n && previousNode.get(n)) {
      steps.push(previousStep.get(n));
      n = previousNode.get(n);
    }

    return steps.reverse();
  };

  const result: BfsNodesResult<N, S> = {
    visited,
    previousNode,
    visitIndex,
    visitLevel,
    getChain,
    getSteps,
  };

  const queue: N[] = [];

  for (const initialNode of initialNodes) {
    if (visited.has(initialNode)) {
      continue;
    }

    queue.push(initialNode);
    visited.add(initialNode);
    visitLevel.set(initialNode, 0);
  }

  let currentIndex = 0;

  while (currentIndex < queue.length) {
    const currentNode = queue[currentIndex];
    visitIndex.set(currentNode, currentIndex);

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

    if (options.maxLevel !== undefined && visitLevel.get(currentNode)! >= options.maxLevel) {
      continue;
    }

    for (const addedNode of addedNodes) {
      if (visited.has(addedNode.node)) {
        continue;
      }

      visited.add(addedNode.node);
      visitLevel.set(addedNode.node, visitLevel.get(currentNode)! + 1);
      previousNode.set(addedNode.node, currentNode);
      previousStep.set(addedNode.node, addedNode.step);
      queue.push(addedNode.node);
    }
  }

  return result;
}
