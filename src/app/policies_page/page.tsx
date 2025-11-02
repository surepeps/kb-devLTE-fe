'use client';
import Button from '@/components/general-components/button';
import Loading from '@/components/loading-component/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React, { FC, Fragment, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, FileText, Shield, Zap, Users, DollarSign, AlertCircle } from 'lucide-react';

const Policies = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const isLoading = useLoading();
  const [selectedPolicy, setSelectedPolicy] = useState('platform');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (isLoading) return <Loading />;

  const filteredPolicy = useMemo(() => {
    const policy = POLICIES_DATA.find(p => p.id === selectedPolicy);
    if (!policy || !searchTerm.trim()) return policy;

    return {
      ...policy,
      content: policy.content
        .map(section => ({
          ...section,
          items: section.items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (Array.isArray(item.details) && item.details.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())))
          ),
        }))
        .filter(section => section.items.length > 0),
    };
  }, [selectedPolicy, searchTerm]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <section
      className={`min-h-[600px] bg-gradient-to-br from-[#EEF1F1] via-[#F8FBFB] to-[#EEF1F1] w-full flex justify-center ${
        (isContactUsClicked || isModalOpened) && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex flex-col gap-[40px] my-[60px] px-[20px]'>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full flex flex-col gap-[20px]'>
          <h2 className='text-[#09391C] lg:text-[44px] lg:leading-[64px] font-semibold font-display text-center text-[32px] leading-[41px]'>
            Our&nbsp;
            <span className='text-[#8DDB90] font-display'>Policies</span>
          </h2>
          <p className='text-center text-[#5A5D63] text-[18px] leading-[28px] max-w-2xl mx-auto'>
            Transparent, comprehensive policies designed to protect all parties and ensure trust and clarity in every transaction
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='w-full max-w-2xl mx-auto'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8DDB90] w-5 h-5' />
            <input
              type='text'
              placeholder='Search policies...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#D6DDEB] bg-white text-[#09391C] placeholder-[#5A5D63] focus:border-[#8DDB90] focus:outline-none transition-colors'
            />
          </div>
        </motion.div>

        {/* Policy Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]'>
            {POLICIES_DATA.map((policy, idx) => (
              <motion.button
                key={policy.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedPolicy(policy.id);
                  setExpandedSections({});
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                  selectedPolicy === policy.id
                    ? 'bg-[#8DDB90] text-white border-[#8DDB90] shadow-lg shadow-[#8DDB90]/30'
                    : 'bg-white text-[#5A5D63] border-[#D6DDEB] hover:border-[#8DDB90] hover:bg-[#F8FBFB]'
                }`}>
                {policy.icon}
                <span className='text-sm font-medium hidden sm:inline'>{policy.name}</span>
                <span className='text-xs font-medium sm:hidden'>{policy.shortName}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Policy Content */}
        <AnimatePresence mode='wait'>
          {filteredPolicy ? (
            <motion.div
              key={selectedPolicy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className='w-full'>
              {/* Policy Header */}
              <div className='mb-8 bg-white rounded-xl p-6 lg:p-8 border border-[#D6DDEB] shadow-sm'>
                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-[#8DDB90]/10 rounded-lg'>
                    <FileText className='w-6 h-6 text-[#8DDB90]' />
                  </div>
                  <div>
                    <h3 className='text-[28px] lg:text-[32px] font-bold text-[#09391C] mb-2'>
                      {filteredPolicy.name}
                    </h3>
                    <p className='text-[#5A5D63] text-[16px] leading-[24px]'>
                      {filteredPolicy.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
              <div className='space-y-4'>
                {filteredPolicy.content.map((section, sectionIdx) => {
                  const sectionId = `${selectedPolicy}-${sectionIdx}`;
                  const isExpanded = expandedSections[sectionId] ?? true;

                  return (
                    <motion.div
                      key={sectionIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIdx * 0.05 }}
                      className='bg-white rounded-xl border border-[#D6DDEB] shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(sectionId)}
                        className='w-full px-6 lg:px-8 py-4 flex items-center justify-between hover:bg-[#F8FBFB] transition-colors'>
                        <div className='flex items-center gap-3 flex-1'>
                          <span className='text-[#8DDB90] font-bold text-lg'>
                            {section.sectionNumber}
                          </span>
                          <h4 className='text-[18px] lg:text-[20px] font-bold text-[#09391C] text-left'>
                            {section.title}
                          </h4>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}>
                          <ChevronDown className='w-5 h-5 text-[#8DDB90]' />
                        </motion.div>
                      </button>

                      {/* Section Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className='border-t border-[#D6DDEB] px-6 lg:px-8 py-6'>
                            <div className='space-y-4'>
                              {section.items.map((item, itemIdx) => (
                                <motion.div
                                  key={itemIdx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIdx * 0.05 }}>
                                  <div className='flex gap-3'>
                                    <span className='text-[#8DDB90] font-bold mt-1 flex-shrink-0'>•</span>
                                    <div className='flex-1'>
                                      <p className='text-[#09391C] font-semibold text-[15px] lg:text-[16px]'>
                                        {item.title}
                                      </p>
                                      {item.description && (
                                        <p className='text-[#5A5D63] text-[14px] lg:text-[15px] leading-[22px] mt-1'>
                                          {item.description}
                                        </p>
                                      )}
                                      {Array.isArray(item.details) && item.details.length > 0 && (
                                        <ul className='mt-2 ml-3 space-y-2'>
                                          {item.details.map((detail, detailIdx) => (
                                            <li
                                              key={detailIdx}
                                              className='text-[#5A5D63] text-[14px] leading-[21px] flex gap-2'>
                                              <span className='text-[#8DDB90] flex-shrink-0'>◦</span>
                                              <span>{detail}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* No Results */}
              {filteredPolicy.content.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='bg-[#FFF3CD] border border-[#FFE69C] rounded-xl p-6 text-center'>
                  <AlertCircle className='w-8 h-8 text-[#FF9800] mx-auto mb-2' />
                  <p className='text-[#FF6F00] font-medium'>
                    No results found for "{searchTerm}"
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-8 bg-gradient-to-r from-[#8DDB90]/10 to-[#09391C]/5 rounded-xl p-6 lg:p-8 border border-[#8DDB90]/20'>
          <div className='flex items-start gap-4'>
            <Shield className='w-6 h-6 text-[#8DDB90] flex-shrink-0 mt-1' />
            <div>
              <h4 className='font-bold text-[#09391C] mb-2'>Your Privacy Matters</h4>
              <p className='text-[#5A5D63] text-[14px] leading-[22px]'>
                These policies are designed to protect your rights and ensure transparent, secure transactions. For questions or concerns, contact us at privacy@khabiteqrealty.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const POLICIES_DATA = [
  {
    id: 'platform',
    name: 'Platform Policies',
    shortName: 'Platform',
    icon: <Zap className='w-4 h-4' />,
    description: 'Master framework guiding all transactions, subscriptions, listings, payments, and interactions across the Khabiteq platform.',
    content: [
      {
        sectionNumber: '1',
        title: 'Subscription Policy',
        items: [
          {
            title: 'Who Can Subscribe',
            description: 'Subscription is available only to registered agents.',
          },
          {
            title: 'Free Trial',
            description: 'All new agents enjoy a 7-day Free Trial with Premium benefits. After trial, subscription is required to maintain access.',
          },
          {
            title: 'Premium Plan',
            description: 'Premium – ₦15,000/month (all features, no commission)',
            details: ['Quarterly – save 10%', 'Yearly – save 20%'],
          },
          {
            title: 'Plan Changes',
            description: 'Agents cannot upgrade or downgrade mid-cycle; changes take effect in the next billing cycle.',
          },
          {
            title: 'Auto-Renewal Options',
            description: 'Agents may choose auto-renewal or manual renewal.',
          },
          {
            title: 'Access Revocation',
            description: 'Once a subscription expires, access is immediately revoked.',
          },
          {
            title: 'Document Verification',
            description: 'Document verification is excluded from subscription and charged separately on a pay-per-use basis.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Inspection Policy',
        items: [
          {
            title: 'Inspection Fees',
            description: 'Agents may set their own inspection fee; Khabiteq charges 15% of set inspection fee per booking for Premium agents and ₦5,000 per booking for unsubscribed agents.',
          },
          {
            title: 'Pay-Per-Request Model',
            description: 'Inspection fees are pay-per-request.',
          },
          {
            title: 'Client Error Refunds',
            description: 'If inspection fails due to the client\'s error → no refund.',
          },
          {
            title: 'System Error Refunds',
            description: 'If inspection fails due to agent, landlord, or Khabiteq error → refund will be made after investigation.',
          },
          {
            title: 'Property Requirements',
            description: 'Properties must be accessible, safe, and available during scheduled inspections.',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Payment & Refund Policy',
        items: [
          {
            title: 'Payment Channels',
            description: 'Payments are made through Khabiteq\'s approved payment channels only.',
          },
          {
            title: 'Subscription Refunds',
            description: 'Subscriptions are non-refundable, except where legally required.',
          },
          {
            title: 'Inspection Refunds',
            description: 'Inspection refunds are case-specific as stated in the Inspection Policy.',
          },
          {
            title: 'Payment Completion',
            description: 'All payments must be completed before services are activated.',
          },
          {
            title: 'Currency',
            description: 'Accepted currency: Nigerian Naira (₦). USD/GBP transactions may be allowed for diaspora clients.',
          },
          {
            title: 'Tax & Processing',
            description: 'All commissions, fees, and escrow deductions are subject to Paystack processing charges and applicable taxes.',
          },
          {
            title: 'Payout Timeline',
            description: 'Payouts to agents/hosts occur within the agreed timelines (e.g., 12–24 hours post shortlet check-in).',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Agent & Listing Policy',
        items: [
          {
            title: 'Verified Agents Only',
            description: 'Only verified agents may list properties.',
          },
          {
            title: 'Listing Accuracy',
            description: 'Listings must be accurate, updated, and not misleading.',
          },
          {
            title: 'Fraudulent Content Removal',
            description: 'Fraudulent or duplicate listings will be removed without refund.',
          },
          {
            title: 'Agent Compliance',
            description: 'Agents are responsible for ensuring compliance with all real estate laws, permits, and taxes.',
          },
          {
            title: 'Media Standards',
            description: 'No watermarks, stock images, or fake documents are allowed.',
          },
          {
            title: 'Ownership Declaration',
            description: 'At posting, sellers/agents/landlords must complete an Ownership Declaration to confirm authority to list.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Verification & Due Diligence Policy',
        items: [
          {
            title: 'Optional Verification',
            description: 'Document verification is optional and charged per request.',
          },
          {
            title: 'Verification Outcomes',
            description: 'Verification outcomes are based on Khabiteq\'s checks, but Khabiteq is not liable for third-party fraud or misrepresentation.',
          },
          {
            title: 'Suspension Rights',
            description: 'Khabiteq reserves the right to suspend agents with repeated failed verifications.',
          },
          {
            title: 'Client Advice',
            description: 'Buyers/tenants are advised to use the verification service before committing.',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'Anti-Fraud & Scam Policy',
        items: [
          {
            title: 'Zero Tolerance',
            description: 'Strict zero-tolerance for fraudulent activities.',
          },
          {
            title: 'Immediate Suspension',
            description: 'Any suspected fraud leads to immediate suspension and possible blacklisting.',
          },
          {
            title: 'Account Termination',
            description: 'Agents found guilty will lose access without refund.',
          },
          {
            title: 'Law Enforcement Notification',
            description: 'Khabiteq may notify law enforcement in cases of fraud, forgery, or scams.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Dispute Resolution Policy',
        items: [
          {
            title: 'Direct Resolution',
            description: 'Disputes between agents and clients should first be resolved directly.',
          },
          {
            title: 'Khabiteq Mediation',
            description: 'Where unresolved, Khabiteq may act as a mediator but is not legally bound to enforce settlement.',
          },
          {
            title: 'Escalation',
            description: 'If disputes escalate, parties are encouraged to use independent mediation or arbitration.',
          },
          {
            title: 'Escrow Release',
            description: 'Escrow funds will only be released upon confirmation of milestones, mutual agreement, or dispute resolution outcome.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Data & Privacy Policy',
        items: [
          {
            title: 'Data Collection',
            description: 'Khabiteq collects only data necessary to operate the platform (e.g., agent profile info, listings, inspection history).',
          },
          {
            title: 'Regulatory Compliance',
            description: 'Data is processed under NDPR and GDPR standards.',
          },
          {
            title: 'No Data Sales',
            description: 'Khabiteq does not sell personal data to third parties.',
          },
          {
            title: 'Consent to Promotion',
            description: 'Agents consent to their profile, reviews, and listings being publicly displayed and promoted across the Khabiteq platform and social media.',
          },
          {
            title: 'Data Retention',
            description: 'Active agents → data retained as long as account is active. Inactive/suspended agents → data retained for 3 years for compliance.',
          },
          {
            title: 'Data Deletion',
            description: 'Users may request data deletion, subject to regulatory requirements.',
          },
        ],
      },
      {
        sectionNumber: '9',
        title: 'Intellectual Property & Content Use',
        items: [
          {
            title: 'Agent Ownership',
            description: 'Agents retain ownership of property photos, videos, and descriptions they upload.',
          },
          {
            title: 'Khabiteq License',
            description: 'By uploading, agents grant Khabiteq a royalty-free license to display, distribute, and advertise such content.',
          },
          {
            title: 'Unauthorized Reproduction',
            description: 'Unauthorized reproduction of platform content outside Khabiteq is prohibited.',
          },
        ],
      },
      {
        sectionNumber: '10',
        title: 'Termination & Suspension Policy',
        items: [
          {
            title: 'Suspension Grounds',
            description: 'Khabiteq may suspend or terminate an agent\'s access if they:',
            details: ['Engage in fraud or scams', 'Repeatedly violate listing rules', 'Misuse inspection or subscription services'],
          },
          {
            title: 'Appeal Process',
            description: 'Suspended agents may appeal within 7 working days.',
          },
          {
            title: 'Final Termination',
            description: 'Termination due to fraud or major violations is final, with no refund.',
          },
        ],
      },
      {
        sectionNumber: '11',
        title: 'Platform Usage & Access Policy',
        items: [
          {
            title: 'Credential Security',
            description: 'Users must not share login credentials with third parties.',
          },
          {
            title: 'Single Account',
            description: 'Multiple accounts for the same agent are prohibited.',
          },
          {
            title: 'Misuse Suspension',
            description: 'Khabiteq may suspend accounts for misuse, impersonation, or unauthorized access.',
          },
        ],
      },
      {
        sectionNumber: '12',
        title: 'Advertising & Promotion Policy',
        items: [
          {
            title: 'Ad Services',
            description: 'Agents may promote their listings via Khabiteq\'s ad services (sponsored placements, featured listings).',
          },
          {
            title: 'Prohibited Practices',
            description: 'Misleading promotions, false discounts, or use of Khabiteq branding without approval are prohibited.',
          },
          {
            title: 'Sponsored Listing Labels',
            description: 'Sponsored listings will always be clearly labeled.',
          },
        ],
      },
      {
        sectionNumber: '13',
        title: 'Client Protection Policy',
        items: [
          {
            title: 'Verification Requirement',
            description: 'Clients are advised to complete document verification before making payments.',
          },
          {
            title: 'Off-Platform Payments',
            description: 'Off-platform payments are strictly discouraged; Khabiteq is not liable for losses from such transactions.',
          },
          {
            title: 'Agent Suspension',
            description: 'Khabiteq reserves the right to suspend agents who attempt to divert clients off-platform.',
          },
        ],
      },
      {
        sectionNumber: '14',
        title: 'Content Moderation & Takedown Policy',
        items: [
          {
            title: 'Content Removal',
            description: 'Khabiteq may remove any content that is:',
            details: ['Fraudulent, offensive, discriminatory, or misleading', 'In breach of copyright (e.g., stolen photos)', 'Not meeting platform quality standards'],
          },
        ],
      },
      {
        sectionNumber: '15',
        title: 'Customer Review & Rating Policy',
        items: [
          {
            title: 'Honest Reviews',
            description: 'Clients may rate and review agents honestly.',
          },
          {
            title: 'Fake Reviews',
            description: 'Fake, coerced, or manipulated reviews will be removed.',
          },
          {
            title: 'Agent Response',
            description: 'Agents cannot demand removal of genuine negative reviews but may respond professionally.',
          },
        ],
      },
      {
        sectionNumber: '16',
        title: 'Anti-Money Laundering (AML) & KYC Policy',
        items: [
          {
            title: 'High-Value Sales',
            description: 'For high-value sales, Khabiteq may request additional identity documents.',
          },
          {
            title: 'Suspicious Transactions',
            description: 'Suspicious transactions may be flagged or reported to authorities.',
          },
          {
            title: 'Compliance',
            description: 'Agents must comply with all Nigerian KYC and AML requirements where applicable.',
          },
        ],
      },
      {
        sectionNumber: '17',
        title: 'Compliance & Legal Disclaimer',
        items: [
          {
            title: 'Platform Role',
            description: 'Khabiteq is a digital marketplace platform and does not act as a buyer, seller, or legal representative in property transactions.',
          },
          {
            title: 'Agent Responsibility',
            description: 'Agents and landlords are fully responsible for the legality and accuracy of listed properties.',
          },
          {
            title: 'Liability Disclaimer',
            description: 'Khabiteq is not liable for disputes, financial losses, or damages from off-platform transactions.',
          },
        ],
      },
      {
        sectionNumber: '18',
        title: 'Customer Support Policy',
        items: [
          {
            title: 'Support Channels',
            description: 'Support is available via phone, email, and in-app channels.',
          },
          {
            title: 'Response Time',
            description: 'Typical response time: 24–48 hours.',
          },
          {
            title: 'Official Communication',
            description: 'Khabiteq will not be responsible for unofficial communications outside its official channels.',
          },
        ],
      },
      {
        sectionNumber: '19',
        title: 'Force Majeure & Service Availability',
        items: [
          {
            title: 'Platform Availability',
            description: 'Khabiteq will make reasonable efforts to keep the platform available 24/7.',
          },
          {
            title: 'Exemptions',
            description: 'Not liable for downtime caused by:',
            details: ['Internet failures', 'Power outages', 'Maintenance', 'Acts of God, government action, or force majeure'],
          },
          {
            title: 'Subscription Extension',
            description: 'Subscription periods will not be extended unless downtime exceeds 7 consecutive days.',
          },
        ],
      },
    ],
  },
  {
    id: 'property-posting',
    name: 'Property Posting Policy',
    shortName: 'Posting',
    icon: <FileText className='w-4 h-4' />,
    description: 'Comprehensive rules for agents, landlords, and brokers to ensure professionalism, transparency, and accountability in property listings.',
    content: [
      {
        sectionNumber: '1',
        title: 'Registration & Verification',
        items: [
          {
            title: 'Registration Requirement',
            description: 'All agents must register through the Khabiteq website.',
          },
          {
            title: 'Required Documents',
            description: 'Required documents include: Valid government-issued ID, contact information, real estate license or association membership (if applicable), and at least one verifiable professional reference.',
          },
          {
            title: 'Agent Approval',
            description: 'Khabiteq reserves the right to verify and approve all agents before granting full access.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Subscription & Access Levels',
        items: [
          {
            title: 'Subscribed Agents with Public Page',
            description: 'Can display their WhatsApp and contact details. Clients may contact them directly for negotiations and inspections. Khabiteq still enforces compliance with all commission and platform rules.',
          },
          {
            title: 'Trial/Unsubscribed Agents',
            description: 'Clients cannot contact them directly. All communications, inspections, and payments must go through Khabiteq. A ₦5,000 inspection fee is paid by the buyer or tenant to Khabiteq. Khabiteq acts as the intermediary for these transactions.',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Property Posting Rules',
        items: [
          {
            title: 'No Watermarks',
            description: 'No watermarks are allowed on property photos.',
          },
          {
            title: 'Image Quality',
            description: 'Images must be clear, recent, and accurate (no stock or misleading images).',
          },
          {
            title: 'Document Validity',
            description: 'All property documents must be valid and verifiable.',
          },
          {
            title: 'Duplicate Prevention',
            description: 'Duplicate or fake listings are strictly prohibited.',
          },
          {
            title: 'Ownership Declaration',
            description: 'At the point of posting, the seller/agent/landlord must complete an Ownership Declaration to confirm they are authorized to list the property.',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Buyer/Tenant Responsibilities',
        items: [
          {
            title: 'Document Verification',
            description: 'Buyers and tenants should insist on document verification before making commitments.',
          },
          {
            title: 'Verification Feature',
            description: 'Khabiteq provides a Document Verification feature that buyers can use to confirm ownership and property authenticity.',
          },
          {
            title: 'No Unverified Transactions',
            description: 'No transaction should proceed without proper verification.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Professional Conduct',
        items: [
          {
            title: 'Professional Treatment',
            description: 'Agents must treat clients professionally and transparently.',
          },
          {
            title: 'No Off-Platform Diversion',
            description: 'Agents must not divert clients off-platform to avoid fees.',
          },
          {
            title: 'Subscription Compliance',
            description: 'Subscribed agents with public pages may transact directly, but Khabiteq\'s commission and compliance policies still apply.',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'Shortlets',
        items: [
          {
            title: 'Property Standards',
            description: 'Hosts must ensure properties are safe, clean, and accurately described.',
          },
          {
            title: 'Service Fee',
            description: 'Guests must pay the shortlet service fee, which applies whether the booking comes from an agent\'s public page or the marketplace.',
          },
          {
            title: 'Payout Timeline',
            description: 'Hosts are paid 12–24 hours after check-in is confirmed.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Joint Ventures (JV)',
        items: [
          {
            title: 'Signed LOI',
            description: 'JV deals must include a signed Letter of Instruction (LOI) between landowners and developers.',
          },
          {
            title: 'Industry Standard Commission',
            description: 'Where no LOI is signed, Khabiteq reserves the right to apply industry-standard sales commission, as mutually agreed before closing.',
          },
          {
            title: 'Khabiteq Involvement',
            description: 'Khabiteq must be included in the transaction process for commissions to apply.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Escrow & Dispute Resolution',
        items: [
          {
            title: 'Escrow Services',
            description: 'Khabiteq may use escrow services to safeguard funds until conditions are met.',
          },
          {
            title: 'Dispute Reporting',
            description: 'Any disputes between clients, agents, or landlords must be reported to Khabiteq.',
          },
          {
            title: 'Corrective Action',
            description: 'Khabiteq reserves the right to mediate and take corrective action, including suspension or blacklisting.',
          },
        ],
      },
      {
        sectionNumber: '9',
        title: 'Compliance & Enforcement',
        items: [
          {
            title: 'Content Removal',
            description: 'Fraudulent, fake, or misleading listings will be removed.',
          },
          {
            title: 'Repeat Offenders',
            description: 'Repeated offenders may be blacklisted and barred from re-registering.',
          },
          {
            title: 'Legal Notification',
            description: 'Legal authorities may be notified in cases of fraud or misconduct.',
          },
        ],
      },
      {
        sectionNumber: '10',
        title: 'Refunds & Failed Inspections',
        items: [
          {
            title: 'Pay-Per-Request',
            description: 'Inspection fees are pay-per-request.',
          },
          {
            title: 'Client Error',
            description: 'If inspection fails due to the client\'s error (buyer/tenant), no refund applies.',
          },
          {
            title: 'System Error',
            description: 'If inspection fails due to agent, landlord, or Khabiteq error, refunds will be made after investigation.',
          },
          {
            title: 'Subscription Refunds',
            description: 'Subscriptions remain non-refundable, except where legally required.',
          },
        ],
      },
    ],
  },
  {
    id: 'subscription',
    name: 'Subscription & Account Management',
    shortName: 'Subscription',
    icon: <Zap className='w-4 h-4' />,
    description: 'Rules for agents, landlords, and property managers who subscribe to Khabiteq services.',
    content: [
      {
        sectionNumber: '1',
        title: 'Subscription Plan',
        items: [
          {
            title: 'Premium Plan',
            description: 'Premium Subscription Plan: ₦15,000 per month.',
          },
          {
            title: 'Discount Options',
            description: 'Discounts available for longer commitments:',
            details: ['3-month subscription: 10% discount', '6-month subscription: 15% discount', '12-month subscription: 20% discount'],
          },
          {
            title: 'Free Trial',
            description: 'Trial Period: Free 7-day trial before payment is required.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Account Features (Premium Subscribers)',
        items: [
          {
            title: 'Personal Agent Page',
            description: 'Personal Agent Public Page with listings and profile.',
          },
          {
            title: 'Custom Inspection Fees',
            description: 'Ability to set custom inspection fees (Khabiteq retains 15% as platform commission).',
          },
          {
            title: 'Zero Commission',
            description: 'Zero sales/rental commission payable to Khabiteq (commission-free transactions).',
          },
          {
            title: 'Agent Marketplace Access',
            description: 'Access to client preferences via Agent Marketplace.',
          },
          {
            title: 'Marketing Exposure',
            description: 'Marketing exposure through the General Marketplace.',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Inspection Fees',
        items: [
          {
            title: 'Subscribed Agents',
            description: 'May set their own inspection fee; Khabiteq collects 15% of this fee.',
          },
          {
            title: 'Unsubscribed Agents',
            description: 'Cannot set fees; fixed inspection fee of ₦5,000 applies and is collected fully by Khabiteq.',
          },
          {
            title: 'Non-Refundable',
            description: 'Inspection fees are non-refundable except where required by law.',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Payments & Renewals',
        items: [
          {
            title: 'Auto-Renewal',
            description: 'Subscriptions renew automatically unless cancelled before the billing date.',
          },
          {
            title: 'Payment Processing',
            description: 'Payments are processed via Paystack with fees split (5% Paystack, 10% Khabiteq retention on inspection/service transactions).',
          },
          {
            title: 'Failed Payment',
            description: 'Failed payments will result in immediate suspension of account access.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Refunds & Cancellations',
        items: [
          {
            title: 'Non-Refundable',
            description: 'Subscription fees are non-refundable, including partial months, even if the subscriber cancels before expiry.',
          },
          {
            title: 'Legal Exceptions',
            description: 'Refunds are only considered where legally mandated (e.g., billing error).',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'User Obligations',
        items: [
          {
            title: 'Accurate Listings',
            description: 'Subscribers must ensure all listed properties are accurate and legally verifiable.',
          },
          {
            title: 'Authority to List',
            description: 'Agents must have the authority or ownership rights to list properties.',
          },
          {
            title: 'Verification Compliance',
            description: 'Subscriptions do not override property verification or due diligence requirements.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Limitations of Service',
        items: [
          {
            title: 'Scope',
            description: 'Subscription covers platform access, tools, and visibility.',
          },
          {
            title: 'Excluded Services',
            description: 'It does not include external marketing services (e.g., social media ads, billboards) unless expressly offered in separate packages.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Account Use & Restrictions',
        items: [
          {
            title: 'Single User',
            description: 'One subscription = one agent only. Accounts cannot be shared, transferred, or resold.',
          },
          {
            title: 'Misuse',
            description: 'Misuse (fraudulent listings, circumvention of Khabiteq fees, or multiple-user abuse) may lead to suspension or termination without refund.',
          },
        ],
      },
      {
        sectionNumber: '9',
        title: 'Suspension & Termination',
        items: [
          {
            title: 'Suspension Grounds',
            description: 'Accounts may be suspended or terminated for:',
            details: ['Non-payment of subscription fees', 'Fraudulent or misleading property listings', 'Circumventing Khabiteq to avoid inspection or service fees'],
          },
          {
            title: 'Pending Obligations',
            description: 'Termination does not exempt the subscriber from pending obligations (fees, commissions, disputes).',
          },
        ],
      },
      {
        sectionNumber: '10',
        title: 'Data Protection & Privacy',
        items: [
          {
            title: 'Data Handling',
            description: 'All subscriber data is handled per the Khabiteq Data Protection & Consent Policy.',
          },
          {
            title: 'Consent to Processing',
            description: 'By subscribing, users consent to the processing of personal and financial data for billing, compliance, and communication.',
          },
        ],
      },
      {
        sectionNumber: '11',
        title: 'Dispute Resolution',
        items: [
          {
            title: 'First Contact',
            description: 'Subscription disputes should first be reported to Khabiteq Support.',
          },
          {
            title: 'Escalation',
            description: 'If unresolved, disputes will follow the same escalation process in the Commission & Transaction Policy and Nigerian law.',
          },
        ],
      },
      {
        sectionNumber: '12',
        title: 'Policy Updates',
        items: [
          {
            title: 'Right to Update',
            description: 'Khabiteq reserves the right to update this policy. Updates take effect once published. Continued use of the platform after updates indicates acceptance.',
          },
        ],
      },
    ],
  },
  {
    id: 'commission',
    name: 'Commission & Transaction Policy',
    shortName: 'Commission',
    icon: <DollarSign className='w-4 h-4' />,
    description: 'Explains commission, service fee, inspection fee, payment, and escrow rules for all transaction types on the platform.',
    content: [
      {
        sectionNumber: '1',
        title: 'Definitions',
        items: [
          {
            title: 'Standard Commission',
            description: 'The professional fee due to an agent for facilitating a property transaction (typically a percentage of the transaction value).',
          },
          {
            title: 'Agent Marketplace',
            description: 'The page where client preferences and requests are posted; agents match clients\' needs with their listings.',
          },
          {
            title: 'General Marketplace',
            description: 'The page listing all properties on Khabiteq available to site visitors.',
          },
          {
            title: 'Subscribed Agent',
            description: 'An agent who has purchased any paid subscription plan that includes a public agent page and expanded access. Subscribed agents pay subscription fees (and do not pay commissions to Khabiteq).',
          },
          {
            title: 'Non-Subscribed Agent',
            description: 'An agent who has not purchased any subscription.',
          },
          {
            title: 'Host & Guest',
            description: 'Host: A person listing a shortlet property. Guest: A person booking a shortlet property.',
          },
          {
            title: 'Joint Venture (JV)',
            description: 'A formal partnership between a landowner and developer to develop property with a pre-agreed sharing ratio on completion.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Commission Structure (Summary)',
        items: [
          {
            title: 'Agent Marketplace - Rent',
            description: 'Khabiteq receives 25% of the standard commission.',
          },
          {
            title: 'Agent Marketplace - Sale',
            description: 'Commission is set by the Letter of Instructions (LOI) between parties.',
          },
          {
            title: 'General Marketplace - Rent',
            description: 'Khabiteq receives 50% of the standard commission.',
          },
          {
            title: 'Subscribed Agents',
            description: 'No commission payable to Khabiteq on transactions. Khabiteq collects 15% of the inspection fee set on the subscribed agent\'s public profile.',
          },
          {
            title: 'Trial/Unsubscribed Agents',
            description: 'Inspection fee is ₦5,000, payable to Khabiteq (Khabiteq coordinates the inspection as intermediary).',
          },
          {
            title: 'Shortlet Fees',
            description: '8% charged to guest and 7% charged to host (applies across all bookings).',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Inspection Fees',
        items: [
          {
            title: 'Subscribed Agents',
            description: 'May set their own inspection fee on their public page; Khabiteq collects 15% of that stated inspection fee.',
          },
          {
            title: 'Unsubscribed Agents',
            description: 'Inspection fee is ₦5,000, paid to Khabiteq.',
          },
          {
            title: 'Refunds',
            description: 'Inspection fees are non-refundable unless the failure was caused by Khabiteq, the seller, or landlord. If the buyer/tenant cancels or defaults, the fee is forfeited.',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Shortlet (Booking) Rules & Disbursement',
        items: [
          {
            title: 'Guest Service Fee',
            description: 'The guest service fee (8%) applies to all bookings regardless of source (subscribed agent, public page, agent marketplace, or general listing).',
          },
          {
            title: 'Host Fee',
            description: 'Hosts are also charged 7% per confirmed booking.',
          },
          {
            title: 'Host Payout',
            description: 'Disbursement: Host payout is released 12–24 hours after guest check-in confirmation.',
          },
          {
            title: 'Guest Payment',
            description: 'Guest payment (including service fee) is charged at booking per platform payment flow.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Payment Flow, Escrow & Deductions',
        items: [
          {
            title: 'Automatic Calculation',
            description: 'Commissions and service fees are automatically calculated and deducted at payment processing.',
          },
          {
            title: 'Payment Responsibility',
            description: 'Generally, agents or landlords pay commissions and platform fees, except shortlets, where the guest pays the guest service fee (8%) and the host is charged 7%.',
          },
          {
            title: 'Escrow',
            description: 'Khabiteq may hold funds in escrow for high-value deals, JV milestones, or as agreed. Escrow terms and fees are disclosed before funds are accepted. Funds in escrow are released only on milestone confirmation, mutual instruction, or dispute resolution.',
          },
          {
            title: 'Digital Receipts',
            description: 'Khabiteq issues digital receipts and statements for all deductions.',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'Sales, Rent & JV Transactions',
        items: [
          {
            title: 'Khabiteq Involvement',
            description: 'For transactions where Khabiteq is directly involved, commission terms are governed by the signed LOI.',
          },
          {
            title: 'Direct Agent Deals',
            description: 'Transactions completed via an agent\'s public page (without Khabiteq involvement) are direct agent-to-client deals. Khabiteq is not responsible for payments or disputes.',
          },
          {
            title: 'Buyer Advice',
            description: 'Buyers and tenants are strongly advised to use Khabiteq\'s document verification service before making payments or moving in.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Posting & Ownership Rules',
        items: [
          {
            title: 'Ownership Declaration',
            description: 'All property owners, sellers, or landlord agents must sign an Ownership Declaration confirming they are authorized to post a listing.',
          },
          {
            title: 'Media Rules',
            description: 'Listings must not include watermarks, third-party branding, or misleading visuals. Breaches may lead to removal.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Communication Rules',
        items: [
          {
            title: 'Subscribed Agents',
            description: 'Subscribed agents with public pages may display their WhatsApp for direct communication.',
          },
          {
            title: 'Unsubscribed Agents',
            description: 'Non-subscribed or trial agents must transact via Khabiteq channels only.',
          },
        ],
      },
      {
        sectionNumber: '9',
        title: 'Non-Circumvention',
        items: [
          {
            title: 'Bypass Prevention',
            description: 'Users must not bypass Khabiteq to avoid commissions or fees after introductions or matches.',
          },
          {
            title: 'Penalties',
            description: 'Breaches may result in fee recovery, penalties, or account suspension/termination.',
          },
        ],
      },
      {
        sectionNumber: '10',
        title: 'Dispute Resolution & Escrow Claims',
        items: [
          {
            title: 'Report Disputes',
            description: 'All disputes must be reported via Khabiteq\'s support channels.',
          },
          {
            title: 'Mediation',
            description: 'Khabiteq first mediates; unresolved disputes proceed under Nigerian law.',
          },
          {
            title: 'Escrow Hold',
            description: 'Funds may be held in escrow until resolution.',
          },
        ],
      },
      {
        sectionNumber: '11',
        title: 'Taxes & Compliance',
        items: [
          {
            title: 'Tax Obligation',
            description: 'All commissions and service fees are subject to applicable Nigerian taxes (VAT, WHT, stamp duties, etc.).',
          },
          {
            title: 'Regulatory Compliance',
            description: 'This policy complies with Nigerian property regulations, including LASRERA where applicable.',
          },
        ],
      },
      {
        sectionNumber: '12',
        title: 'Liability & Disclaimer',
        items: [
          {
            title: 'Platform Role',
            description: 'Khabiteq acts as an intermediary/facilitator and is not responsible for third-party misrepresentations or default.',
          },
          {
            title: 'User Diligence',
            description: 'Users must perform due diligence (title, inspection, legal checks).',
          },
          {
            title: 'Limited Liability',
            description: 'Khabiteq\'s liability is limited to direct losses caused by proven negligence.',
          },
        ],
      },
      {
        sectionNumber: '13',
        title: 'Data Protection',
        items: [
          {
            title: 'Data Handling',
            description: 'Personal/financial data for payments and escrow is handled per Khabiteq\'s Data Protection Policy.',
          },
          {
            title: 'Consent',
            description: 'By transacting, users consent to use of their data for compliance and communication.',
          },
        ],
      },
      {
        sectionNumber: '14',
        title: 'Policy Changes',
        items: [
          {
            title: 'Update Right',
            description: 'Khabiteq may update this policy. Updates are effective upon publication.',
          },
          {
            title: 'Acceptance',
            description: 'Continued use of the platform means acceptance of changes.',
          },
        ],
      },
    ],
  },
  {
    id: 'data-consent',
    name: 'Agent Data Consent Policy',
    shortName: 'Data Consent',
    icon: <Shield className='w-4 h-4' />,
    description: 'Explains how Khabiteq collects, uses, stores, and protects personal data provided by agents who register on the platform.',
    content: [
      {
        sectionNumber: '1',
        title: 'Personal Data We Collect',
        items: [
          {
            title: 'Identification Data',
            description: 'Full name, date of birth, National Identification Number (NIN), valid government-issued ID.',
          },
          {
            title: 'Contact Information',
            description: 'Phone numbers, email addresses, residential/business addresses.',
          },
          {
            title: 'Professional Information',
            description: 'Licenses, certifications, proof of agency/ownership, and related documents.',
          },
          {
            title: 'Financial Information',
            description: 'Bank account details for payment of inspection fees, commissions, and related transactions.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Purpose of Data Collection',
        items: [
          {
            title: 'KYC Compliance',
            description: 'Identity verification and Know Your Customer (KYC) compliance.',
          },
          {
            title: 'Payment Processing',
            description: 'Processing inspection fees, commissions, and other payments due to you.',
          },
          {
            title: 'Communication',
            description: 'Communicating updates about your listings, account, and transactions.',
          },
          {
            title: 'Legal Compliance',
            description: 'Compliance with applicable laws, including anti-fraud and anti-money laundering regulations.',
          },
          {
            title: 'Record-Keeping',
            description: 'Secure record-keeping of transactions performed on the platform.',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Data Sharing',
        items: [
          {
            title: 'No Sales',
            description: 'We will not sell your personal information.',
          },
          {
            title: 'Authorized Partners',
            description: 'Data may only be shared with: Authorized third-party service providers (e.g., payment processors, verification agencies). Regulatory authorities or law enforcement agencies, if required by law.',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Data Security',
        items: [
          {
            title: 'Encryption',
            description: 'All electronic records are encrypted during storage and transmission.',
          },
          {
            title: 'Access Control',
            description: 'Access to your data is restricted to authorized Khabiteq staff and approved third parties.',
          },
          {
            title: 'Physical Security',
            description: 'Physical records (if any) are kept in secure, access-controlled facilities.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Consent',
        items: [
          {
            title: 'Data Collection Consent',
            description: 'By signing this document, you consent to: The collection, use, and storage of your personal and financial data for the purposes outlined above.',
          },
          {
            title: 'Contact Consent',
            description: 'Khabiteq contacting you by phone, email, or SMS regarding your account, payments, and services.',
          },
          {
            title: 'Sharing Consent',
            description: 'Khabiteq sharing your data with trusted partners solely for payment processing, KYC, or regulatory compliance.',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'Withdrawal of Consent',
        items: [
          {
            title: 'Withdrawal Process',
            description: 'You may withdraw your consent at any time by sending a written request to privacy@khabiteqrealty.com.',
          },
          {
            title: 'Service Impact',
            description: 'Withdrawal of consent may limit or prevent you from continuing as an agent on the platform, as certain data (e.g., NIN, bank details) is mandatory for compliance.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Data Retention',
        items: [
          {
            title: 'Retention Period',
            description: 'Your personal data will be retained for up to five (5) years after account closure, or longer if required by law.',
          },
          {
            title: 'Disposal',
            description: 'After the retention period, your data will be securely deleted or anonymized.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Your Rights',
        items: [
          {
            title: 'Access',
            description: 'Access your personal data.',
          },
          {
            title: 'Correction',
            description: 'Request corrections or updates to inaccurate information.',
          },
          {
            title: 'Deletion',
            description: 'Request deletion of your data (subject to legal requirements).',
          },
          {
            title: 'Portability',
            description: 'Request a copy of your data in a machine-readable format.',
          },
        ],
      },
    ],
  },
  {
    id: 'data-protection',
    name: 'Data Protection & Privacy Policy',
    shortName: 'Privacy',
    icon: <Shield className='w-4 h-4' />,
    description: 'Comprehensive policy outlining how Khabiteq prioritizes privacy and security of all personal data across all platform interactions.',
    content: [
      {
        sectionNumber: '1',
        title: 'Personal Data Collection',
        items: [
          {
            title: 'Contact Information',
            description: 'Names, email addresses, phone numbers.',
          },
          {
            title: 'Property Information',
            description: 'Search preferences (location, type, budget), property details, agreements, and payment information.',
          },
          {
            title: 'Business Information',
            description: 'Certifications and addresses for agents and landlords.',
          },
        ],
      },
      {
        sectionNumber: '2',
        title: 'Data Collection Methods',
        items: [
          {
            title: 'Collection Channels',
            description: 'Through online forms, website interactions, emails, and phone communications.',
          },
          {
            title: 'Onboarding Process',
            description: 'During onboarding processes for agents and clients.',
          },
        ],
      },
      {
        sectionNumber: '3',
        title: 'Data Storage and Security',
        items: [
          {
            title: 'Digital Storage',
            description: 'Personal data is encrypted during storage and transit.',
          },
          {
            title: 'Physical Records',
            description: 'Hard copies, if any, are stored in secure, restricted-access locations.',
          },
          {
            title: 'Backups',
            description: 'Regular backups are performed to safeguard against data loss.',
          },
          {
            title: 'System Security',
            description: 'Continuous updates and security patches are applied to protect against vulnerabilities.',
          },
        ],
      },
      {
        sectionNumber: '4',
        title: 'Data Access',
        items: [
          {
            title: 'Access Restriction',
            description: 'Access is restricted to authorized personnel based on their roles.',
          },
          {
            title: 'Third-Party Access',
            description: 'Third-party providers, such as payment processors, are given access only when necessary and under strict confidentiality agreements.',
          },
          {
            title: 'Monitoring',
            description: 'All access is monitored to ensure compliance with data protection protocols.',
          },
        ],
      },
      {
        sectionNumber: '5',
        title: 'Data Usage',
        items: [
          {
            title: 'Permitted Uses',
            description: 'Data is utilized solely for:',
            details: [
              'Providing services, such as property matching, rent collection, and transaction facilitation',
              'Communicating updates related to listings, inspections, or transactions',
              'Marketing, but only with explicit consent from data owners'
            ],
          },
          {
            title: 'Prohibited Uses',
            description: 'Data is never sold or shared with unauthorized third parties.',
          },
        ],
      },
      {
        sectionNumber: '6',
        title: 'Data Sharing',
        items: [
          {
            title: 'Trusted Partners',
            description: 'Data is shared only with trusted third parties under confidentiality agreements (e.g., payment processors or legal service providers).',
          },
          {
            title: 'Anonymization',
            description: 'When possible, data is anonymized before sharing to safeguard privacy.',
          },
        ],
      },
      {
        sectionNumber: '7',
        title: 'Data Retention and Disposal',
        items: [
          {
            title: 'Retention Period',
            description: 'Personal and transactional data is kept for up to five years or as required by law.',
          },
          {
            title: 'Digital Disposal',
            description: 'Digital data is deleted using certified data-wiping software and Physical records are securely shredded before disposal.',
          },
        ],
      },
      {
        sectionNumber: '8',
        title: 'Breach Management',
        items: [
          {
            title: 'Notification',
            description: 'All affected parties will be notified within 72 hours.',
          },
          {
            title: 'Authority Notification',
            description: 'Authorities will be informed as required by law.',
          },
          {
            title: 'Internal Review',
            description: 'An internal review will be conducted, and measures will be implemented to prevent future breaches.',
          },
        ],
      },
      {
        sectionNumber: '9',
        title: 'Data Owner Rights',
        items: [
          {
            title: 'Access Right',
            description: 'Request access to their personal data.',
          },
          {
            title: 'Correction Right',
            description: 'Request corrections or updates to inaccurate data.',
          },
          {
            title: 'Erasure Right',
            description: 'Request the deletion of personal data, subject to legal or contractual obligations.',
          },
          {
            title: 'Restriction Right',
            description: 'Restrict how their data is processed.',
          },
          {
            title: 'Objection Right',
            description: 'Object to specific types of data processing.',
          },
          {
            title: 'Portability Right',
            description: 'Request a copy of their data in a machine-readable format.',
          },
        ],
      },
      {
        sectionNumber: '10',
        title: 'Monitoring and Compliance',
        items: [
          {
            title: 'Regular Audits',
            description: 'Regular audits ensure adherence to this policy and compliance with data protection regulations.',
          },
          {
            title: 'Non-Compliance Actions',
            description: 'Non-compliance by employees or third-party providers will result in corrective actions, including termination of agreements if necessary.',
          },
        ],
      },
      {
        sectionNumber: '11',
        title: 'Policy Updates',
        items: [
          {
            title: 'Regular Review',
            description: 'This policy is reviewed regularly to reflect changes in regulations or company practices.',
          },
          {
            title: 'Notification',
            description: 'Updates will be posted on our website and will take effect immediately.',
          },
        ],
      },
    ],
  },
];

export default Policies;
