import { Cell, checkLineWin } from './lineWinCheck';

const COLS = 7;
const ROWS = 6;
const WIN_LENGTH = 4;

export function getColumnAIMove(
  board: Cell[][], // 6 rows, 7 cols
  difficulty: 'easy' | 'medium' | 'hard',
  cpuPlayer: Cell
): number {
  const humanPlayer = cpuPlayer === 1 ? 2 : 1;
  
  const validCols = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === 0) validCols.push(c);
  }
  if (validCols.length === 0) return -1;

  if (difficulty === 'hard') {
    let bestScore = -Infinity;
    let bestCol = validCols[0];
    for (const c of validCols) {
      const r = getDropRow(board, c);
      board[r][c] = cpuPlayer;
      const score = minimax(board, 0, false, cpuPlayer, humanPlayer, -Infinity, Infinity, r, c);
      board[r][c] = 0;
      if (score > bestScore) {
        bestScore = score;
        bestCol = c;
      }
    }
    return bestCol;
  }

  // Medium / Easy: Block or Win
  if (difficulty === 'medium') {
    // 1. Win
    for (const c of validCols) {
      const r = getDropRow(board, c);
      board[r][c] = cpuPlayer;
      if (checkLineWin(board, r, c, WIN_LENGTH).won) {
        board[r][c] = 0;
        return c;
      }
      board[r][c] = 0;
    }
    // 2. Block
    for (const c of validCols) {
      const r = getDropRow(board, c);
      board[r][c] = humanPlayer;
      if (checkLineWin(board, r, c, WIN_LENGTH).won) {
        board[r][c] = 0;
        return c;
      }
      board[r][c] = 0;
    }
  }

  // Fallback to random
  return validCols[Math.floor(Math.random() * validCols.length)];
}

function getDropRow(board: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

// Alpha-Beta Minimax
function minimax(
  board: Cell[][],
  depth: number,
  isMaximizing: boolean,
  cpuPlayer: Cell,
  humanPlayer: Cell,
  alpha: number,
  beta: number,
  lastR: number,
  lastC: number
): number {
  if (lastR !== -1) {
    if (checkLineWin(board, lastR, lastC, WIN_LENGTH).won) {
      return isMaximizing ? -1000 + depth : 1000 - depth;
    }
  }

  // Hard cap at depth 7 for Connect-4 to stay instantly responsive on JS thread
  if (depth >= 7) {
    return scorePosition(board, cpuPlayer);
  }

  const validCols = [];
  // Center-weighted column exploration for faster alpha-beta cutoffs
  const colOrder = [3, 2, 4, 1, 5, 0, 6];
  for (const c of colOrder) {
    if (board[0][c] === 0) validCols.push(c);
  }

  if (validCols.length === 0) return 0; // Draw

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const c of validCols) {
      const r = getDropRow(board, c);
      board[r][c] = cpuPlayer;
      const ev = minimax(board, depth + 1, false, cpuPlayer, humanPlayer, alpha, beta, r, c);
      board[r][c] = 0;
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const c of validCols) {
      const r = getDropRow(board, c);
      board[r][c] = humanPlayer;
      const ev = minimax(board, depth + 1, true, cpuPlayer, humanPlayer, alpha, beta, r, c);
      board[r][c] = 0;
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function scorePosition(board: Cell[][], player: Cell): number {
  let score = 0;
  // Score center column higher
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][3] === player) centerCount++;
  }
  score += centerCount * 3;
  return score;
}
