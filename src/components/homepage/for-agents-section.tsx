/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSubscriptionSettings } from '@/hooks/useSystemSettings';
import { formatSubscriptionFeatures } from '@/services/systemSettingsService';

const ForAgentsSection = () => {
  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettings>({});
  const [loading, setLoading] = useState(true);

  const freeDashboardFeatures = [
    "Basic property listings",
    "Client contact information",
    "Basic analytics dashboard",
    "Community support"
  ];

  // Default subscription features (fallback)
  const defaultSubscriptionFeatures = [
    "Unlimited property listings",
    "Advanced lead management",
    "Priority customer support",
    "Detailed analytics & reports",
    "Marketing tools & templates",
    "Exclusive buyer preferences access",
    "Document verification assistance",
    "Commission tracking system"
  ];

  useEffect(() => {
    const fetchSubscriptionSettings = async () => {
      try {
        const settings = await getSubscriptionSettings();
        setSubscriptionSettings(settings);
      } catch (error) {
        console.error('Error fetching subscription settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionSettings();
  }, []);

  // Get subscription features from API or use default
  const subscriptionFeatures = subscriptionSettings.features
    ? formatSubscriptionFeatures(subscriptionSettings.features)
    : defaultSubscriptionFeatures;

  // Get monthly fee from API or use default
  const monthlyFee = subscriptionSettings.monthly_fee || 25000;

  const agentBenefits = [
    {
      title: "Verified Buyer Network",
      description: "Connect with pre-qualified buyers who are serious about purchasing.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      )
    },
    {
      title: "Smart Matching System",
      description: "Our AI matches your listings with the right buyers automatically.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Commission Protection",
      description: "Secure your earnings with our transparent commission tracking.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <section className='w-full py-16 md:py-24 bg-[#FFFEFB]'>
      <div className='container mx-auto px-4 md:px-8'>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#09391C] mb-6 font-display'>
            For Real Estate Agents
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Join our verified network of professional agents and grow your business with powerful tools and qualified leads.
          </p>
        </motion.div>

        {/* Agent Benefits */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {agentBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='text-center group hover:scale-105 transition-transform duration-300'>
              
              <div className='w-16 h-16 mx-auto mb-6 bg-[#8DDB90] rounded-full flex items-center justify-center text-white group-hover:bg-[#7BC87F] transition-colors duration-300'>
                {benefit.icon}
              </div>

              <h3 className='text-xl md:text-2xl font-bold text-[#09391C] mb-4'>
                {benefit.title}
              </h3>

              <p className='text-gray-600 leading-relaxed'>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='bg-[#F5F7F9] rounded-3xl p-8 md:p-12'>
          
          <h3 className='text-2xl md:text-3xl font-bold text-[#09391C] text-center mb-12'>
            Choose Your Dashboard
          </h3>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            
            {/* Free Dashboard */}
            <div className='bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#8DDB90] transition-colors duration-300'>
              <div className='text-center mb-8'>
                <h4 className='text-2xl font-bold text-[#09391C] mb-2'>Free Dashboard</h4>
                <div className='text-4xl font-bold text-[#8DDB90] mb-4'>₦0</div>
                <p className='text-gray-600'>Perfect for getting started</p>
              </div>

              <ul className='space-y-4 mb-8'>
                {freeDashboardFeatures.map((feature, index) => (
                  <li key={index} className='flex items-center gap-3'>
                    <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className='text-gray-700'>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/agent-onboard">
                <button className='w-full bg-gray-100 hover:bg-gray-200 text-[#09391C] py-3 px-4 sm:px-6 rounded-full font-bold transition-colors duration-300 text-sm sm:text-base flex items-center justify-center min-h-[48px]'>
                  <span className="whitespace-nowrap">Start Free</span>
                </button>
              </Link>
            </div>

            {/* Subscription Dashboard */}
            <div className='bg-white rounded-2xl p-8 border-2 border-[#8DDB90] relative overflow-hidden'>
              {/* Popular badge */}
              <div className='absolute top-0 right-0 bg-[#8DDB90] text-white px-4 py-1 text-sm font-bold transform rotate-12 translate-x-2 -translate-y-2'>
                POPULAR
              </div>

              <div className='text-center mb-8'>
                <h4 className='text-2xl font-bold text-[#09391C] mb-2'>Subscription Dashboard</h4>
                <div className='text-4xl font-bold text-[#8DDB90] mb-4'>
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-10 w-32 mx-auto rounded"></div>
                  ) : (
                    <>₦{monthlyFee.toLocaleString()}<span className='text-lg text-gray-500'>/month</span></>
                  )}
                </div>
                <p className='text-gray-600'>For serious professionals</p>
              </div>

              <ul className='space-y-4 mb-8'>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 8 }).map((_, index) => (
                    <li key={index} className='flex items-center gap-3'>
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="bg-gray-200 h-4 rounded animate-pulse flex-1"></div>
                    </li>
                  ))
                ) : (
                  subscriptionFeatures.map((feature, index) => (
                    <li key={index} className='flex items-center gap-3'>
                      <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className='text-gray-700'>{feature.trim()}</span>
                    </li>
                  ))
                )}
              </ul>

              <Link href="/agent-subscriptions">
                <button className='w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white py-3 px-4 sm:px-6 rounded-full font-bold transition-colors duration-300 text-sm sm:text-base flex items-center justify-center min-h-[48px]'>
                  <span className="whitespace-nowrap">Subscribe Now</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className='text-center mt-12'>
            <p className='text-gray-600 mb-6'>
              Join over 250+ verified agents already growing their business with Khabiteq
            </p>
            <Link href="/agent-onboard">
              <button className='bg-[#09391C] hover:bg-[#0B423D] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-colors duration-300 flex items-center justify-center min-h-[48px] sm:min-h-[56px]'>
                <span className="whitespace-nowrap">Become a Verified Agent</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForAgentsSection;
