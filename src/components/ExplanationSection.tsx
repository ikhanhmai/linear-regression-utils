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
            <h4 className="font-medium text-gray-200 mb-2">Why Linear Regression Matters</h4>
            <p className="mb-4 text-gray-300">
              Linear regression is one of the most fundamental and widely used statistical tools in data analysis. 
              It helps us understand and predict relationships between variables, making it invaluable in many fields.
            </p>

            <h5 className="font-medium text-gray-200 mb-2">Key Benefits:</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-300">
              <li>
                <strong className="text-gray-200">Simplicity and Interpretability:</strong> Linear relationships are easy to understand and explain to stakeholders
              </li>
              <li>
                <strong className="text-gray-200">Prediction Power:</strong> Make informed predictions about future outcomes based on historical data
              </li>
              <li>
                <strong className="text-gray-200">Relationship Quantification:</strong> Measure exactly how much one variable influences another
              </li>
              <li>
                <strong className="text-gray-200">Foundation for Advanced Models:</strong> Serves as a building block for more complex statistical methods
              </li>
            </ul>

            <h5 className="font-medium text-gray-200 mb-2">Real-World Applications:</h5>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>
                <strong className="text-gray-200">Business:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Predicting sales based on advertising spend</li>
                  <li>Forecasting inventory needs based on historical demand</li>
                  <li>Analyzing price elasticity of products</li>
                </ul>
              </li>
              <li>
                <strong className="text-gray-200">Healthcare:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>Studying relationship between diet and health outcomes</li>
                  <li>Predicting patient recovery time based on various factors</li>
                  <li>Analyzing drug dosage effectiveness</li>
                </ul>
              </li>
              <li>
                <strong className="text-gray-200">Real Estate:</strong>
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
            <h4 className="font-medium text-gray-200 mb-2">How to Use This Tool</h4>
            <p className="mb-4 text-gray-300">
              This tool helps you understand linear regression by visualizing data points
              and their best-fit line. You can either input your own data or experiment
              with randomly generated points.
            </p>

            <h5 className="font-medium text-gray-200 mb-2">Key Features:</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-300">
              <li>
                <strong className="text-gray-200">Add Data Points:</strong> Enter X and Y coordinates manually to plot specific points
              </li>
              <li>
                <strong className="text-gray-200">Generate Random Points:</strong> Quickly create a dataset with the random point generator
              </li>
              <li>
                <strong className="text-gray-200">Manual Mode:</strong> Toggle this to adjust the regression line manually and see how it affects the fit
              </li>
              <li>
                <strong className="text-gray-200">Statistics Display:</strong> View important regression statistics like R², TSS, MSS, and RSS
              </li>
            </ul>

            <h5 className="font-medium text-gray-200 mb-2">Tips:</h5>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>
                Hover over points to see their exact coordinates
              </li>
              <li>
                Use the tooltips (ℹ️) next to statistics for detailed explanations
              </li>
              <li>
                Try adjusting the line manually to understand how different slopes and intercepts affect the fit
              </li>
            </ul>
          </section>
        );

      case 'technical-details':
        return (
          <section>
            <h4 className="font-medium text-gray-200 mb-2">Technical Details</h4>
            <p className="mb-4 text-gray-300">
              Linear regression finds the best-fitting straight line through a set of points by minimizing
              the sum of squared residuals (the vertical distances between points and the line).
            </p>

            <h5 className="font-medium text-gray-200 mb-2">Key Concepts:</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-300">
              <li>
                <strong className="text-gray-200">Regression Line:</strong> y = β₀ + β₁x, where β₀ is the y-intercept and β₁ is the slope
              </li>
              <li>
                <strong className="text-gray-200">Least Squares Method:</strong> Minimizes Σ(yi - ŷi)², where yi is the actual y-value and ŷi is the predicted y-value
              </li>
              <li>
                <strong className="text-gray-200">R-squared (R²):</strong> Measures how well the model fits the data, ranging from 0 (poor fit) to 1 (perfect fit)
              </li>
            </ul>

            <h5 className="font-medium text-gray-200 mb-2">Statistical Measures:</h5>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>
                <strong className="text-gray-200">TSS (Total Sum of Squares):</strong> Total variability in y-values
              </li>
              <li>
                <strong className="text-gray-200">MSS (Model Sum of Squares):</strong> Variability explained by the regression line
              </li>
              <li>
                <strong className="text-gray-200">RSS (Residual Sum of Squares):</strong> Unexplained variability
              </li>
            </ul>
          </section>
        );

      case 'glossary':
        return (
          <section>
            <h4 className="font-medium text-gray-200 mb-2">Glossary of Terms</h4>
            <dl className="space-y-4 text-gray-300">
              <div>
                <dt className="font-medium text-gray-200">Regression Line</dt>
                <dd className="mt-1">The line that best fits the data points, minimizing the sum of squared residuals.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-200">Slope (β₁)</dt>
                <dd className="mt-1">The change in y for a one-unit change in x. Represents the relationship's strength and direction.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-200">Intercept (β₀)</dt>
                <dd className="mt-1">The y-value where the regression line crosses the y-axis (x = 0).</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-200">Residual</dt>
                <dd className="mt-1">The vertical distance between a data point and the regression line.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-200">R-squared (R²)</dt>
                <dd className="mt-1">A measure of how well the regression line fits the data, expressed as a percentage.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-200">Correlation Coefficient (r)</dt>
                <dd className="mt-1">Measures the strength and direction of the linear relationship between x and y.</dd>
              </div>
            </dl>
          </section>
        );
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-sm border border-gray-700">
      {renderContent()}
    </div>
  );
};
