"use client";

import React, { useState } from 'react';
import { Layout } from './common/Layout/Layout';
import { RegressionVisualizer } from './RegressionVisualizer';
import { ExplanationSection } from './ExplanationSection';

const getContent = (activeItem: string) => {
  switch (activeItem) {
    case 'simple-regression':
      return <RegressionVisualizer type={'simple'} />;
    case 'multiple-regression':
      return <div className="p-6">Multiple Linear Regression - Coming Soon!</div>;
    case 'why-linear-regression':
      return <ExplanationSection activeSection="why-regression" />;
    case 'user-guide':
      return <ExplanationSection activeSection="user-guide" />;
    case 'technical-details':
      return <ExplanationSection activeSection="technical-details" />;
    case 'glossary':
      return <ExplanationSection activeSection="glossary" />;
    default:
      return <RegressionVisualizer type={'simple'} />;
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
