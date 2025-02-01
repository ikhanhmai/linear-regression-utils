/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen, waitFor } from '../../test-utils'
import { RegressionVisualizer } from '../RegressionVisualizer'

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Scatter: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Line: () => null,
}))

describe('RegressionVisualizer', () => {
  it('renders simple regression mode correctly', () => {
    render(<RegressionVisualizer type="simple" />)
    
    // Check if the component renders with correct mode
    expect(screen.getByText(/simple linear regression/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/x/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/y/i)).toBeInTheDocument()
  })

  it('renders multiple regression mode correctly', () => {
    render(<RegressionVisualizer type="multiple" />)
    
    // Check if the component renders with correct mode
    expect(screen.getByText(/multiple linear regression/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/x1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/x2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/y/i)).toBeInTheDocument()
  })

  it('updates regression statistics when adding points in simple mode', async () => {
    const { user } = render(<RegressionVisualizer type="simple" />)

    // Add a point
    const xInput = screen.getByLabelText(/x/i)
    const yInput = screen.getByLabelText(/y/i)
    const addButton = screen.getByRole('button', { name: /add point/i })

    await user.type(xInput, '2')
    await user.type(yInput, '4')
    await user.click(addButton)

    // Check if statistics are updated
    await waitFor(() => {
      expect(screen.getByText(/r-squared/i)).toBeInTheDocument()
    })
  })

  it('allows switching between manual and automatic mode', async () => {
    const { user } = render(<RegressionVisualizer type="simple" />)

    const modeToggle = screen.getByRole('checkbox', { name: /manual mode/i })
    await user.click(modeToggle)

    // Check if manual controls are visible
    expect(screen.getByLabelText(/slope/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/intercept/i)).toBeInTheDocument()
  })
})
