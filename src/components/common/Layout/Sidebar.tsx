"use client";

import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { 
  FaChartBar, 
  FaBook, 
  FaChevronDown,
  FaChevronRight,
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaEnvelope 
} from 'react-icons/fa';
import { SOCIAL_LINKS, CONTACT_EMAIL, AUTHOR_NAME } from '../../../constants/social';

interface SidebarProps {
  activeItem: string;
  onSelectItem: (id: string) => void;
  onSectionChange: (section: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary') => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: IconType;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'regression',
    label: 'Regression Analysis',
    icon: FaChartBar,
    children: [
      {
        id: 'simple-regression',
        label: 'Simple Linear Regression',
        icon: FaChartBar
      },
      {
        id: 'multiple-regression',
        label: 'Multiple Linear Regression',
        icon: FaChartBar
      }
    ]
  },
  {
    id: 'explanation',
    label: 'Learning Resources',
    icon: FaBook,
    children: [
      {
        id: 'why-regression',
        label: 'Why Linear Regression?'
      },
      {
        id: 'user-guide',
        label: 'User Guide'
      },
      {
        id: 'technical-details',
        label: 'Technical Details'
      },
      {
        id: 'glossary',
        label: 'Glossary'
      }
    ]
  }
];

const MenuItem: React.FC<{
  item: MenuItem;
  activeItem: string;
  onSelectItem: (id: string) => void;
  onSectionChange?: (section: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary') => void;
  level?: number;
}> = ({ item, activeItem, onSelectItem, onSectionChange, level = 0 }) => {
  const [isExpanded, setIsExpanded] = React.useState(
    item.children?.some(child => child.id === activeItem) || item.id === activeItem
  );

  const handleClick = () => {
    if (item.children) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectItem(item.id);
      
      // Handle learning resource section changes
      if (item.id === 'why-regression' || 
          item.id === 'user-guide' || 
          item.id === 'technical-details' || 
          item.id === 'glossary') {
        onSectionChange?.(item.id as any);
      }
    }
  };

  const isActive = activeItem === item.id;
  const Icon = item.icon;

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={`w-full flex items-center px-4 py-2 text-sm transition-colors rounded-lg
          ${isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50'
          }
        `}
        style={{ paddingLeft: `${level * 1 + 1}rem` }}
      >
        <div className="flex items-center flex-1">
          {Icon && <Icon className="w-4 h-4 mr-3" />}
          <span className="flex-1 text-left">{item.label}</span>
        </div>
        {item.children && (
          <span className="ml-auto">
            {isExpanded ? (
              <FaChevronDown className="w-3 h-3" />
            ) : (
              <FaChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
      </button>

      {item.children && isExpanded && (
        <div className="mt-1">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              activeItem={activeItem}
              onSelectItem={onSelectItem}
              onSectionChange={onSectionChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex justify-center space-x-4 mb-3">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">{item.label}</span>
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} Linear Regression Utils by {AUTHOR_NAME}
        </p>
        <p className="text-xs leading-5 text-gray-500 mt-1">
          Have feedback? <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-600 hover:text-gray-900">Email me</a>
        </p>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSelectItem, onSectionChange }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Linear Regression
        </h1>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              activeItem={activeItem}
              onSelectItem={onSelectItem}
              onSectionChange={onSectionChange}
            />
          ))}
        </nav>
      </div>
      <Footer />
    </div>
  );
};
