/** @format */

'use client';
import React from 'react';
import ReviewingApplication from '@/components/applicationUnderReview';
import AgentNav from '@/components/agent-page-components/agent_navbar';

const page = () => {
  return (
    <section
      className={` w-full items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]`}>
      <AgentNav isDisabled={true} />
      <ReviewingApplication />
    </section>
  );
};

export default page;
