export type Cell = 0 | 1 | 2;
export type GridShape = 'square' | 'triangle';

// Represent an edge simply as a string "r1,c1-r2,c2" where r1<=r2 and if r1==r2 then c1<c2
export type EdgeId = string;
export function makeEdgeId(r1: number, c1: number, r2: number, c2: number): EdgeId {
  if (r1 < r2 || (r1 === r2 && c1 < c2)) {
    return `${r1},${c1}-${r2},${c2}`;
  }
  return `${r2},${c2}-${r1},${c1}`;
}

export type ShapeDef = {
  id: string; // e.g. "sq-r-c" or "tri1-r-c"
  edges: EdgeId[];
};

export function generateShapes(rows: number, cols: number, type: GridShape): ShapeDef[] {
  const shapes: ShapeDef[] = [];
  
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const top = makeEdgeId(r, c, r, c + 1);
      const bottom = makeEdgeId(r + 1, c, r + 1, c + 1);
      const left = makeEdgeId(r, c, r + 1, c);
      const right = makeEdgeId(r, c + 1, r + 1, c + 1);
      
      if (type === 'square') {
        shapes.push({
          id: `sq-${r}-${c}`,
          edges: [top, bottom, left, right]
        });
      } else {
        const diag = makeEdgeId(r, c, r + 1, c + 1); // top-left to bottom-right
        shapes.push({
          id: `tri1-${r}-${c}`, // Top-right triangle
          edges: [top, right, diag]
        });
        shapes.push({
          id: `tri2-${r}-${c}`, // Bottom-left triangle
          edges: [left, bottom, diag]
        });
      }
    }
  }
  return shapes;
}

export function checkShapes(
  drawnEdges: Set<EdgeId>,
  shapes: ShapeDef[]
): ShapeDef[] {
  return shapes.filter(s => s.edges.every(e => drawnEdges.has(e)));
}

// Valid edges helper
export function generateValidEdges(rows: number, cols: number, type: GridShape): EdgeId[] {
  const edges = new Set<EdgeId>();
  for (const shape of generateShapes(rows, cols, type)) {
    for (const edge of shape.edges) {
      edges.add(edge);
    }
  }
  return Array.from(edges);
}

export function getBestMove(
  drawnEdges: Set<EdgeId>,
  allEdges: EdgeId[],
  shapes: ShapeDef[]
): EdgeId {
  const available = allEdges.filter(e => !drawnEdges.has(e));
  if (available.length === 0) return '';

  // 1. Can we complete a shape right now? (Takes priority, grants extra turn)
  for (const edge of available) {
    drawnEdges.add(edge);
    const completed = shapes.filter(s => s.edges.every(e => drawnEdges.has(e)));
    drawnEdges.delete(edge);
    if (completed.length > 0) return edge;
  }

  // 2. Filter out moves that would give away a shape
  const safeMoves = available.filter(edge => {
    drawnEdges.add(edge);
    const givesAway = shapes.some(s => {
      const drawnCount = s.edges.filter(e => drawnEdges.has(e)).length;
      return drawnCount === s.edges.length - 1;
    });
    drawnEdges.delete(edge);
    return !givesAway;
  });

  if (safeMoves.length > 0) {
    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }

  // 3. Forced to give away a shape
  return available[Math.floor(Math.random() * available.length)];
}
