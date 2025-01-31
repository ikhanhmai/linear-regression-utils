"use client";

import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      >
        <InfoIcon className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-72 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
          <div className="relative">
            {content}
            <div className="absolute w-3 h-3 bg-gray-900 rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};
