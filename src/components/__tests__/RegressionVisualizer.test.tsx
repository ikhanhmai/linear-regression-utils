import React from 'react';
import { render, screen } from '../../test-utils';
import { RegressionVisualizer } from '../RegressionVisualizer';
import userEvent from '@testing-library/user-event';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComposedChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Scatter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  XAxis: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  YAxis: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Legend: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('RegressionVisualizer', () => {
  it('allows users to input data points and view regression results', async () => {
    const user = userEvent.setup()
    render(<RegressionVisualizer type="simple" />)

    // Add a data point
    await user.type(screen.getByLabelText('X Value'), '2')
    await user.type(screen.getByLabelText('Y Value'), '4')
    await user.click(screen.getByRole('button', { name: /add point/i }))

    // Verify regression stats are shown
    expect(screen.getByText('Line Parameters')).toBeInTheDocument()
    expect(screen.getByText('Model Fit')).toBeInTheDocument()
  })

  it('validates input fields before adding points', async () => {
    const user = userEvent.setup()
    render(<RegressionVisualizer type="simple" />)

    // Try to add point without values
    await user.click(screen.getByRole('button', { name: /add point/i }))

    // Verify no regression stats are shown since no points were added
    expect(screen.getByText('R² = 0.000')).toBeInTheDocument()
    expect(screen.getByText('y = 0.00x + 0.00')).toBeInTheDocument()
  })

  it('handles multiple regression with random point generation', async () => {
    const user = userEvent.setup()
    render(<RegressionVisualizer type="multiple" />)

    // Generate random points
    await user.click(screen.getByRole('button', { name: /generate points/i }))

    // Verify regression stats and visualization are shown
    expect(screen.getByText('Multiple Linear Regression')).toBeInTheDocument()
    expect(screen.getByText('Line Parameters')).toBeInTheDocument()
    expect(screen.getByText('Model Fit')).toBeInTheDocument()
    
    // Check feature selection
    const featureSelect = screen.getByRole('combobox')
    expect(featureSelect).toBeInTheDocument()
    await user.selectOptions(featureSelect, '1')
    expect(featureSelect).toHaveValue('1')
  })
})
