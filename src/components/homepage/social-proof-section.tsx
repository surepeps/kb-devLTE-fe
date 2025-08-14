/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const SocialProofSection = () => {
  const stats = [
    {
      number: 250,
      label: "Verified Agents",
      suffix: "+"
    },
    {
      number: 1500,
      label: "Properties Matched",
      suffix: "+"
    },
    {
      number: 800,
      label: "Deals Closed",
      suffix: "+"
    },
    {
      number: 98,
      label: "Client Satisfaction",
      suffix: "%"
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Property Buyer",
      location: "Lagos",
      text: "Khabiteq made finding my dream home effortless. The verified agents and instant notifications saved me months of searching!",
      avatar: "AJ"
    },
    {
      name: "Sarah Okafor",
      role: "Real Estate Agent",
      location: "Abuja",
      text: "As an agent, Khabiteq has transformed my business. The platform connects me with serious buyers and the tools are incredible.",
      avatar: "SO"
    },
    {
      name: "Michael Chen",
      role: "Property Investor",
      location: "Port Harcourt",
      text: "The document verification service gave me confidence in my investment. Transparent, secure, and professional service.",
      avatar: "MC"
    }
  ];

  const partners = [
    { name: "Paystack", logo: "💳" },
    { name: "Flutterwave", logo: "💰" },
    { name: "Lagos State", logo: "🏛️" },
    { name: "NAICOM", logo: "🛡️" }
  ];

  return (
    <section className='w-full py-16 md:py-24 bg-[#F5F7F9]'>
      <div className='container mx-auto px-4 md:px-8'>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-20'>
          
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#09391C] mb-6 font-display'>
            Trusted by Thousands
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12'>
            Join the growing community of satisfied customers who've found their perfect properties through Khabiteq.
          </p>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='text-center'>
                <div className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#8DDB90] mb-2'>
                  <CountUp end={stat.number} duration={2.5} />
                  {stat.suffix}
                </div>
                <div className='text-gray-600 font-medium'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='mb-20'>
          
          <h3 className='text-2xl md:text-3xl font-bold text-[#09391C] text-center mb-12'>
            What Our Clients Say
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
                
                {/* Rating Stars */}
                <div className='flex items-center gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className='text-gray-600 mb-6 leading-relaxed'>
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-[#8DDB90] rounded-full flex items-center justify-center text-white font-bold'>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className='font-bold text-[#09391C]'>
                      {testimonial.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trusted Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center'>
          
          <h3 className='text-xl md:text-2xl font-bold text-[#09391C] mb-8'>
            Trusted Partners & Security
          </h3>

          <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300'>
                <span className='text-2xl'>{partner.logo}</span>
                <span className='font-medium text-gray-700'>{partner.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Security badges */}
          <div className='flex flex-wrap justify-center items-center gap-6 mt-8'>
            <div className='flex items-center gap-2 text-gray-600'>
              <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className='text-sm font-medium'>SSL Secured</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className='text-sm font-medium'>Data Protected</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className='text-sm font-medium'>Verified Platform</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
