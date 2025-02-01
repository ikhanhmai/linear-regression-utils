# Linear Regression Utils

A modern web application for visualizing and understanding linear regression concepts through interactive demonstrations. Built with Next.js, TypeScript, and Recharts.

## Features

- **Simple Linear Regression**: Visualize and analyze relationships between two variables
- **Multiple Linear Regression**: Explore relationships with multiple independent variables
- **Interactive Visualization**: Real-time updates of regression lines and statistics
- **Statistical Analysis**: View detailed regression statistics including R-squared, p-values, and more
- **Educational Resources**: Built-in explanations and technical details about regression analysis

## Tech Stack

- **Framework**: Next.js 15.1.6 with TypeScript
- **UI Components**: 
  - Recharts for data visualization
  - Tailwind CSS for styling
  - Headless UI for accessible components
- **State Management**: React Hooks
- **Development Tools**: ESLint, TypeScript

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            
│   ├── common/            # Shared UI components
│   │   └── Layout/        # Layout components
│   ├── RegressionVisualizer.tsx  # Main regression visualization
│   ├── DataInputForm.tsx         # Data input handling
│   ├── RegressionChart.tsx       # Chart visualization
│   └── StatsDisplay.tsx          # Statistical results display
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
└── types/                # TypeScript type definitions
```

## Getting Started

1. **Prerequisites**
   - Node.js (Latest LTS version recommended)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd linear-regression-utils

   # Install dependencies
   npm install
   ```

3. **Development**
   ```bash
   # Start development server with Turbopack
   npm run dev
   ```

4. **Build**
   ```bash
   # Create production build
   npm run build

   # Start production server
   npm start
   ```

## Key Components

### RegressionVisualizer
The core component that handles:
- Data point management for both simple and multiple regression
- Statistical calculations
- Visualization coordination

### DataInputForm
Handles user input for:
- Manual data point entry
- Random data point generation
- Input validation

### RegressionChart
Visualizes:
- Data points
- Regression lines
- Chart domains and scales

## Type Definitions

Key types include:
- `DataPoint`: Single data point for simple regression `{ x: number, y: number }`
- `MultipleDataPoint`: Data point for multiple regression `{ x: number[], y: number }`
- `RegressionStats`: Statistical calculations and results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
