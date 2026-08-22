'use client';

import { useState, useCallback, useMemo } from 'react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { 
  GridSize, Fleet, CPUState, getShipSizes, generateRandomFleet, 
  isValidPlacement, getNextCPUMove, processCPUHitResult, Coord 
} from '@/lib/games/fleetEngine';
import Link from 'next/link';

type Mode = 'cpu' | 'local';
type Phase = 'setup' | 'placement' | 'playing' | 'gameover';

type PlayerState = {
  fleet: Fleet;
  shots: Set<string>; // 'r,c'
  sunks: Set<string>; // ship ids
};

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export default function FogGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('cpu');
  const [gridSize, setGridSize] = useState<GridSize>(5);

  const [p1State, setP1State] = useState<PlayerState>({ fleet: [], shots: new Set(), sunks: new Set() });
  const [p2State, setP2State] = useState<PlayerState>({ fleet: [], shots: new Set(), sunks: new Set() });
  
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [cpuState, setCpuState] = useState<CPUState>({ mode: 'random', firstHit: null, lastHit: null, currentDir: null, triedDirs: [] });

  // Placement state
  const [placingPlayer, setPlacingPlayer] = useState<1 | 2>(1);
  const [unplacedSizes, setUnplacedSizes] = useState<number[]>([]);
  const [placementOrientation, setPlacementOrientation] = useState<'h' | 'v'>('h');
  const [hoverCells, setHoverCells] = useState<Coord[]>([]);

  const initPlacement = (player: 1 | 2) => {
    setPlacingPlayer(player);
    setUnplacedSizes(getShipSizes(gridSize));
    setPhase('placement');
    setHoverCells([]);
  };

  const handleAutoPlace = () => {
    const randomFleet = generateRandomFleet(gridSize);
    if (placingPlayer === 1) {
      setP1State(prev => ({ ...prev, fleet: randomFleet }));
      if (mode === 'cpu') {
        setP2State(prev => ({ ...prev, fleet: generateRandomFleet(gridSize) }));
        startGame();
      } else {
        initPlacement(2);
      }
    } else {
      setP2State(prev => ({ ...prev, fleet: randomFleet }));
      startGame();
    }
  };

  const startGame = () => {
    setPhase('playing');
    setActivePlayer(1);
    setCpuState({ mode: 'random', firstHit: null, lastHit: null, currentDir: null, triedDirs: [] });
  };

  const checkSunk = (targetFleet: Fleet, targetShots: Set<string>): Set<string> => {
    const sunks = new Set<string>();
    for (const ship of targetFleet) {
      if (ship.cells.every(c => targetShots.has(`${c[0]},${c[1]}`))) {
        sunks.add(ship.id);
      }
    }
    return sunks;
  };

  const handleGridClick = (r: number, c: number) => {
    if (phase === 'placement') {
      if (unplacedSizes.length === 0 || hoverCells.length === 0) return;
      
      const currentFleet = placingPlayer === 1 ? p1State.fleet : p2State.fleet;
      if (isValidPlacement(hoverCells, currentFleet, gridSize)) {
        const newShip = { id: `ship-${unplacedSizes.length}`, size: unplacedSizes[0], cells: hoverCells };
        
        if (placingPlayer === 1) {
          setP1State(prev => ({ ...prev, fleet: [...prev.fleet, newShip] }));
        } else {
          setP2State(prev => ({ ...prev, fleet: [...prev.fleet, newShip] }));
        }

        const newUnplaced = unplacedSizes.slice(1);
        setUnplacedSizes(newUnplaced);
        setHoverCells([]);

        if (newUnplaced.length === 0) {
          if (placingPlayer === 1 && mode === 'local') {
            initPlacement(2);
          } else if (placingPlayer === 1 && mode === 'cpu') {
            setP2State(prev => ({ ...prev, fleet: generateRandomFleet(gridSize) }));
            startGame();
          } else {
            startGame();
          }
        }
      }
      return;
    }

    if (phase !== 'playing') return;
    
    // Play phase
    const defenderState = activePlayer === 1 ? p2State : p1State;
    const attackerState = activePlayer === 1 ? p1State : p2State;
    const shotStr = `${r},${c}`;

    if (attackerState.shots.has(shotStr)) return; // already shot here

    const newShots = new Set(attackerState.shots);
    newShots.add(shotStr);
    
    const newSunks = checkSunk(defenderState.fleet, newShots);
    const isHit = defenderState.fleet.some(s => s.cells.some(sc => sc[0] === r && sc[1] === c));

    if (activePlayer === 1) {
      setP1State(prev => ({ ...prev, shots: newShots, sunks: newSunks }));
    } else {
      setP2State(prev => ({ ...prev, shots: newShots, sunks: newSunks }));
    }

    if (newSunks.size === defenderState.fleet.length) {
      setPhase('gameover');
      return;
    }

    if (mode === 'cpu' && activePlayer === 1) {
      // CPU Turn
      setActivePlayer(2);
      setTimeout(() => {
        let cpuS = cpuState;
        
        // Pass current shots to AI
        const p2CurrentShots = new Set(p2State.shots); 
        
        const { move, newState } = getNextCPUMove(cpuS, p2CurrentShots, gridSize);
        const cpuShotStr = `${move[0]},${move[1]}`;
        p2CurrentShots.add(cpuShotStr);

        const isCpuHit = p1State.fleet.some(s => s.cells.some(sc => sc[0] === move[0] && sc[1] === move[1]));
        const cpuSunks = checkSunk(p1State.fleet, p2CurrentShots);
        
        // Did this specific shot sink a ship?
        const justSunk = cpuSunks.size > p2State.sunks.size;

        const nextCpuState = processCPUHitResult(newState, move, isCpuHit, justSunk);
        
        setP2State(prev => ({ ...prev, shots: p2CurrentShots, sunks: cpuSunks }));
        setCpuState(nextCpuState);

        if (cpuSunks.size === p1State.fleet.length) {
          setPhase('gameover');
        } else {
          setActivePlayer(1);
        }
      }, 500);
    } else {
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }
  };

  const handlePointerMove = (r: number, c: number) => {
    if (phase !== 'placement' || unplacedSizes.length === 0) return;
    const size = unplacedSizes[0];
    const cells: Coord[] = [];
    for (let i = 0; i < size; i++) {
      cells.push(placementOrientation === 'h' ? [r, c + i] : [r + i, c]);
    }
    setHoverCells(cells);
  };

  const renderGrid = (playerOwner: 1 | 2) => {
    const isAttackerView = phase === 'playing' && ((activePlayer === 1 && playerOwner === 2) || (activePlayer === 2 && playerOwner === 1));
    const isMyPlacement = phase === 'placement' && placingPlayer === playerOwner;
    
    const ownerState = playerOwner === 1 ? p1State : p2State;
    const opponentState = playerOwner === 1 ? p2State : p1State;

    // During play, you click on OPPONENT'S grid to shoot.
    // If it's P1's turn, P1 shoots on P2's grid.
    const isClickable = phase === 'placement' ? isMyPlacement : (phase === 'playing' && isAttackerView && !(mode === 'cpu' && activePlayer === 2));

    const borderColor = playerOwner === 1 
      ? (isDark ? 'border-[var(--color-ink-primary-dark)]' : 'border-[var(--color-ink-primary)]')
      : 'border-[var(--color-ink-secondary)]';

    return (
      <div className={`flex flex-col items-center gap-2 ${!isClickable ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold tracking-widest uppercase text-sm">
          {playerOwner === 1 ? 'Player 1' : (mode === 'cpu' ? 'CPU Fleet' : 'Player 2')}
        </h3>
        <div 
          className={`grid gap-1 border-4 ${borderColor} p-2 rounded`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: gridSize }).map((_, r) => 
            Array.from({ length: gridSize }).map((_, c) => {
              const shotStr = `${r},${c}`;
              // For opponent state, "shots" means shots FIRED BY OPPONENT onto THIS grid.
              const isShot = opponentState.shots.has(shotStr);
              const isHit = isShot && ownerState.fleet.some(s => s.cells.some(sc => sc[0] === r && sc[1] === c));
              const isMiss = isShot && !isHit;

              // Placement visuals
              const isHovered = isMyPlacement && hoverCells.some(hc => hc[0] === r && hc[1] === c);
              const isPlaced = isMyPlacement && ownerState.fleet.some(s => s.cells.some(sc => sc[0] === r && sc[1] === c));
              
              let cellClass = "w-8 h-8 sm:w-10 sm:h-10 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center cursor-crosshair transition-colors";
              
              if (isHovered) {
                const valid = isValidPlacement(hoverCells, ownerState.fleet, gridSize);
                cellClass += valid ? " bg-[var(--color-ink-primary)]/30" : " bg-red-500/50";
              } else if (isPlaced) {
                // Placed ships ONLY render during placement phase!
                cellClass += " bg-[var(--color-ink-primary)] opacity-50";
              }

              return (
                <div 
                  key={`${r}-${c}`} 
                  className={cellClass}
                  onClick={() => handleGridClick(r, c)}
                  onPointerMove={() => handlePointerMove(r, c)}
                >
                  {isHit && (
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-neutral-900 dark:bg-neutral-100 rounded-full" style={{ filter: 'url(#ink-bleed)' }} />
                  )}
                  {isMiss && (
                    <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-neutral-400 dark:border-neutral-500 rounded-full opacity-50" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10">INK FLEET</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="cpu">CPU</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Grid Size</label>
            <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value) as GridSize)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value={5}>Small (5x5)</option>
              <option className="text-black" value={10}>Classic (10x10)</option>
            </select>
          </div>

          <button onClick={() => initPlacement(1)} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>
        </div>
      )}

      {phase === 'placement' && (
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="text-center">
            <h2 className="text-xl uppercase tracking-widest">
              {placingPlayer === 1 ? 'Player 1' : 'Player 2'} Placement
            </h2>
            <p className="opacity-70 mt-2">
              Place your size-{unplacedSizes[0]} ship
            </p>
          </div>

          <div className="flex gap-4 mb-4">
            <button onClick={() => setPlacementOrientation(o => o === 'h' ? 'v' : 'h')} className="px-4 py-2 border border-current rounded uppercase text-sm">
              Rotate ({placementOrientation === 'h' ? 'Horizontal' : 'Vertical'})
            </button>
            <button onClick={handleAutoPlace} className="px-4 py-2 bg-neutral-800 text-white rounded uppercase text-sm">
              Auto Place
            </button>
          </div>

          {renderGrid(placingPlayer)}
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl z-10">
          <div className="text-lg uppercase tracking-widest font-bold">
            {phase === 'gameover' ? 'Game Over' : (activePlayer === 1 ? "Player 1's Turn" : "Player 2's Turn")}
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
            {renderGrid(1)}
            {renderGrid(2)}
          </div>
          
          <div className="flex gap-8 text-sm uppercase opacity-70">
            <div>P1 Sunks: {p1State.sunks.size} / {p2State.fleet.length}</div>
            <div>P2 Sunks: {p2State.sunks.size} / {p1State.fleet.length}</div>
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {p1State.sunks.size === p2State.fleet.length ? 'Player 1 Wins!' : 'Player 2 Wins!'}
            </h2>

            <div className="flex gap-4 mt-4">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Setup
              </button>
              <button onClick={() => { setP1State({fleet:[], shots: new Set(), sunks: new Set()}); setP2State({fleet:[], shots: new Set(), sunks: new Set()}); initPlacement(1); }} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded uppercase tracking-widest text-sm">
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
