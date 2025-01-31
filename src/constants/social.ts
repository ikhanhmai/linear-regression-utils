import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export const SOCIAL_LINKS = [
  {
    href: 'https://github.com/ikhanhmai',
    icon: FaGithub,
    label: 'GitHub'
  },
  {
    href: 'https://www.linkedin.com/in/ikhanhmai/',
    icon: FaLinkedin,
    label: 'LinkedIn'
  },
  {
    href: 'https://x.com/maivankhanh',
    icon: FaTwitter,
    label: 'Twitter'
  },
  {
    href: 'mailto:blueblazedev@outlook.com',
    icon: FaEnvelope,
    label: 'Email'
  }
] as const;

export const CONTACT_EMAIL = 'blueblazedev@outlook.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/ikhanhmai/';
