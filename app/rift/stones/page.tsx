'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import { Cell, checkLineWin } from '@/lib/games/lineWinCheck';
import { getStonesAIMove } from '@/lib/games/stonesAI';
import Link from 'next/link';

type BoardSize = 3 | 9 | 15;
type GameMode = 'cpu' | 'local';
type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'setup' | 'playing' | 'gameover';

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

const Mark = ({ player, size, isDark }: { player: Cell, size: number, isDark: boolean }) => {
  const [transform, setTransform] = useState('');
  useEffect(() => {
    const rot = Math.random() * 20 - 10;
    const scaleX = 0.9 + Math.random() * 0.2;
    const scaleY = 0.9 + Math.random() * 0.2;
    setTransform(`rotate(${rot}deg) scale(${scaleX}, ${scaleY})`);
  }, []);

  const strokeWidth = size === 3 ? 4 : (size === 9 ? 3 : 2);
  const color = player === 1 
    ? (isDark ? 'var(--color-ink-primary-dark)' : 'var(--color-ink-primary)') 
    : 'var(--color-ink-secondary)';

  if (player === 1) {
    return (
      <motion.svg
        viewBox="0 0 24 24"
        className="w-full h-full"
        style={{ filter: 'url(#ink-bleed)', transform, color }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <path d="M 5 5 L 19 19 M 19 5 L 5 19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
      </motion.svg>
    );
  }
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      style={{ filter: 'url(#ink-bleed)', transform, color }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
    </motion.svg>
  );
};

export default function StonesGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
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
    setHighScoreState(getHighScore('stones') || 0);
  }, []);

  const winLength = boardSize === 3 ? 3 : 5;

  const initGame = () => {
    const newBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    setBoard(newBoard);
    setCurrentPlayer(1);
    setWinner(0);
    setWinLine([]);
    setPhase('playing');
    setIsCpuThinking(false);
  };

  const handleCellClick = (r: number, c: number) => {
    if (phase !== 'playing' || board[r][c] !== 0 || isCpuThinking) return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = currentPlayer;
    setBoard(newBoard);

    const win = checkLineWin(newBoard, r, c, winLength);
    if (win.won) {
      handleWin(win.player, win.line);
    } else if (newBoard.every(row => row.every(cell => cell !== 0))) {
      setPhase('gameover'); // Draw
    } else {
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      if (mode === 'cpu' && nextPlayer === 2) {
        setIsCpuThinking(true);
        setTimeout(() => playCpuMove(newBoard), 100); // slight delay for feel
      }
    }
  };

  const playCpuMove = useCallback((currentBoard: Cell[][]) => {
    const move = getStonesAIMove(currentBoard, difficulty, 2, winLength);
    if (move[0] === -1) return;

    const newBoard = currentBoard.map(row => [...row]);
    newBoard[move[0]][move[1]] = 2;
    setBoard(newBoard);

    const win = checkLineWin(newBoard, move[0], move[1], winLength);
    if (win.won) {
      handleWin(win.player, win.line);
    } else if (newBoard.every(row => row.every(cell => cell !== 0))) {
      setPhase('gameover');
    } else {
      setCurrentPlayer(1);
    }
    setIsCpuThinking(false);
  }, [difficulty, winLength]);

  const handleWin = (player: Cell, line: [number, number][]) => {
    setWinner(player);
    setWinLine(line);
    setPhase('gameover');

    if (mode === 'cpu') {
      if (player === 1) {
        const newStreak = winStreak + 1;
        setWinStreak(newStreak);
        if (setHighScoreIfBetter('stones', newStreak, true)) {
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

      <h1 className="text-4xl font-bold mb-8 font-serif tracking-widest">GRID STRATEGY</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as GameMode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="cpu">CPU</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Board Size</label>
            <select value={boardSize} onChange={(e) => setBoardSize(Number(e.target.value) as BoardSize)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value={3}>3x3</option>
              <option className="text-black" value={9}>9x9</option>
              <option className="text-black" value={15}>15x15</option>
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
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="flex justify-between w-full uppercase tracking-widest text-sm">
            <span className={currentPlayer === 1 ? 'font-bold' : 'opacity-50'}>Player 1 (Cross)</span>
            {mode === 'cpu' && <span>Streak: {winStreak}</span>}
            <span className={currentPlayer === 2 ? 'font-bold' : 'opacity-50'}>{mode === 'cpu' ? 'CPU' : 'Player 2'} (Ring)</span>
          </div>

          <div 
            className="grid gap-1 p-2 bg-neutral-300 dark:bg-neutral-800 rounded aspect-square w-full max-w-[600px]"
            style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
          >
            {board.map((row, r) => 
              row.map((cell, c) => {
                const isWinCell = winLine.some(([wr, wc]) => wr === r && wc === c);
                return (
                  <button
                    key={`${r}-${c}`}
                    className={`bg-white dark:bg-neutral-900 aspect-square flex items-center justify-center transition-colors
                      ${isWinCell ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                    `}
                    onClick={() => handleCellClick(r, c)}
                    disabled={phase !== 'playing' || cell !== 0 || isCpuThinking}
                  >
                    {cell !== 0 && <Mark player={cell} size={boardSize} isDark={isDark} />}
                  </button>
                );
              })
            )}
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
