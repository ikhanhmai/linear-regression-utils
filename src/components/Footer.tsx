import React from 'react';
import { SOCIAL_LINKS, CONTACT_EMAIL, AUTHOR_NAME } from '../constants/social';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="px-6 py-4 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.label}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Linear Regression Utils by {AUTHOR_NAME}. Let&apos;s explore data together!
          </p>
          <p className="text-center text-xs leading-5 text-gray-500 mt-1">
            Have feedback? <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-600 hover:text-gray-900">Email me</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
