'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import { getHighScore, setHighScoreIfBetter } from '@/lib/games/highScore';
import Link from 'next/link';

type Mode = 'solo' | 'cpu' | 'local';
type GridSize = 16 | 36 | 64;
type Phase = 'setup' | 'playing' | 'gameover';

type Card = {
  id: string;
  index: number;
  shape: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const ALL_SHAPES = [
  'mountain', 'river', 'sun', 'moon', 'star', 'flower', 'cloud', 'rain',
  'wave', 'leaf', 'branch', 'bamboo', 'lotus', 'pine', 'wind', 'snowflake',
  'lightning', 'fish', 'crane', 'butterfly', 'dragonfly', 'reed', 'stone',
  'bridge', 'lantern', 'boat', 'feather', 'vine', 'crescent', 'droplet',
  'ripple', 'ember'
];

const LogoShodo = () => (
  <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 opacity-80" fill="currentColor">
    <path d="M50 10 C 20 10, 10 40, 15 70 C 20 90, 50 90, 70 70 C 85 55, 80 30, 60 20 C 40 10, 30 30, 40 50" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" style={{ filter: 'url(#ink-bleed)' }} />
  </svg>
);

const InkBleedFilter = () => (
  <svg className="hidden">
    <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export default function EchoGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();
  
  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('solo');
  const [gridSize, setGridSize] = useState<GridSize>(16);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [firstFlip, setFirstFlip] = useState<number | null>(null);
  const [secondFlip, setSecondFlip] = useState<number | null>(null);
  
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  
  const [highScore, setHighScoreState] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const cpuMemory = useRef<Record<number, string>>({});

  useEffect(() => {
    setHighScoreState(getHighScore(`echo-${gridSize}`) || 0);
  }, [gridSize]);

  // Timer for solo mode
  useEffect(() => {
    if (phase === 'playing' && mode === 'solo') {
      const interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, mode, startTime]);

  const initGame = () => {
    const pairsNeeded = gridSize / 2;
    const selectedShapes = [...ALL_SHAPES].sort(() => Math.random() - 0.5).slice(0, pairsNeeded);
    const deck = [...selectedShapes, ...selectedShapes]
      .sort(() => Math.random() - 0.5)
      .map((shape, idx) => ({ id: `c-${idx}`, index: idx, shape, isFlipped: false, isMatched: false }));
      
    setCards(deck);
    setFirstFlip(null);
    setSecondFlip(null);
    setActivePlayer(1);
    setScores({ 1: 0, 2: 0 });
    setStartTime(Date.now());
    setElapsed(0);
    cpuMemory.current = {};
    setIsProcessing(false);
    setPhase('playing');
  };

  const handleCardClick = (index: number) => {
    if (phase !== 'playing' || isProcessing) return;
    if (mode === 'cpu' && activePlayer === 2) return;
    if (cards[index].isMatched || index === firstFlip) return;

    flipCard(index);
  };

  const flipCard = useCallback((index: number) => {
    setCards(prev => {
      const next = [...prev];
      next[index].isFlipped = true;
      cpuMemory.current[index] = next[index].shape; // Both players and CPU see this
      return next;
    });

    if (firstFlip === null) {
      setFirstFlip(index);
    } else {
      setSecondFlip(index);
      setIsProcessing(true);
    }
  }, [firstFlip]);

  // Resolve flips
  useEffect(() => {
    if (firstFlip !== null && secondFlip !== null) {
      const card1 = cards[firstFlip];
      const card2 = cards[secondFlip];
      
      const isMatch = card1.shape === card2.shape;

      const t = setTimeout(() => {
        setCards(prev => {
          const next = [...prev];
          if (isMatch) {
            next[firstFlip].isMatched = true;
            next[secondFlip].isMatched = true;
          } else {
            next[firstFlip].isFlipped = false;
            next[secondFlip].isFlipped = false;
          }
          return next;
        });

        if (isMatch) {
          setScores(s => ({ ...s, [activePlayer]: s[activePlayer] + 1 }));
          // Same player goes again
        } else {
          // Turn passes
          if (mode !== 'solo') setActivePlayer(activePlayer === 1 ? 2 : 1);
        }
        
        setFirstFlip(null);
        setSecondFlip(null);
        setIsProcessing(false);
      }, 1000);

      return () => clearTimeout(t);
    }
  }, [firstFlip, secondFlip, cards, activePlayer, mode]);

  // Game over check
  useEffect(() => {
    if (phase === 'playing' && cards.length > 0 && cards.every(c => c.isMatched)) {
      setPhase('gameover');
      if (mode === 'solo') {
        const finalTime = Math.floor(elapsed / 1000);
        if (setHighScoreIfBetter(`echo-${gridSize}`, finalTime, false)) {
          setHighScoreState(finalTime);
        }
      }
    }
  }, [cards, phase, mode, elapsed, gridSize]);

  // CPU logic
  useEffect(() => {
    if (phase === 'playing' && mode === 'cpu' && activePlayer === 2 && !isProcessing && firstFlip === null) {
      const t = setTimeout(() => {
        const memory = cpuMemory.current;
        const unflipped = cards.filter(c => !c.isFlipped && !c.isMatched);
        
        // Find known pairs in memory that aren't matched
        let knownPair: [number, number] | null = null;
        const seenShapes: Record<string, number> = {};
        
        for (const [idxStr, shape] of Object.entries(memory)) {
          const idx = parseInt(idxStr);
          if (cards[idx].isMatched || cards[idx].isFlipped) continue;
          
          if (seenShapes[shape] !== undefined) {
            knownPair = [seenShapes[shape], idx];
            break;
          }
          seenShapes[shape] = idx;
        }

        // Defect chance: 10%
        const forgets = Math.random() < 0.1;

        if (knownPair && !forgets) {
          // Flip first of known pair
          flipCard(knownPair[0]);
          setTimeout(() => flipCard(knownPair[1]), 600);
        } else {
          // Pick random unknown card
          const unknownCards = unflipped.filter(c => !memory[c.index]);
          const candidates = unknownCards.length > 0 ? unknownCards : unflipped;
          const pick1 = candidates[Math.floor(Math.random() * candidates.length)].index;
          flipCard(pick1);
          
          // Wait and pick second
          setTimeout(() => {
            const revealedShape = cards[pick1].shape;
            
            // Do we know where the other one is?
            let matchIdx = -1;
            for (const [idxStr, shape] of Object.entries(memory)) {
              const idx = parseInt(idxStr);
              if (idx !== pick1 && shape === revealedShape && !cards[idx].isMatched) {
                matchIdx = idx;
                break;
              }
            }

            const forgetsSecond = Math.random() < 0.1;
            
            if (matchIdx !== -1 && !forgetsSecond) {
              flipCard(matchIdx);
            } else {
              // Pick another random
              const remainingUnflipped = cards.filter(c => !c.isFlipped && !c.isMatched && c.index !== pick1);
              const remainingUnknown = remainingUnflipped.filter(c => !memory[c.index]);
              const pool = remainingUnknown.length > 0 ? remainingUnknown : remainingUnflipped;
              const pick2 = pool[Math.floor(Math.random() * pool.length)].index;
              flipCard(pick2);
            }
          }, 600);
        }
      }, 1000); // Wait 1s before CPU starts turn

      return () => clearTimeout(t);
    }
  }, [phase, mode, activePlayer, isProcessing, firstFlip, cards, flipCard]);


  const cols = Math.sqrt(gridSize);
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      <InkBleedFilter />
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10 uppercase">Echoes</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8">
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Opponent</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value="solo">Solo (Time Trial)</option>
              <option className="text-black" value="cpu">CPU (Hard)</option>
              <option className="text-black" value="local">Local PvP</option>
            </select>
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <label className="uppercase tracking-widest text-xs font-bold">Grid Size</label>
            <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value) as GridSize)} className="p-2 bg-transparent border border-current rounded">
              <option className="text-black" value={16}>4x4 (8 Pairs)</option>
              <option className="text-black" value={36}>6x6 (18 Pairs)</option>
              <option className="text-black" value={64}>8x8 (32 Pairs)</option>
            </select>
          </div>

          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>

          {mode === 'solo' && highScore > 0 && (
            <p className="mt-4 text-sm opacity-70">Best Time: {highScore}s</p>
          )}
        </div>
      )}

      {(phase === 'playing' || phase === 'gameover') && (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl z-10 flex-1">
          <div className="flex justify-between w-full uppercase tracking-widest text-sm px-4 font-bold">
            {mode === 'solo' ? (
              <span>Time: {Math.floor(elapsed / 1000)}s</span>
            ) : (
              <>
                <span className={activePlayer === 1 ? 'text-[var(--color-ink-primary)] dark:text-[var(--color-ink-primary-dark)] scale-110 transition-transform' : 'opacity-50'}>
                  Player 1: {scores[1]}
                </span>
                <span className={activePlayer === 2 ? 'text-[var(--color-ink-secondary)] scale-110 transition-transform' : 'opacity-50'}>
                  {mode === 'cpu' ? 'CPU' : 'Player 2'}: {scores[2]}
                </span>
              </>
            )}
          </div>

          <div 
            className="grid gap-2 sm:gap-4 w-full aspect-square"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cards.map((card, idx) => (
              <div 
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`relative w-full h-full preserve-3d transition-transform duration-500 cursor-pointer ${card.isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back (Face down) */}
                <div 
                  className={`absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded shadow border border-neutral-300 dark:border-neutral-700 flex items-center justify-center backface-hidden ${card.isFlipped ? 'invisible' : ''}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <LogoShodo />
                </div>
                
                {/* Front (Face up) */}
                <div 
                  className={`absolute inset-0 bg-white dark:bg-neutral-900 rounded shadow flex items-center justify-center backface-hidden rotate-y-180 ${!card.isFlipped ? 'invisible' : ''} ${card.isMatched ? 'opacity-50' : ''}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="text-xs sm:text-base md:text-xl font-serif uppercase tracking-widest text-center px-1 break-words leading-tight" style={{ filter: 'url(#ink-bleed)' }}>
                    {card.shape}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {mode === 'solo' 
                ? 'Complete!' 
                : scores[1] > scores[2] 
                  ? 'Player 1 Wins!' 
                  : (scores[2] > scores[1] ? (mode === 'cpu' ? 'CPU Wins!' : 'Player 2 Wins!') : 'Draw!')}
            </h2>

            <div className="flex gap-12 text-center uppercase tracking-widest text-sm opacity-80 mt-2">
              {mode === 'solo' ? (
                <div>
                  <div className="text-3xl font-bold">{Math.floor(elapsed / 1000)}s</div>
                  <div>Final Time</div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-3xl font-bold">{scores[1]}</div>
                    <div>Player 1</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{scores[2]}</div>
                    <div>{mode === 'cpu' ? 'CPU' : 'Player 2'}</div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setPhase('setup')} className="px-6 py-2 border border-current rounded uppercase tracking-widest text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
                Menu
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
