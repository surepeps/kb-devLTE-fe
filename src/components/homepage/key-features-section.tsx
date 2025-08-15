/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const KeyFeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Document Verification",
      description: "Verify property ownership and documents.",
      videoThumbnail: "/placeholder-property.svg",
      link: "/document-verification",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Submit Your Preference",
      description: "Share requirements, we'll match you.",
      videoThumbnail: "/placeholder-property.svg",
      link: "/preference",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 10a6 6 0 1012 0v-1a1 1 0 00-2 0v1a4 4 0 11-8 0V9a1 1 0 00-2 0v1zm6-6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Agent Marketplace",
      description: "Access verified client preferences matching your listings.",
      videoThumbnail: "/placeholder-property.svg",
      link: "/agent-marketplace",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      ),
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Subscription Plans",
      description: "Unlock premium tools for agents and landlords.",
      videoThumbnail: "/placeholder-property.svg",
      link: "/agent-subscriptions",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11.586 10 15 6.586V7z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-orange-500"
    },
    {
      id: 5,
      title: "Post a Property",
      description: "List your property for sale or rent in minutes.",
      videoThumbnail: "/placeholder-property.svg",
      link: "/post-property",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      ),
      color: "bg-red-500"
    }
  ];

  return (
    <section className='w-full py-16 md:py-24 bg-[#FFFEFB]'>
      <div className='container mx-auto px-4 md:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#09391C] mb-6 font-display'>
            Key Features
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover the powerful tools and services that make Khabiteq your trusted real estate partner.
          </p>
        </motion.div>

        {/* Features Grid - Two rows on desktop, stacked on mobile */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* First row - 3 cards */}
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='group hover:scale-105 transition-transform duration-300'>
              
              <Link href={feature.link}>
                <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer'>
                  
                  {/* Video Thumbnail */}
                  <div className='aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300'>
                    <img 
                      src={feature.videoThumbnail}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300'>
                      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl md:text-2xl font-bold text-[#09391C] mb-3 group-hover:text-[#8DDB90] transition-colors duration-300'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-600 leading-relaxed mb-4'>
                    {feature.description}
                  </p>

                  {/* Link/Button */}
                  <div className='flex items-center gap-2 text-[#8DDB90] group-hover:text-[#7BC87F] transition-colors duration-300'>
                    <span className='font-medium'>Learn More</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Second row - 2 cards centered */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-8 lg:mt-12 max-w-4xl mx-auto'>
          {features.slice(3, 5).map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
              viewport={{ once: true }}
              className='group hover:scale-105 transition-transform duration-300'>
              
              <Link href={feature.link}>
                <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer'>
                  
                  {/* Video Thumbnail */}
                  <div className='aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300'>
                    <img 
                      src={feature.videoThumbnail}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300'>
                      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl md:text-2xl font-bold text-[#09391C] mb-3 group-hover:text-[#8DDB90] transition-colors duration-300'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-600 leading-relaxed mb-4'>
                    {feature.description}
                  </p>

                  {/* Link/Button */}
                  <div className='flex items-center gap-2 text-[#8DDB90] group-hover:text-[#7BC87F] transition-colors duration-300'>
                    <span className='font-medium'>Learn More</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
