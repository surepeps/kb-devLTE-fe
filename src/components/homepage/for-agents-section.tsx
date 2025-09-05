/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { URLS } from '@/utils/URLS';
import { GET_REQUEST } from '@/utils/requests';

interface ApiPlan {
  _id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  durationInDays: number;
  features: string[];
}

const ForAgentsSection = () => {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      const res = await GET_REQUEST<{ success: boolean; data: ApiPlan[] }>(`${URLS.BASE}${URLS.getSubscriptionPlans}`);
      if (res?.success && Array.isArray(res.data)) {
        setPlans(res.data);
      } else {
        setPlans([]);
      }
      setLoadingPlans(false);
    };
    fetchPlans();
  }, []);

  const freeDashboardFeatures = [
    'Basic property listings',
    'Client contact information',
    'Basic analytics dashboard',
    'Community support',
  ];

  const agentBenefits = [
    {
      title: 'Verified Buyer Network',
      description: 'Connect with pre-qualified buyers who are serious about purchasing.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
    },
    {
      title: 'Smart Matching System',
      description: 'Our AI matches your listings with the right buyers automatically.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: 'Commission Protection',
      description: 'Secure your earnings with our transparent commission tracking.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-[#FFFEFB]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#09391C] mb-6 font-display">For Real Estate Agents</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join our verified network of professional agents and grow your business with powerful tools and qualified leads.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {agentBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-[#8DDB90] rounded-full flex items-center justify-center text-white group-hover:bg-[#7BC87F] transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#09391C] mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#F5F7F9] rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#09391C] text-center mb-12">Choose Your Dashboard</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#8DDB90] transition-colors duration-300">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-[#09391C] mb-2">Free Dashboard</h4>
                <div className="text-4xl font-bold text-[#8DDB90] mb-4">₦0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                {freeDashboardFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/agent-onboard">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-[#09391C] py-3 px-4 sm:px-6 rounded-full font-bold transition-colors duration-300 text-sm sm:text-base flex items-center justify-center min-h-[48px]">
                  <span className="whitespace-nowrap">Start Free</span>
                </button>
              </Link>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingPlans
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                      <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
                      <div className="h-8 w-28 bg-gray-200 rounded mb-6 animate-pulse" />
                      <ul className="space-y-3 mb-6">
                        {Array.from({ length: 5 }).map((__, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                          </li>
                        ))}
                      </ul>
                      <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                : plans.map((plan) => (
                    <div key={plan._id} className="bg-white rounded-2xl p-8 border-2 border-[#8DDB90] relative overflow-hidden">
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-bold text-[#09391C] mb-2">{plan.name}</h4>
                        <div className="text-3xl font-bold text-[#8DDB90] mb-2">₦{Number(plan.price).toLocaleString()}</div>
                        <p className="text-gray-600 text-sm">
                          {plan.currency} • {Math.max(1, Math.round((plan.durationInDays || 30) / 30))} month{Math.max(1, Math.round((plan.durationInDays || 30) / 30)) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {(plan.features || []).map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-[#8DDB90]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/agent-subscriptions">
                        <button className="w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white py-3 px-4 sm:px-6 rounded-full font-bold transition-colors duration-300 text-sm sm:text-base flex items-center justify-center min-h-[48px]">
                          <span className="whitespace-nowrap">Subscribe Now</span>
                        </button>
                      </Link>
                    </div>
                  ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Join over 250+ verified agents already growing their business with Khabiteq</p>
            <Link href="/agent-onboard">
              <button className="bg-[#09391C] hover:bg-[#0B423D] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-colors duration-300 flex items-center justify-center min-h-[48px] sm:min-h-[56px]">
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
