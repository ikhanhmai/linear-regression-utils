"use client";

import React from 'react';
import { Tooltip } from './Tooltip';

interface ManualControlsProps {
  slope: number;
  intercept: number;
  onUpdate: (param: 'slope' | 'intercept', value: number) => void;
  manualMode: boolean;
  onManualModeChange: (enabled: boolean) => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({
  slope,
  intercept,
  onUpdate,
  manualMode,
  onManualModeChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={manualMode}
              onChange={(e) => onManualModeChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Manual Mode</span>
            <Tooltip content={
              "Enable Manual Mode to:\n" +
              "• Manually adjust the regression line\n" +
              "• See how changes affect R² and other statistics\n" +
              "• Compare your fit with the best-fit line"
            } />
          </div>
        </div>
      </div>

      {manualMode && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Line Parameters</h3>
              <Tooltip content={
                "Slope (β₁): Represents the change in y for a one-unit change in x\n" +
                "Intercept (β₀): The y-value where the line crosses the y-axis (x = 0)\n\n" +
                "Formula: y = β₀ + β₁x"
              } />
            </div>

            {/* Slope Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="slope" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Slope (β₁)
                  <Tooltip content={`
                    The slope (β₁) determines how much y changes for each unit change in x.
                    - Positive slope: line goes up from left to right
                    - Negative slope: line goes down from left to right
                    - Steeper slope: larger absolute value
                  `} />
                </label>
                <span className="text-sm text-gray-500 font-mono">{slope.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="slope"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={slope}
                  onChange={(e) => onUpdate('slope', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={slope}
                  onChange={(e) => onUpdate('slope', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
              </div>
            </div>

            {/* Intercept Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="intercept" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Intercept (β₀)
                  <Tooltip content={`
                    The intercept (β₀) is where the line crosses the y-axis (x = 0).
                    - Positive intercept: line crosses above origin
                    - Negative intercept: line crosses below origin
                    - Zero intercept: line goes through origin
                  `} />
                </label>
                <span className="text-sm text-gray-500 font-mono">{intercept.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="intercept"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={intercept}
                  onChange={(e) => onUpdate('intercept', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={intercept}
                  onChange={(e) => onUpdate('intercept', parseFloat(e.target.value))}
                  step="0.1"
                  className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="font-medium mb-2">Current Equation:</p>
              <p className="font-mono">y = {slope.toFixed(2)}x + {intercept.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
