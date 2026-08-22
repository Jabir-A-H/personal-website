'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRafLoop } from '@/lib/games/useRafLoop';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import Link from 'next/link';

type Drop = {
  id: string;
  x: number;
  y: number;
  color: 'black' | 'red';
};

type RatioMode = 'A' | 'C';
type Phase = 'setup' | 'playing' | 'gameover';

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 1000;
const POT_WIDTH = 160;
const POT_HEIGHT = 60;
const POT_Y = GAME_HEIGHT - 100;
const DROP_RADIUS = 25;
const BASE_SPEED = 0.4; // units per ms
const BASE_SPAWN_RATE = 1200; // ms

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export default function SpillGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [ratioMode, setRatioMode] = useState<RatioMode>('A');
  const [highScore, setHighScoreState] = useState(0);

  // React state for rendering
  const [drops, setDrops] = useState<Drop[]>([]);
  const [potX, setPotX] = useState(GAME_WIDTH / 2);
  const [score, setScore] = useState({ totalCaught: 0, redCaught: 0, missedBlack: 0 });

  // Mutable refs for RAF loop to avoid stale closures
  const stateRef = useRef({
    drops: [] as Drop[],
    potX: GAME_WIDTH / 2,
    totalCaught: 0,
    redCaught: 0,
    missedBlack: 0,
    timeSinceLastSpawn: 0,
    nextDropId: 0,
    keys: { left: false, right: false },
    isGameOver: false
  });

  useEffect(() => {
    setHighScoreState(getHighScore(`spill-${ratioMode}`) || 0);
  }, [ratioMode]);

  const initGame = () => {
    stateRef.current = {
      drops: [],
      potX: GAME_WIDTH / 2,
      totalCaught: 0,
      redCaught: 0,
      missedBlack: 0,
      timeSinceLastSpawn: BASE_SPAWN_RATE, // Spawn immediately
      nextDropId: 0,
      keys: { left: false, right: false },
      isGameOver: false
    };
    setDrops([]);
    setPotX(GAME_WIDTH / 2);
    setScore({ totalCaught: 0, redCaught: 0, missedBlack: 0 });
    setPhase('playing');
  };

  const endGame = useCallback(() => {
    stateRef.current.isGameOver = true;
    setPhase('gameover');
    const finalScore = stateRef.current.totalCaught;
    if (setHighScoreIfBetter(`spill-${ratioMode}`, finalScore, true)) {
      setHighScoreState(finalScore);
    }
  }, [ratioMode]);

  useRafLoop((deltaMs) => {
    if (phase !== 'playing' || stateRef.current.isGameOver) return;

    const s = stateRef.current;
    
    // 1. Process Input (Keyboard)
    const moveSpeed = 1.2 * deltaMs;
    if (s.keys.left) s.potX = Math.max(POT_WIDTH / 2, s.potX - moveSpeed);
    if (s.keys.right) s.potX = Math.min(GAME_WIDTH - POT_WIDTH / 2, s.potX + moveSpeed);

    // 2. Spawn Logic
    const currentSpeed = BASE_SPEED + (s.totalCaught * 0.005);
    const spawnRate = Math.max(300, BASE_SPAWN_RATE - (s.totalCaught * 15));

    s.timeSinceLastSpawn += deltaMs;
    if (s.timeSinceLastSpawn >= spawnRate) {
      s.timeSinceLastSpawn = 0;
      const isRed = Math.random() < 0.1; // 10% red drops
      s.drops.push({
        id: `drop-${s.nextDropId++}`,
        x: DROP_RADIUS + Math.random() * (GAME_WIDTH - DROP_RADIUS * 2),
        y: -DROP_RADIUS,
        color: isRed ? 'red' : 'black'
      });
    }

    // 3. Move Drops & Collision
    const newDrops: Drop[] = [];
    let potLeft = s.potX - POT_WIDTH / 2;
    let potRight = s.potX + POT_WIDTH / 2;

    for (const drop of s.drops) {
      drop.y += currentSpeed * deltaMs;

      // Check collision with pot line
      if (drop.y + DROP_RADIUS >= POT_Y && drop.y - DROP_RADIUS <= POT_Y + POT_HEIGHT) {
        if (drop.x >= potLeft - DROP_RADIUS && drop.x <= potRight + DROP_RADIUS) {
          // Caught!
          if (drop.color === 'red') s.redCaught++;
          else s.totalCaught++;
          continue; // Remove from newDrops
        }
      }

      // Check missed drop
      if (drop.y - DROP_RADIUS > GAME_HEIGHT) {
        if (drop.color === 'black') {
          s.missedBlack++;
          
          // Instantly check ratio C if a black drop is missed
          if (ratioMode === 'C') {
            const ratio = s.redCaught / (s.totalCaught + s.missedBlack);
            if (s.totalCaught + s.missedBlack >= 5 && ratio > 0.1) {
              endGame();
              return;
            }
          }
        }
        continue;
      }

      newDrops.push(drop);
    }
    s.drops = newDrops;

    // 4. Fail Condition Check
    const denominator = ratioMode === 'A' ? s.totalCaught : (s.totalCaught + s.missedBlack);
    if (denominator >= 5) { // Grace period of 5 drops
      const ratio = s.redCaught / denominator;
      if (ratio > 0.1) {
        endGame();
        return;
      }
    }

    // 5. Sync to React state (batch updates)
    setPotX(s.potX);
    setDrops([...s.drops]);
    setScore({ totalCaught: s.totalCaught, redCaught: s.redCaught, missedBlack: s.missedBlack });

  }, phase === 'playing');

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (phase !== 'playing') return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - svgRect.left) / svgRect.width;
    const gameX = xRatio * GAME_WIDTH;
    stateRef.current.potX = Math.max(POT_WIDTH / 2, Math.min(GAME_WIDTH - POT_WIDTH / 2, gameX));
  };

  const currentRatio = useMemo(() => {
    const den = ratioMode === 'A' ? score.totalCaught : (score.totalCaught + score.missedBlack);
    return den === 0 ? 0 : (score.redCaught / den);
  }, [score, ratioMode]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 touch-none ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10">FALLING INK</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Rule Set (Ratio Mode)</label>
            <select value={ratioMode} onChange={(e) => setRatioMode(e.target.value as RatioMode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="A">Mode A (Ignore Missed Black Drops)</option>
              <option className="text-black" value="C">Mode C (Missed Black Drops Penalize Ratio)</option>
            </select>
          </div>
          
          <div className="text-sm opacity-80 text-center">
            Catch black ink. Avoid red ink.<br/>
            Game Over if Red ratio exceeds 10%.
          </div>

          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>

          {highScore > 0 && (
            <p className="mt-4 text-sm opacity-70">High Score: {highScore}</p>
          )}
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl z-10 flex-1">
          <div className="flex justify-between w-full uppercase tracking-widest text-sm px-4">
            <span>Score: {score.totalCaught}</span>
            <span className={currentRatio > 0.08 ? 'text-red-500 font-bold' : ''}>
              Toxicity: {(currentRatio * 100).toFixed(1)}% / 10%
            </span>
          </div>

          <svg 
            viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
            className="w-full aspect-square bg-neutral-200 dark:bg-neutral-900 rounded cursor-crosshair overflow-hidden shadow-inner"
            style={{ filter: 'url(#ink-bleed)' }}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
          >
            {/* Drops */}
            {drops.map(d => (
              <circle 
                key={d.id} 
                cx={d.x} 
                cy={d.y} 
                r={DROP_RADIUS} 
                fill={d.color === 'red' ? 'var(--color-ink-secondary)' : (isDark ? 'var(--color-ink-primary-dark)' : 'var(--color-ink-primary)')} 
              />
            ))}

            {/* Pot */}
            <rect
              x={potX - POT_WIDTH / 2}
              y={POT_Y}
              width={POT_WIDTH}
              height={POT_HEIGHT}
              rx={20}
              fill={isDark ? 'white' : 'black'}
              opacity={0.8}
            />
          </svg>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif text-red-500">TOXICITY CRITICAL</h2>
            
            <div className="flex gap-8 text-center uppercase tracking-widest text-sm opacity-80">
              <div>
                <div className="text-2xl font-bold">{score.totalCaught}</div>
                <div>Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{(currentRatio * 100).toFixed(1)}%</div>
                <div>Final Ratio</div>
              </div>
            </div>

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
