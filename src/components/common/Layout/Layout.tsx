"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

export const Layout: React.FC = () => {
  const [activeItem, setActiveItem] = useState('simple-regression');
  const [activeSection, setActiveSection] = useState<'why-regression' | 'user-guide' | 'technical-details' | 'glossary'>('why-regression');

  // Create tooltip portal container on mount
  // useEffect(() => {
  //   const portalId = 'tooltip-portal';
  //   if (!document.getElementById(portalId)) {
  //     const portalContainer = document.createElement('div');
  //     portalContainer.id = portalId;
  //     document.body.appendChild(portalContainer);
  //   }
    
  //   // Cleanup on unmount
  //   return () => {
  //     const portalContainer = document.getElementById(portalId);
  //     if (portalContainer) {
  //       document.body.removeChild(portalContainer);
  //     }
  //   };
  // }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none w-64 border-r border-gray-200 bg-white">
        <Sidebar 
          activeItem={activeItem} 
          onSelectItem={setActiveItem}
          onSectionChange={setActiveSection}
        />
      </div>
      <div className="flex-1 min-w-0">
        <MainContent activeItem={activeItem} activeSection={activeSection} />
      </div>
    </div>
  );
};
