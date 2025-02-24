/** @format */
'use client';
import Button from '@/components/button';
import Loading from '@/components/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React, { useState } from 'react';

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
      <div className='container flex flex-col h-[600px] gap-[30px] my-[60px] px-[20px]'>
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
      </div>
    </section>
  );
};

const buttons: string[] = [
  'Client Engagement policy',
  'Agent Engagement policy',
  'Data Protection policy',
];

export default Policies;
