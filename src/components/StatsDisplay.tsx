"use client";

import React from 'react';
import { RegressionStats } from '../types';

interface StatsDisplayProps {
  stats: RegressionStats;
  manualMode: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, manualMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Line Parameters</h3>
        <div className="space-y-2">
          <p className="font-mono text-gray-800">
            y = {stats.slope.toFixed(2)}x + {stats.intercept.toFixed(2)}
          </p>
          <p className="text-gray-600">
            R² = {stats.rSquared.toFixed(3)}
          </p>
        </div>
      </div>

      {manualMode && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Fit Parameters (Reference)</h3>
          <div className="space-y-2">
            <p className="font-mono text-gray-800">
              y = {stats.calculatedSlope.toFixed(2)}x + {stats.calculatedIntercept.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
