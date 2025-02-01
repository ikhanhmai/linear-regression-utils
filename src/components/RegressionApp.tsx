"use client";

import React, { useState } from 'react';
import { Layout } from './common/Layout/Layout';
import { RegressionVisualizer } from './RegressionVisualizer';
import { ExplanationSection } from './ExplanationSection';

const getContent = (activeItem: string) => {
  switch (activeItem) {
    case 'simple-regression':
      return <RegressionVisualizer />;
    case 'multiple-regression':
      return <div className="p-6">Multiple Linear Regression - Coming Soon!</div>;
    case 'why-linear-regression':
      return <ExplanationSection defaultTab="why" />;
    case 'user-guide':
      return <ExplanationSection defaultTab="guide" />;
    case 'technical-details':
      return <ExplanationSection defaultTab="technical" />;
    case 'glossary':
      return <ExplanationSection defaultTab="glossary" />;
    default:
      return <RegressionVisualizer />;
  }
};

export const RegressionApp: React.FC = () => {
  const [activeItem, setActiveItem] = useState('simple-regression');

  return (
    <Layout activeItem={activeItem} onSelectItem={setActiveItem}>
      {getContent(activeItem)}
    </Layout>
  );
};
