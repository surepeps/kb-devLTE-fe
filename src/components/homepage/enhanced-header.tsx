/** @format */

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Bell, User } from 'lucide-react';
import khabiteqIcon from '@/svgs/khabi-teq.svg';
import Button from '@/components/general-components/button';
import { useUserContext } from '@/context/user-context';
import { useNotifications } from '@/context/notification-context';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  subItems?: { name: string; href: string }[];
}

const EnhancedHeader = ({ isComingSoon = false }: { isComingSoon?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useUserContext();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems: NavItem[] = [
    { name: 'Home', href: '/new-homepage' },
    {
      name: 'Marketplace',
      href: '/market-place',
      subItems: [
        { name: 'Buy Properties', href: '/market-place?type=buy' },
        { name: 'Rent Properties', href: '/market-place?type=rent' },
        { name: 'Shortlet', href: '/market-place?type=shortlet' },
        { name: 'Joint Ventures', href: '/joint-ventures' }
      ]
    },
    { name: 'Submit Preference', href: '/preference' },
    { name: 'For Agents', href: '/agent-onboard' },
    { name: 'About Us', href: '/about_us' },
    { name: 'Contact', href: '/contact-us' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/90 backdrop-blur-sm'
        } ${isComingSoon ? 'filter blur-sm' : ''}`}>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/new-homepage" className="flex-shrink-0">
              <Image
                src={khabiteqIcon}
                width={140}
                height={24}
                className="h-6 lg:h-7 w-auto"
                alt="Khabiteq"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.subItems ? (
                    <>
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-[#8DDB90] ${
                          pathname === item.href || pathname.startsWith(item.href)
                            ? 'text-[#8DDB90]'
                            : 'text-gray-700'
                        }`}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}>
                        {item.name}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>
                      
                      {/* Desktop Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                            onMouseEnter={() => setActiveDropdown(item.name)}
                            onMouseLeave={() => setActiveDropdown(null)}>
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#8DDB90] transition-colors">
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-[#8DDB90] ${
                        pathname === item.href
                          ? 'text-[#8DDB90]'
                          : 'text-gray-700'
                      }`}>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {user?._id || user?.id ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-500 hover:text-[#8DDB90] transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Profile */}
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#8DDB90] to-[#09391C] rounded-full flex items-center justify-center">
                      {user?.profile_picture ? (
                        <Image
                          src={user.profile_picture}
                          width={32}
                          height={32}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName || 'Dashboard'}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    value="Login"
                    onClick={() => router.push('/auth/login')}
                    className="px-4 py-2 text-sm font-medium text-[#8DDB90] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-all duration-200"
                  />
                  <Button
                    value="Sign Up"
                    green={true}
                    onClick={() => router.push('/auth/register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#8DDB90] rounded-lg hover:bg-[#7BC87F] transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {/* Mobile Actions & Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              {user?._id || user?.id && (
                <>
                  {/* Mobile Notifications */}
                  <button className="relative p-2 text-gray-500 hover:text-[#8DDB90] transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Mobile Profile */}
                  <Link href="/dashboard" className="w-8 h-8 bg-gradient-to-br from-[#8DDB90] to-[#09391C] rounded-full flex items-center justify-center">
                    {user?.profile_picture ? (
                      <Image
                        src={user.profile_picture}
                        width={32}
                        height={32}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-700 hover:text-[#8DDB90] transition-colors"
                aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
              
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 hover:text-[#8DDB90] hover:bg-gray-50 rounded-lg transition-colors">
                          <span className="font-medium">{item.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-2 space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-[#8DDB90] hover:bg-gray-50 rounded-md transition-colors">
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                          pathname === item.href
                            ? 'text-[#8DDB90] bg-[#8DDB90]/10'
                            : 'text-gray-700 hover:text-[#8DDB90] hover:bg-gray-50'
                        }`}>
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Auth Buttons */}
                {!user?._id && !user?.id && (
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    <Button
                      value="Login"
                      onClick={() => router.push('/auth/login')}
                      className="w-full py-2 text-center text-[#8DDB90] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-all duration-200"
                    />
                    <Button
                      value="Sign Up"
                      green={true}
                      onClick={() => router.push('/auth/register')}
                      className="w-full py-2 text-center text-white bg-[#8DDB90] rounded-lg hover:bg-[#7BC87F] transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default EnhancedHeader;
