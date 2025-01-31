"use client";

import React, { useState } from 'react';

export const ExplanationSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'technical'>('guide');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Getting Started / How to Use
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-100">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'guide'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              User Guide
              {activeTab === 'guide' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'technical'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Technical Details
              {activeTab === 'technical' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {/* User Guide Content */}
          {activeTab === 'guide' && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-base font-semibold mb-2">Welcome to the Linear Regression Visualizer!</h3>
              
              <p className="mb-4">
                This tool helps you understand linear regression by visualizing data points
                and their best-fit line. You can either input your own data or experiment
                with randomly generated points.
              </p>

              <h4 className="font-medium mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Add Data Points:</strong> Enter X and Y coordinates manually to plot specific points
                </li>
                <li>
                  <strong>Generate Random Points:</strong> Quickly create a dataset with the random point generator
                </li>
                <li>
                  <strong>Manual Mode:</strong> Toggle this to adjust the regression line manually and see how it affects the fit
                </li>
                <li>
                  <strong>Statistics Display:</strong> View important regression statistics like R², TSS, MSS, and RSS
                </li>
              </ul>

              <h4 className="font-medium mb-2">How to Use:</h4>
              <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>
                  Start by either:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Entering X and Y values manually and clicking "Add Point"</li>
                    <li>Using the random point generator to create a dataset</li>
                  </ul>
                </li>
                <li>
                  Observe the regression line that best fits your data points
                </li>
                <li>
                  Toggle "Manual Mode" to:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Adjust the slope and intercept using sliders</li>
                    <li>See how changes affect the fit statistics</li>
                    <li>Compare your line with the best-fit line</li>
                  </ul>
                </li>
                <li>
                  Study the statistics:
                  <ul className="list-disc pl-5 mt-1">
                    <li>R² shows how well the line fits the data (0 to 1)</li>
                    <li>TSS represents total variance in the data</li>
                    <li>MSS shows variance explained by the model</li>
                    <li>RSS indicates remaining unexplained variance</li>
                  </ul>
                </li>
              </ol>

              <h4 className="font-medium mb-2">Tips:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Hover over points to see their exact coordinates
                </li>
                <li>
                  Use the tooltips (ℹ️) next to statistics for detailed explanations
                </li>
                <li>
                  Try different datasets to understand how the regression line adapts
                </li>
                <li>
                  In manual mode, try to minimize RSS for a better fit
                </li>
              </ul>
            </div>
          )}

          {/* Technical Details Content */}
          {activeTab === 'technical' && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-base font-semibold mb-2">How the Model Works</h3>
              
              <h4 className="font-medium mb-2">Linear Regression Model</h4>
              <p className="mb-4">
                The linear regression model finds the best-fitting straight line through the data points using the method of least squares:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Model Equation:</strong> y = βₒ + β₁x
                  <ul className="list-disc pl-5 mt-1">
                    <li>βₒ (beta-zero) is the y-intercept</li>
                    <li>β₁ (beta-one) is the slope</li>
                  </ul>
                </li>
                <li>
                  <strong>Parameter Calculation:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>β₁ = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)</li>
                    <li>βₒ = ȳ - β₁x̄</li>
                    <li>Where x̄ and ȳ are the means of x and y values</li>
                  </ul>
                </li>
              </ul>

              <h4 className="font-medium mb-2">Random Point Generation</h4>
              <p className="mb-4">
                When you click the "Generate Random Points" button, the following process happens under the hood:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong>Step 1: Create a "True" Line</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Generates a random slope between -1 and 1</li>
                    <li>Generates a random intercept between -5 and 5</li>
                    <li>This hidden "true" line represents the underlying pattern that points will follow</li>
                  </ul>
                </li>
                <li>
                  <strong>Step 2: Generate Individual Points</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>For each point:
                      <ol className="list-decimal pl-5 mt-1">
                        <li>Generate random x coordinate between -10 and 10</li>
                        <li>Calculate perfect y value using the true line equation</li>
                        <li>Add random noise (±2 units) to simulate real-world variation</li>
                      </ol>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Step 3: Update and Recalculate</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Replace existing points with the new random points</li>
                    <li>Automatically trigger regression recalculation</li>
                    <li>Update all statistics (R², TSS, MSS, RSS)</li>
                    <li>Redraw the chart with new points and regression line</li>
                  </ul>
                </li>
              </ul>
              <p className="mb-4 text-sm text-gray-600 italic">
                Interesting note: The regression line that the algorithm finds might be slightly different from the "true" line used to generate the points. 
                This simulates real-world scenarios where we try to discover underlying relationships from noisy data!
              </p>

              <h4 className="font-medium mb-2">Statistics Calculation</h4>
              <p className="mb-4">
                The model calculates several key statistics to measure the fit quality:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Total Sum of Squares (TSS):</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Measures total variance in y values</li>
                    <li>TSS = ∑(y - ȳ)²</li>
                  </ul>
                </li>
                <li>
                  <strong>Model Sum of Squares (MSS):</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Measures variance explained by the model</li>
                    <li>MSS = ∑(ŷ - ȳ)²</li>
                    <li>Where ŷ is the predicted y value</li>
                  </ul>
                </li>
                <li>
                  <strong>Residual Sum of Squares (RSS):</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Measures unexplained variance</li>
                    <li>RSS = ∑(y - ŷ)²</li>
                  </ul>
                </li>
                <li>
                  <strong>R-squared (R²):</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Measures proportion of variance explained</li>
                    <li>R² = 1 - (RSS/TSS)</li>
                    <li>Or equivalently: R² = MSS/TSS</li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
