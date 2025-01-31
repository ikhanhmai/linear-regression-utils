import React from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { SOCIAL_LINKS, CONTACT_EMAIL, LINKEDIN_URL } from '../constants/social';

const Footer = () => {
  return (
    <footer className="mt-auto py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Feature Request Section */}
        <div className="text-center mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Have a suggestion or feature request?</h3>
          <p className="text-sm text-gray-600 mb-3">
            I'd love to hear your feedback! Feel free to reach out:
          </p>
          <div className="space-x-2 text-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <FaEnvelope className="w-3 h-3 mr-1" />
              {CONTACT_EMAIL}
            </a>
            <span className="text-gray-400">or</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <FaLinkedin className="w-3 h-3 mr-1" />
              message on LinkedIn
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-5">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} Khanh Mai. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
