"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { SimpleDataPoint, MultipleDataPoint, SimpleNewPoint, MultipleNewPoint, RegressionStats } from '../types';
import { DataInputForm } from './DataInputForm';
import { MultipleDataInputForm } from './MultipleDataInputForm';
import { SimpleRegressionChart } from './SimpleRegressionChart';
import { MultipleRegressionChart } from './MultipleRegressionChart';
import { StatsDisplay } from './StatsDisplay';
import { mean, variance } from '../utils/statistics';
import { calculatePValue } from '../utils/statistics';
import { transpose, multiply, inverse } from '../utils/matrixOperations';

interface RegressionVisualizerProps {
  type: 'simple' | 'multiple';
}

// Helper function to get default regression stats
function getDefaultRegressionStats(): RegressionStats {
  return ({
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
  });
}

export const RegressionVisualizer: React.FC<RegressionVisualizerProps> = ({ type }) => {
  const [simplePoints, setSimplePoints] = useState<SimpleDataPoint[]>([]);
  const [multiplePoints, setMultiplePoints] = useState<MultipleDataPoint[]>([]);
  const [selectedFeature] = useState(0);
  const [regressionStats, setRegressionStats] = useState<RegressionStats>(getDefaultRegressionStats());
  const [newPoint, setNewPoint] = useState<SimpleNewPoint | MultipleNewPoint>(
    type === 'simple'
      ? { feature: '0', output: '0' }
      : { features: ['0', '0'], output: '0' }
  );

  // Calculate regression statistics for simple regression
  const calculateSimpleRegression = useCallback((points: SimpleDataPoint[]): RegressionStats => {
    if (points.length < 2) {
      return getDefaultRegressionStats();
    }

    try {
      const n = points.length;
      const xValues = points.map(p => p.x);
      const yValues = points.map(p => p.y);
    
      const xMean = mean(xValues);
      const yMean = mean(yValues);
    
      // Calculate slope and intercept
      const numerator = points.reduce((sum, point) => sum + (point.x - xMean) * (point.y - yMean), 0);
      const denominator = points.reduce((sum, point) => sum + Math.pow(point.x - xMean, 2), 0);
      
      const slope = numerator / denominator;
      const intercept = yMean - slope * xMean;
    
      // Calculate sum of squares
      const tss = points.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
      const mss = points.reduce((sum, point) => sum + Math.pow(slope * point.x + intercept - yMean, 2), 0);
      const rss = points.reduce((sum, point) => sum + Math.pow(point.y - (slope * point.x + intercept), 2), 0);
    
      // Calculate R-squared and degrees of freedom
      const rSquared = 1 - (rss / tss);
      const dfRegression = 1;  
      const dfResidual = n - 2;  
      const dfTotal = n - 1;
      const adjustedRSquared = 1 - ((1 - rSquared) * dfTotal / dfResidual);
    
      // Calculate standard errors
      const mse = rss / dfResidual;  
      const xVariance = variance(xValues);
      const standardErrorSlope = Math.sqrt(mse / (n * xVariance));
      const standardErrorIntercept = Math.sqrt(mse * (1/n + Math.pow(xMean, 2)/(n * xVariance)));
    
      // Calculate t-statistics and p-values
      const tStatisticSlope = slope / standardErrorSlope;
      const tStatisticIntercept = intercept / standardErrorIntercept;
      const pValueSlope = calculatePValue(tStatisticSlope);
      const pValueIntercept = calculatePValue(tStatisticIntercept);
    
      // Calculate F-statistic
      const fStatistic = (mss / dfRegression) / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic));  
    
      return {
        slope,
        intercept,
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
  }, []);

  // Calculate regression statistics for multiple regression
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
        fStatistic,
        pValueF,
        dfRegression,
        dfResidual,
        dfTotal,
        coefficients,
        adjustedRSquared,
        standardErrorSlope: standardErrors[1],
        standardErrorIntercept: standardErrors[0],
        vif: 1,  
        pValueSlope: calculatePValue(tStatistics[1]),
        pValueIntercept: calculatePValue(tStatistics[0])
      };
    } catch (error) {
      console.error('Error in regression calculation:', error);
      return {
        ...getDefaultRegressionStats(),
        coefficients: [0, 0, 0]
      };
    }
  }, []);

  // Generate random points for simple regression
  const generateRandomSimplePoints = useCallback((count: number): SimpleDataPoint[] => {
    const slope = 2;
    const intercept = 1;
    return Array.from({ length: count }, () => {
      const x = Math.random() * 20 - 10;
      const perfectY = slope * x + intercept;
      const y = perfectY + (Math.random() - 0.5);
      return { x, y };
    });
  }, []);

  // Generate random points for multiple regression
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

  const handleInputChange = (field: string, value: string) => {
    setNewPoint(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPoint = () => {
    if (type === 'simple') {
      const simpleNewPoint = newPoint as SimpleNewPoint;
      const x = parseFloat(simpleNewPoint.feature);
      const y = parseFloat(simpleNewPoint.output);
      if (!isNaN(x) && !isNaN(y)) {
        setSimplePoints([...simplePoints, { x, y }]);
        setNewPoint({ feature: '0', output: '0' });
      }
    } else {
      const multipleNewPoint = newPoint as MultipleNewPoint;
      const features = multipleNewPoint.features.map(f => parseFloat(f));
      const y = parseFloat(multipleNewPoint.output);
      if (features.every(x => !isNaN(x)) && !isNaN(y)) {
        setMultiplePoints([...multiplePoints, { features, output: y }]);
        setNewPoint({ features: ['0', '0'], output: '0' });
      }
    }
  };

  const calculateChartDomain = (): { x: [number, number]; y: [number, number] } => {
    if (type === 'simple') {
      if (simplePoints.length === 0) {
        return { x: [-10, 10], y: [-10, 10] };
      }
      const xValues = simplePoints.map(p => p.x);
      const yValues = simplePoints.map(p => p.y);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      const xPadding = Math.max(1, (xMax - xMin) * 0.2);
      const yPadding = Math.max(1, (yMax - yMin) * 0.2);
      return {
        x: [xMin - xPadding, xMax + xPadding],
        y: [yMin - yPadding, yMax + yPadding],
      };
    } else {
      if (multiplePoints.length === 0) {
        return { x: [-10, 10], y: [-10, 10] };
      }
      const xValues = multiplePoints.map(p => p.features[selectedFeature]);
      const yValues = multiplePoints.map(p => p.output);
      const yPredicted = multiplePoints.map(p => {
        const coefficients = regressionStats.coefficients || [];
        return coefficients[0] + coefficients[1] * p.features[0] + coefficients[2] * p.features[1];
      });
      
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues, ...yPredicted);
      const yMax = Math.max(...yValues, ...yPredicted);
      
      const xPadding = Math.max(1, (xMax - xMin) * 0.2);
      const yPadding = Math.max(1, (yMax - yMin) * 0.2);
      
      return {
        x: [xMin - xPadding, xMax + xPadding],
        y: [yMin - yPadding, yMax + yPadding],
      };
    }
  };

  // Get regression line points for visualization
  const getRegressionLinePoints = () => {
    const points: { x: number; yRegression: number }[] = [];
    const domain = calculateChartDomain();
    const step = (domain.x[1] - domain.x[0]) / 99;

    if (type === 'simple') {
      if (!regressionStats.slope && !regressionStats.intercept) {
        return points;
      }

      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + (step * i);
        const yRegression = regressionStats.slope * x + regressionStats.intercept;
        points.push({ x, yRegression });
      }
    } else {
      if (!regressionStats.coefficients || !regressionStats.coefficients.length) {
        return points;
      }

      // For multiple regression, calculate mean values for non-selected features
      const meanFeatures = Array(2).fill(0);
      multiplePoints.forEach(point => {
        point.features.forEach((val, idx) => {
          meanFeatures[idx] += val;
        });
      });
      meanFeatures.forEach((sum, idx) => {
        meanFeatures[idx] = (sum / multiplePoints.length) || 0;
      });

      const coefficients = regressionStats.coefficients;
      for (let i = 0; i <= 99; i++) {
        const x = domain.x[0] + (step * i);
        // Create a feature vector with the current x value and mean values for other features
        const features = [...meanFeatures];
        features[selectedFeature] = x;
        
        // Calculate predicted y using coefficients
        const yRegression = coefficients[0] + features.reduce((sum, feat, idx) => {
          return sum + coefficients[idx + 1] * feat;
        }, 0);
        
        points.push({ x, yRegression });
      }
    }
    
    return points;
  };

  // Generate ticks for axes
  const generateTicks = (min: number, max: number, count = 5): number[] => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
  };

  // Update regression stats when points change
  useEffect(() => {
    if (type === 'simple' && simplePoints.length >= 2) {
      const stats = calculateSimpleRegression(simplePoints);
      setRegressionStats(stats);
    } else if (type === 'multiple' && multiplePoints.length >= 2) {
      setRegressionStats(calculateMultipleRegression(multiplePoints));
    }
  }, [type, simplePoints, multiplePoints, calculateSimpleRegression, calculateMultipleRegression]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        {type === 'simple' ? (
          <>
            <DataInputForm
              newPoint={newPoint as SimpleNewPoint}
              onAddPoint={handleAddPoint}
              onInputChange={handleInputChange}
              onGeneratePoints={(count) => {
                const points = generateRandomSimplePoints(count);
                setSimplePoints(points);
              }}
            />
            <SimpleRegressionChart
              dataPoints={simplePoints}
              regressionLine={getRegressionLinePoints()}
              domain={calculateChartDomain()}
              generateTicks={generateTicks}
            />
            <StatsDisplay stats={regressionStats} manualMode={false} />
          </>
        ) : (
          <>
            <MultipleDataInputForm
              onPointAdd={(point: MultipleNewPoint) => {
                const features = point.features.map(f => parseFloat(f));
                const y = parseFloat(point.output);
                if (features.every(x => !isNaN(x)) && !isNaN(y)) {
                  setMultiplePoints([...multiplePoints, { features, output: y }]);
                }
              }}
              onGeneratePoints={(count) => {
                const points = generateRandomMultiplePoints(count);
                setMultiplePoints(points);
              }}
            />
            <MultipleRegressionChart
              dataPoints={multiplePoints.map(p => ({ x: p.features[selectedFeature], y: p.output }))}
              regressionLine={getRegressionLinePoints()}
              domain={calculateChartDomain()}
              generateTicks={generateTicks}
              selectedFeature={selectedFeature}
            />
            <StatsDisplay stats={regressionStats} manualMode={false} />
          </>
        )}
      </div>
    </div>
  );
};
