'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import { Cell, checkLineWin } from '@/lib/games/lineWinCheck';
import { getColumnAIMove } from '@/lib/games/columnAI';
import Link from 'next/link';

type GameMode = 'cpu' | 'local';
type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'setup' | 'playing' | 'gameover';

const COLS = 7;
const ROWS = 6;
const WIN_LENGTH = 4;

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

const Blob = ({ player, isDark }: { player: Cell, isDark: boolean }) => {
  const color = player === 1 
    ? (isDark ? 'var(--color-ink-primary-dark)' : 'var(--color-ink-primary)') 
    : 'var(--color-ink-secondary)';

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      style={{ filter: 'url(#ink-bleed)', color }}
      initial={{ y: '-600%', scaleY: 1.2, scaleX: 0.8 }}
      animate={{ y: 0, scaleY: 1, scaleX: 1 }}
      transition={{ 
        y: { type: 'spring', stiffness: 200, damping: 15, mass: 1 },
        scaleY: { delay: 0.2, type: 'spring', stiffness: 300, damping: 10 },
        scaleX: { delay: 0.2, type: 'spring', stiffness: 300, damping: 10 }
      }}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </motion.svg>
  );
};

export default function ColumnGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<GameMode>('cpu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  
  const [board, setBoard] = useState<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);
  const [winner, setWinner] = useState<Cell>(0);
  const [winLine, setWinLine] = useState<[number, number][]>([]);
  const [winStreak, setWinStreak] = useState(0);
  const [highScore, setHighScoreState] = useState(0);
  
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  useEffect(() => {
    setHighScoreState(getHighScore('column') || 0);
  }, []);

  const initGame = () => {
    const newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    setBoard(newBoard);
    setCurrentPlayer(1);
    setWinner(0);
    setWinLine([]);
    setPhase('playing');
    setIsCpuThinking(false);
  };

  const handleColClick = (c: number) => {
    if (phase !== 'playing' || board[0][c] !== 0 || isCpuThinking) return;

    // Find drop row
    let dropR = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] === 0) {
        dropR = r;
        break;
      }
    }
    if (dropR === -1) return;

    const newBoard = board.map(row => [...row]);
    newBoard[dropR][c] = currentPlayer;
    setBoard(newBoard);

    const win = checkLineWin(newBoard, dropR, c, WIN_LENGTH);
    if (win.won) {
      handleWin(win.player, win.line);
    } else if (newBoard.every(row => row.every(cell => cell !== 0))) {
      setPhase('gameover'); // Draw
    } else {
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      if (mode === 'cpu' && nextPlayer === 2) {
        setIsCpuThinking(true);
        setTimeout(() => playCpuMove(newBoard), 500); // 500ms delay to let piece fall
      }
    }
  };

  const playCpuMove = useCallback((currentBoard: Cell[][]) => {
    const col = getColumnAIMove(currentBoard, difficulty, 2);
    if (col === -1) return;

    let dropR = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (currentBoard[r][col] === 0) {
        dropR = r;
        break;
      }
    }

    const newBoard = currentBoard.map(row => [...row]);
    newBoard[dropR][col] = 2;
    setBoard(newBoard);

    const win = checkLineWin(newBoard, dropR, col, WIN_LENGTH);
    if (win.won) {
      handleWin(win.player, win.line);
    } else if (newBoard.every(row => row.every(cell => cell !== 0))) {
      setPhase('gameover');
    } else {
      setCurrentPlayer(1);
    }
    setIsCpuThinking(false);
  }, [difficulty]);

  const handleWin = (player: Cell, line: [number, number][]) => {
    setWinner(player);
    setWinLine(line);
    setTimeout(() => setPhase('gameover'), 800); // Let animation finish before showing popup

    if (mode === 'cpu') {
      if (player === 1) {
        const newStreak = winStreak + 1;
        setWinStreak(newStreak);
        if (setHighScoreIfBetter('column', newStreak, true)) {
          setHighScoreState(newStreak);
        }
      } else {
        setWinStreak(0);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 font-serif tracking-widest">CONNECT-4</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as GameMode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="cpu">CPU</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>

          {mode === 'cpu' && (
            <div className="flex flex-col w-full gap-2">
              <label className="uppercase tracking-widest text-xs font-bold">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="p-2 bg-transparent border border-current rounded">
                <option className="text-black" value="easy">Easy</option>
                <option className="text-black" value="medium">Medium</option>
                <option className="text-black" value="hard">Hard</option>
              </select>
            </div>
          )}

          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>

          {highScore > 0 && mode === 'cpu' && (
            <p className="mt-4 text-sm opacity-70">CPU Win Streak Record: {highScore}</p>
          )}
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl z-10">
          <div className="flex justify-between w-full uppercase tracking-widest text-sm">
            <span className={currentPlayer === 1 ? 'font-bold' : 'opacity-50'}>Player 1</span>
            {mode === 'cpu' && <span>Streak: {winStreak}</span>}
            <span className={currentPlayer === 2 ? 'font-bold' : 'opacity-50'}>{mode === 'cpu' ? 'CPU' : 'Player 2'}</span>
          </div>

          <div className="flex gap-2 p-4 bg-neutral-300 dark:bg-neutral-800 rounded shadow-inner max-w-full">
            {Array.from({ length: COLS }).map((_, c) => (
              <button
                key={c}
                className="flex flex-col gap-2 w-10 sm:w-14"
                onClick={() => handleColClick(c)}
                disabled={phase !== 'playing' || board[0][c] !== 0 || isCpuThinking}
              >
                {board.map((row, r) => {
                  const cell = board[r][c];
                  const isWinCell = winLine.some(([wr, wc]) => wr === r && wc === c);
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-full aspect-square rounded-full flex items-center justify-center relative overflow-visible
                        ${isWinCell ? 'ring-4 ring-yellow-400 bg-neutral-200 dark:bg-neutral-700' : 'bg-neutral-200 dark:bg-neutral-700 shadow-inner'}
                      `}
                    >
                      {cell !== 0 && (
                        <div className="absolute inset-0 scale-125 z-10 pointer-events-none">
                          <Blob player={cell} isDark={isDark} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {winner === 1 ? 'Player 1 Wins!' : winner === 2 ? (mode === 'cpu' ? 'CPU Wins!' : 'Player 2 Wins!') : 'Draw!'}
            </h2>
            
            <div className="flex gap-4 mt-4">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Setup
              </button>
              <button onClick={initGame} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded uppercase tracking-widest text-sm">
                Play Again
              </button>
            </div>
            
            <Link href="/" className="mt-8 text-sm uppercase tracking-widest opacity-60 hover:opacity-100">
              Quit to Site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
