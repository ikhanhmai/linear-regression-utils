"use client";

import React, { useState, useEffect } from 'react';
import { DataInputForm } from '../components/DataInputForm';
import { ManualControls } from '../components/ManualControls';
import { RegressionChart } from '../components/RegressionChart';
import { StatsDisplay } from '../components/StatsDisplay';
import { DataPoint, RegressionStats, ChartDomain } from '../types';

const RegressionVisualizer: React.FC = () => {
  // Initial data points
  const initialPoints: DataPoint[] = [
    { x: 1, y: 2.5 },
    { x: 2, y: 2.8 },
    { x: 3, y: 4.7 },
    { x: 4, y: 4.2 },
    { x: 5, y: 5.9 }
  ];

  const [dataPoints, setDataPoints] = useState<DataPoint[]>(initialPoints);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [chartDomain, setChartDomain] = useState<ChartDomain>({ x: [0, 5], y: [0, 8] });
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
  const [feedback, setFeedback] = useState<string>('');

  // Calculate chart domain based on data points
  const calculateChartDomain = (points: DataPoint[]): ChartDomain => {
    if (points.length === 0) {
      return { x: [0, 10], y: [0, 10] };
    }
    
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;
    const xPadding = xRange * 0.3;
    const yPadding = yRange * 0.3;

    return {
      x: [Math.max(0, minX - xPadding), maxX + xPadding],
      y: [Math.max(0, minY - yPadding), maxY + yPadding]
    };
  };

  // Calculate regression statistics
  const calculateRegression = (points: DataPoint[]): { 
    slope: number; 
    intercept: number; 
    rSquared: number;
    tss: number;
    mss: number;
    rss: number;
  } => {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = meanY - slope * meanX;

    const predictions = points.map(p => slope * p.x + intercept);
    
    // Calculate TSS (Total Sum of Squares)
    const tss = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    
    // Calculate RSS (Residual Sum of Squares)
    const rss = points.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
    
    // Calculate MSS (Model Sum of Squares)
    const mss = tss - rss;
    
    // Calculate R-squared
    const rSquared = 1 - (rss / tss);

    return { slope, intercept, rSquared, tss, mss, rss };
  };

  // Update regression and chart domain when data points change
  useEffect(() => {
    const stats = calculateRegression(dataPoints);
    const domain = calculateChartDomain(dataPoints);
    setChartDomain(domain);

    if (!manualMode) {
      setRegressionStats({
        slope: stats.slope,
        intercept: stats.intercept,
        rSquared: stats.rSquared,
        calculatedSlope: stats.slope,
        calculatedIntercept: stats.intercept,
        tss: stats.tss,
        mss: stats.mss,
        rss: stats.rss
      });
    } else {
      setRegressionStats(prev => ({
        ...prev,
        calculatedSlope: stats.slope,
        calculatedIntercept: stats.intercept,
        tss: stats.tss,
        mss: stats.mss,
        rss: stats.rss
      }));
    }
  }, [dataPoints, manualMode]);

  // Generate regression line points
  const regressionLineData = (): Array<{ x: number; yRegression: number }> => {
    const numPoints = 51;
    const xMin = chartDomain.x[0];
    const xMax = chartDomain.x[1];
    const step = (xMax - xMin) / (numPoints - 1);

    return Array.from({ length: numPoints }, (_, i) => {
      const x = xMin + (i * step);
      return {
        x,
        yRegression: regressionStats.slope * x + regressionStats.intercept
      };
    });
  };

  // Handle adding new points
  const handleAddPoint = (point: DataPoint) => {
    const updatedPoints = [...dataPoints, point];
    const newDomain = calculateChartDomain(updatedPoints);
    
    setDataPoints(updatedPoints);
    setChartDomain(newDomain);
    setFeedback(`Added point (${point.x}, ${point.y})`);
    
    setTimeout(() => setFeedback(''), 3000);
  };

  // Handle manual parameter updates
  const handleManualUpdate = (param: 'slope' | 'intercept', value: number): void => {
    if (!isNaN(value)) {
      setRegressionStats(prev => {
        const newStats = {
          ...prev,
          [param]: value
        };
        
        const slope = param === 'slope' ? value : prev.slope;
        const intercept = param === 'intercept' ? value : prev.intercept;
        
        const predictions = dataPoints.map(p => slope * p.x + intercept);
        const meanY = dataPoints.reduce((sum, p) => sum + p.y, 0) / dataPoints.length;
        const ssRes = dataPoints.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
        const ssTot = dataPoints.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
        newStats.rSquared = 1 - (ssRes / ssTot);
        return newStats;
      });
    }
  };

  // Generate ticks for axes
  const generateTicks = (min: number, max: number, count = 6): number[] => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) =>
      Number((min + i * step).toFixed(1))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <ManualControls
            manualMode={manualMode}
            onManualModeChange={setManualMode}
            slope={regressionStats.slope}
            intercept={regressionStats.intercept}
            onSlopeChange={(value) => handleManualUpdate('slope', value)}
            onInterceptChange={(value) => handleManualUpdate('intercept', value)}
          />
          
          <DataInputForm
            onAddPoint={handleAddPoint}
            feedback={feedback}
          />
        </div>

        <RegressionChart
          dataPoints={dataPoints}
          regressionLine={regressionLineData()}
          chartDomain={chartDomain}
          generateTicks={generateTicks}
        />

        <StatsDisplay
          stats={regressionStats}
          manualMode={manualMode}
        />
      </div>
    </div>
  );
};

export default RegressionVisualizer;
