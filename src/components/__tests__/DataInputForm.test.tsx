import React from 'react'
import { render, screen } from '../../test-utils'
import { DataInputForm } from '../DataInputForm'

describe('DataInputForm', () => {
  const mockOnAddPoint = jest.fn()
  const mockOnGeneratePoints = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows users to input data points', async () => {
    const { user } = render(
      <DataInputForm onAddPoint={mockOnAddPoint} onGeneratePoints={mockOnGeneratePoints} />
    )

    // Find input fields
    const xInput = screen.getByLabelText(/x/i)
    const yInput = screen.getByLabelText(/y/i)
    const addButton = screen.getByRole('button', { name: /add point/i })

    // Input values
    await user.type(xInput, '2')
    await user.type(yInput, '4')
    await user.click(addButton)

    // Check if onAddPoint was called with correct values
    expect(mockOnAddPoint).toHaveBeenCalledWith({ x: 2, y: 4 })
  })

  it('validates numeric input', async () => {
    const { user } = render(
      <DataInputForm onAddPoint={mockOnAddPoint} onGeneratePoints={mockOnGeneratePoints} />
    )

    const xInput = screen.getByLabelText(/x/i)
    const yInput = screen.getByLabelText(/y/i)
    const addButton = screen.getByRole('button', { name: /add point/i })

    // Try invalid input
    await user.type(xInput, 'abc')
    await user.type(yInput, '4')
    await user.click(addButton)

    // Check that onAddPoint was not called with invalid input
    expect(mockOnAddPoint).not.toHaveBeenCalled()
  })

  it('allows generating random points', async () => {
    const { user } = render(
      <DataInputForm onAddPoint={mockOnAddPoint} onGeneratePoints={mockOnGeneratePoints} />
    )

    const generateButton = screen.getByRole('button', { name: /generate/i })
    await user.click(generateButton)

    expect(mockOnGeneratePoints).toHaveBeenCalled()
  })
})
