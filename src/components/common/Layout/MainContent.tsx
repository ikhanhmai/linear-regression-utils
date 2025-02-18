"use client";

import React from 'react';
import { ExplanationSection } from '../../ExplanationSection';
import { RegressionVisualizer } from '../../RegressionVisualizer';

interface MainContentProps {
  children?: React.ReactNode;
  activeItem: string;
  activeSection: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary';
}

export const MainContent: React.FC<MainContentProps> = ({ activeItem, activeSection }) => {
  const renderContent = () => {
    // Handle regression analysis items
    if (activeItem === 'simple-regression' || activeItem === 'multiple-regression') {
      return <RegressionVisualizer type={activeItem === 'simple-regression' ? 'simple' : 'multiple'} />;
    }
    
    // Handle learning resources items
    if (activeItem.match(/^(why-regression|user-guide|technical-details|glossary)$/)) {
      return <ExplanationSection activeSection={activeSection} />;
    }
    
    return null;
  };

  return (
    <main className="flex flex-col min-h-0 h-full overflow-y-auto bg-[#121212]">
      <div className="container mx-auto px-6 py-6 max-w-7xl flex flex-col flex-1 min-h-0">
        {renderContent()}
      </div>
    </main>
  );
};
