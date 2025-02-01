"use client";

import React, { useState } from 'react';
import { SimpleNewPoint, MultipleNewPoint } from '../types';
import { DataInputForm } from './DataInputForm';
import { MultipleDataInputForm } from './MultipleDataInputForm';
import { SimpleRegressionChart } from './SimpleRegressionChart';
import { MultipleRegressionChart } from './MultipleRegressionChart';
import { StatsDisplay } from './StatsDisplay';
import { useSimpleRegression } from '../hooks/useSimpleRegression';
import { useMultipleRegression } from '../hooks/useMultipleRegression';
import { useRegressionChart } from '../hooks/useRegressionChart';
import { ManualControls } from './ManualControls';

interface RegressionVisualizerProps {
  type: 'simple' | 'multiple';
}

export const RegressionVisualizer: React.FC<RegressionVisualizerProps> = ({ type }) => {
  // Initialize hooks
  const {
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
  } = useSimpleRegression();

  const {
    multiplePoints,
    setMultiplePoints,
    selectedFeature,
    setSelectedFeature,
    calculateMultipleRegression,
    generateRandomMultiplePoints
  } = useMultipleRegression();

  const {
    calculateChartDomain,
    getRegressionLinePoints,
    generateTicks
  } = useRegressionChart();

  // State for new point input
  const [newPoint, setNewPoint] = useState<SimpleNewPoint | MultipleNewPoint>(
    type === 'simple'
      ? { feature: '', output: '' }
      : { features: ['', ''], output: '' }
  );

  // Calculate regression stats
  const regressionStats = type === 'simple'
    ? calculateSimpleRegression(simplePoints)
    : calculateMultipleRegression(multiplePoints);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setNewPoint(prev => ({ ...prev, [field]: value }));
  };

  // Handle adding points
  const handleAddPoint = () => {
    if (type === 'simple') {
      const x = parseFloat((newPoint as SimpleNewPoint).feature);
      const y = parseFloat((newPoint as SimpleNewPoint).output);
      if (!isNaN(x) && !isNaN(y)) {
        setSimplePoints([...simplePoints, { x, y }]);
        setNewPoint({ feature: '', output: '' });
      }
    }
  };

  // Calculate chart domain
  const domain = type === 'simple'
    ? calculateChartDomain(simplePoints)
    : calculateChartDomain(multiplePoints.map(p => ({ x: p.features[selectedFeature], y: p.output })));

  // Get regression line points
  const regressionLine = getRegressionLinePoints(
    type,
    type === 'simple' ? simplePoints : multiplePoints,
    regressionStats,
    selectedFeature,
    domain
  );

  // Feature selection UI for multiple regression
  const FeatureSelector = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Feature to Visualize
      </label>
      <select
        value={selectedFeature}
        onChange={(e) => setSelectedFeature(parseInt(e.target.value))}
        className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
      >
        {[0, 1].map((idx) => (
          <option key={idx} value={idx}>
            Feature {idx + 1}
          </option>
        ))}
      </select>
    </div>
  );

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
            <ManualControls 
              slope={manualSlope}
              intercept={manualIntercept}
              onUpdate={(param, value) => {
                if (param === 'slope') setManualSlope(value);
                if (param === 'intercept') setManualIntercept(value);
              }}
              manualMode={manualMode}
              onManualModeChange={setManualMode}
            />
            <SimpleRegressionChart
              dataPoints={simplePoints}
              regressionLine={regressionLine}
              domain={domain}
              generateTicks={generateTicks}
            />
            <StatsDisplay stats={regressionStats} manualMode={manualMode} />
          </>
        ) : (
          <>
            <FeatureSelector />
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
              regressionLine={regressionLine}
              domain={domain}
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
