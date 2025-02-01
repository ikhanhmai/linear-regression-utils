"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { FaBars } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onSelectItem: (item: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeItem, onSelectItem }) => {
  const [activeSection, setActiveSection] = useState<'why-regression' | 'user-guide' | 'technical-details' | 'glossary'>('why-regression');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          aria-label="Toggle menu"
          data-testid="mobile-menu-button"
        >
          <FaBars className="w-6 h-6 text-gray-600" />
        </button>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            data-testid="mobile-overlay"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            w-64 flex-shrink-0 border-r border-gray-200 bg-white
            pt-16 lg:pt-0 
          `}
          data-testid="sidebar"
        >
          <Sidebar 
            activeItem={activeItem} 
            onSelectItem={(item) => {
              onSelectItem(item);
              setIsMobileMenuOpen(false);
            }}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <MainContent activeItem={activeItem} activeSection={activeSection} />
          {children}
        </div>
      </div>
    </div>
  );
};
