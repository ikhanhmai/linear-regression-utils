"use client";

import React, { useState, useEffect } from 'react';
import { DataInputForm } from './DataInputForm';
import { RegressionChart } from './RegressionChart';
import { StatsDisplay } from './StatsDisplay';
import { ManualControls } from './ManualControls';
import { ExplanationSection } from './ExplanationSection';
import { DataPoint, RegressionStats, MultipleDataPoint } from '../types';

interface RegressionVisualizerProps {
  type: 'simple' | 'multiple';
}

const initialSimplePoints: DataPoint[] = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 5 },
];

const initialMultiplePoints: MultipleDataPoint[] = [
  { x: [1, 1], y: 2 },
  { x: [2, 2], y: 4 },
  { x: [3, 1], y: 5 },
  { x: [4, 3], y: 4 },
  { x: [5, 2], y: 5 },
];

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
const calculateRegression = (points: DataPoint[]): RegressionStats => {
  if (points.length < 2) {
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
      dfTotal: 0
    };
  }

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
};

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

export const RegressionVisualizer: React.FC<RegressionVisualizerProps> = ({ type }) => {
  const [simplePoints, setSimplePoints] = useState<DataPoint[]>(initialSimplePoints);
  const [multiplePoints, setMultiplePoints] = useState<MultipleDataPoint[]>(initialMultiplePoints);
  const [manualMode, setManualMode] = useState(false);
  const [regressionStats, setRegressionStats] = useState<RegressionStats>({
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
    dfTotal: 0
  });

  const [newPoint, setNewPoint] = useState(
    type === 'simple' 
      ? { x: '', y: '' }
      : { x1: '', x2: '', y: '' }
  );

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
      if (simplePoints.length === 0) return { x: [-10, 10] as [number, number], y: [-10, 10] as [number, number] };
      
      const xValues = simplePoints.map(p => p.x);
      const yValues = simplePoints.map(p => p.y);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      
      const xPadding = Math.max(2, (xMax - xMin) * 0.2);
      const yPadding = Math.max(2, (yMax - yMin) * 0.2);
      
      return {
        x: [xMin - xPadding, xMax + xPadding] as [number, number],
        y: [yMin - yPadding, yMax + yPadding] as [number, number]
      };
    } else {
      if (multiplePoints.length === 0) return { x: [-10, 10] as [number, number], y: [-10, 10] as [number, number] };
      
      const x1Values = multiplePoints.map(p => p.x[0]);
      const yValues = multiplePoints.map(p => p.y);
      const x1Min = Math.min(...x1Values);
      const x1Max = Math.max(...x1Values);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      
      const x1Padding = Math.max(2, (x1Max - x1Min) * 0.2);
      const yPadding = Math.max(2, (yMax - yMin) * 0.2);
      
      return {
        x: [x1Min - x1Padding, x1Max + x1Padding] as [number, number],
        y: [yMin - yPadding, yMax + yPadding] as [number, number]
      };
    }
  };

  // Generate ticks for axes
  const generateTicks = (min: number, max: number, count = 5): number[] => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
  };

  // Update regression line points based on current slope and intercept
  const getRegressionLinePoints = () => {
    const domain = calculateChartDomain();
    // Generate 100 points for a smoother line
    const points = [];
    const step = (domain.x[1] - domain.x[0]) / 99;
    
    for (let i = 0; i <= 99; i++) {
      const x = domain.x[0] + (step * i);
      const yRegression = regressionStats.slope * x + regressionStats.intercept;
      points.push({ x, yRegression });
    }
    
    return points;
  };

  // Effect to update regression stats when points change
  useEffect(() => {
    if (type === 'simple') {
      const stats = calculateRegression(simplePoints);
      if (!manualMode) {
        setRegressionStats(stats);
      } else {
        setRegressionStats(prev => ({
          ...prev,
          calculatedSlope: stats.slope,
          calculatedIntercept: stats.intercept,
          rSquared: stats.rSquared,
          tss: stats.tss,
          mss: stats.mss,
          rss: stats.rss,
          tStatisticSlope: stats.tStatisticSlope,
          tStatisticIntercept: stats.tStatisticIntercept,
          pValueSlope: stats.pValueSlope,
          pValueIntercept: stats.pValueIntercept,
          fStatistic: stats.fStatistic,
          pValueF: stats.pValueF,
          standardErrorSlope: stats.standardErrorSlope,
          standardErrorIntercept: stats.standardErrorIntercept,
          vif: stats.vif,
          adjustedRSquared: stats.adjustedRSquared,
          dfRegression: stats.dfRegression,
          dfResidual: stats.dfResidual,
          dfTotal: stats.dfTotal
        }));
      }
    } else {
      // TO DO: implement multiple linear regression
    }
  }, [simplePoints, multiplePoints, manualMode, type]); // Add type to dependencies

  // Handle adding new points
  const handleAddSimplePoint = (point: DataPoint) => {
    setSimplePoints(prev => [...prev, point]);
  };

  // Handle generating random points
  const handleGenerateSimplePoints = (count: number) => {
    const newPoints = generateRandomPoints(count);
    setSimplePoints(newPoints);
  };

  // Handle manual parameter updates
  const handleManualUpdate = (param: 'slope' | 'intercept', value: number) => {
    if (!isNaN(value)) {
      setRegressionStats(prev => {
        const newStats = { ...prev };
        newStats[param] = value;
        
        // Recalculate R² and other stats based on new manual parameters
        const predictions = simplePoints.map(p => value * p.x + newStats.intercept);
        const yMean = mean(simplePoints.map(p => p.y));
        const tss = simplePoints.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
        const rss = simplePoints.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
        const mss = tss - rss;
        newStats.rSquared = 1 - (rss / tss);
        newStats.tss = tss;
        newStats.mss = mss;
        newStats.rss = rss;
        
        return newStats;
      });
    }
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Linear Regression Visualizer</h1>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0 space-y-6">
        {/* Explanation Section */}
        <ExplanationSection activeSection="why-regression" />

        {/* Chart Section - Full Width */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {type === 'simple' ? (
            <RegressionChart
              dataPoints={simplePoints}
              regressionLine={getRegressionLinePoints()}
              domain={calculateChartDomain()}
              generateTicks={generateTicks}
            />
          ) : (
            // TO DO: implement multiple linear regression chart
            <div className="aspect-video bg-white border border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">3D plot will be displayed here</p>
            </div>
          )}
        </div>

        {/* Controls and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Input - Left Column */}
          <div>
            {type === 'simple' ? (
              <DataInputForm
                onAddPoint={handleAddSimplePoint}
                onGeneratePoints={handleGenerateSimplePoints}
              />
            ) : (
              // TO DO: implement multiple linear regression data input
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium mb-4">Multiple Linear Regression Data Input</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        X₁ Variable
                      </label>
                      <input
                        type="text"
                        value={newPoint.x1}
                        onChange={(e) => handleInputChange('x1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter X₁ value"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        X₂ Variable
                      </label>
                      <input
                        type="text"
                        value={newPoint.x2}
                        onChange={(e) => handleInputChange('x2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter X₂ value"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Y Variable
                      </label>
                      <input
                        type="text"
                        value={newPoint.y}
                        onChange={(e) => handleInputChange('y', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter Y value"
                      />
                    </div>
                  </div>

                  <div>
                    <button 
                      onClick={handleAddPoint}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Point
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual Controls - Middle Column */}
          <div>
            <ManualControls
              slope={regressionStats.slope}
              intercept={regressionStats.intercept}
              onUpdate={handleManualUpdate}
              manualMode={manualMode}
              onManualModeChange={setManualMode}
            />
          </div>

          {/* Stats Display - Right Column */}
          <div>
            <StatsDisplay
              stats={regressionStats}
              manualMode={manualMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
