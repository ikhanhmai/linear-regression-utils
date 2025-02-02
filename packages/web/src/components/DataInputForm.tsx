"use client";

import React, { useState } from 'react';
import { SimpleNewPoint } from '@linear-regression-utils/shared';
import { Tooltip } from './Tooltip';

interface DataInputFormProps {
  newPoint: SimpleNewPoint;
  onAddPoint: () => void;
  onInputChange: (field: string, value: string) => void;
  onGeneratePoints: (count: number) => void;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({
  newPoint,
  onAddPoint,
  onInputChange,
  onGeneratePoints,
}) => {
  const [pointCount, setPointCount] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPoint();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="x" className="block text-sm font-medium text-gray-700">
                  X Value
                  <Tooltip content="Enter a numeric value for the x-coordinate" />
                </label>
                <input
                  type="number"
                  id="x"
                  value={newPoint.feature}
                  onChange={(e) => onInputChange('feature', e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  step="any"
                  placeholder="Enter X value"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="y" className="block text-sm font-medium text-gray-700">
                  Y Value
                  <Tooltip content="Enter a numeric value for the y-coordinate" />
                </label>
                <input
                  type="number"
                  id="y"
                  value={newPoint.output}
                  onChange={(e) => onInputChange('output', e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  step="any"
                  placeholder="Enter Y value"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Point
            </button>
          </form>

          {/* Random Data Generation */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              Generate Random Points
              <Tooltip content={`
                Generate random points to quickly populate the chart.
                Points will follow a linear pattern with some random noise
                to simulate real-world data.
              `} />
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="pointCount" className="block text-sm text-gray-600 mb-2">
                  Number of Points
                </label>
                <input
                  id="pointCount"
                  type="range"
                  min="5"
                  max="50"
                  value={pointCount}
                  onChange={(e) => setPointCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5</span>
                  <span>{pointCount}</span>
                  <span>50</span>
                </div>
              </div>
              <button
                onClick={() => onGeneratePoints(pointCount)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Generate Points
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
