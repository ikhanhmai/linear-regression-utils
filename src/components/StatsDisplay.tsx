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
    <div className="grid grid-cols-1 gap-6">
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
            Regression Statistics
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Line Parameters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-700">Line Parameters</h4>
                  <Tooltip content={`
                    Slope (β₁) = ${stats.slope.toFixed(4)}
                    Standard Error = ${stats.standardErrorSlope.toFixed(4)}
                    t-statistic = ${stats.tStatisticSlope.toFixed(4)}
                    p-value = ${stats.pValueSlope.toFixed(4)}

                    Intercept (β₀) = ${stats.intercept.toFixed(4)}
                    Standard Error = ${stats.standardErrorIntercept.toFixed(4)}
                    t-statistic = ${stats.tStatisticIntercept.toFixed(4)}
                    p-value = ${stats.pValueIntercept.toFixed(4)}
                  `} />
                </div>
                <div className="pl-4 border-l-2 border-blue-100 space-y-2">
                  <p className="font-mono text-lg text-gray-800">
                    y = {stats.slope.toFixed(2)}x + {stats.intercept.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Slope p-value: {stats.pValueSlope < 0.001 ? '< 0.001' : stats.pValueSlope.toFixed(3)}</p>
                    <p>Intercept p-value: {stats.pValueIntercept < 0.001 ? '< 0.001' : stats.pValueIntercept.toFixed(3)}</p>
                  </div>
                </div>
              </div>

              {/* Model Fit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-700">Model Fit</h4>
                  <Tooltip content={`
                    R² measures how well the regression line approximates the data points.
                    F-statistic tests if the model is significantly better than a horizontal line.
                    
                    R² = ${stats.rSquared.toFixed(4)}
                    F-statistic = ${stats.fStatistic.toFixed(4)}
                    F p-value = ${stats.pValueF.toFixed(4)}
                    
                    Degrees of Freedom:
                    - Regression: ${stats.dfRegression}
                    - Residual: ${stats.dfResidual}
                    - Total: ${stats.dfTotal}
                  `} />
                </div>
                <div className="pl-4 border-l-2 border-blue-100 space-y-2">
                  <div>
                    <p className="text-lg text-gray-800">R² = {stats.rSquared.toFixed(3)}</p>
                    <p className="text-sm text-gray-500">
                      Explains {(stats.rSquared * 100).toFixed(1)}% of variance
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-800">
                      F({stats.dfRegression}, {stats.dfResidual}) = {stats.fStatistic.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      p-value: {stats.pValueF < 0.001 ? '< 0.001' : stats.pValueF.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Sum of Squares */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Sum of Squares</h4>
                <div className="pl-4 border-l-2 border-blue-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-800">
                      <span className="font-medium">TSS</span> = {stats.tss.toFixed(3)}
                    </p>
                    <span className="text-sm text-gray-500">(Total)</span>
                    <Tooltip content={`
                      Total Sum of Squares (TSS) measures the total variability in y values.
                      TSS = Σ(yi - ȳ)²
                      where:
                      - yi is each y value
                      - ȳ is the mean of y values
                      This represents the total variance to be explained by the model.
                    `} />
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-gray-800">
                      <span className="font-medium">MSS</span> = {stats.mss.toFixed(3)}
                    </p>
                    <span className="text-sm text-gray-500">(Model)</span>
                    <Tooltip content={`
                      Model Sum of Squares (MSS) measures the variance explained by the regression line.
                      MSS = Σ(ŷi - ȳ)²
                      where:
                      - ŷi is the predicted y value
                      - ȳ is the mean of y values
                      This represents how much of the variance is captured by the model.
                    `} />
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-gray-800">
                      <span className="font-medium">RSS</span> = {stats.rss.toFixed(3)}
                    </p>
                    <span className="text-sm text-gray-500">(Residual)</span>
                    <Tooltip content={`
                      Residual Sum of Squares (RSS) measures the variance not explained by the model.
                      RSS = Σ(yi - ŷi)²
                      where:
                      - yi is the actual y value
                      - ŷi is the predicted y value
                      This represents the remaining unexplained variance.
                    `} />
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 font-medium">
                      R² = MSS/TSS = 1 - (RSS/TSS)
                    </p>
                    <Tooltip content={`
                      R² can be calculated in two equivalent ways:
                      1. MSS/TSS: Proportion of variance explained by the model
                      2. 1 - (RSS/TSS): Proportion of variance not in the residuals
                    `} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {manualMode && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Best Fit Parameters (Reference)
            </h3>
            <Tooltip content={`
              These are the mathematically optimal parameters that minimize RSS.
              Use these as a reference when manually adjusting the line to understand
              how far your manual fit is from the best possible fit.
            `} />
          </div>
          <div className="pl-4 border-l-2 border-blue-100">
            <p className="font-mono text-lg text-gray-800">
              y = {stats.calculatedSlope.toFixed(2)}x + {stats.calculatedIntercept.toFixed(2)}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
