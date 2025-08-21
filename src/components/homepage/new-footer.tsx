/** @format */

'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import khabiTeqIcon from '@/svgs/white-khabi-teq.svg';
import { epilogue } from '@/styles/font';

const NewFooter = ({ isComingSoon }: { isComingSoon?: boolean }) => {
  const exploreLinks = [
    { name: 'Buy Properties', url: '/market-place' },
    { name: 'Rent Properties', url: '/market-place' },
    { name: 'Sell Properties', url: '/post-property' },
    { name: 'Joint Ventures', url: '/joint-ventures' },
    { name: 'Agent Marketplace', url: '/agent-marketplace' }
  ];

  const servicesLinks = [
    { name: 'Document Verification', url: '/document-verification' },
    { name: 'Property Inspection', url: '/my-inspection-requests' },
    { name: 'Secure Transactions', url: '/transactions' },
    { name: 'Agent Services', url: '/agent-onboard' },
    { name: 'Referral Program', url: '/referral' }
  ];

  const supportLinks = [
    { name: 'About Us', url: '/about_us' },
    { name: 'Contact Us', url: '/contact-us' },
    { name: 'FAQs', url: '/homepage#faqs' },
    { name: 'Privacy Policy', url: '/policies_page' },
    { name: 'Terms of Service', url: '/policies_page' }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/khabiteq',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/khabiteq',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/khabiteq',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.826 3.85 13.018 5.126 11.99c1.276-1.028 3.084-1.028 4.36 0 1.276 1.028 1.276 2.836 0 3.864-.875.807-2.026 1.297-3.323 1.297zm7.518 0c-1.297 0-2.448-.49-3.323-1.297-1.276-1.028-1.276-2.836 0-3.864 1.276-1.028 3.084-1.028 4.36 0 1.276 1.028 1.276 2.836 0 3.864-.875.807-2.026 1.297-3.323 1.297z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/khabiteq',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@khabiteq',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  const quickActions = [
    { name: 'Submit Property Preference', url: '/preference' },
    { name: 'Join as an Agent', url: '/agent-onboard' },
    { name: 'Verify Documents', url: '/document-verification' },
    { name: 'Browse Properties', url: '/market-place' }
  ];

  return (
    <footer className={`bg-[#0B423D] w-full ${isComingSoon && 'filter blur-sm'}`}>
      <div className='container mx-auto px-4 md:px-8 py-16'>
        
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12'>
          
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}>
              
              <Image
                src={khabiTeqIcon}
                width={169}
                height={35}
                alt='Khabiteq Logo'
                className='mb-6'
              />
              
              <p className={`text-[#D6DDEB] text-base leading-relaxed mb-6 max-w-md ${epilogue.className}`}>
                Simplifying real estate transactions in Nigeria. Buy, sell, rent, and manage properties with ease through Khabi-Teq&apos;s trusted platform. Verified agents, secure transactions, and transparent deals.
              </p>

              {/* Quick Actions */}
              <div className='space-y-3'>
                <h4 className={`text-white font-semibold text-lg mb-4 ${epilogue.className}`}>
                  Quick Actions
                </h4>
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.url}
                    className='block text-[#8DDB90] hover:text-white transition-colors duration-300 text-sm font-medium'>
                    → {action.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Explore */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}>
              
              <h3 className={`text-white font-semibold text-lg mb-6 ${epilogue.className}`}>
                Explore
              </h3>
              
              <div className='space-y-4'>
                {exploreLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className={`block text-[#D6DDEB] hover:text-white transition-colors duration-300 text-base ${epilogue.className}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}>
              
              <h3 className={`text-white font-semibold text-lg mb-6 ${epilogue.className}`}>
                Services
              </h3>
              
              <div className='space-y-4'>
                {servicesLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className={`block text-[#D6DDEB] hover:text-white transition-colors duration-300 text-base ${epilogue.className}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}>
              
              <h3 className={`text-white font-semibold text-lg mb-6 ${epilogue.className}`}>
                Support
              </h3>
              
              <div className='space-y-4'>
                {supportLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className={`block text-[#D6DDEB] hover:text-white transition-colors duration-300 text-base ${epilogue.className}`}>
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Contact Info */}
              <div className='mt-6 pt-6 border-t border-white/20'>
                <div className='space-y-2'>
                  <p className={`text-[#D6DDEB] text-sm ${epilogue.className}`}>
                    📧 info@khabiteqrealty.com
                  </p>
                  <p className={`text-[#D6DDEB] text-sm ${epilogue.className}`}>
                    📞 +234 813 210 8659, 02013306352
                  </p>
                  <p className={`text-[#D6DDEB] text-sm ${epilogue.className}`}>
                    📍 Lagos, Nigeria
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='bg-white/5 rounded-2xl p-6 md:p-8 mb-12'>
          
          <div className='text-center md:text-left md:flex md:items-center md:justify-between'>
            <div className='mb-6 md:mb-0'>
              <h4 className={`text-white font-bold text-xl mb-2 ${epilogue.className}`}>
                Stay Updated with Property Deals
              </h4>
              <p className={`text-[#D6DDEB] ${epilogue.className}`}>
                Get notified about new properties, market insights, and exclusive offers.
              </p>
            </div>
            
            <div className='flex gap-3 max-w-md md:max-w-none'>
              <input
                type="email"
                placeholder="Enter your email"
                className='flex-1 px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8DDB90]'
              />
              <button className='bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-colors duration-300 whitespace-nowrap text-sm sm:text-base flex items-center justify-center min-h-[48px]'>
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className='border-t border-white/20 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}>
              <p className={`text-gray-400 text-center md:text-left ${epilogue.className}`}>
                © {new Date().getFullYear()} Khabiteq Realty Limited. All rights reserved.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className='flex items-center gap-4'>
              
              <span className={`text-[#D6DDEB] text-sm mr-2 ${epilogue.className}`}>
                Follow us:
              </span>
              
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#D6DDEB] hover:bg-[#8DDB90] hover:text-white transition-all duration-300 hover:scale-110'
                  title={social.name}>
                  {social.icon}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
