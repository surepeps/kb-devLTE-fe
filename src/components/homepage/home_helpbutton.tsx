/** @format */

import React from 'react';
import Button from '../general-components/button';

const HelpButton = () => {
  return (
    <section className='w-full flex justify-center items-center py-[40px]'>
      <div className='container flex flex-col gap-[20px]'>
        <h2 className='text-[25px] leading-[29.3px] text-center font-bold text-[#09391C]'>
          Get started with Khabi-Teq today
        </h2>
        <div className='flex justify-center items-center md:flex-row flex-col gap-[15px] md:gap-[28px] flex-wrap'>
          <Button
            type='button'
            onClick={() => {
              window.location.href = '/buy_page';
            }}
            value={`Submit Your Preference`}
            className='h-[50px] font-bold text-[#FFFFFF] text-base w-[249px] md:min-w-[249px] py-[12px] md:px-[24px] bg-[#8DDB90] leading-[25.6px]'
          />
          <Button
            type='button'
            onClick={() => {
              window.location.href = '/sell_page';
            }}
            value={`Submit Your Brief`}
            className='h-[50px] font-bold text-[#FFFFFF] text-base w-[249px] md:min-w-[249px] py-[12px] md:px-[24px] bg-[#8DDB90] leading-[25.6px]'
          />
          <Button
            type='button'
            onClick={() => {
              window.location.href = '/joint_ventures';
            }}
            value={`Learn More About Joint Ventures`}
            className='h-[50px] font-bold text-[#09391C] text-base w-[249px] md:w-[328px] py-[12px] md:px-[24px] bg-[#EEF1F1] leading-[25.6px] border border-[#C7CAD0]'
          />
        </div>
      </div>
    </section>
  );
};

export default HelpButton;
