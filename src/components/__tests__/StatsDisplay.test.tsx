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

  it('displays all regression statistics correctly', () => {
    render(<StatsDisplay stats={mockStats} manualMode={false} />)

    // Check if key statistics are displayed
    expect(screen.getByText(/R² = 0\.850/)).toBeInTheDocument()
    expect(screen.getByText(/Line Parameters/)).toBeInTheDocument()
    expect(screen.getByText(/y = 2\.00x \+ 1\.00/)).toBeInTheDocument()
  })

  it('formats p-values correctly', () => {
    render(<StatsDisplay stats={mockStats} manualMode={false} />)

    // Check for specific p-value texts
    expect(screen.getByText(/Slope p-value: 0\.001/)).toBeInTheDocument()
    expect(screen.getByText(/Intercept p-value: 0\.010/)).toBeInTheDocument()
  })

  it('displays sum of squares', () => {
    render(<StatsDisplay stats={mockStats} manualMode={false} />)

    // Check for sum of squares values with their labels
    const tssText = screen.getByText((content, element) => {
      const hasText = (text: string) => element?.textContent?.includes(text);
      return hasText('TSS') && hasText('100.000');
    });
    expect(tssText).toBeInTheDocument();

    const mssText = screen.getByText((content, element) => {
      const hasText = (text: string) => element?.textContent?.includes(text);
      return hasText('MSS') && hasText('85.000');
    });
    expect(mssText).toBeInTheDocument();

    const rssText = screen.getByText((content, element) => {
      const hasText = (text: string) => element?.textContent?.includes(text);
      return hasText('RSS') && hasText('15.000');
    });
    expect(rssText).toBeInTheDocument();
  })
})
