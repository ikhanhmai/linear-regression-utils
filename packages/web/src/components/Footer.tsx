import React from 'react';
import { SOCIAL_LINKS, CONTACT_EMAIL, AUTHOR_NAME } from '../constants/social';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto w-full">
      <div className="px-4 py-4 flex flex-col items-center space-y-4">
        <div className="flex justify-center space-x-4">
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
    </footer>
  );
};

export default Footer;
