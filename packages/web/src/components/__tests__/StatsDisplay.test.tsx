import React from 'react'
import { render, screen } from '../../test-utils'
import { StatsDisplay } from '../StatsDisplay'

describe('StatsDisplay', () => {
  const mockStats = {
    slope: 2,
    intercept: 1,
    rSquared: 0.85,
    calculatedSlope: 2,
    calculatedIntercept: 1,
    tss: 100,
    mss: 85,
    rss: 15,
    tStatisticSlope: 5.5,
    tStatisticIntercept: 3.2,
    pValueSlope: 0.001,
    pValueIntercept: 0.01,
    fStatistic: 30.25,
    pValueF: 0.0001,
    standardErrorSlope: 0.36,
    standardErrorIntercept: 0.31,
    vif: 1,
    adjustedRSquared: 0.83,
    dfRegression: 1,
    dfResidual: 18,
    dfTotal: 19
  }

  it('displays key regression statistics that users need', () => {
    render(<StatsDisplay stats={mockStats} manualMode={false} />)

    // Check for essential statistics that users need to interpret the regression
    expect(screen.getByText('Regression Statistics')).toBeInTheDocument()
    expect(screen.getByText('Line Parameters')).toBeInTheDocument()
    expect(screen.getByText('Model Fit')).toBeInTheDocument()
  })

  it('shows different levels of detail based on mode', () => {
    const { rerender } = render(<StatsDisplay stats={mockStats} manualMode={false} />)
    
    // Simple mode should show basic stats
    expect(screen.getByText('Line Parameters')).toBeInTheDocument()
    expect(screen.getByText('Model Fit')).toBeInTheDocument()

    // Technical mode should show additional stats
    rerender(<StatsDisplay stats={mockStats} manualMode={true} />)
    expect(screen.getByText('Sum of Squares')).toBeInTheDocument()
    expect(screen.getByText('Best Fit Parameters (Reference)')).toBeInTheDocument()
  })
})
