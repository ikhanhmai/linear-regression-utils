export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const variance = (values: number[]): number => {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / (values.length - 1);
};

export const calculatePValue = (tStat: number, degreesOfFreedom: number): number => {
  // Using a simplified t-distribution approximation
  // For more accurate results, you might want to use a statistical library
  const x = degreesOfFreedom / (degreesOfFreedom + tStat * tStat);
  const beta = Math.exp(
    0.5 * (Math.log(degreesOfFreedom) - Math.log(2 * Math.PI)) -
    Math.log(Math.sqrt(x * (1 - x)))
  );
  return 2 * (1 - beta);
};
