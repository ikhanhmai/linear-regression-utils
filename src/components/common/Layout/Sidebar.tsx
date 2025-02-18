import React from 'react';
import { FaChartBar, FaBook } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import Footer from '../../../components/Footer';

interface MenuItem {
  id: string;
  label: string;
  icon?: IconType;
  children?: MenuItem[];
}

interface MenuItemProps {
  item: MenuItem;
  activeItem: string;
  onSelectItem: (id: string) => void;
  onSectionChange?: (section: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary') => void;
  level?: number;
}

interface SidebarProps {
  activeItem: string;
  onSelectItem: (id: string) => void;
  onSectionChange: (section: 'why-regression' | 'user-guide' | 'technical-details' | 'glossary') => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'regression-analysis',
    label: 'Regression Analysis',
    icon: FaChartBar,
    children: [
      {
        id: 'simple-regression',
        label: 'Simple Linear Regression'
      },
      {
        id: 'multiple-regression',
        label: 'Multiple Linear Regression'
      }
    ]
  },
  {
    id: 'learning-resources',
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

const MenuItem: React.FC<MenuItemProps> = ({ 
  item, 
  activeItem, 
  onSelectItem, 
  onSectionChange,
  level = 0 
}) => {
  const handleClick = () => {
    onSelectItem(item.id);
    if (onSectionChange && item.id.match(/^(why-regression|user-guide|technical-details|glossary)$/)) {
      onSectionChange(item.id as 'why-regression' | 'user-guide' | 'technical-details' | 'glossary');
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={`
          w-full text-left px-2 py-2 rounded-md transition-colors
          ${level > 0 ? 'pl-10' : 'font-medium'}
          ${activeItem === item.id 
            ? 'bg-blue-900/30 text-blue-400' 
            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
          }
          flex items-center space-x-2
        `}
      >
        {item.icon && <item.icon className="w-5 h-5" />}
        <span>{item.label}</span>
      </button>
      {item.children && (
        <div className="space-y-1">
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

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSelectItem, onSectionChange }) => {
  return (
    <div className="h-full flex flex-col">
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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
      <Footer />
    </div>
  );
};
