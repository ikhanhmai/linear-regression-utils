import React from 'react'
import { render, screen } from '../../test-utils'
import { DataInputForm } from '../DataInputForm'

describe('DataInputForm', () => {
  const mockOnAddPoint = jest.fn()
  const mockOnGeneratePoints = jest.fn()
  const mockOnInputChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows users to input data points', async () => {
    const { user } = render(
      <DataInputForm 
        newPoint={{ x: '2', y: '3' }}
        onAddPoint={mockOnAddPoint}
        onInputChange={mockOnInputChange}
        onGeneratePoints={mockOnGeneratePoints}
      />
    )

    // Find input fields
    const xInput = screen.getByLabelText('X Value')
    const yInput = screen.getByLabelText('Y Value')

    // Verify input values are displayed
    expect(xInput).toHaveValue(2)
    expect(yInput).toHaveValue(3)

    // Submit the form
    const submitButton = screen.getByText('Add Point')
    await user.click(submitButton)

    expect(mockOnAddPoint).toHaveBeenCalled()
  })

  it('validates numeric input', async () => {
    const { user } = render(
      <DataInputForm 
        newPoint={{ x: '', y: '' }}
        onAddPoint={mockOnAddPoint}
        onInputChange={mockOnInputChange}
        onGeneratePoints={mockOnGeneratePoints}
      />
    )

    // Find input fields
    const xInput = screen.getByLabelText('X Value')
    const yInput = screen.getByLabelText('Y Value')

    // Test non-numeric input
    await user.type(xInput, 'abc')
    await user.type(yInput, 'def')

    // Submit the form
    const submitButton = screen.getByText('Add Point')
    await user.click(submitButton)

    // Verify that onAddPoint wasn't called with invalid input
    expect(mockOnAddPoint).not.toHaveBeenCalled()
  })

  it('allows generating random points', async () => {
    const { user } = render(
      <DataInputForm 
        newPoint={{ x: '', y: '' }}
        onAddPoint={mockOnAddPoint}
        onInputChange={mockOnInputChange}
        onGeneratePoints={mockOnGeneratePoints}
      />
    )

    // Find and click the generate points button
    const generateButton = screen.getByText('Generate Points')
    await user.click(generateButton)

    expect(mockOnGeneratePoints).toHaveBeenCalledWith(10) // Default value
  })
})
