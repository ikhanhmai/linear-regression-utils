"use client";

import React from 'react';
import { RegressionStats } from '../types';
import { Tooltip } from './Tooltip';

interface StatsDisplayProps {
  stats: RegressionStats;
  manualMode: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, manualMode }) => {
  return (
    <div className="space-y-6 text-gray-200">
      <section className="bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-700 bg-[#2F2F2F]">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-200">
            Regression Statistics
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Line Parameters */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Line Parameters
                <Tooltip content="Parameters of the regression line equation: y = mx + b" />
              </h4>
              <div className="mt-2 font-mono bg-[#1E1E1E] p-4 rounded-md border border-gray-700">
                <p>y = {stats.slope.toFixed(2)}x + {stats.intercept.toFixed(2)}</p>
              </div>
            </div>

            {/* Model Fit */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Model Fit
                <Tooltip content="Statistical measures of how well the model fits the data" />
              </h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300 font-medium">
                    R² = {stats.rSquared.toFixed(3)}
                  </p>
                  <Tooltip content="R-squared measures how well the regression line fits the data (0 to 1)" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300 font-medium">
                    Adjusted R² = {stats.adjustedRSquared.toFixed(3)}
                  </p>
                  <Tooltip content="Adjusted R-squared accounts for the number of predictors in the model" />
                </div>
              </div>
            </div>

            {/* Statistical Significance */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Statistical Significance
                <Tooltip content="Measures of statistical significance for the regression parameters" />
              </h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300 font-medium">
                    F-statistic = {stats.fStatistic.toFixed(3)}
                  </p>
                  <Tooltip content="F-statistic tests the overall significance of the regression" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300 font-medium">
                    p-value = {stats.pValueF.toFixed(4)}
                  </p>
                  <Tooltip content="p-value for the F-statistic (smaller values indicate stronger evidence)" />
                </div>
              </div>
            </div>

            {/* Coefficient Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Coefficient Details
                <Tooltip content="Detailed statistics for each regression coefficient" />
              </h4>
              <div className="mt-2 space-y-4">
                <div className="bg-[#1E1E1E] p-4 rounded-md border border-gray-700">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Slope (β₁)</h5>
                  <div className="space-y-1 font-mono text-sm">
                    <p>Value = {stats.slope.toFixed(4)}</p>
                    <p>Std. Error = {stats.standardErrorSlope.toFixed(4)}</p>
                    <p>t-statistic = {stats.tStatisticSlope.toFixed(4)}</p>
                    <p>p-value = {stats.pValueSlope.toFixed(4)}</p>
                  </div>
                </div>
                <div className="bg-[#1E1E1E] p-4 rounded-md border border-gray-700">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Intercept (β₀)</h5>
                  <div className="space-y-1 font-mono text-sm">
                    <p>Value = {stats.intercept.toFixed(4)}</p>
                    <p>Std. Error = {stats.standardErrorIntercept.toFixed(4)}</p>
                    <p>t-statistic = {stats.tStatisticIntercept.toFixed(4)}</p>
                    <p>p-value = {stats.pValueIntercept.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Model Summary
                <Tooltip content="Summary statistics for the regression model" />
              </h4>
              <div className="mt-2 bg-[#1E1E1E] p-4 rounded-md border border-gray-700 space-y-1 font-mono text-sm">
                <p>Degrees of Freedom (Total) = {stats.dfTotal}</p>
                <p>Degrees of Freedom (Regression) = {stats.dfRegression}</p>
                <p>Degrees of Freedom (Residual) = {stats.dfResidual}</p>
                <p>Total Sum of Squares = {stats.tss.toFixed(4)}</p>
                <p>Model Sum of Squares = {stats.mss.toFixed(4)}</p>
                <p>Residual Sum of Squares = {stats.rss.toFixed(4)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {manualMode && (
        <section className="bg-[#1E1E1E] p-6 rounded-xl shadow-sm border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-200">
              Best Fit Parameters (Reference)
            </h3>
            <Tooltip content="These are the mathematically optimal parameters that minimize RSS. Use these as a reference when manually adjusting the line to understand how far your manual fit is from the best possible fit." />
          </div>
          <div className="pl-4 border-l-2 border-blue-100">
            <p className="font-mono text-lg text-gray-200">
              y = {stats.calculatedSlope.toFixed(2)}x + {stats.calculatedIntercept.toFixed(2)}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
