"use client";

import React, { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { ExplanationSection } from '../components/ExplanationSection';
import { RegressionVisualizer } from '@/components/RegressionVisualizer';

export const RegressionApp: React.FC = () => {
  const [activeItem, setActiveItem] = useState('simple-lr');

  const renderContent = () => {
    switch (activeItem) {
      case 'simple-lr':
        return <RegressionVisualizer type={'simple'} />;
      case 'multi-lr':
        return <div>Multiple Linear Regression - Coming Soon!</div>;
      case 'why-lr':
      case 'guide':
      case 'technical':
      case 'glossary':
        const sectionMap = {
          'why-lr': 'why-regression',
          'guide': 'user-guide',
          'technical': 'technical-details',
          'glossary': 'glossary'
        } as const;
        return <ExplanationSection activeSection={sectionMap[activeItem as keyof typeof sectionMap]} />;
      default:
        return <RegressionVisualizer type={'simple'} />;
    }
  };

  return (
    <Layout activeItem={activeItem} onSelectItem={setActiveItem}>
      {renderContent()}
    </Layout>
  );
};
