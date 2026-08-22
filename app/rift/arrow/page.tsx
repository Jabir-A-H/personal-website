'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRafLoop } from '@/lib/games/useRafLoop';
import { useGameTheme } from '@/lib/games/useGameTheme';
import Link from 'next/link';

type Mode = 'cpu' | 'local';
type Phase = 'setup' | 'playing' | 'shot_result' | 'gameover';

type Shot = {
  x: number;
  y: number;
  score: number;
};

type PlayerState = {
  score: number;
  shots: Shot[];
};

const GAME_SIZE = 1000;
const CENTER = GAME_SIZE / 2;
const MAX_HOLD_MS = 1800; // 1.8s
const DRIFT_VELOCITY = 0.12; // px per ms

const RINGS = [
  { r: 400, score: 1 },
  { r: 300, score: 3 },
  { r: 200, score: 5 },
  { r: 100, score: 7 },
  { r: 25, score: 10 },
];

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

const getScoreForCoordinate = (x: number, y: number) => {
  const dist = Math.hypot(x - CENTER, y - CENTER);
  for (let i = RINGS.length - 1; i >= 0; i--) {
    if (dist <= RINGS[i].r) return RINGS[i].score;
  }
  return 0; // Miss
};

export default function ArrowGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('cpu');
  
  const [p1State, setP1State] = useState<PlayerState>({ score: 0, shots: [] });
  const [p2State, setP2State] = useState<PlayerState>({ score: 0, shots: [] });
  
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [turnShots, setTurnShots] = useState(0); // 0 or 1. Reset to 0 when turn changes.
  
  // Turn environment (Wind)
  const [wind, setWind] = useState({ mag: 0, ang: 0 });

  // Aiming state (React)
  const [isHolding, setIsHolding] = useState(false);
  const [reticle, setReticle] = useState({ x: CENTER, y: CENTER });
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1

  const [lastShotResult, setLastShotResult] = useState<Shot | null>(null);

  // Mutable refs for high-frequency aiming math
  const aimRef = useRef({
    baseX: CENTER,
    baseY: CENTER,
    driftAng: 0,
    holdTime: 0,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const rollWind = () => {
    setWind({
      mag: Math.random() * 80 + 20, // 20 to 100 px displacement
      ang: Math.random() * Math.PI * 2
    });
  };

  const initGame = () => {
    setP1State({ score: 0, shots: [] });
    setP2State({ score: 0, shots: [] });
    setActivePlayer(1);
    setTurnShots(0);
    rollWind();
    setPhase('playing');
  };

  const fireShot = useCallback(() => {
    if (!isHolding && mode !== 'cpu') return;

    setIsHolding(false);
    setHoldProgress(0);

    // Calculate final landing
    const finalX = reticle.x + Math.cos(wind.ang) * wind.mag;
    const finalY = reticle.y + Math.sin(wind.ang) * wind.mag;
    
    const score = getScoreForCoordinate(finalX, finalY);
    const shotResult = { x: finalX, y: finalY, score };
    
    setLastShotResult(shotResult);
    setPhase('shot_result');

    setTimeout(() => {
      // Apply score
      if (activePlayer === 1) {
        setP1State(prev => ({ score: prev.score + score, shots: [...prev.shots, shotResult] }));
      } else {
        setP2State(prev => ({ score: prev.score + score, shots: [...prev.shots, shotResult] }));
      }

      setPhase('playing');
      setReticle({ x: CENTER, y: CENTER }); // Reset visual reticle

      const newTurnShots = turnShots + 1;
      
      // End of turn logic
      if (newTurnShots >= 2) {
        setTurnShots(0);
        rollWind();
        
        const isGameOver = activePlayer === 2 && p2State.shots.length === 7; // About to add the 8th
        if (isGameOver) {
          setPhase('gameover');
        } else {
          setActivePlayer(activePlayer === 1 ? 2 : 1);
        }
      } else {
        setTurnShots(newTurnShots);
      }
    }, 2000); // Wait 2s to show result
  }, [isHolding, reticle, wind, activePlayer, turnShots, p1State, p2State, mode]);

  // RAF loop for aiming
  useRafLoop((deltaMs) => {
    if (!isHolding) return;

    const r = aimRef.current;
    r.holdTime += deltaMs;
    
    // Constant velocity drift
    r.baseX += Math.cos(r.driftAng) * DRIFT_VELOCITY * deltaMs;
    r.baseY += Math.sin(r.driftAng) * DRIFT_VELOCITY * deltaMs;

    const newX = r.baseX + r.offsetX;
    const newY = r.baseY + r.offsetY;
    
    setReticle({ x: newX, y: newY });
    
    const progress = Math.min(1, r.holdTime / MAX_HOLD_MS);
    setHoldProgress(progress);

    if (progress >= 1) {
      fireShot();
    }
  }, isHolding);

  // Input handlers
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (phase !== 'playing' || (mode === 'cpu' && activePlayer === 2)) return;
    
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - svgRect.left) / svgRect.width;
    const yRatio = (e.clientY - svgRect.top) / svgRect.height;
    
    aimRef.current = {
      baseX: CENTER,
      baseY: CENTER,
      driftAng: Math.random() * Math.PI * 2, // Random direction per hold
      holdTime: 0,
      startX: xRatio * GAME_SIZE,
      startY: yRatio * GAME_SIZE,
      offsetX: 0,
      offsetY: 0,
    };
    
    setReticle({ x: CENTER, y: CENTER });
    setHoldProgress(0);
    setIsHolding(true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isHolding) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - svgRect.left) / svgRect.width;
    const yRatio = (e.clientY - svgRect.top) / svgRect.height;
    
    aimRef.current.offsetX = (xRatio * GAME_SIZE) - aimRef.current.startX;
    aimRef.current.offsetY = (yRatio * GAME_SIZE) - aimRef.current.startY;
  };

  const handlePointerUp = () => {
    if (isHolding) fireShot();
  };

  // CPU AI Trigger
  useEffect(() => {
    if (phase === 'playing' && mode === 'cpu' && activePlayer === 2) {
      // Simulate CPU shot
      const delay = Math.random() * 500 + 500;
      const t = setTimeout(() => {
        // CPU math
        const targetHoldTime = Math.random() * 1000 + 400; // Hold for 0.4s to 1.4s
        const driftAng = Math.random() * Math.PI * 2;
        
        // Final base reticle after hold time
        const baseX = CENTER + Math.cos(driftAng) * DRIFT_VELOCITY * targetHoldTime;
        const baseY = CENTER + Math.sin(driftAng) * DRIFT_VELOCITY * targetHoldTime;
        
        // CPU offsets to counter wind and drift (imperfectly)
        const counterWindX = -Math.cos(wind.ang) * wind.mag;
        const counterWindY = -Math.sin(wind.ang) * wind.mag;
        const counterDriftX = -Math.cos(driftAng) * DRIFT_VELOCITY * targetHoldTime;
        const counterDriftY = -Math.sin(driftAng) * DRIFT_VELOCITY * targetHoldTime;
        
        // Add some noise (CPU error)
        const errMag = Math.random() * 100;
        const errAng = Math.random() * Math.PI * 2;
        
        const finalRetX = baseX + counterWindX + counterDriftX + (Math.cos(errAng) * errMag);
        const finalRetY = baseY + counterWindY + counterDriftY + (Math.sin(errAng) * errMag);

        setReticle({ x: finalRetX, y: finalRetY });
        
        // Fake a short hold visual then fire
        setIsHolding(true);
        setTimeout(() => {
          fireShot();
        }, 100);

      }, delay);
      return () => clearTimeout(t);
    }
  }, [phase, mode, activePlayer, wind, turnShots, fireShot]);


  const isResultsPhase = phase === 'shot_result';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 touch-none select-none ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10">RIMAYA</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="cpu">CPU</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>

          <div className="text-sm opacity-80 text-center uppercase tracking-widest">
            Press & hold to draw the bow.<br/>
            Drag to counteract drift.<br/>
            Release to fire.<br/>
            Account for the wind.
          </div>

          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>
        </div>
      )}

      {(phase === 'playing' || phase === 'shot_result' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl z-10 flex-1 relative">
          
          <div className="flex justify-between w-full uppercase tracking-widest text-sm px-4">
            <span className={activePlayer === 1 ? 'font-bold' : ''}>P1 Score: {p1State.score} ({p1State.shots.length}/8)</span>
            
            {phase === 'playing' && (
              <span className="flex items-center gap-2">
                Wind: {Math.round(wind.mag)}
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: `rotate(${wind.ang}rad)` }}>
                  <path d="M12 2L22 22H2Z" fill="currentColor" />
                </svg>
              </span>
            )}

            <span className={activePlayer === 2 ? 'font-bold' : ''}>P2 Score: {p2State.score} ({p2State.shots.length}/8)</span>
          </div>

          <div className="text-center font-bold uppercase tracking-widest mt-2">
            {phase === 'gameover' ? 'Match Complete' : (activePlayer === 1 ? "Player 1" : "Player 2")}
            {phase !== 'gameover' && ` - Shot ${turnShots + 1} of 2`}
          </div>

          <div className="relative w-full max-w-lg aspect-square">
            <svg 
              viewBox={`0 0 ${GAME_SIZE} ${GAME_SIZE}`}
              className={`w-full h-full bg-neutral-200 dark:bg-neutral-900 rounded shadow-inner overflow-visible transition-transform duration-700 ${isResultsPhase ? 'scale-150' : 'scale-100'}`}
              style={isResultsPhase && lastShotResult ? {
                transformOrigin: `${(lastShotResult.x / GAME_SIZE) * 100}% ${(lastShotResult.y / GAME_SIZE) * 100}%`
              } : {}}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Fuzzy Outer Enso Edge */}
              <circle cx={CENTER} cy={CENTER} r={RINGS[0].r + 10} fill="none" stroke="currentColor" strokeWidth={30} opacity={0.2} style={{ filter: 'url(#ink-bleed)' }} />
              
              {/* Crisp Inner Rings */}
              {RINGS.map((ring, i) => (
                <circle 
                  key={i} 
                  cx={CENTER} cy={CENTER} 
                  r={ring.r} 
                  fill={i % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} 
                  stroke="currentColor" 
                  strokeWidth={2} 
                />
              ))}
              <circle cx={CENTER} cy={CENTER} r={RINGS[RINGS.length-1].r} fill="currentColor" />

              {/* Previous Shots for active player (faint) */}
              {phase === 'playing' && (activePlayer === 1 ? p1State : p2State).shots.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={8} fill="currentColor" opacity={0.3} />
              ))}

              {/* The current reticle (only when holding) */}
              {isHolding && phase === 'playing' && (
                <g transform={`translate(${reticle.x}, ${reticle.y})`}>
                  <circle cx={0} cy={0} r={40} fill="none" stroke="currentColor" strokeWidth={2} opacity={0.5} />
                  <line x1={-10} y1={0} x2={10} y2={0} stroke="currentColor" strokeWidth={2} />
                  <line x1={0} y1={-10} x2={0} y2={10} stroke="currentColor" strokeWidth={2} />
                  
                  {/* Timer Ring */}
                  <path 
                    d={`M 0 -40 A 40 40 0 ${holdProgress > 0.5 ? 1 : 0} 1 ${40 * Math.sin(holdProgress * Math.PI * 2)} ${-40 * Math.cos(holdProgress * Math.PI * 2)}`}
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth={4} 
                  />
                </g>
              )}

              {/* Result shot */}
              {isResultsPhase && lastShotResult && (
                <g>
                  <circle cx={lastShotResult.x} cy={lastShotResult.y} r={15} fill="var(--color-ink-secondary)" style={{ filter: 'url(#ink-bleed)' }} />
                  <text 
                    x={lastShotResult.x} 
                    y={lastShotResult.y - 30} 
                    textAnchor="middle" 
                    fill="var(--color-ink-secondary)" 
                    className="font-bold text-6xl"
                  >
                    +{lastShotResult.score}
                  </text>
                </g>
              )}
            </svg>

            {/* Instruction Overlay (Bow visible before holding) */}
            {!isHolding && phase === 'playing' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                <span className="uppercase tracking-widest text-sm border border-current px-4 py-2 rounded">
                  {mode === 'cpu' && activePlayer === 2 ? 'CPU Aiming...' : 'Press & Hold to Draw Bow'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {p1State.score > p2State.score ? 'Player 1 Wins!' : (p2State.score > p1State.score ? (mode === 'cpu' ? 'CPU Wins!' : 'Player 2 Wins!') : 'Draw!')}
            </h2>

            <div className="flex gap-12 text-center uppercase tracking-widest text-sm opacity-80 mt-2">
              <div>
                <div className="text-3xl font-bold">{p1State.score}</div>
                <div>Player 1</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{p2State.score}</div>
                <div>{mode === 'cpu' ? 'CPU' : 'Player 2'}</div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Setup
              </button>
              <button onClick={initGame} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded uppercase tracking-widest text-sm">
                Rematch
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
