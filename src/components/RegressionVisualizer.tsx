"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DataInputForm } from './DataInputForm';
import { MultipleDataInputForm } from './MultipleDataInputForm';
import { SimpleRegressionChart } from './SimpleRegressionChart';
import { MultipleRegressionChart } from './MultipleRegressionChart';
import { StatsDisplay } from './StatsDisplay';

interface DataPoint {
  x: number;
  y: number;
}

interface MultipleDataPoint {
  x: number[];
  y: number;
}

interface RegressionStats {
  slope: number;
  intercept: number;
  rSquared: number;
  calculatedSlope: number;
  calculatedIntercept: number;
  tss: number;
  mss: number;
  rss: number;
  tStatisticSlope: number;
  tStatisticIntercept: number;
  pValueSlope: number;
  pValueIntercept: number;
  fStatistic: number;
  pValueF: number;
  standardErrorSlope: number;
  standardErrorIntercept: number;
  vif: number;
  adjustedRSquared: number;
  dfRegression: number;
  dfResidual: number;
  dfTotal: number;
  coefficients?: number[]; // Array of coefficients for multiple regression
}

interface RegressionVisualizerProps {
  type: 'simple' | 'multiple';
}

interface NewPoint {
  x?: string;
  y?: string;
  x1?: string;
  x2?: string;
}

