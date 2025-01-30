"use client";
import React, { useState, useEffect } from 'react';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend } from 'recharts';

// Define types for our data structures
interface DataPoint {
  x: number;
  y: number;
}

interface RegressionStats {
  slope: number;
  intercept: number;
  rSquared: number;
  calculatedSlope: number;
  calculatedIntercept: number;
}

interface ChartDomain {
  x: [number, number];
  y: [number, number];
}

const RegressionVisualizer: React.FC = () => {
  // Our initial scattered data points
  const initialPoints: DataPoint[] = [
    { x: 1, y: 2.5 },
    { x: 2, y: 2.8 },
    { x: 3, y: 4.7 },
    { x: 4, y: 4.2 },
    { x: 5, y: 5.9 }
  ];

  const [dataPoints, setDataPoints] = useState<DataPoint[]>(initialPoints);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [newPoint, setNewPoint] = useState<{ x: string; y: string }>({ x: '', y: '' });
  const [chartDomain, setChartDomain] = useState<ChartDomain>({ x: [0, 5], y: [0, 8] });
  const [regressionStats, setRegressionStats] = useState<RegressionStats>({
    slope: 0,
    intercept: 0,
    rSquared: 0,
    calculatedSlope: 0,
    calculatedIntercept: 0
  });
  const [feedback, setFeedback] = useState<string>('');

  // Calculate chart domain based on data points
  const calculateChartDomain = (points: DataPoint[]): ChartDomain => {
    if (points.length === 0) {
      return { x: [0, 10], y: [0, 10] }; // Default domain when no points
    }
    
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Add 30% padding for better visualization
    const xRange = maxX - minX || 1; // Prevent division by zero
    const yRange = maxY - minY || 1;
    const xPadding = xRange * 0.3;
    const yPadding = yRange * 0.3;

    return {
      x: [Math.max(0, minX - xPadding), maxX + xPadding],
      y: [Math.max(0, minY - yPadding), maxY + yPadding]
    };
  };

  // Calculate regression statistics
  const calculateRegression = (points: DataPoint[]): { slope: number; intercept: number; rSquared: number } => {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = meanY - slope * meanX;

    // Calculate R-squared using the calculated slope and intercept
    const predictions = points.map(p => slope * p.x + intercept);
    const ssRes = points.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
    const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    return { slope, intercept, rSquared };
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
        calculatedIntercept: stats.intercept
      });
    } else {
      setRegressionStats(prev => ({
        ...prev,
        calculatedSlope: stats.slope,
        calculatedIntercept: stats.intercept
      }));
    }
  }, [dataPoints, manualMode]);

  // Generate regression line points across the full domain
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
  const addPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPoint.x !== '' && newPoint.y !== '') {
      const x = parseFloat(newPoint.x);
      const y = parseFloat(newPoint.y);
      
      if (!isNaN(x) && !isNaN(y)) {
        const updatedPoints = [...dataPoints, { x, y }];
        const newDomain = calculateChartDomain(updatedPoints);
        
        setDataPoints(updatedPoints);
        setChartDomain(newDomain);
        setNewPoint({ x: '', y: '' });
        setFeedback(`Added point (${x}, ${y})`);
        
        console.log('Added new point:', { x, y });
        console.log('New domain:', newDomain);
        
        setTimeout(() => setFeedback(''), 3000);
      } else {
        setFeedback('Please enter valid numbers');
        setTimeout(() => setFeedback(''), 3000);
      }
    }
  };

  // Handle manual parameter updates
  const handleManualUpdate = (param: 'slope' | 'intercept', value: string): void => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setRegressionStats(prev => {
        const newStats = {
          ...prev,
          [param]: numValue
        };
        
        // Use the appropriate slope and intercept based on which parameter is being updated
        const slope = param === 'slope' ? numValue : prev.slope;
        const intercept = param === 'intercept' ? numValue : prev.intercept;
        
        // Recalculate R-squared with new parameters
        const predictions = dataPoints.map(p => slope * p.x + intercept);
        const meanY = dataPoints.reduce((sum, p) => sum + p.y, 0) / dataPoints.length;
        const ssRes = dataPoints.reduce((sum, p, i) => sum + Math.pow(p.y - predictions[i], 2), 0);
        const ssTot = dataPoints.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
        newStats.rSquared = 1 - (ssRes / ssTot);
        return newStats;
      });
    }
  };

  // Generate ticks for axes based on domain
  const generateTicks = (min: number, max: number, count = 6): number[] => {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) =>
      Number((min + i * step).toFixed(1))
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        {/* Manual mode controls */}
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={manualMode}
              onChange={(e) => setManualMode(e.target.checked)}
              className="mr-2"
            />
            Manual Mode
          </label>

          {manualMode && (
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slope</label>
                <input
                  type="number"
                  value={regressionStats.slope}
                  onChange={(e) => handleManualUpdate('slope', e.target.value)}
                  className="border rounded p-2 w-24"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Intercept</label>
                <input
                  type="number"
                  value={regressionStats.intercept}
                  onChange={(e) => handleManualUpdate('intercept', e.target.value)}
                  className="border rounded p-2 w-24"
                  step="0.1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Add new point form */}
        <form onSubmit={addPoint} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X Value</label>
              <input
                type="number"
                value={newPoint.x}
                onChange={(e) => setNewPoint({ ...newPoint, x: e.target.value })}
                className="border rounded p-2 w-24"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y Value</label>
              <input
                type="number"
                value={newPoint.y}
                onChange={(e) => setNewPoint({ ...newPoint, y: e.target.value })}
                className="border rounded p-2 w-24"
                step="any"
              />
            </div>
            <button
              type="submit"
              className="mt-6 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Point
            </button>
          </div>
          {feedback && (
            <div className="text-green-600 mt-2">
              {feedback}
            </div>
          )}
        </form>
      </div>

      <ComposedChart
        width={600}
        height={400}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          domain={chartDomain.x}
          ticks={generateTicks(...chartDomain.x)}
        />
        <YAxis
          type="number"
          domain={chartDomain.y}
          ticks={generateTicks(...chartDomain.y)}
        />
        <Tooltip />
        <Legend />

        <Line
          data={regressionLineData()}
          type="monotone"
          dataKey="yRegression"
          stroke="#82ca9d"
          name="Regression Line"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />

        <Scatter
          data={dataPoints}
          fill="#8884d8"
          name="Data Points"
          dataKey="y"
          shape={(props: any) => {
            const { cx, cy } = props;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#8884d8"
              />
            );
          }}
        />
      </ComposedChart>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Current Line Parameters</h3>
          <p className="font-mono">y = {regressionStats.slope.toFixed(2)}x + {regressionStats.intercept.toFixed(2)}</p>
          <p>R² = {regressionStats.rSquared.toFixed(3)}</p>
        </div>

        {manualMode && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Best Fit Parameters (Reference)</h3>
            <p className="font-mono">
              y = {regressionStats.calculatedSlope.toFixed(2)}x + {regressionStats.calculatedIntercept.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegressionVisualizer;
