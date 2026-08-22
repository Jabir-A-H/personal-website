'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRafLoop } from '@/lib/games/useRafLoop';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import Link from 'next/link';

type SegmentType = 'obstacle' | 'gap' | 'empty';
type TrackRow = [SegmentType, SegmentType];

type TrackItem = {
  id: string;
  y: number;
  segments: TrackRow;
  passed: boolean;
};

type Phase = 'setup' | 'playing' | 'gameover';

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 1000;
const LANE_WIDTH = GAME_WIDTH / 2;
const ROW_HEIGHT = 250;
const PLAYER_Y = 850;
const PLAYER_RADIUS = 35;
const BASE_SPEED = 0.35; // px per ms

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

function generateValidRow(): TrackRow {
  const options: SegmentType[] = ['empty', 'obstacle', 'gap'];
  
  // Weights: 50% empty, 25% obstacle, 25% gap
  const pick = () => {
    const r = Math.random();
    if (r < 0.5) return 'empty';
    if (r < 0.75) return 'obstacle';
    return 'gap';
  };

  let r: TrackRow;
  do {
    r = [pick(), pick()];
  } while (r[0] !== 'empty' && r[1] !== 'empty'); // At least one lane MUST be passable

  return r;
}

export default function CurrentGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [highScore, setHighScoreState] = useState(0);

  // React state for rendering
  const [track, setTrack] = useState<TrackItem[]>([]);
  const [currentLane, setCurrentLane] = useState<0 | 1>(0);
  const [survived, setSurvived] = useState(0);

  // Mutable refs for RAF loop
  const stateRef = useRef({
    track: [] as TrackItem[],
    currentLane: 0 as 0 | 1,
    survived: 0,
    nextRowId: 0,
    isGameOver: false
  });

  useEffect(() => {
    setHighScoreState(getHighScore('current') || 0);
  }, []);

  const initGame = () => {
    // Pre-fill initial track (empty so player can get ready)
    const initialTrack: TrackItem[] = [];
    for (let i = 0; i < Math.ceil(GAME_HEIGHT / ROW_HEIGHT) + 1; i++) {
      initialTrack.push({
        id: `row-${i}`,
        y: GAME_HEIGHT - i * ROW_HEIGHT,
        segments: ['empty', 'empty'],
        passed: false
      });
    }

    stateRef.current = {
      track: initialTrack,
      currentLane: 0,
      survived: 0,
      nextRowId: initialTrack.length,
      isGameOver: false
    };

    setTrack(initialTrack);
    setCurrentLane(0);
    setSurvived(0);
    setPhase('playing');
  };

  const endGame = useCallback(() => {
    stateRef.current.isGameOver = true;
    setPhase('gameover');
    const finalScore = Math.floor(stateRef.current.survived / 100); // 10th of a second
    if (setHighScoreIfBetter('current', finalScore, true)) {
      setHighScoreState(finalScore);
    }
  }, []);

  useRafLoop((deltaMs) => {
    if (phase !== 'playing' || stateRef.current.isGameOver) return;
    if (deltaMs > 100) return; // Prevent huge jumps if tab is backgrounded

    const s = stateRef.current;
    
    s.survived += deltaMs;
    const speed = BASE_SPEED + (s.survived * 0.000015); // Gently ramp up

    let newTrack = [];
    
    // Move track down
    for (const row of s.track) {
      row.y += speed * deltaMs;

      // Collision Check
      if (!row.passed && row.y + ROW_HEIGHT > PLAYER_Y && row.y < PLAYER_Y + PLAYER_RADIUS * 2) {
        // Player is currently intersecting this row
        const activeSegment = row.segments[s.currentLane];
        if (activeSegment === 'obstacle' || activeSegment === 'gap') {
          // You can refine hitboxes, but rough overlap is fine for high speeds
          const playerCenter = PLAYER_Y + PLAYER_RADIUS;
          const rowTop = row.y;
          const rowBottom = row.y + ROW_HEIGHT;
          if (playerCenter > rowTop + 20 && playerCenter < rowBottom - 20) {
            endGame();
            return;
          }
        }
      }

      if (!row.passed && row.y > PLAYER_Y + PLAYER_RADIUS * 2) {
        row.passed = true;
      }

      if (row.y < GAME_HEIGHT) {
        newTrack.push(row);
      }
    }

    // Spawn new rows at the top
    const highestRow = newTrack.length > 0 ? newTrack[newTrack.length - 1] : null;
    if (!highestRow || highestRow.y > 0) {
      const spawnY = highestRow ? highestRow.y - ROW_HEIGHT : -ROW_HEIGHT;
      newTrack.push({
        id: `row-${s.nextRowId++}`,
        y: spawnY,
        segments: generateValidRow(),
        passed: false
      });
    }

    s.track = newTrack;

    // Sync to React state (batch updates)
    setTrack([...s.track]);
    setSurvived(s.survived);
  }, phase === 'playing');

  const handlePointerDown = () => {
    if (phase !== 'playing') return;
    const newLane = stateRef.current.currentLane === 0 ? 1 : 0;
    stateRef.current.currentLane = newLane;
    setCurrentLane(newLane);
  };

  const scoreDisplay = Math.floor(survived / 100);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 touch-none ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10">INK RUSH</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="text-sm opacity-80 text-center uppercase tracking-widest">
            Tap anywhere to switch lanes.<br/>
            Avoid obstacles. Don't fall in gaps.
          </div>

          <button onClick={initGame} className="mt-8 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
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
            <span>Time: {scoreDisplay}</span>
          </div>

          <svg 
            viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
            className="w-full aspect-square bg-neutral-200 dark:bg-neutral-900 rounded cursor-pointer overflow-hidden shadow-inner"
            style={{ filter: 'url(#ink-bleed)' }}
            onPointerDown={handlePointerDown}
          >
            {/* Dividing Line */}
            <line x1={GAME_WIDTH/2} y1={0} x2={GAME_WIDTH/2} y2={GAME_HEIGHT} stroke="currentColor" strokeWidth={4} strokeDasharray="20,20" opacity={0.2} />

            {/* Track Rows */}
            {track.map(row => (
              <g key={row.id} transform={`translate(0, ${row.y})`}>
                {row.segments.map((seg, i) => {
                  if (seg === 'empty') return null;
                  
                  const x = i * LANE_WIDTH;
                  if (seg === 'obstacle') {
                    // Draw a solid rock/obstacle
                    return (
                      <rect 
                        key={i} 
                        x={x + 50} 
                        y={50} 
                        width={LANE_WIDTH - 100} 
                        height={ROW_HEIGHT - 100} 
                        fill={isDark ? 'var(--color-ink-primary-dark)' : 'var(--color-ink-primary)'} 
                        rx={20}
                      />
                    );
                  }
                  
                  if (seg === 'gap') {
                    // Draw a hole showing background
                    return (
                      <rect 
                        key={i} 
                        x={x + 20} 
                        y={0} 
                        width={LANE_WIDTH - 40} 
                        height={ROW_HEIGHT} 
                        fill={isDark ? '#000000' : '#ffffff'} 
                        opacity={0.8}
                      />
                    );
                  }
                })}
              </g>
            ))}

            {/* Player Avatar */}
            <circle 
              cx={currentLane === 0 ? LANE_WIDTH / 2 : LANE_WIDTH + LANE_WIDTH / 2} 
              cy={PLAYER_Y + PLAYER_RADIUS} 
              r={PLAYER_RADIUS} 
              fill="var(--color-ink-secondary)" 
              style={{ transition: 'cx 0.15s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif text-[var(--color-ink-secondary)]">WIPEOUT</h2>
            
            <div className="text-center uppercase tracking-widest text-sm opacity-80">
              <div className="text-4xl font-bold">{scoreDisplay}</div>
              <div className="mt-2">Final Score</div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Menu
              </button>
              <button onClick={initGame} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded uppercase tracking-widest text-sm">
                Race Again
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
