import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Layout } from '../Layout';
import '@testing-library/jest-dom';

// Mock the MainContent and Sidebar components
jest.mock('../MainContent', () => ({
  MainContent: () => <div data-testid="main-content">Main Content</div>
}));

jest.mock('../Sidebar', () => ({
  Sidebar: ({ onSelectItem, onSectionChange }: { onSelectItem: (item: string) => void, onSectionChange: (section: string) => void }) => (
    <div data-testid="sidebar">
      <button onClick={() => onSelectItem('test-item')}>Select Item</button>
      <button onClick={() => onSectionChange('technical-details')}>Change Section</button>
    </div>
  )
}));

// Mock window resize
const mockResize = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Layout', () => {
  const originalWindowInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWindowInnerWidth
    });
  });

  it('shows menu button and hides sidebar by default on mobile', () => {
    // Set viewport to mobile size
    mockResize(640); // Mobile viewport

    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );
    
    // Menu button should be visible
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeVisible();

    // Sidebar should be hidden by default (translated out of view)
    const sidebar = screen.getByTestId('sidebar').parentElement;
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('shows/hides sidebar when menu button is clicked on mobile', () => {
    // Set viewport to mobile size
    mockResize(640); // Mobile viewport

    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );
    
    const menuButton = screen.getByLabelText('Toggle menu');
    const sidebar = screen.getByTestId('sidebar').parentElement;

    // Initially hidden
    expect(sidebar).toHaveClass('-translate-x-full');

    // Click menu button to show sidebar
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('translate-x-0');

    // Click menu button again to hide sidebar
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('closes sidebar when clicking overlay on mobile', () => {
    // Set viewport to mobile size
    mockResize(640); // Mobile viewport

    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );
    
    // Open the sidebar
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Click the overlay
    const overlay = screen.getByTestId('mobile-overlay');
    fireEvent.click(overlay);

    // Sidebar should be hidden
    const sidebar = screen.getByTestId('sidebar').parentElement;
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('closes sidebar when selecting an item on mobile', () => {
    // Set viewport to mobile size
    mockResize(640); // Mobile viewport

    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );
    
    // Open the sidebar
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    // Select an item
    const selectItemButton = screen.getByText('Select Item');
    fireEvent.click(selectItemButton);

    // Sidebar should be hidden
    const sidebar = screen.getByTestId('sidebar').parentElement;
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('has proper spacing in mobile view to avoid hamburger menu overlap', () => {
    // Set viewport to mobile size
    mockResize(375); // Mobile viewport
    
    render(
      <Layout 
        activeItem="test-item"
        onSelectItem={() => {}}
      >
        <div>Test Content</div>
      </Layout>
    );
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('pt-16');
    
    // Click mobile menu button to open sidebar
    const menuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(menuButton);
    
    // Verify sidebar is visible and properly spaced
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).not.toHaveClass('-translate-x-full');
  });

  describe('Layout Component', () => {
    it('renders sidebar and main content with correct spacing', () => {
      render(
        <Layout 
          activeItem="test-item"
          onSelectItem={() => {}}
        >
          <div>Test Content</div>
        </Layout>
      );
      
      // Check sidebar
      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('w-64');
      expect(sidebar).toHaveClass('flex-shrink-0');
      
      // Check main content
      const mainContent = screen.getByRole('main');
      const mainContentWrapper = mainContent.parentElement;
      expect(mainContentWrapper).toHaveClass('flex-1');
      expect(mainContentWrapper).toHaveClass('overflow-hidden');
    });

    it('maintains correct layout structure in desktop view', () => {
      render(
        <Layout 
          activeItem="test-item"
          onSelectItem={() => {}}
        >
          <div>Test Content</div>
        </Layout>
      );
      
      const container = screen.getByRole('complementary').parentElement;
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('h-screen');
      expect(container).toHaveClass('overflow-hidden');
    });
  });
});
