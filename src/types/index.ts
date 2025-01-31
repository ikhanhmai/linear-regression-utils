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
}

export interface ChartDomain {
  x: [number, number];
  y: [number, number];
}
