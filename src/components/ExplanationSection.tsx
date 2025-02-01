"use client";

import React from 'react';

interface ExplanationSectionProps {
  activeSection: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary';
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'why-regression':
        return (
          <section>
            <h4 className="font-medium mb-2">Why Linear Regression Matters</h4>
            <p className="mb-4">
              Linear regression is one of the most fundamental and widely used statistical tools in data analysis. 
              It helps us understand and predict relationships between variables, making it invaluable in many fields.
            </p>

            <h5 className="font-medium mb-2">Key Benefits:</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Simplicity and Interpretability:</strong> Linear relationships are easy to understand and explain to stakeholders
              </li>
              <li>
                <strong>Prediction Power:</strong> Make informed predictions about future outcomes based on historical data
              </li>
              <li>
                <strong>Relationship Quantification:</strong> Measure exactly how much one variable influences another
              </li>
              <li>
                <strong>Foundation for Advanced Models:</strong> Serves as a building block for more complex statistical methods
              </li>
            </ul>

            <h5 className="font-medium mb-2">Real-World Applications:</h5>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Business:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Predicting sales based on advertising spend</li>
                  <li>Forecasting inventory needs based on historical demand</li>
                  <li>Analyzing price elasticity of products</li>
                </ul>
              </li>
              <li>
                <strong>Healthcare:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Studying relationship between diet and health outcomes</li>
                  <li>Predicting patient recovery time based on various factors</li>
                  <li>Analyzing drug dosage effectiveness</li>
                </ul>
              </li>
              <li>
                <strong>Real Estate:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Estimating house prices based on square footage</li>
                  <li>Analyzing property value trends over time</li>
                  <li>Determining rental rates based on location factors</li>
                </ul>
              </li>
            </ul>
          </section>
        );

      case 'user-guide':
        return (
          <section>
            <h4 className="font-medium mb-2">How to Use This Tool</h4>
            <p className="mb-4">
              This tool helps you understand linear regression by visualizing data points
              and their best-fit line. You can either input your own data or experiment
              with randomly generated points.
            </p>

            <h5 className="font-medium mb-2">Key Features:</h5>
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

            <h5 className="font-medium mb-2">Tips:</h5>
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
          </section>
        );

      case 'technical-details':
        return (
          <section>
            <h4 className="font-medium mb-2">Technical Implementation</h4>
            <p className="mb-4">
              The linear regression model finds the best-fitting straight line through the data points using the method of least squares:
            </p>

            <h5 className="font-medium mb-2">Model Equation</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Basic Form:</strong> y = β₀ + β₁x
                <ul className="list-disc pl-5 mt-1">
                  <li>β₀ (beta-zero) is the y-intercept</li>
                  <li>β₁ (beta-one) is the slope</li>
                </ul>
              </li>
              <li>
                <strong>Parameter Calculation:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>β₁ = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)</li>
                  <li>β₀ = ȳ - β₁x̄</li>
                  <li>Where x̄ and ȳ are the means of x and y values</li>
                </ul>
              </li>
            </ul>

            <h5 className="font-medium mb-2">Statistical Measures</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Formula</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">R² (R-squared)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Proportion of variance explained by the model</td>
                    <td className="px-4 py-3 text-sm text-gray-500">1 - (RSS/TSS)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">TSS</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Total Sum of Squares (total variance)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Σ(yi - ȳ)²</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">RSS</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Residual Sum of Squares (unexplained variance)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Σ(yi - ŷi)²</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">F-statistic</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Tests overall model significance</td>
                    <td className="px-4 py-3 text-sm text-gray-500">(MSS/p) / (RSS/(n-p-1))</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">p-value</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Probability under null hypothesis</td>
                    <td className="px-4 py-3 text-sm text-gray-500">P(|t| &gt; t_obs)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );

      case 'glossary':
        return (
          <section>
            <h4 className="font-medium mb-2">Statistical Terms</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Formula</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">R² (R-squared)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Proportion of variance explained by the model</td>
                    <td className="px-4 py-3 text-sm text-gray-500">1 - (RSS/TSS)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">TSS</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Total Sum of Squares (total variance)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Σ(yi - ȳ)²</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">RSS</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Residual Sum of Squares (unexplained variance)</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Σ(yi - ŷi)²</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">F-statistic</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Tests overall model significance</td>
                    <td className="px-4 py-3 text-sm text-gray-500">(MSS/p) / (RSS/(n-p-1))</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">p-value</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Probability under null hypothesis</td>
                    <td className="px-4 py-3 text-sm text-gray-500">P(|t| &gt; t_obs)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4">
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
