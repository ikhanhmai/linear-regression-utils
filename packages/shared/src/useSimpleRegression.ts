"use client";

import { useState, useCallback } from 'react';
import { SimpleDataPoint, RegressionStats } from './types';
import { mean, variance, calculatePValue } from './utils/statistics';

export const useSimpleRegression = () => {
  const [simplePoints, setSimplePoints] = useState<SimpleDataPoint[]>([]);
  const [manualMode, setManualMode] = useState(false);
  const [manualSlope, setManualSlope] = useState(0);
  const [manualIntercept, setManualIntercept] = useState(0);

  const calculateSimpleRegression = useCallback((points: SimpleDataPoint[]): RegressionStats => {
    if (points.length < 2) {
      return getDefaultRegressionStats();
    }

    try {
      const n = points.length;
      const xMean = mean(points.map(p => p.x));
      const yMean = mean(points.map(p => p.y));
      const xVariance = variance(points.map(p => p.x));
      
      // Calculate slope and intercept
      let slope: number;
      let intercept: number;
      
      if (manualMode) {
        slope = manualSlope;
        intercept = manualIntercept;
      } else {
        let numerator = 0;
        let denominator = 0;
        
        points.forEach(point => {
          numerator += (point.x - xMean) * (point.y - yMean);
          denominator += Math.pow(point.x - xMean, 2);
        });
        
        slope = numerator / denominator;
        intercept = yMean - slope * xMean;
      }
      
      // Calculate predicted values and residuals
      const yPred = points.map(p => slope * p.x + intercept);
      const residuals = points.map((p, i) => p.y - yPred[i]);
      
      // Calculate sum of squares
      const tss = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
      const rss = residuals.reduce((sum, r) => sum + Math.pow(r, 2), 0);
      const mss = tss - rss;
      
      // Calculate R-squared
      const rSquared = 1 - (rss / tss);
      
      // Calculate standard errors and t-statistics
      const dfTotal = n - 1;
      const dfRegression = 1;
      const dfResidual = n - 2;
      const mse = rss / dfResidual;
      
      const standardErrorSlope = Math.sqrt(mse / (n * xVariance));
      const standardErrorIntercept = Math.sqrt(mse * (1/n + Math.pow(xMean, 2)/(n * xVariance)));
      
      const tStatisticSlope = slope / standardErrorSlope;
      const tStatisticIntercept = intercept / standardErrorIntercept;
      
      const pValueSlope = calculatePValue(Math.abs(tStatisticSlope), dfResidual);
      const pValueIntercept = calculatePValue(Math.abs(tStatisticIntercept), dfResidual);
      
      // Calculate adjusted R-squared
      const adjustedRSquared = 1 - ((1 - rSquared) * dfTotal / dfResidual);
      
      // Calculate F-statistic
      const fStatistic = (mss / dfRegression) / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic), dfResidual);

      return {
        slope: slope,
        intercept: intercept,
        rSquared,
        calculatedSlope: slope,
        calculatedIntercept: intercept,
        tss,
        mss,
        rss,
        tStatisticSlope,
        tStatisticIntercept,
        pValueSlope,
        pValueIntercept,
        fStatistic,
        pValueF,
        standardErrorSlope,
        standardErrorIntercept,
        vif: 1,
        adjustedRSquared,
        dfRegression,
        dfResidual,
        dfTotal,
        coefficients: [intercept, slope]
      };
    } catch (error) {
      console.error('Error calculating regression:', error);
      return getDefaultRegressionStats();
    }
  }, [manualMode, manualSlope, manualIntercept]);

  const generateRandomSimplePoints = useCallback((count: number): SimpleDataPoint[] => {
    const points: SimpleDataPoint[] = [];
    // Randomize slope and intercept for more variation
    const slope = Math.random() * 6 - 3;  // Random slope between -3 and 3
    const intercept = Math.random() * 4 - 2;  // Random intercept between -2 and 2
    const noise = 1.5;  // Increased noise for more variation

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 10 - 5;  // Random x between -5 and 5
      // Add more randomized noise
      const noiseAmount = (Math.random() * 2 - 1) * noise * (1 + Math.random());  // Variable noise
      const y = slope * x + intercept + noiseAmount;
      points.push({ x, y });
    }

    return points;
  }, []);

  return {
    simplePoints,
    setSimplePoints,
    manualMode,
    setManualMode,
    manualSlope,
    setManualSlope,
    manualIntercept,
    setManualIntercept,
    calculateSimpleRegression,
    generateRandomSimplePoints
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
