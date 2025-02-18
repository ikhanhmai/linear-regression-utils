import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from '../Layout';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock components for cleaner tests
jest.mock('../MainContent', () => ({
  MainContent: () => <div>Main Content</div>
}));

jest.mock('../Sidebar', () => ({
  Sidebar: ({ onSelectItem }: { onSelectItem: (item: string) => void }) => (
    <div>
      <button onClick={() => onSelectItem('test-item')}>Select Item</button>
    </div>
  )
}));

describe('Layout', () => {
  it('allows users to navigate using the sidebar', async () => {
    const user = userEvent.setup()
    const handleSelect = jest.fn()
    
    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={handleSelect}
      >
        <div>Test Content</div>
      </Layout>
    );

    // Navigate using sidebar
    const navigationItem = screen.getByRole('button', { name: /select item/i })
    await user.click(navigationItem)
    expect(handleSelect).toHaveBeenCalled()
  })

  it('shows and hides mobile menu', async () => {
    const user = userEvent.setup()
    
    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(menuButton)
    
    // Verify sidebar is visible
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('translate-x-0')
    
    // Close menu
    await user.click(menuButton)
    expect(sidebar).toHaveClass('-translate-x-full')
  })
})
