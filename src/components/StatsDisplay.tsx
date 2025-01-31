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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regression Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                Line Parameters
                <Tooltip content={`
                  Slope (β₁) = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)
                  Intercept (β₀) = ȳ - β₁x̄
                  where:
                  - n is the number of points
                  - x̄ is the mean of x values
                  - ȳ is the mean of y values
                `} />
              </h4>
              <p className="font-mono text-gray-800">
                y = {stats.slope.toFixed(2)}x + {stats.intercept.toFixed(2)}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                Model Fit
                <Tooltip content={`
                  R² measures how well the regression line approximates the data points.
                  - R² = 1: Perfect fit
                  - R² = 0: Line explains none of the variability
                  - Higher R² indicates better model fit
                `} />
              </h4>
              <div className="space-y-1">
                <p className="text-gray-600">
                  R² = {stats.rSquared.toFixed(3)}
                </p>
                <p className="text-sm text-gray-500">
                  (Explains {(stats.rSquared * 100).toFixed(1)}% of variance)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Sum of Squares</h4>
              <div className="space-y-1">
                <p className="text-gray-600 flex items-center">
                  TSS = {stats.tss.toFixed(3)}
                  <span className="text-sm text-gray-500 ml-2">(Total)</span>
                  <Tooltip content={`
                    Total Sum of Squares (TSS) measures the total variability in y values.
                    TSS = Σ(yi - ȳ)²
                    where:
                    - yi is each y value
                    - ȳ is the mean of y values
                    This represents the total variance to be explained by the model.
                  `} />
                </p>
                <p className="text-gray-600 flex items-center">
                  MSS = {stats.mss.toFixed(3)}
                  <span className="text-sm text-gray-500 ml-2">(Model)</span>
                  <Tooltip content={`
                    Model Sum of Squares (MSS) measures the variance explained by the regression line.
                    MSS = Σ(ŷi - ȳ)²
                    where:
                    - ŷi is the predicted y value
                    - ȳ is the mean of y values
                    This represents how much of the variance is captured by the model.
                  `} />
                </p>
                <p className="text-gray-600 flex items-center">
                  RSS = {stats.rss.toFixed(3)}
                  <span className="text-sm text-gray-500 ml-2">(Residual)</span>
                  <Tooltip content={`
                    Residual Sum of Squares (RSS) measures the variance not explained by the model.
                    RSS = Σ(yi - ŷi)²
                    where:
                    - yi is the actual y value
                    - ŷi is the predicted y value
                    This represents the remaining unexplained variance.
                  `} />
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p className="flex items-center">
                R² = MSS/TSS = 1 - (RSS/TSS)
                <Tooltip content={`
                  R² can be calculated in two equivalent ways:
                  1. As the ratio of explained variance to total variance (MSS/TSS)
                  2. As the complement of the ratio of unexplained variance (1 - RSS/TSS)
                  Both methods will give the same result.
                `} />
              </p>
              <p className="flex items-center">
                TSS = MSS + RSS
                <Tooltip content={`
                  The total variance (TSS) is split between:
                  - Variance explained by the model (MSS)
                  - Unexplained variance (RSS)
                  This relationship always holds true.
                `} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {manualMode && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Best Fit Parameters (Reference)
            <Tooltip content={`
              These are the mathematically optimal parameters that minimize RSS.
              Use these as a reference when manually adjusting the line to understand
              how far your manual fit is from the best possible fit.
            `} />
          </h3>
          <p className="font-mono text-gray-800">
            y = {stats.calculatedSlope.toFixed(2)}x + {stats.calculatedIntercept.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};
