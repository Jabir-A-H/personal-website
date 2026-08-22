'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import { Cell, GridShape, EdgeId, ShapeDef, generateShapes, generateValidEdges, checkShapes, getBestMove, makeEdgeId } from '@/lib/games/shapeClaimEngine';
import Link from 'next/link';

type GameMode = 'cpu' | 'local';
type Phase = 'setup' | 'playing' | 'gameover';

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export default function SealGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<GameMode>('cpu');
  const [gridSize, setGridSize] = useState<number>(4);
  const [gridShape, setGridShape] = useState<GridShape>('square');
  
  const [drawnEdges, setDrawnEdges] = useState<string[]>([]);
  const [claimedShapes, setClaimedShapes] = useState<{ id: string, owner: Cell }[]>([]);
  
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);
  const [winStreak, setWinStreak] = useState(0);
  const [highScore, setHighScoreState] = useState(0);
  
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  // Memoize definitions
  const shapes = useMemo(() => generateShapes(gridSize, gridSize, gridShape), [gridSize, gridShape]);
  const validEdges = useMemo(() => generateValidEdges(gridSize, gridSize, gridShape), [gridSize, gridShape]);

  useEffect(() => {
    setHighScoreState(getHighScore('seal') || 0);
  }, []);

  const initGame = () => {
    setDrawnEdges([]);
    setClaimedShapes([]);
    setCurrentPlayer(1);
    setPhase('playing');
    setIsCpuThinking(false);
  };

  const checkGameEnd = (currentDrawn: string[], currentClaimed: { id: string, owner: Cell }[]) => {
    if (currentDrawn.length === validEdges.length) {
      setPhase('gameover');
      if (mode === 'cpu') {
        const p1Score = currentClaimed.filter(s => s.owner === 1).length;
        const p2Score = currentClaimed.filter(s => s.owner === 2).length;
        if (p1Score > p2Score) {
          const newStreak = winStreak + 1;
          setWinStreak(newStreak);
          if (setHighScoreIfBetter('seal', newStreak, true)) {
            setHighScoreState(newStreak);
          }
        } else {
          setWinStreak(0);
        }
      }
      return true;
    }
    return false;
  };

  const handleEdgeClick = (edgeId: EdgeId) => {
    if (phase !== 'playing' || drawnEdges.includes(edgeId) || isCpuThinking) return;

    applyMove(edgeId, currentPlayer);
  };

  const applyMove = (edgeId: EdgeId, player: Cell) => {
    const newDrawn = [...drawnEdges, edgeId];
    setDrawnEdges(newDrawn);

    const newlyCompleted = checkShapes(new Set(newDrawn), shapes)
      .filter(s => !claimedShapes.some(cs => cs.id === s.id));

    let nextPlayer = player;
    let nextClaimed = claimedShapes;

    if (newlyCompleted.length > 0) {
      // Extra turn!
      nextClaimed = [...claimedShapes, ...newlyCompleted.map(s => ({ id: s.id, owner: player }))];
      setClaimedShapes(nextClaimed);
    } else {
      nextPlayer = player === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
    }

    if (!checkGameEnd(newDrawn, nextClaimed)) {
      if (mode === 'cpu' && nextPlayer === 2) {
        setIsCpuThinking(true);
        setTimeout(() => playCpuMove(newDrawn, nextClaimed), 500);
      } else {
        setIsCpuThinking(false);
      }
    } else {
      setIsCpuThinking(false);
    }
  };

  const playCpuMove = useCallback((currentDrawn: string[], currentClaimed: any[]) => {
    const edge = getBestMove(new Set(currentDrawn), validEdges, shapes);
    if (!edge) return;
    
    const newDrawn = [...currentDrawn, edge];
    setDrawnEdges(newDrawn);

    const newlyCompleted = checkShapes(new Set(newDrawn), shapes)
      .filter(s => !currentClaimed.some(cs => cs.id === s.id));

    let nextPlayer: Cell = 2;
    let nextClaimed = currentClaimed;

    if (newlyCompleted.length > 0) {
      nextClaimed = [...currentClaimed, ...newlyCompleted.map(s => ({ id: s.id, owner: 2 }))];
      setClaimedShapes(nextClaimed);
    } else {
      nextPlayer = 1;
      setCurrentPlayer(1);
    }

    if (!checkGameEnd(newDrawn, nextClaimed)) {
      if (nextPlayer === 2) {
        // AI gets another turn
        setTimeout(() => playCpuMove(newDrawn, nextClaimed), 500);
      } else {
        setIsCpuThinking(false);
      }
    } else {
      setIsCpuThinking(false);
    }
  }, [validEdges, shapes, mode, winStreak]);

  const p1Score = claimedShapes.filter(s => s.owner === 1).length;
  const p2Score = claimedShapes.filter(s => s.owner === 2).length;

  const SPACING = 60;
  const boardWidth = (gridSize - 1) * SPACING;
  const boardHeight = (gridSize - 1) * SPACING;

  // Helper to draw shapes
  const renderShapePath = (sId: string) => {
    const parts = sId.split('-');
    const r = parseInt(parts[1]);
    const c = parseInt(parts[2]);
    const x0 = c * SPACING;
    const y0 = r * SPACING;
    const x1 = (c + 1) * SPACING;
    const y1 = (r + 1) * SPACING;

    if (parts[0] === 'sq') {
      return `M ${x0},${y0} L ${x1},${y0} L ${x1},${y1} L ${x0},${y1} Z`;
    } else if (parts[0] === 'tri1') {
      return `M ${x0},${y0} L ${x1},${y0} L ${x1},${y1} Z`;
    } else if (parts[0] === 'tri2') {
      return `M ${x0},${y0} L ${x0},${y1} L ${x1},${y1} Z`;
    }
    return '';
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 font-serif tracking-widest">CLAIM THE SCROLL</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as GameMode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="cpu">CPU</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>

          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Grid Size</label>
            <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value={4}>4x4</option>
              <option className="text-black" value={6}>6x6</option>
              <option className="text-black" value={8}>8x8</option>
            </select>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Shape Mode</label>
            <select value={gridShape} onChange={(e) => setGridShape(e.target.value as GridShape)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="square">Square</option>
              <option className="text-black" value="triangle">Triangle</option>
            </select>
          </div>

          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>

          {highScore > 0 && mode === 'cpu' && (
            <p className="mt-4 text-sm opacity-70">CPU Win Streak Record: {highScore}</p>
          )}
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl z-10">
          <div className="flex justify-between w-full uppercase tracking-widest text-sm mb-4">
            <span className={currentPlayer === 1 ? 'font-bold' : 'opacity-50'}>Player 1: {p1Score}</span>
            {mode === 'cpu' && <span>Streak: {winStreak}</span>}
            <span className={currentPlayer === 2 ? 'font-bold' : 'opacity-50'}>{mode === 'cpu' ? 'CPU' : 'Player 2'}: {p2Score}</span>
          </div>

          <div className="relative overflow-visible" style={{ width: boardWidth, height: boardHeight }}>
            <svg 
              width={boardWidth + 40} 
              height={boardHeight + 40} 
              viewBox={`-20 -20 ${boardWidth + 40} ${boardHeight + 40}`} 
              className="overflow-visible"
              style={{ filter: 'url(#ink-bleed)' }}
            >
              {/* Claimed Shapes */}
              {claimedShapes.map((cs) => (
                <path 
                  key={cs.id}
                  d={renderShapePath(cs.id)}
                  fill={cs.owner === 1 ? (isDark ? 'var(--color-ink-primary-dark)' : 'var(--color-ink-primary)') : 'var(--color-ink-secondary)'}
                  opacity={0.3}
                />
              ))}

              {/* Grid Dots */}
              {Array.from({ length: gridSize }).map((_, r) => 
                Array.from({ length: gridSize }).map((_, c) => (
                  <circle key={`d-${r}-${c}`} cx={c * SPACING} cy={r * SPACING} r={4} fill="currentColor" opacity={0.5} />
                ))
              )}

              {/* Edges */}
              {validEdges.map((edgeId) => {
                const [p1, p2] = edgeId.split('-');
                const [r1, c1] = p1.split(',').map(Number);
                const [r2, c2] = p2.split(',').map(Number);
                const isDrawn = drawnEdges.includes(edgeId);

                return (
                  <g key={edgeId} onClick={() => handleEdgeClick(edgeId)} className="cursor-pointer group">
                    <line 
                      x1={c1 * SPACING} y1={r1 * SPACING} 
                      x2={c2 * SPACING} y2={r2 * SPACING} 
                      stroke="transparent" strokeWidth={24} 
                    />
                    {isDrawn ? (
                      <line 
                        x1={c1 * SPACING} y1={r1 * SPACING} 
                        x2={c2 * SPACING} y2={r2 * SPACING} 
                        stroke="currentColor" strokeWidth={3} 
                      />
                    ) : (
                      <line 
                        x1={c1 * SPACING} y1={r1 * SPACING} 
                        x2={c2 * SPACING} y2={r2 * SPACING} 
                        stroke="currentColor" strokeWidth={3} 
                        opacity={0.1}
                        className="group-hover:opacity-30 transition-opacity"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {p1Score > p2Score ? 'Player 1 Wins!' : p2Score > p1Score ? (mode === 'cpu' ? 'CPU Wins!' : 'Player 2 Wins!') : 'Draw!'}
            </h2>
            <p>Score: {p1Score} to {p2Score}</p>
            
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
