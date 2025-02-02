export const mean = (arr: number[]): number => 
  arr.reduce((a, b) => a + b, 0) / arr.length;

export const variance = (arr: number[]): number => {
  const m = mean(arr);
  return arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length - 1);
};

export const calculatePValue = (tStatistic: number): number => {
  // This is a simplified approximation using the standard normal distribution
  const absT = Math.abs(tStatistic);
  return 2 * (1 - Math.exp(-0.717 * absT - 0.416 * absT * absT));
};

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
