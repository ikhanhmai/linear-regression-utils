export interface DataPoint {
  x: number;
  y: number;
}

export interface RegressionStats {
  slope: number;
  intercept: number;
  rSquared: number;
  calculatedSlope: number;
  calculatedIntercept: number;
  tss: number;  // Total Sum of Squares
  mss: number;  // Model Sum of Squares
  rss: number;  // Residual Sum of Squares
}

export interface ChartDomain {
  x: [number, number];
  y: [number, number];
}
