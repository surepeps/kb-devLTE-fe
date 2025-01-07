/** @format */

import { StaticImageData } from 'next/image';
import facebookIcon from '@/svgs/facebook.svg';
import instagramIcon from '@/svgs/instagram.svg';
import twitterIcon from '@/svgs/twitter.svg';
import linkedInIcon from '@/svgs/linkedIn.svg';

//Navbar data
export const navData: { name: string; url: string }[] = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Buy',
    url: '#',
  },
  {
    name: 'Sell',
    url: '#',
  },
  {
    name: 'Rent',
    url: '#',
  },
  {
    name: 'Landlord',
    url: '#',
  },
  {
    name: 'Agent',
    url: '#',
  },
  {
    name: 'Policies',
    url: '#',
  },
  {
    name: 'About us',
    url: '#',
  },
];

//Footer Data
export const exploreData: { name: string; url: string }[] = [
  {
    name: 'Buy',
    url: '#',
  },
  {
    name: 'sell a property',
    url: '#',
  },
  {
    name: 'Agent',
    url: '#',
  },
  {
    name: 'Landlord',
    url: '#',
  },
  {
    name: 'About Us',
    url: '#',
  },
];

export const servicesData: { name: string; url: string }[] = [
  {
    name: 'Property management',
    url: '#',
  },
  {
    name: 'Property Valuation',
    url: '#',
  },
  {
    name: 'Legal Management',
    url: '#',
  },
  {
    name: 'Exchange Management',
    url: '#',
  },
];

export const supportData: { name: string; url: string }[] = [
  {
    name: 'FAQ',
    url: '#',
  },
  {
    name: 'Contact us',
    url: '#',
  },
  {
    name: 'policies',
    url: '#',
  },
];

export const iconsData: { image: StaticImageData; url: string }[] = [
  {
    image: facebookIcon,
    url: '#',
  },
  {
    image: instagramIcon,
    url: '#',
  },
  {
    image: twitterIcon,
    url: '#',
  },
  {
    image: linkedInIcon,
    url: '#',
  },
];

//Section1 data
export const section1Data: { name: string; count: number }[] = [
  {
    name: 'Properties',
    count: 22,
  },
  {
    name: 'Years of Experiences',
    count: 4,
  },
  {
    name: 'Satisfied Clients',
    count: 34,
  },
];

//Highlight of Our Real Estate Expertise Section

export const HighlightData: { title: string; text: string }[] = [
  {
    title: 'Market Analysis',
    text: `In-depth understanding of market trends to guide pricing and strategy.`,
  },
  {
    title: 'Property Valuation',
    text: `Accurate assessments to determine the true value of your favourite apartment, cottage etc.`,
  },
  {
    title: 'Legal Assistance',
    text: `Helping clients navigate the complexities of legal paperwork to ensure a smooth transaction`,
  },
  {
    title: 'Negotiation Skill',
    text: `In-depth understanding of market trends to guide pricing and strategy`,
  },
  {
    title: 'Tailored Marketing plan',
    text: `Providing assistance even after the sale, ensuring clients feel supported throughout their journey`,
  },
  {
    title: 'Post - Sale Support',
    text: `Developing customized strategies to showcase properties and attract buyers.`,
  },
];

//FAQs
export const FAQsData: { heading: string; text: string }[] = [
  {
    heading: `How do I find a property on Khabi-Teq?`,
    text: `We combine real estate expertise with innovative technology to simplify property transactions and management, offering tailored solutions to meet your needs.`,
  },
  {
    heading: `What makes Khabi-Teq different?`,
    text: `We combine real estate expertise with innovative technology to simplify property transactions and management, offering tailored solutions to meet your needs.`,
  },
  {
    heading: `How can I contact Khabi-Teq for support?`,
    text: `We combine real estate expertise with innovative technology to simplify property transactions and management, offering tailored solutions to meet your needs.`,
  },
  {
    heading: `Is there a fee for using Khabi-Teq?`,
    text: `We combine real estate expertise with innovative technology to simplify property transactions and management, offering tailored solutions to meet your needs.`,
  },
  {
    heading: `Can I inspect a property before renting or buying`,
    text: `We combine real estate expertise with innovative technology to simplify property transactions and management, offering tailored solutions to meet your needs.`,
  },
];
