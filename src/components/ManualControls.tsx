"use client";

import React from 'react';

interface ManualControlsProps {
  manualMode: boolean;
  onManualModeChange: (enabled: boolean) => void;
  slope: number;
  intercept: number;
  onSlopeChange: (value: number) => void;
  onInterceptChange: (value: number) => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({
  manualMode,
  onManualModeChange,
  slope,
  intercept,
  onSlopeChange,
  onInterceptChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="manual-mode"
          checked={manualMode}
          onChange={(e) => onManualModeChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="manual-mode" className="text-sm font-medium text-gray-700">
          Manual Mode
        </label>
      </div>

      {manualMode && (
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slope
            </label>
            <input
              type="number"
              value={slope}
              onChange={(e) => onSlopeChange(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.1"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intercept
            </label>
            <input
              type="number"
              value={intercept}
              onChange={(e) => onInterceptChange(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
