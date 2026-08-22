'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameTheme } from '@/lib/games/useGameTheme';
import Link from 'next/link';

type CardColor = 'sumi' | 'vermillion' | 'indigo' | 'ochre' | 'none';
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'skip' | 'draw2' | 'wild' | 'wildDraw4';

type Card = {
  id: string;
  color: CardColor;
  value: CardValue;
};

type Phase = 'setup' | 'playing' | 'color_picker' | 'gameover';
type Turn = 'player' | 'cpu';

const COLORS: CardColor[] = ['sumi', 'vermillion', 'indigo', 'ochre'];

const COLOR_MAP = {
  'sumi': 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black',
  'vermillion': 'bg-[var(--color-ink-secondary)] text-white',
  'indigo': 'bg-blue-800 text-white',
  'ochre': 'bg-yellow-600 text-white',
  'none': 'bg-neutral-500 text-white',
};

const BORDER_COLOR_MAP = {
  'sumi': 'border-neutral-800 dark:border-neutral-200',
  'vermillion': 'border-[var(--color-ink-secondary)]',
  'indigo': 'border-blue-800',
  'ochre': 'border-yellow-600',
  'none': 'border-transparent',
};

const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  let id = 0;

  for (const c of COLORS) {
    // 1-7
    for (let v = 1; v <= 7; v++) {
      deck.push({ id: `c-${id++}`, color: c, value: v as CardValue });
    }
    // 2 Skips, 2 Draw-2s
    deck.push({ id: `c-${id++}`, color: c, value: 'skip' });
    deck.push({ id: `c-${id++}`, color: c, value: 'skip' });
    deck.push({ id: `c-${id++}`, color: c, value: 'draw2' });
    deck.push({ id: `c-${id++}`, color: c, value: 'draw2' });
  }

  // 4 Wilds, 4 WildDraw4s
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c-${id++}`, color: 'none', value: 'wild' });
    deck.push({ id: `c-${id++}`, color: 'none', value: 'wildDraw4' });
  }

  return deck.sort(() => Math.random() - 0.5);
};

export default function DeckGame() {
  const { isDark, toggle: toggleTheme } = useGameTheme();

  const [phase, setPhase] = useState<Phase>('setup');
  const [deck, setDeck] = useState<Card[]>([]);
  const [discard, setDiscard] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [cpuHand, setCpuHand] = useState<Card[]>([]);
  
  const [turn, setTurn] = useState<Turn>('player');
  const [activeColor, setActiveColor] = useState<CardColor>('none');
  const [pendingWildCard, setPendingWildCard] = useState<Card | null>(null);

  const initGame = () => {
    let newDeck = generateDeck();
    const pHand = newDeck.splice(0, 7);
    const cHand = newDeck.splice(0, 7);
    
    // Find first non-wild for discard
    let firstIdx = newDeck.findIndex(c => c.color !== 'none');
    if (firstIdx === -1) firstIdx = 0; // highly unlikely
    
    const firstCard = newDeck.splice(firstIdx, 1)[0];
    
    setPlayerHand(pHand);
    setCpuHand(cHand);
    setDiscard([firstCard]);
    setActiveColor(firstCard.color);
    setDeck(newDeck);
    setTurn('player');
    setPhase('playing');
  };

  const drawCards = (currentDeck: Card[], currentDiscard: Card[], count: number) => {
    let d = [...currentDeck];
    let drawn: Card[] = [];
    
    for (let i = 0; i < count; i++) {
      if (d.length === 0) {
        // Reshuffle discard except top card
        if (currentDiscard.length > 1) {
          const top = currentDiscard[currentDiscard.length - 1];
          d = currentDiscard.slice(0, currentDiscard.length - 1).sort(() => Math.random() - 0.5);
          currentDiscard.length = 0;
          currentDiscard.push(top);
        } else {
          break; // Nothing left to draw
        }
      }
      drawn.push(d.pop()!);
    }
    return { newDeck: d, drawn };
  };

  const isLegalMove = (card: Card, topCard: Card, currentActiveColor: CardColor) => {
    if (card.color === 'none') return true; // Wilds always legal
    if (card.color === currentActiveColor) return true;
    if (card.value === topCard.value) return true;
    return false;
  };

  const processPlay = (card: Card, playerType: Turn, chosenColor?: CardColor) => {
    const isPlayer = playerType === 'player';
    
    let newPHand = [...playerHand];
    let newCHand = [...cpuHand];
    
    if (isPlayer) {
      newPHand = newPHand.filter(c => c.id !== card.id);
      setPlayerHand(newPHand);
    } else {
      newCHand = newCHand.filter(c => c.id !== card.id);
      setCpuHand(newCHand);
    }

    const newDiscard = [...discard, card];
    setDiscard(newDiscard);

    let nextColor = chosenColor || card.color;
    setActiveColor(nextColor);

    // Check Win (Wait to declare until animations would finish, but state updates immediately)
    if ((isPlayer && newPHand.length === 0) || (!isPlayer && newCHand.length === 0)) {
      setPhase('gameover');
      return;
    }

    // Process effects
    let nextTurn = isPlayer ? 'cpu' : 'player';
    let currentDeck = deck;

    if (card.value === 'skip') {
      nextTurn = playerType; // Skips opponent, you go again (1v1 rule)
    } else if (card.value === 'draw2') {
      const { newDeck, drawn } = drawCards(currentDeck, newDiscard, 2);
      currentDeck = newDeck;
      setDeck(newDeck);
      if (isPlayer) setCpuHand([...newCHand, ...drawn]);
      else setPlayerHand([...newPHand, ...drawn]);
      nextTurn = playerType;
    } else if (card.value === 'wildDraw4') {
      const { newDeck, drawn } = drawCards(currentDeck, newDiscard, 4);
      currentDeck = newDeck;
      setDeck(newDeck);
      if (isPlayer) setCpuHand([...newCHand, ...drawn]);
      else setPlayerHand([...newPHand, ...drawn]);
      nextTurn = playerType;
    }

    setTurn(nextTurn as Turn);
  };

  // CPU Logic
  useEffect(() => {
    if (phase === 'playing' && turn === 'cpu') {
      const t = setTimeout(() => {
        const topCard = discard[discard.length - 1];
        const legalCards = cpuHand.filter(c => isLegalMove(c, topCard, activeColor));

        if (legalCards.length > 0) {
          // Prioritize specials/wilds to disrupt
          const specials = legalCards.filter(c => typeof c.value === 'string');
          const toPlay = specials.length > 0 ? specials[0] : legalCards[0];
          
          let chosenColor = toPlay.color;
          if (toPlay.color === 'none') {
            // Pick most abundant color in hand
            const counts = { sumi: 0, vermillion: 0, indigo: 0, ochre: 0 };
            cpuHand.forEach(c => {
              if (c.color !== 'none') counts[c.color as keyof typeof counts]++;
            });
            type ValidColor = Exclude<CardColor, 'none'>;
            chosenColor = (Object.keys(counts) as ValidColor[]).reduce((a, b) => counts[a] > counts[b] ? a : b);
            if (counts[chosenColor as ValidColor] === 0) chosenColor = 'sumi'; // fallback
          }

          processPlay(toPlay, 'cpu', chosenColor);
        } else {
          // Draw
          const { newDeck, drawn } = drawCards(deck, discard, 1);
          setDeck(newDeck);
          
          if (drawn.length > 0) {
            const drawnCard = drawn[0];
            const newCHand = [...cpuHand, drawnCard];
            setCpuHand(newCHand);
            
            // Can play immediately?
            if (isLegalMove(drawnCard, topCard, activeColor)) {
              setTimeout(() => {
                let chosenColor = drawnCard.color;
                if (drawnCard.color === 'none') chosenColor = 'vermillion'; // random fallback on draw-wild
                processPlay(drawnCard, 'cpu', chosenColor);
              }, 800);
            } else {
              setTurn('player');
            }
          } else {
            setTurn('player'); // Deck empty completely
          }
        }
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, turn, cpuHand, discard, activeColor, deck]);

  const handlePlayerCardClick = (card: Card) => {
    if (phase !== 'playing' || turn !== 'player') return;
    const topCard = discard[discard.length - 1];
    
    if (isLegalMove(card, topCard, activeColor)) {
      if (card.color === 'none') {
        setPendingWildCard(card);
        setPhase('color_picker');
      } else {
        processPlay(card, 'player');
      }
    }
  };

  const handlePlayerDraw = () => {
    if (phase !== 'playing' || turn !== 'player') return;
    
    const { newDeck, drawn } = drawCards(deck, discard, 1);
    setDeck(newDeck);
    
    if (drawn.length > 0) {
      const drawnCard = drawn[0];
      setPlayerHand([...playerHand, drawnCard]);
      
      if (!isLegalMove(drawnCard, discard[discard.length-1], activeColor)) {
        setTurn('cpu');
      }
      // If it is legal, player just keeps their turn and can click it
    } else {
      setTurn('cpu');
    }
  };

  const renderCardValue = (v: CardValue) => {
    if (v === 'skip') return '⊘';
    if (v === 'draw2') return '+2';
    if (v === 'wild') return 'W';
    if (v === 'wildDraw4') return '+4';
    return v;
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 select-none ${isDark ? 'dark bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-900'}`}>
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={toggleTheme} className="p-2 border rounded border-neutral-500 hover:bg-neutral-500/20">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 font-serif tracking-widest z-10 uppercase">Ink Shed</h1>

      {phase === 'setup' && (
        <div className="flex flex-col gap-6 items-center w-full max-w-sm z-10 mt-8 text-center">
          <p className="opacity-80 text-sm uppercase tracking-widest">
            A fast 1v1 duel.<br/>
            Match ink colors or numbers.<br/>
            First to empty their hand wins.<br/>
            Skip, +2, and +4 grant an extra turn.
          </p>
          <button onClick={initGame} className="mt-4 px-8 py-3 bg-[var(--color-accent)] text-white font-bold tracking-widest rounded shadow">
            START
          </button>
        </div>
      )}

      {(phase === 'playing' || phase === 'color_picker') && (
        <div className="flex flex-col items-center justify-between w-full max-w-4xl flex-1 py-8 relative">
          
          {/* CPU Hand */}
          <div className="flex flex-col items-center w-full h-32">
            <div className="uppercase tracking-widest text-sm opacity-50 mb-2">CPU Hand ({cpuHand.length})</div>
            <div className="flex justify-center flex-wrap gap-[-20px] sm:gap-2 px-4 w-full">
              {cpuHand.map((c, i) => (
                <div key={c.id} className="w-12 h-16 sm:w-16 sm:h-24 bg-neutral-300 dark:bg-neutral-800 rounded border border-neutral-400 dark:border-neutral-700 -ml-4 sm:ml-0 shadow" />
              ))}
            </div>
          </div>

          {/* Play Area */}
          <div className="flex items-center justify-center gap-8 w-full my-8">
            <div 
              onClick={handlePlayerDraw}
              className={`w-24 h-32 sm:w-32 sm:h-44 bg-neutral-300 dark:bg-neutral-800 rounded border-2 border-dashed ${turn === 'player' ? 'border-neutral-500 cursor-pointer hover:bg-neutral-400 dark:hover:bg-neutral-700' : 'border-neutral-700 opacity-50'} flex flex-col items-center justify-center`}
            >
              <div className="font-bold uppercase tracking-widest text-sm opacity-50">Draw</div>
              <div className="text-xs opacity-30">{deck.length} left</div>
            </div>

            <div className="relative">
              {discard.length > 0 && (
                <div className={`w-24 h-32 sm:w-32 sm:h-44 rounded shadow-xl flex flex-col justify-between p-2 sm:p-4 ${COLOR_MAP[discard[discard.length-1].color]}`}>
                  <div className="text-lg sm:text-xl font-bold">{renderCardValue(discard[discard.length-1].value)}</div>
                  <div className="self-center text-4xl sm:text-6xl font-serif opacity-50">{renderCardValue(discard[discard.length-1].value)}</div>
                  <div className="text-lg sm:text-xl font-bold self-end rotate-180">{renderCardValue(discard[discard.length-1].value)}</div>
                </div>
              )}
              {/* Active Color Indicator (if wild played) */}
              <div className={`absolute -right-4 -bottom-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg ${COLOR_MAP[activeColor]} ${activeColor === 'none' ? 'hidden' : ''}`} />
            </div>
          </div>

          {/* Player Hand */}
          <div className="flex flex-col items-center w-full min-h-48">
            <div className={`uppercase tracking-widest text-sm mb-4 font-bold ${turn === 'player' ? 'text-[var(--color-accent)]' : 'opacity-50'}`}>
              Your Hand ({playerHand.length})
            </div>
            
            <div className="flex justify-center flex-wrap gap-2 px-4 w-full">
              {playerHand.map((card) => {
                const topCard = discard[discard.length - 1];
                const isLegal = turn === 'player' && isLegalMove(card, topCard, activeColor);
                
                return (
                  <div 
                    key={card.id} 
                    onClick={() => handlePlayerCardClick(card)}
                    className={`w-16 h-24 sm:w-24 sm:h-32 rounded shadow flex flex-col justify-between p-1 sm:p-2 transition-transform duration-200 
                      ${COLOR_MAP[card.color]} 
                      ${isLegal ? 'cursor-pointer hover:-translate-y-4 shadow-lg' : 'opacity-40'}
                    `}
                  >
                    <div className="text-sm sm:text-base font-bold">{renderCardValue(card.value)}</div>
                    <div className="self-center text-2xl sm:text-4xl font-serif opacity-50">{renderCardValue(card.value)}</div>
                    <div className="text-sm sm:text-base font-bold self-end rotate-180">{renderCardValue(card.value)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Color Picker Modal */}
          {phase === 'color_picker' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6">
                <h2 className="uppercase tracking-widest font-bold">Select Active Ink</h2>
                <div className="grid grid-cols-2 gap-4">
                  {COLORS.map(c => (
                    <button 
                      key={c}
                      onClick={() => {
                        processPlay(pendingWildCard!, 'player', c);
                        setPendingWildCard(null);
                        setPhase('playing');
                      }}
                      className={`w-24 h-24 rounded shadow hover:scale-105 transition-transform ${COLOR_MAP[c]}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded shadow-2xl flex flex-col items-center gap-6 text-neutral-900 dark:text-white">
            <h2 className="text-3xl font-serif">
              {playerHand.length === 0 ? 'You Win!' : 'CPU Wins!'}
            </h2>

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
