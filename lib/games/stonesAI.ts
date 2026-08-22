import { Cell, checkLineWin } from './lineWinCheck';

export function getStonesAIMove(
  board: Cell[][],
  difficulty: 'easy' | 'medium' | 'hard',
  cpuPlayer: Cell,
  winLength: number
): [number, number] {
  const humanPlayer = cpuPlayer === 1 ? 2 : 1;
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c] === 0) emptyCells.push([r, c]);
    }
  }

  if (emptyCells.length === 0) return [-1, -1];

  // Hard 3x3 (minimax)
  if (difficulty === 'hard' && board.length === 3) {
    let bestScore = -Infinity;
    let bestMove = emptyCells[0];
    for (const [r, c] of emptyCells) {
      board[r][c] = cpuPlayer;
      const score = minimax(board, false, cpuPlayer, humanPlayer, winLength, 0, r, c);
      board[r][c] = 0;
      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }
    return bestMove;
  }

  // Heuristics for others
  // 1. Can CPU win right now? (Medium/Hard)
  if (difficulty === 'medium' || difficulty === 'hard') {
    for (const [r, c] of emptyCells) {
      board[r][c] = cpuPlayer;
      const win = checkLineWin(board, r, c, winLength);
      board[r][c] = 0;
      if (win.won) return [r, c];
    }
  }

  // 2. Can Human win right now? Block it. (Easy/Medium/Hard)
  for (const [r, c] of emptyCells) {
    board[r][c] = humanPlayer;
    const win = checkLineWin(board, r, c, winLength);
    board[r][c] = 0;
    if (win.won) return [r, c];
  }

  // 3. Medium/Hard: Center/near-existing heuristic
  if (difficulty === 'medium') {
    return getHeuristicMove(board, emptyCells);
  }

  // 4. Hard 9x9/15x15: 2-ply lookahead (simulate one move ahead)
  if (difficulty === 'hard' && board.length > 3) {
    for (const [r, c] of emptyCells) {
      board[r][c] = cpuPlayer;
      // Check if this move creates two unblocked win paths (simplified)
      // Actually, a simple 2-ply: see if there is any move that human can make next that we can't block,
      // or if we can make a move that human can't block. 
      // To keep it simple and performant:
      let createdThreats = 0;
      const subEmpty = emptyCells.filter(([er, ec]) => er !== r || ec !== c);
      for (const [hr, hc] of subEmpty) {
        board[hr][hc] = cpuPlayer;
        if (checkLineWin(board, hr, hc, winLength).won) createdThreats++;
        board[hr][hc] = 0;
      }
      board[r][c] = 0;
      if (createdThreats >= 2) return [r, c]; // Fork!
    }

    // Block human forks
    for (const [r, c] of emptyCells) {
      board[r][c] = humanPlayer;
      let humanThreats = 0;
      const subEmpty = emptyCells.filter(([er, ec]) => er !== r || ec !== c);
      for (const [hr, hc] of subEmpty) {
        board[hr][hc] = humanPlayer;
        if (checkLineWin(board, hr, hc, winLength).won) humanThreats++;
        board[hr][hc] = 0;
      }
      board[r][c] = 0;
      if (humanThreats >= 2) return [r, c];
    }

    return getHeuristicMove(board, emptyCells);
  }

  // Easy fallback
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getHeuristicMove(board: Cell[][], emptyCells: [number, number][]): [number, number] {
  // Prefer center
  const center = Math.floor(board.length / 2);
  if (board[center][center] === 0) return [center, center];

  // Prefer adjacent to existing marks
  const adjacents = emptyCells.filter(([r, c]) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board.length) {
          if (board[nr][nc] !== 0) return true;
        }
      }
    }
    return false;
  });

  if (adjacents.length > 0) {
    return adjacents[Math.floor(Math.random() * adjacents.length)];
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function minimax(
  board: Cell[][],
  isMaximizing: boolean,
  cpuPlayer: Cell,
  humanPlayer: Cell,
  winLength: number,
  depth: number,
  lastR: number,
  lastC: number
): number {
  if (lastR !== -1) {
    const win = checkLineWin(board, lastR, lastC, winLength);
    if (win.won) {
      return isMaximizing ? -10 + depth : 10 - depth;
    }
  }
  
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c] === 0) emptyCells.push([r, c]);
    }
  }

  if (emptyCells.length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const [r, c] of emptyCells) {
      board[r][c] = cpuPlayer;
      const score = minimax(board, false, cpuPlayer, humanPlayer, winLength, depth + 1, r, c);
      board[r][c] = 0;
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const [r, c] of emptyCells) {
      board[r][c] = humanPlayer;
      const score = minimax(board, true, cpuPlayer, humanPlayer, winLength, depth + 1, r, c);
      board[r][c] = 0;
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
}
