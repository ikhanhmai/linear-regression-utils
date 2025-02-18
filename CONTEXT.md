# Linear Regression Utils

A modern, interactive web application for exploring and understanding linear regression concepts.

## Project Overview

This application provides an intuitive interface for learning and experimenting with linear regression. Users can input data points, visualize regression lines, and understand key statistical measures.

### Key Features

- Interactive data point input and visualization
- Real-time regression line updates
- Statistical measure calculations (R², TSS, MSS, RSS)
- Educational resources and explanations
- Dark theme UI for better visibility and reduced eye strain

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **State Management**: React Hooks
- **Testing**: React Testing Library & Jest

## Component Architecture

### Core Components

1. **RegressionVisualizer** (`RegressionVisualizer.tsx`)
   - Main container component
   - Manages regression state and calculations
   - Coordinates child components

2. **DataInputForm** (`DataInputForm.tsx`)
   - Handles user input for data points
   - Input validation and formatting
   - Styled with dark theme colors and consistent spacing

3. **SimpleRegressionChart** (`SimpleRegressionChart.tsx`)
   - Visualizes data points and regression line
   - Uses Recharts for rendering
   - Dark theme compatible with readable grid lines and data points

4. **StatsDisplay** (`StatsDisplay.tsx`)
   - Shows regression statistics
   - Tooltips for explanations
   - Styled for dark theme readability

5. **ManualControls** (`ManualControls.tsx`)
   - Manual regression line adjustment
   - Interactive slope and intercept controls
   - Dark theme UI elements

### Layout Components

1. **Layout** (`Layout.tsx`)
   - Main layout structure
   - Dark theme background and borders
   - Responsive design

2. **Sidebar** (`Sidebar.tsx`)
   - Navigation menu
   - Dark theme styling with hover states
   - Section selection

3. **MainContent** (`MainContent.tsx`)
   - Content area management
   - Dark theme background
   - Proper spacing and padding

### UI Components

1. **Tooltip** (`Tooltip.tsx`)
   - Reusable tooltip component
   - Dark theme styling
   - Consistent with overall design

2. **ExplanationSection** (`ExplanationSection.tsx`)
   - Educational content display
   - Dark theme text and background colors
   - Organized learning resources

## Styling Guidelines

### Dark Theme Colors
- Background: #121212 (Main), #1E1E1E (Components)
- Text: #E5E7EB (Primary), #9CA3AF (Secondary)
- Borders: #374151 (Dividers), #4B5563 (Containers)
- Accents: #60A5FA (Primary), #3B82F6 (Hover)

### Component Styling
- Consistent border radius (rounded-md)
- Proper spacing (margin and padding)
- Hover and focus states
- Smooth transitions

## Recent Changes

1. **Dark Theme Implementation**
   - Updated all components with dark theme colors
   - Enhanced contrast for better readability
   - Consistent styling across components
   - Improved visual hierarchy

2. **UI Enhancements**
   - Refined component spacing
   - Updated hover and focus states
   - Improved button and input styling
   - Enhanced chart readability

## Future Improvements

1. **Theme Toggle**
   - Add light/dark theme switch
   - Persist theme preference

2. **Accessibility**
   - Enhance keyboard navigation
   - Improve screen reader support
   - Add ARIA labels

3. **Additional Features**
   - Multiple regression analysis
   - Data export/import
   - More statistical measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details
