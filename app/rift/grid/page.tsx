'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import Link from 'next/link';
import puzzlesData from '@/data/sudoku-puzzles.json';

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'setup' | 'playing' | 'gameover';

type Puzzle = {
  difficulty: Difficulty;
  clues: (number | null)[][];
  solution: number[][];
};

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export default function GridGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  
  const [validationResult, setValidationResult] = useState<'success' | 'failed' | null>(null);

  const loadPuzzle = useCallback((diff: Difficulty) => {
    const bank = puzzlesData.filter((p: any) => p.difficulty === diff) as Puzzle[];
    if (bank.length === 0) return;
    
    const randomPuzzle = bank[Math.floor(Math.random() * bank.length)];
    setPuzzle(randomPuzzle);
    // Deep copy clues
    setGrid(randomPuzzle.clues.map(row => [...row]));
    setSelectedCell(null);
    setValidationResult(null);
    setPhase('playing');
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (phase !== 'playing') return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = useCallback((num: number | null) => {
    if (phase !== 'playing' || !selectedCell || !puzzle) return;
    const [r, c] = selectedCell;
    
    // Can't edit clue cells
    if (puzzle.clues[r][c] !== null) return;

    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
    setValidationResult(null); // Clear errors
  }, [phase, selectedCell, puzzle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing' || !selectedCell) return;
      const [r, c] = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(null);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        setSelectedCell([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        setSelectedCell([r, Math.min(8, c + 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, selectedCell, handleNumberInput]);

  const handleSubmit = () => {
    if (!puzzle) return;
    
    let isCorrect = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== puzzle.solution[r][c]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    if (isCorrect) {
      setValidationResult('success');
      setTimeout(() => setPhase('gameover'), 1000);
    } else {
      setValidationResult('failed');
      setTimeout(() => setValidationResult(null), 2000);
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

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10 uppercase">Grid</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="easy">Easy</option>
              <option className="text-black" value="medium">Medium</option>
              <option className="text-black" value="hard">Hard</option>
            </select>
          </div>

          <button onClick={() => loadPuzzle(difficulty)} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && puzzle && (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg z-10 flex-1 relative">
          
          <div className="flex justify-between w-full uppercase tracking-widest text-sm">
            <span>Difficulty: {difficulty}</span>
            <button onClick={() => loadPuzzle(difficulty)} className="underline opacity-60 hover:opacity-100">
              New Puzzle
            </button>
          </div>

          {/* Grid Area */}
          <div className="border-4 border-current grid grid-cols-9 bg-neutral-300 dark:bg-neutral-800 gap-[1px]">
            {Array.from({ length: 9 }).map((_, r) => (
              Array.from({ length: 9 }).map((_, c) => {
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isClue = puzzle.clues[r][c] !== null;
                const val = grid[r][c];

                // Thicker borders for 3x3 subgrids
                let extraClasses = '';
                if (c % 3 === 2 && c !== 8) extraClasses += 'border-r-2 border-r-current ';
                if (r % 3 === 2 && r !== 8) extraClasses += 'border-b-2 border-b-current ';

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center cursor-pointer select-none transition-colors
                      ${extraClasses}
                      ${isSelected ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
                      ${isClue ? 'font-black' : 'font-medium text-[var(--color-ink-primary)] dark:text-[var(--color-ink-primary-dark)]'}
                    `}
                  >
                    {val && (
                      <span className="text-2xl sm:text-3xl font-sans leading-none" style={{ filter: 'url(#ink-bleed)' }}>
                        {val}
                      </span>
                    )}
                  </div>
                );
              })
            ))}
          </div>

          {/* Validation Msg */}
          <div className="h-6">
            {validationResult === 'failed' && <span className="text-red-500 font-bold uppercase tracking-widest">Not quite right.</span>}
            {validationResult === 'success' && <span className="text-green-500 font-bold uppercase tracking-widest">Solved!</span>}
          </div>

          {/* Number Palette */}
          {phase === 'playing' && (
            <div className="flex flex-col gap-4 w-full items-center mt-2">
              <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    className="w-10 h-10 sm:w-12 sm:h-12 border border-current rounded shadow-sm flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-xl sm:text-2xl font-sans font-black" style={{ filter: 'url(#ink-bleed)' }}>{num}</span>
                  </button>
                ))}
                <button
                  onClick={() => handleNumberInput(null)}
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-current rounded shadow-sm flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors uppercase text-xs font-bold"
                >
                  DEL
                </button>
              </div>

              <button 
                onClick={handleSubmit} 
                className="mt-4 w-full max-w-xs py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest uppercase rounded shadow hover:opacity-90 transition-opacity"
              >
                Submit Solution
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">Puzzle Solved!</h2>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Menu
              </button>
              <button onClick={() => loadPuzzle(difficulty)} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded uppercase tracking-widest text-sm">
                Next Puzzle
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
