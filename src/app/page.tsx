"use client";

import React, { useState, useEffect } from 'react';
import { DataInputForm } from '../components/DataInputForm';
import { RegressionChart } from '../components/RegressionChart';
import { StatsDisplay } from '../components/StatsDisplay';
import { ManualControls } from '../components/ManualControls';
import { ExplanationSection } from '../components/ExplanationSection';
import Footer from '../components/Footer';
import { DataPoint, RegressionStats } from '../types';

const initialPoints: DataPoint[] = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 5 },
];

// Calculate mean of an array
const mean = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;

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
      rss: 0
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
  
  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
  const intercept = yMean - slope * xMean;
  
  // Calculate predictions
  const predictions = points.map(p => slope * p.x + intercept);
  
  // Calculate TSS, MSS, and RSS
  const tss = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const rss = points.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
  const mss = tss - rss;
  
  // Calculate R-squared
  const rSquared = 1 - (rss / tss);
  
  return {
    slope,
    intercept,
    rSquared,
    calculatedSlope: slope,
    calculatedIntercept: intercept,
    tss,
    mss,
    rss
  };
};

// Generate random points
const generateRandomPoints = (count: number): DataPoint[] => {
  // Generate points that roughly follow a linear pattern with some noise
  const slope = Math.random() * 2 - 1; // Random slope between -1 and 1
  const intercept = Math.random() * 10 - 5; // Random intercept between -5 and 5
  const noise = 2; // Amount of random noise to add

  return Array.from({ length: count }, () => {
    const x = Math.random() * 20 - 10; // Random x between -10 and 10
    const perfectY = slope * x + intercept;
    const y = perfectY + (Math.random() * noise * 2 - noise); // Add random noise
    return { x, y };
  });
};

export default function RegressionVisualizer() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(initialPoints);
  const [manualMode, setManualMode] = useState(false);
  const [regressionStats, setRegressionStats] = useState<RegressionStats>({
    slope: 0,
    intercept: 0,
    rSquared: 0,
    calculatedSlope: 0,
    calculatedIntercept: 0,
    tss: 0,
    mss: 0,
    rss: 0
  });

  // Calculate chart domain based on data points
  const calculateChartDomain = (): { x: [number, number]; y: [number, number] } => {
    if (dataPoints.length === 0) return { x: [-10, 10] as [number, number], y: [-10, 10] as [number, number] };
    
    const xValues = dataPoints.map(p => p.x);
    const yValues = dataPoints.map(p => p.y);
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
    const stats = calculateRegression(dataPoints);
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
        rss: stats.rss
      }));
    }
  }, [dataPoints, manualMode]);

  // Handle adding new points
  const handleAddPoint = (point: DataPoint) => {
    setDataPoints(prev => [...prev, point]);
  };

  // Handle generating random points
  const handleGeneratePoints = (count: number) => {
    const newPoints = generateRandomPoints(count);
    setDataPoints(newPoints);
  };

  // Handle manual parameter updates
  const handleManualUpdate = (param: 'slope' | 'intercept', value: number) => {
    if (!isNaN(value)) {
      setRegressionStats(prev => {
        const newStats = { ...prev };
        newStats[param] = value;
        
        // Recalculate R² and other stats based on new manual parameters
        const predictions = dataPoints.map(p => value * p.x + newStats.intercept);
        const yMean = mean(dataPoints.map(p => p.y));
        const tss = dataPoints.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
        const rss = dataPoints.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
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
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Linear Regression Visualizer</h1>
      
      {/* Main Content */}
      <div className="space-y-8">
        {/* Explanation Section */}
        <ExplanationSection />

        {/* Chart Section - Full Width */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <RegressionChart
            dataPoints={dataPoints}
            regressionLine={getRegressionLinePoints()}
            domain={calculateChartDomain()}
            generateTicks={generateTicks}
          />
        </div>

        {/* Controls and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Input - Left Column */}
          <div>
            <DataInputForm
              onAddPoint={handleAddPoint}
              onGeneratePoints={handleGeneratePoints}
            />
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
      <Footer />
    </div>
  );
}
