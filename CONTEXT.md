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
- Desktop application support via Tauri

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **State Management**: React Hooks
- **Testing**: React Testing Library & Jest
- **Desktop Framework**: Tauri 1.x

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

## Build Process

### Tauri Desktop Application

The application is built using Tauri 1.x for cross-platform desktop support. Key configuration files:

1. **tauri.conf.json**
   - Configuration for window size and properties
   - Build settings for different platforms
   - Security settings and permissions

2. **Cargo.toml**
   - Rust dependencies and features
   - Build configuration for native components

### Build Steps
1. Debug build: `cargo build` in src-tauri directory
2. Release build: `cargo build --release` in src-tauri directory

### Build Issues and Solutions
1. **Dependency Conflicts**: Resolved conflicts between Tauri v1 and v2 dependencies
   - Updated tauri.conf.json to use v1 schema
   - Aligned Cargo.toml dependencies with Tauri v1.x
   - Removed incompatible plugins (tauri-plugin-log)

2. **Configuration Updates**:
   - Updated window configuration for better desktop integration
   - Configured proper build paths for Next.js output
   - Set appropriate security policies

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

3. **Desktop Support**
   - Added Tauri integration
   - Configured desktop window properties
   - Optimized build process
   - Added cross-platform support

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

4. **Desktop Enhancements**
   - Native system menu integration
   - File system access for data persistence
   - Offline mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details
