"use client";

import { useCallback } from 'react';
import { SimpleDataPoint, MultipleDataPoint, RegressionStats, ChartDomain } from './types';

export const useRegressionChart = () => {
  const calculateChartDomain = useCallback((points: SimpleDataPoint[] | MultipleDataPoint[], selectedFeature = 0): ChartDomain => {
    if (points.length === 0) {
      return {
        x: [-5, 5] as [number, number],
        y: [-5, 5] as [number, number]
      };
    }

    const isSimpleData = 'x' in points[0];
    
    const xValues = isSimpleData
      ? (points as SimpleDataPoint[]).map(p => p.x)
      : (points as MultipleDataPoint[]).map(p => p.features[selectedFeature]);
    const yValues = isSimpleData
      ? (points as SimpleDataPoint[]).map(p => p.y)
      : (points as MultipleDataPoint[]).map(p => p.output);
      
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xPadding = Math.max(1, (xMax - xMin) * 0.1);
    const yPadding = Math.max(1, (yMax - yMin) * 0.1);

    return {
      x: [xMin - xPadding, xMax + xPadding] as [number, number],
      y: [yMin - yPadding, yMax + yPadding] as [number, number]
    };
  }, []);

  const getRegressionLinePoints = useCallback((
    type: 'simple' | 'multiple',
    points: SimpleDataPoint[] | MultipleDataPoint[],
    stats: RegressionStats,
    selectedFeature: number,
    domain: { x: [number, number]; y: [number, number] }
  ) => {
    const linePoints: { x: number; yRegression: number }[] = [];
    const step = (domain.x[1] - domain.x[0]) / 99;

    if (type === 'simple') {
      if (!stats.slope && !stats.intercept) {
        return linePoints;
      }

      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + (step * i);
        const yRegression = stats.slope * x + stats.intercept;
        linePoints.push({ x, yRegression });
      }
    } else {
      if (!stats.coefficients || !stats.coefficients.length) {
        return linePoints;
      }

      const multiPoints = points as MultipleDataPoint[];
      // Calculate mean values for non-selected features
      const meanFeatures = Array(2).fill(0);
      multiPoints.forEach(point => {
        point.features.forEach((val, idx) => {
          meanFeatures[idx] += val;
        });
      });
      meanFeatures.forEach((sum, idx) => {
        meanFeatures[idx] = (sum / multiPoints.length) || 0;
      });

      const coefficients = stats.coefficients;
      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + (step * i);
        // Create a feature vector with the current x value and mean values for other features
        const features = [...meanFeatures];
        features[selectedFeature] = x;
        
        // Calculate predicted y using coefficients
        const yRegression = coefficients[0] + features.reduce((sum, feat, idx) => {
          return sum + coefficients[idx + 1] * feat;
        }, 0);
        
        linePoints.push({ x, yRegression });
      }
    }
    
    return linePoints;
  }, []);

  const generateTicks = useCallback((min: number, max: number, count = 5): number[] => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
  }, []);

  return {
    calculateChartDomain,
    getRegressionLinePoints,
    generateTicks
  };
};
