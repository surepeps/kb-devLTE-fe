/** @format */

import { StaticImageData } from 'next/image';
import facebookIcon from '@/svgs/facebook.svg';
import instagramIcon from '@/svgs/instagram.svg';
import twitterIcon from '@/svgs/twitter.svg';
import linkedInIcon from '@/svgs/linkedIn.svg';
import envelopeIcon from '@/svgs/envelope.svg';
import phoneIcon from '@/svgs/phone.svg';
import whatsappIcon from '@/svgs/whatsapp.svg';

//Navbar data
export const navData: { name: string; url: string; isClicked: boolean }[] = [
  {
    name: 'Home',
    url: '/',
    isClicked: true,
  },
  {
    name: 'Buy',
    url: '/buy',
    isClicked: false,
  },
  {
    name: 'Sell',
    url: '/sell',
    isClicked: false,
  },
  {
    name: 'Rent',
    url: '/rent',
    isClicked: false,
  },
  {
    name: 'Landlord',
    url: '/landlord',
    isClicked: false,
  },
  {
    name: 'Agent',
    url: '/agent',
    isClicked: false,
  },
  {
    name: 'Policies',
    url: '/policies',
    isClicked: false,
  },
  {
    name: 'About us',
    url: '/aboutUs',
    isClicked: false,
  },
];

//Footer Data
export const exploreData: { name: string; url: string }[] = [
  {
    name: 'Buy',
    url: '/buy',
  },
  {
    name: 'sell a property',
    url: '/sell',
  },
  {
    name: 'Agent',
    url: '/agent',
  },
  {
    name: 'Landlord',
    url: '/landlord',
  },
  {
    name: 'About Us',
    url: '/aboutUs',
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
export const GeneralFAQsData: { heading: string; text: string }[] = [
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

export const LandlordFAQsData: { heading: string; text: string }[] = [
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

export const TenantsFAQsData: { heading: string; text: string }[] = [
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

//CLients feedbacks
export const clientData: { name: string; text: string; starsRated: number }[] =
  [
    {
      name: 'Michael .A',
      text: `Khabi-Teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way`,
      starsRated: 5,
    },
    {
      name: 'Johnson Kent',
      text: `Khabi-Teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way`,
      starsRated: 4,
    },
    {
      name: 'Jordan Faraway',
      text: `Khabi-Teq made finding my dream home so easy! The process was seamless, and the team was incredibly supportive every step of the way`,
      starsRated: 5,
    },
  ];

//Contact Us data
export const contactUsData: {
  value: string;
  icon: StaticImageData;
  type: string;
}[] = [
  {
    value: 'Khabireqrealty.com',
    icon: envelopeIcon,
    type: 'mail',
  },
  {
    value: '070567778906',
    icon: phoneIcon,
    type: 'call',
  },
  {
    value: '070454556775',
    icon: whatsappIcon,
    type: 'social_media',
  },
];

//CardData for section 1
export const cardData: {
  header: string;
  value: string;
}[] = [
  {
    header: 'Property Type',
    value: 'Residential',
  },
  {
    header: 'Location',
    value: 'Lagos Ikeja',
  },
  {
    header: 'Property Prices',
    value: 'Residential',
  },
  {
    header: 'Document',
    value: 'C of o, recepit,...',
  },
];

/**propertyType: 'Residential',
    location: 'Lagos Ikeja',
    propertyPrices: 'Residential',
    document: 'C of o, recepit,...', */
