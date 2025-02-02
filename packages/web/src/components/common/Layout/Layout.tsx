"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

interface LayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onSelectItem: (item: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeItem, onSelectItem }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'why-regression' | 'user-guide' | 'technical-details' | 'glossary'>('why-regression');

  return (
    <div className="flex h-screen overflow-hidden flex-col" data-testid="layout-container">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile menu button */}
        <button
          data-testid="mobile-menu-button"
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            height="1em"
            width="1em"
            strokeWidth="0"
          >
            <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
          </svg>
        </button>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            data-testid="mobile-overlay"
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          role="complementary"
          data-testid="sidebar"
          className={`fixed lg:static inset-y-0 left-0 z-40 transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 flex-shrink-0 border-r border-gray-200 bg-white pt-16 lg:pt-0`}
        >
          <Sidebar 
            activeItem={activeItem}
            onSelectItem={(item) => {
              onSelectItem(item);
              setIsMobileMenuOpen(false);
            }}
            onSectionChange={setActiveSection}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div data-testid="main-content">
            <MainContent activeItem={activeItem} activeSection={activeSection}>
              {children}
            </MainContent>
          </div>
        </div>
      </div>
    </div>
  );
};
