/** @format */
'use client';
import Button from '@/components/button';
import Loading from '@/components/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React, { Fragment, useState } from 'react';
import { motion } from 'framer-motion';

const Policies = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const isLoading = useLoading();
  const [policiesButton, setPoliciesButton] = useState({
    clientEngagementPolicyButton: false,
    agentEngagementPolicyButton: false,
    dataProductionPolicyButton: false,
  });

  if (isLoading) return <Loading />;
  return (
    <section
      className={`min-h-[600px] bg-[#EEF1F1] w-full flex justify-center ${
        (isContactUsClicked || isModalOpened) && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex flex-col gap-[30px] my-[60px] px-[20px]'>
        <h2 className='text-[#09391C] lg:text-[40px] lg:leading-[64px] font-semibold font-display text-center text-[30px] leading-[41px]'>
          Our&nbsp;
          <span className='text-[#8DDB90] font-display'>Policies</span>
        </h2>
        <div className='w-full flex lg:flex-row flex-col gap-[15px] min-h-[38px] lg:min-w-[623px] justify-center items-center'>
          {buttons.map((item: string, idx: number) => (
            <Button
              onClick={() => {
                if (item === buttons[0]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: true,
                    agentEngagementPolicyButton: false,
                    dataProductionPolicyButton: false,
                  });
                }
                if (item === buttons[1]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: false,
                    agentEngagementPolicyButton: true,
                    dataProductionPolicyButton: false,
                  });
                }
                if (item === buttons[2]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: false,
                    agentEngagementPolicyButton: false,
                    dataProductionPolicyButton: true,
                  });
                }
              }}
              className={`min-h-[38px] lg:w-[217px] w-full border-[1px] py-[12px] px-[24px] border-[#D6DDEB] text-[#5A5D63] text-[14px] font-medium leading-[22.4px] hover:bg-[#8DDB90] hover:text-[#FFFFFF] ${
                item === buttons[0] &&
                policiesButton.clientEngagementPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              } ${
                item === buttons[1] &&
                policiesButton.agentEngagementPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              } ${
                item === buttons[2] &&
                policiesButton.dataProductionPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              }`}
              key={idx}
              value={item}
            />
          ))}
        </div>
        <div className='container border border-black border-dashed'>
          {policiesButton.dataProductionPolicyButton && DataProtectionPolicy()}
        </div>
      </div>
    </section>
  );
};

const buttons: string[] = [
  'Client Engagement policy',
  'Agent Engagement policy',
  'Data Protection policy',
];

const DataProtectionPolicy = () => {
  return (
    <Fragment>
      <div className='container min-h-[800px] flex flex-col gap-[30px] '>
        {/* <div className='min-w-[253px] min-h-[32px] flex items-center gap-[24px]'>
          <Image
            src={arrowRIcon}
            alt=''
            width={1000}
            height={1000}
            onClick={() => {
              route.back();
            }}
            title='Go Back'
            className='w-[24px] h-[24px] cursor-pointer'
          />
          <div className='min-w-[205px] min-h-[32px] flex items-center gap-[8px]'>
            <Link
              href={'/'}
              className='text-[20px] leading-[32px] text-[#25324B] font-normal'>
              Home
            </Link>
            <svg
              width='4'
              height='4'
              viewBox='0 0 4 4'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <circle cx='2' cy='2' r='2' fill='#25324B' />
            </svg>
            <span className='text-[20px] leading-[32px] font-medium text-[#09391C]'>
              Joint Ventures
            </span>
          </div>
        </div> */}
        <div className='w-full min-h-[200px] flex flex-col justify-center items-center gap-[20px]'>
          <motion.h2
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className='text-[40px] leading-[64px] text-center font-semibold text-[#09391C] font-display'>
            <span className='text-[#8DDB90] font-display'>Khabi-Teq</span> Data
            Protection Policy
          </motion.h2>
          <motion.span
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className='text-[20px] leading-[32px] text-center text-[#5A5D63]'>
            At Khabi-Teq, we prioritize the privacy and security of all personal
            data entrusted to us by agents, tenants, landlords, buyers, and
            sellers. This policy explains how we collect, store, use, and
            protect personal data across all interactions.
          </motion.span>
          {/**Buttons */}
          {/* <motion.div
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='flex md:flex-row flex-col gap-[10px]'>
            <Button
              value='Submit Your Interest Now'
              className='min-h-[50px] py-[12px] px-[24px] gap-[10px] text-[#FAFAFA] text-base font-bold leading-[25.6px] text-center'
              green={true}
            />
            <Button
              value='Share Your Property Brief Today'
              className='min-h-[50px] py-[12px] px-[24px] gap-[10px] text-[#FAFAFA] text-base font-bold leading-[25.6px] text-center'
              green={true}
            />
          </motion.div> */}
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='lg:w-[1100px] md:border-[1px] md:border-[#C7CAD0] flex justify-center items-center'>
            <div className='lg:w-[870px] flex flex-col gap-[39px]'>
              {/**What is a Joint Venture (JV)? */}
              <div className='w-full flex flex-col gap-[15px]'>
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className='text-[22px] leading-[25.78px] tracking-[0%] font-bold text-[#09391C]'>
                  Personal Data Collection
                </motion.h2>
                <motion.p
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className='text-[20px] text-[#5A5D63] leading-[37.4px] tracking-[2%] font-normal'>
                  We collect data necessary for delivering real estate services,
                  including:
                </motion.p>
                <motion.ol
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className='list-disc list-inside'>
                  <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                    <span className='text-black font-bold'>
                      Contatct Information:&nbsp;
                    </span>
                    Names, email addresses, phone numbers.
                  </motion.li>
                  <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                    <span className='text-black font-bold'>
                      Property Preferences and Transactions:&nbsp;
                    </span>
                    Search preferences (location, type, budget), property
                    details, agreements, and payment information.
                  </motion.li>
                  <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                    <span className='text-black font-bold'>
                      Business Information:&nbsp;
                    </span>
                    Certifications and addresses for agents and landlords.
                  </motion.li>
                </motion.ol>
              </div>

              {/**  Who Can Participate in a JV? */}
              <div className='w-full flex flex-col gap-[15px]'>
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-[22px] leading-[25.78px] tracking-[0%] font-bold text-[#09391C]'>
                  Who Can Participate in a JV?
                </motion.h2>
                <div className='flex flex-col'>
                  <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='text-[20px] text-[#5A5D63] leading-[37.4px] tracking-[2%] font-normal'>
                    <span className='text-[#000000] font-semibold'>
                      Property Owners:
                    </span>{' '}
                    With undeveloped land or assets looking to maximize value.
                  </motion.p>
                  <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className='text-[20px] text-[#5A5D63] leading-[37.4px] tracking-[2%] font-normal'>
                    <span className='text-[#000000] font-semibold'>
                      Developers:
                    </span>{' '}
                    Seeking verified assets for residential, commercial, or
                    mixed-use projects.
                  </motion.p>
                </div>
              </div>

              {/**Why Joint Ventures Are Beneficial */}
              <div className='w-full flex flex-col gap-[15px]'>
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-[22px] leading-[25.78px] tracking-[0%] font-bold text-[#09391C]'>
                  Why Joint Ventures Are Beneficial
                </motion.h2>
                <div className='flex flex-col'>
                  <div className='flex flex-col'>
                    <motion.h4
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className='text-[20px] leading-[37.4px] tracking-[2%] text-black font-semibold'>
                      For Property Owners:
                    </motion.h4>
                    <motion.ol
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className='list-disc list-inside'>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Maximize property value without upfront investments.
                      </motion.li>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Earn profits through a fair profit-sharing model.
                      </motion.li>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Partner with skilled developers for professional
                        execution.
                      </motion.li>
                    </motion.ol>
                  </div>
                  <div className='flex flex-col'>
                    <motion.h4
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className='text-[20px] leading-[37.4px] tracking-[2%] text-black font-semibold'>
                      For Developers:
                    </motion.h4>
                    <motion.ul
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className='list-disc list-inside'>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Access prime properties for development.
                      </motion.li>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Lower upfront costs by sharing resources.
                      </motion.li>
                      <motion.li className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                        Mitigate risks through collaborative efforts
                      </motion.li>
                    </motion.ul>
                  </div>
                </div>
              </div>

              {/**How it Works */}
              <div className='flex flex-col'>
                <motion.h2 className='text-[24px] leading-[44.88px] tracking-[2%] font-semibold text-[#09391C]'>
                  How It Works
                </motion.h2>
                <motion.ol
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='list-decimal list-inside'>
                  <motion.li className='leading-[37.4px] text-[20px] tracking-[2%]'>
                    <span className='text-black font-semibold text-[20px] leading-[37.4px] tracking-[2%]'>
                      Submit Property Brief:
                    </span>
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Owners provide asset details, including JV availability
                    </span>
                  </motion.li>
                  <motion.li className='leading-[37.4px] text-[20px] tracking-[2%]'>
                    <span className='text-black font-semibold text-[20px] leading-[37.4px] tracking-[2%]'>
                      Developer Matching:
                    </span>
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Khabi-Teq connects owners with suitable developers.
                    </span>
                  </motion.li>
                  <motion.li className='leading-[37.4px] text-[20px] tracking-[2%]'>
                    <span className='text-black font-semibold text-[20px] leading-[37.4px] tracking-[2%]'>
                      Agreement:
                    </span>
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Both parties finalize profit-sharing and project terms.
                    </span>
                  </motion.li>
                  <motion.li className='leading-[37.4px] text-[20px] tracking-[2%]'>
                    <span className='text-black font-semibold text-[20px] leading-[37.4px] tracking-[2%]'>
                      Development:
                    </span>
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      The developer executes the project, with updates provided
                      to the owner.
                    </span>
                  </motion.li>
                  <motion.li className='leading-[37.4px] text-[20px] tracking-[2%]'>
                    <span className='text-black font-semibold text-[20px] leading-[37.4px] tracking-[2%]'>
                      Profit Sharing:
                    </span>
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Upon completion, profits are distributed as agreed.
                    </span>
                  </motion.li>
                </motion.ol>
              </div>

              {/**Why Partner with Khabi-Teq for JVs?*/}
              <div className='flex flex-col'>
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-[24px] leading-[44.88px] tracking-[2%] font-semibold text-[#09391C]'>
                  Why Partner with Khabi-Teq for JVs?
                </motion.h2>

                <motion.ul
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='list-disc list-inside md:pl-[50px]'>
                  <motion.li>
                    <span className='text-[#000000] text-[24px] font-semibold leading-[44.8px] tracking-[2%]'>
                      Seamless Matching:
                    </span>{' '}
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      We connect verified property owners with reliable
                      developers based on goals and project scope.
                    </span>
                  </motion.li>
                  <motion.li>
                    <span className='text-[#000000] text-[24px] font-semibold leading-[44.8px] tracking-[2%]'>
                      Transparency:
                    </span>{' '}
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Our platform ensures clear communication, profit-sharing
                      agreements, and updates throughout the project
                    </span>
                  </motion.li>
                  <motion.li>
                    <span className='text-[#000000] text-[24px] font-semibold leading-[44.8px] tracking-[2%]'>
                      Expert Support:
                    </span>{' '}
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Khabi-Teq handles all the coordination, so you can focus
                      on achieving success.
                    </span>
                  </motion.li>
                  <motion.li>
                    <span className='text-[#000000] text-[24px] font-semibold leading-[44.8px] tracking-[2%]'>
                      Market Insights
                    </span>{' '}
                    <span className='text-[20px] font-normal leading-[37.4px] tracking-[2%] text-[#5A5D63]'>
                      Leverage our local expertise to find high-demand areas for
                      development.
                    </span>
                  </motion.li>
                </motion.ul>
              </div>
              {/**Key Considerations */}
              <div className='flex flex-col gap-[24px]'>
                <motion.h2
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-[#09391C] text-[25px] leading-[29.3px] tracking-[0%] font-semibold'>
                  Key Considerations
                </motion.h2>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='flex flex-col'>
                  <motion.p className='text-[20px] leading-[37.4px] tracking-[2%] '>
                    <span className='text-black font-semibold'>
                      Clear Agreements:
                    </span>{' '}
                    <span className='font-normal text-[#5A5D63]'>
                      Define roles, profit-sharing ratios, and timelines.
                    </span>
                  </motion.p>
                  <motion.p className='text-[20px] leading-[37.4px] tracking-[2%] '>
                    <span className='text-black font-semibold'>
                      Legal Verification:
                    </span>{' '}
                    <span className='font-normal text-[#5A5D63]'>
                      Ensure ownership documents are valid.
                    </span>
                  </motion.p>
                  <motion.p className='text-[20px] leading-[37.4px] tracking-[2%] '>
                    <span className='text-black font-semibold'>
                      Collaboration Commitment:
                    </span>{' '}
                    <span className='font-normal text-[#5A5D63]'>
                      Maintain open communication throughout the project.
                    </span>
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>

          {/** */}
          <div className='min-h-[200px] w-full flex flex-col justify-center items-center mt-6 lg:mt-0'>
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='lg:w-[871px] text-[20px] leading-[26px] text-center tracking-[0%] font-semibold text-[#09391C]'>
              Partner with Khabi-Teq to close deals faster, with transparency
              and unmatched support. Together, we turn opportunities into
              success
            </motion.h2>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className='flex gap-[24px] mt-8 md:flex-row flex-col'>
              <Button
                value='Submit Brief'
                className='min-h-[50px] py-[12px] w-[220.5px] px-[24px] gap-[10px] text-[#FAFAFA] text-base font-bold leading-[25.6px] text-center'
                green={true}
                onClick={() => {}}
              />
              <Button
                value='Submit Prefence'
                className='min-h-[50px] py-[12px] w-[220.5px] px-[24px] gap-[10px] text-[#FAFAFA] text-base font-bold leading-[25.6px] text-center'
                green={true}
                onClick={() => {}}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Policies;
