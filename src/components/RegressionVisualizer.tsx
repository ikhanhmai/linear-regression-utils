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
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Feature to Visualize
      </label>
      <select
        value={selectedFeature}
        onChange={(e) => setSelectedFeature(parseInt(e.target.value))}
        className="block w-full rounded-md border border-gray-600 bg-[#2D2D2D] px-4 py-2.5 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
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
    <div className="flex flex-col gap-6 p-6 bg-[#1E1E1E] min-h-screen">
      <div className="flex flex-col gap-6">
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
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
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
            </div>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
              <SimpleRegressionChart
                dataPoints={simplePoints}
                regressionLine={regressionLine}
                domain={domain}
                generateTicks={generateTicks}
              />
            </div>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
              <StatsDisplay stats={regressionStats} manualMode={manualMode} />
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
              <FeatureSelector />
            </div>
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
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
              <MultipleRegressionChart
                dataPoints={multiplePoints.map(p => ({ x: p.features[selectedFeature], y: p.output }))}
                regressionLine={regressionLine}
                domain={domain}
                generateTicks={generateTicks}
                selectedFeature={selectedFeature}
              />
            </div>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-gray-700">
              <StatsDisplay stats={regressionStats} manualMode={false} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
