export interface SimpleDataPoint {
  x: number;
  y: number;
}

export interface MultipleDataPoint {
  features: number[];
  output: number;
}

export interface SimpleNewPoint {
  feature: string;
  output: string;
}

export interface MultipleNewPoint {
  features: string[];
  output: string;
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
  tStatisticSlope: number;  // t-statistic for slope
  tStatisticIntercept: number;  // t-statistic for intercept
  pValueSlope: number;  // p-value for slope
  pValueIntercept: number;  // p-value for intercept
  fStatistic: number;  // F-statistic for overall model
  pValueF: number;  // p-value for F-statistic
  standardErrorSlope: number;  // Standard error of slope
  standardErrorIntercept: number;  // Standard error of intercept
  vif: number;  // Variance Inflation Factor (for multicollinearity)
  adjustedRSquared: number;  // Adjusted R-squared (accounts for model complexity)
  dfRegression: number;  // Degrees of freedom for regression
  dfResidual: number;  // Degrees of freedom for residuals
  dfTotal: number;  // Total degrees of freedom
  coefficients: number[];  // Array of coefficients for multiple regression
}
