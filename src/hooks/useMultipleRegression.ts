"use client";

import { useState, useCallback } from 'react';
import { MultipleDataPoint, RegressionStats } from '../types';
import { mean } from '../utils/statistics';
import { calculatePValue } from '../utils/statistics';
import { transpose, multiply, inverse } from '../utils/matrixOperations';

export const useMultipleRegression = () => {
  const [multiplePoints, setMultiplePoints] = useState<MultipleDataPoint[]>([]);
  const [selectedFeature, setSelectedFeature] = useState(0);

  const calculateMultipleRegression = useCallback((points: MultipleDataPoint[]): RegressionStats => {
    if (points.length < 2) {
      return {
        ...getDefaultRegressionStats(),
        coefficients: [0, 0, 0]
      };
    }

    try {
      const n = points.length;
      const p = points[0].features.length;

      // Create X matrix with a column of 1s for intercept
      const X = points.map(point => [1, ...point.features]);
      const y = points.map(point => point.output);

      // Calculate X'X
      const XtX = multiply(transpose(X), X);
      
      // Calculate inverse of X'X
      const XtXInv = inverse(XtX);
      
      // Calculate X'y
      const Xty = multiply(transpose(X), y.map(val => [val])).map(row => row[0]);
      
      // Calculate coefficients
      const coefficients = multiply(XtXInv, Xty.map(val => [val])).map(row => row[0]);
      
      // Calculate predicted values
      const yPred = multiply(X, coefficients.map(val => [val])).map(row => row[0]);
      
      // Calculate means
      const yMean = mean(y);
      
      // Calculate sum of squares
      const tss = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
      const rss = y.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0);
      const mss = tss - rss;
      
      // Calculate R-squared and adjusted R-squared
      const rSquared = 1 - (rss / tss);
      const dfTotal = n - 1;
      const dfRegression = p;
      const dfResidual = n - (p + 1);
      const adjustedRSquared = 1 - ((1 - rSquared) * dfTotal / dfResidual);

      // Calculate standard errors and t-statistics
      const mse = rss / dfResidual;
      const standardErrors = XtXInv.map((row, i) => Math.sqrt(mse * row[i]));
      const tStatistics = coefficients.map((coef, i) => coef / standardErrors[i]);

      // Calculate F-statistic
      const fStatistic = (mss / dfRegression) / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic));

      return {
        slope: coefficients[1],
        intercept: coefficients[0],
        rSquared,
        calculatedSlope: coefficients[1],
        calculatedIntercept: coefficients[0],
        tss,
        mss,
        rss,
        tStatisticSlope: tStatistics[1],
        tStatisticIntercept: tStatistics[0],
        pValueSlope: calculatePValue(Math.abs(tStatistics[1])),
        pValueIntercept: calculatePValue(Math.abs(tStatistics[0])),
        fStatistic,
        pValueF,
        standardErrorSlope: standardErrors[1],
        standardErrorIntercept: standardErrors[0],
        vif: 1,
        adjustedRSquared,
        dfRegression,
        dfResidual,
        dfTotal,
        coefficients
      };
    } catch (error) {
      console.error('Error calculating multiple regression:', error);
      return {
        ...getDefaultRegressionStats(),
        coefficients: [0, 0, 0]
      };
    }
  }, []);

  const generateRandomMultiplePoints = useCallback((count: number): MultipleDataPoint[] => {
    const points: MultipleDataPoint[] = [];
    const coefficients = [2, 3]; // True coefficients for features
    const intercept = 1; // True intercept
    const noise = 0.5; // Noise level

    for (let i = 0; i < count; i++) {
      const features = coefficients.map(() => Math.random() * 10 - 5); // Random features between -5 and 5
      const output = intercept + features.reduce((sum, feat, idx) => sum + coefficients[idx] * feat, 0)
        + (Math.random() * 2 - 1) * noise; // Add random noise
      points.push({ features, output });
    }
    return points;
  }, []);

  return {
    multiplePoints,
    setMultiplePoints,
    selectedFeature,
    setSelectedFeature,
    calculateMultipleRegression,
    generateRandomMultiplePoints
  };
};

// Helper function to get default regression stats
function getDefaultRegressionStats(): RegressionStats {
  return {
    slope: 0,
    intercept: 0,
    rSquared: 0,
    calculatedSlope: 0,
    calculatedIntercept: 0,
    tss: 0,
    mss: 0,
    rss: 0,
    tStatisticSlope: 0,
    tStatisticIntercept: 0,
    pValueSlope: 1,
    pValueIntercept: 1,
    fStatistic: 0,
    pValueF: 1,
    standardErrorSlope: 0,
    standardErrorIntercept: 0,
    vif: 1,
    adjustedRSquared: 0,
    dfRegression: 0,
    dfResidual: 0,
    dfTotal: 0,
    coefficients: [0, 0]
  };
}
