# Linear Regression Utils

A React application for performing and visualizing linear regression analysis.

## Project Structure

```
linear-regression-utils/
├── src/
│   ├── components/
│   │   ├── DataInputForm.tsx       # Form for inputting data points
│   │   ├── RegressionVisualizer.tsx # Main visualization component
│   │   ├── ScatterPlot.tsx        # Scatter plot visualization
│   │   ├── StatsDisplay.tsx       # Display regression statistics
│   │   └── Tooltip.tsx            # Reusable tooltip component
│   ├── hooks/
│   │   ├── useSimpleRegression.ts  # Hook for simple linear regression
│   │   └── useMultipleRegression.ts # Hook for multiple linear regression
│   ├── utils/
│   │   └── statistics.ts           # Statistical calculation utilities
│   └── types/
│       └── index.ts                # TypeScript type definitions
```

## Components

### DataInputForm
- Handles user input for x and y coordinates
- Validates numeric input
- Provides option to generate random points
- Uses Tailwind CSS for styling

### RegressionVisualizer
- Main component orchestrating the regression analysis
- Manages data input and visualization
- Supports both simple and multiple regression types
- Displays regression statistics and scatter plot

### ScatterPlot
- Visualizes data points and regression line using Recharts
- Handles undefined regression line gracefully
- Provides interactive tooltips and legend

### StatsDisplay
- Shows key regression statistics:
  - Line parameters (slope, intercept)
  - R-squared value
  - P-values
  - Standard errors
  - T-statistics
- Includes tooltips for statistical explanations

## Recent Changes

### Bug Fixes
1. Fixed ScatterPlot to handle undefined regression line
2. Updated DataInputForm validation logic
3. Enhanced error handling in regression calculations

### UI Improvements
1. Added tooltips for statistical explanations
2. Improved form validation feedback
3. Enhanced visualization responsiveness

### Testing
1. Added behavior tests for components
2. Improved test coverage for edge cases
3. Implemented mock data for regression hooks

## Next Steps
1. Address remaining test failures
2. Add more statistical analysis features
3. Enhance data visualization options
4. Improve error handling and user feedback

## Development Guidelines
1. Use behavior testing with React Testing Library
2. Maintain backwards compatibility
3. Follow React best practices
4. Use TypeScript for type safety
5. Implement responsive design with Tailwind CSS

---
Last Updated: 2025-02-18
