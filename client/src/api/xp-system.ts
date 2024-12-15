export const maxExp = 2000;

export function level(exp: number) {
  return Math.floor(exp / maxExp) + 1;
}

export function currentLevelExp(exp: number) {
  return exp % maxExp;
}

