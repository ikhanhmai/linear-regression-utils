"use client";

import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { ExplanationSection } from '../components/ExplanationSection';
import { RegressionVisualizer } from './page';

export const RegressionApp: React.FC = () => {
  const [activeItem, setActiveItem] = useState('simple-lr');

  const renderContent = () => {
    switch (activeItem) {
      case 'simple-lr':
        return <RegressionVisualizer />;
      case 'multi-lr':
        return <div>Multiple Linear Regression - Coming Soon!</div>;
      case 'why-lr':
      case 'guide':
      case 'technical':
      case 'glossary':
        return <ExplanationSection defaultTab={activeItem.replace('lr', '')} />;
      default:
        return <RegressionVisualizer />;
    }
  };

  return (
    <Layout activeItem={activeItem} onSelectItem={setActiveItem}>
      {renderContent()}
    </Layout>
  );
};