// Helper function to get default regression stats
const getDefaultRegressionStats = (): RegressionStats => ({
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

export const RegressionVisualizer: React.FC<RegressionVisualizerProps> = ({ type }) => {
  const [simplePoints, setSimplePoints] = useState<DataPoint[]>([]);
  const [multiplePoints, setMultiplePoints] = useState<MultipleDataPoint[]>([]);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [regressionStats, setRegressionStats] = useState<RegressionStats>(getDefaultRegressionStats());
  const [newPoint, setNewPoint] = useState<NewPoint>(
    type === 'simple'
      ? { x: '', y: '' }
      : { x1: '', x2: '', y: '' }
  );

  // Calculate mean of an array
  const mean = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;

  // Calculate variance of an array
  const variance = (arr: number[]): number => {
    const m = mean(arr);
    return arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length - 1);
  };

  // Calculate p-value from t-statistic (using normal distribution as approximation)
  const calculatePValue = (tStatistic: number): number => {
    // This is a simplified approximation using the standard normal distribution
    const absT = Math.abs(tStatistic);
    return 2 * (1 - Math.exp(-0.717 * absT - 0.416 * absT * absT));
  };

  // Calculate regression statistics
  const calculateRegression = useCallback((points: DataPoint[]): RegressionStats => {
    if (points.length < 2) {
      return getDefaultRegressionStats();
    }

    try {
      const n = points.length;
      const xValues = points.map(p => p.x);
      const yValues = points.map(p => p.y);
    
      const xMean = mean(xValues);
      const yMean = mean(yValues);
    
      const xxSum = xValues.reduce((sum, x) => sum + x * x, 0);
      const xySum = points.reduce((sum, p) => sum + p.x * p.y, 0);
      const xSum = xValues.reduce((a, b) => a + b, 0);
      const ySum = yValues.reduce((a, b) => a + b, 0);
    
      // Calculate basic regression parameters
      const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
      const intercept = yMean - slope * xMean;
    
      // Calculate predictions and residuals
      const predictions = points.map(p => slope * p.x + intercept);
      const residuals = points.map((p, i) => p.y - predictions[i]);
    
      // Calculate sums of squares
      const tss = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
      const rss = residuals.reduce((sum, r) => sum + r * r, 0);
      const mss = tss - rss;
    
      // Calculate R-squared and Adjusted R-squared
      const rSquared = 1 - (rss / tss);
      const dfTotal = n - 1;
      const dfRegression = 1;  // Simple linear regression has 1 predictor
      const dfResidual = n - 2;  // n - (predictors + 1)
      const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1) / (n - 2));
    
      // Calculate standard errors
      const mse = rss / dfResidual;  // Mean squared error
      const xVariance = variance(xValues);
      const standardErrorSlope = Math.sqrt(mse / (n * xVariance));
      const standardErrorIntercept = Math.sqrt(mse * (1/n + Math.pow(xMean, 2)/(n * xVariance)));
    
      // Calculate t-statistics
      const tStatisticSlope = slope / standardErrorSlope;
      const tStatisticIntercept = intercept / standardErrorIntercept;
    
      // Calculate p-values
      const pValueSlope = calculatePValue(tStatisticSlope);
      const pValueIntercept = calculatePValue(tStatisticIntercept);
    
      // Calculate F-statistic
      const fStatistic = (mss / dfRegression) / (rss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic));  // Convert F to t for approximation
    
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
        vif: 1,  // Always 1 for simple linear regression
        adjustedRSquared,
        dfRegression,
        dfResidual,
        dfTotal
      };
    } catch (error) {
      console.error('Error calculating regression:', error);
      return getDefaultRegressionStats();
    }
  }, []);

  // Calculate multiple regression statistics
  const calculateMultipleRegression = useCallback((points: MultipleDataPoint[]): RegressionStats => {
    if (points.length < 2) {
      return {
        ...getDefaultRegressionStats(),
        coefficients: [0, 0, 0] // Intercept and coefficients for 2 features
      };
    }

    try {
      const n = points.length;
      const p = points[0].x.length; // Number of features

      // Create X matrix with a column of 1s for intercept
      const X = points.map(point => [1, ...point.x]);
      const y = points.map(point => point.y);

      // Calculate X'X
      const XtX = multiply(transpose(X), X);
      
      // Calculate X'y
      const Xty = multiply(transpose(X), y.map(val => [val]));
      
      // Calculate (X'X)^-1
      const XtXInv = inverse(XtX);
      
      // Calculate coefficients: β = (X'X)^-1 X'y
      const coefficients = multiply(XtXInv, Xty).map(row => row[0]);

      // Calculate predicted values
      const yPred = multiply(X, coefficients.map(c => [c])).map(row => row[0]);

      // Calculate residuals
      const residuals = y.map((actual, i) => actual - yPred[i]);

      // Calculate sums of squares
      const yMean = mean(y);
      const tss = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
      const rss = residuals.reduce((sum, r) => sum + r * r, 0);
      const mss = tss - rss;

      // Calculate R-squared and adjusted R-squared
      const rSquared = 1 - (rss / tss);
      const dfTotal = n - 1;
      const dfRegression = p;  // Number of features
      const dfResidual = n - (p + 1);  // n - (features + intercept)
      const adjustedRSquared = 1 - ((1 - rSquared) * (dfTotal) / dfResidual);

      // Calculate standard errors and t-statistics
      const mse = rss / dfResidual;
      const standardErrors = XtXInv.map((row, i) => Math.sqrt(mse * row[i]));
      const tStatistics = coefficients.map((coef, i) => coef / standardErrors[i]);
      const pValues = tStatistics.map(t => calculatePValue(t));

      // Calculate F-statistic
      const fStatistic = (mss / dfRegression) / (mss / dfResidual);
      const pValueF = calculatePValue(Math.sqrt(fStatistic));

      return {
        ...getDefaultRegressionStats(),
        rSquared,
        adjustedRSquared,
        coefficients,
        tss,
        mss,
        rss,
        fStatistic,
        pValueF,
        dfRegression,
        dfResidual,
        dfTotal
      };
    } catch (error) {
      console.error('Error in regression calculation:', error);
      return {
        ...getDefaultRegressionStats(),
        coefficients: [0, 0, 0] // Intercept and coefficients for 2 features
      };
    }
  }, []);

  // Calculate VIF for each feature
  const calculateVIF = (X: number[][]): number => {
    // For simplicity, calculate VIF for the first feature
    const y = X.map(row => row[0]);
    const otherX = X.map(row => [1, ...row.slice(1)]);
  
    try {
      const XT = transpose(otherX);
      const XTX = multiply(XT, otherX);
      const XTXInv = inverse(XTX);
      const XTy = multiply(XT, [y]);
      const coefficients = multiply(XTXInv, XTy).map(row => row[0]);
      
      const yPred = otherX.map(row => 
        row.reduce((sum, val, i) => sum + val * coefficients[i], 0)
      );
      
      const yMean = mean(y);
      const tss = sum(y.map(val => Math.pow(val - yMean, 2)));
      const rss = sum(y.map((val, i) => Math.pow(val - yPred[i], 2)));
      const rSquared = 1 - (rss / tss);
      
      return 1 / (1 - rSquared);
    } catch (error) {
      // If matrix operations fail (e.g., singular matrix), return 1
      console.warn('Failed to calculate VIF:', error);
      return 1;
    }
  };

  // Matrix operations
  const transpose = (matrix: number[][]): number[][] => {
    if (!matrix[0]) return [[]];
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  };

  const multiply = (a: number[][], b: number[][]): number[][] => {
    if (!a.length || !b.length || !a[0].length || !b[0].length) return [[]];
  
    const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  };

  const determinant = (matrix: number[][]): number => {
    const n = matrix.length;
  
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  
    let det = 0;
    for (let j = 0; j < n; j++) {
      det += Math.pow(-1, j) * matrix[0][j] * determinant(
        matrix.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
      );
    }
    return det;
  };

  const cofactor = (matrix: number[][], row: number, col: number): number => {
    const subMatrix = matrix
      .slice(0, row)
      .concat(matrix.slice(row + 1))
      .map(row => [...row.slice(0, col), ...row.slice(col + 1)]);
    return Math.pow(-1, row + col) * determinant(subMatrix);
  };

  const inverse = (matrix: number[][]): number[][] => {
    const n = matrix.length;
  
    if (n !== matrix[0].length) throw new Error('Matrix must be square');

    // Add small regularization term to diagonal for numerical stability
    const lambda = 1e-8;
    const regularizedMatrix = matrix.map((row, i) => 
      row.map((val, j) => i === j ? val + lambda : val)
    );

    const det = determinant(regularizedMatrix);
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular or nearly singular');
    }
  
    const cofactorMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        cofactorMatrix[i][j] = Math.pow(-1, i + j) * cofactor(regularizedMatrix, i, j);
      }
    }

    const adjugate = transpose(cofactorMatrix);
    return adjugate.map(row => row.map(val => val / det));
  };

  const diagonal = (matrix: number[][]): number[] => {
    return matrix.map((row, i) => row[i] || 0);
  };

  const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

  // Generate random points
  const generateRandomPoints = (count: number): DataPoint[] => {
    const slope = 0.5;
    const intercept = 2;
    const noise = 2;

    return Array.from({ length: count }, () => {
      const x = Math.random() * 20 - 10; // Random x between -10 and 10
      const perfectY = slope * x + intercept;
      const y = perfectY + (Math.random() * noise * 2 - noise); // Add random noise
      return { x, y };
    });
  };

  // Generate random points for multiple regression
  const generateRandomMultiplePoints = (count: number, featureCount: number): MultipleDataPoint[] => {
    const points: MultipleDataPoint[] = [];
    
    // Generate coefficients for each feature
    const coefficients = Array(featureCount).fill(0).map(() => Math.random() * 2 - 1);
    const intercept = Math.random() * 2 - 1;
    
    for (let i = 0; i < count; i++) {
      // Generate random x values for each feature
      const x = Array(featureCount).fill(0).map(() => Math.random() * 10 - 5);
      
      // Calculate y using the linear combination plus some noise
      const y = intercept + coefficients.reduce((sum, coef, idx) => sum + coef * x[idx], 0) + (Math.random() - 0.5);
      
      points.push({ x, y });
    }
    
    return points;
  };

  const handleAddPoint = () => {
    if (type === 'simple') {
      const x = parseFloat(newPoint.x as string);
      const y = parseFloat(newPoint.y as string);
      if (!isNaN(x) && !isNaN(y)) {
        setSimplePoints([...simplePoints, { x, y }]);
        setNewPoint({ x: '', y: '' });
      }
    } else {
      const x1 = parseFloat(newPoint.x1 as string);
      const x2 = parseFloat(newPoint.x2 as string);
      const y = parseFloat(newPoint.y as string);
      if (!isNaN(x1) && !isNaN(x2) && !isNaN(y)) {
        setMultiplePoints([...multiplePoints, { x: [x1, x2], y }]);
        setNewPoint({ x1: '', x2: '', y: '' });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPoint(prev => ({ ...prev, [field]: value }));
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
      const xPadding = Math.max(1, (xMax - xMin) * 0.2);  // Increased padding
      const yPadding = Math.max(1, (yMax - yMin) * 0.2);  // Increased padding
      return {
        x: [xMin - xPadding, xMax + xPadding],
        y: [yMin - yPadding, yMax + yPadding],
      };
    } else {
      if (multiplePoints.length === 0) {
        return { x: [-10, 10], y: [-10, 10] };
      }
      const xValues = multiplePoints.map(p => p.x[selectedFeature]);
      const yValues = multiplePoints.map(p => p.y);
      const yPredicted = multiplePoints.map(p => {
        const coefficients = regressionStats.coefficients || [];
        return coefficients[0] + coefficients[1] * p.x[0] + coefficients[2] * p.x[1];
      });
      
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues, ...yPredicted);
      const yMax = Math.max(...yValues, ...yPredicted);
      
      const xPadding = Math.max(1, (xMax - xMin) * 0.2);  // Increased padding for multiple regression
      const yPadding = Math.max(1, (yMax - yMin) * 0.2);  // Increased padding for multiple regression
      
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
        point.x.forEach((val, idx) => {
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
      const stats = calculateRegression(simplePoints);
      setRegressionStats(stats);
    } else if (type === 'multiple' && multiplePoints.length >= 2) {
      setRegressionStats(calculateMultipleRegression(multiplePoints));
    }
  }, [type, simplePoints, multiplePoints, calculateRegression, calculateMultipleRegression]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {type === 'simple' ? (
        <>
          <DataInputForm
            newPoint={newPoint}
            onAddPoint={handleAddPoint}
            onInputChange={handleInputChange}
            onGeneratePoints={(count) => {
              const points = generateRandomPoints(count);
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
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Multiple Linear Regression</h2>
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(parseInt(e.target.value))}
                className="px-3 py-1 border rounded"
              >
                <option value={0}>Feature 1</option>
                <option value={1}>Feature 2</option>
              </select>
            </div>
          </div>
          <MultipleDataInputForm
            newPoint={newPoint}
            onAddPoint={handleAddPoint}
            onInputChange={handleInputChange}
            selectedFeature={selectedFeature}
            onFeatureChange={setSelectedFeature}
            onGeneratePoints={(count) => {
              const points = generateRandomMultiplePoints(count, 2);
              setMultiplePoints(points);
            }}
            featureCount={2}
          />
          <MultipleRegressionChart
            dataPoints={multiplePoints.map(p => ({ x: p.x[selectedFeature], y: p.y }))}
            regressionLine={getRegressionLinePoints()}
            domain={calculateChartDomain()}
            generateTicks={generateTicks}
            selectedFeature={selectedFeature}
          />
          <StatsDisplay stats={regressionStats} manualMode={false} />
        </>
      )}
    </div>
  );
};
