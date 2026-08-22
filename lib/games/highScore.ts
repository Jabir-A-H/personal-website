export function getHighScore(gameKey: string): number | null {
  try {
    const raw = localStorage.getItem(`rift:${gameKey}:highscore`);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}

export function setHighScoreIfBetter(
  gameKey: string,
  score: number,
  higherIsBetter: boolean = true
): boolean {
  try {
    const current = getHighScore(gameKey);
    const isBetter =
      current === null || (higherIsBetter ? score > current : score < current);
    if (isBetter) {
      localStorage.setItem(`rift:${gameKey}:highscore`, String(score));
    }
    return isBetter;
  } catch {
    return false;
  }
}
