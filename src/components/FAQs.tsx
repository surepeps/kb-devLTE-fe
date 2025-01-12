/** @format */
'use client';
import React, { useState } from 'react';
import Button from './button';
import { GeneralFAQsData, LandlordFAQsData, TenantsFAQsData } from '@/data';
import Details from './details';

const FAQs = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
  });

  return (
    <section className='flex items-center justify-center md:min-h-[782px] md:py-[60px]'>
      <div className='container min-h-[782px] flex flex-col gap-[20px] lg:gap-[57px] justify-center items-center p-[20px]'>
        <h2 className='lg:text-[42px] text-[24px] leading-[26px] lg:leading-[46px] font-semibold text-center text-[#09391C]'>
          Frequently Asked Question
        </h2>
        <div className='min-h-[38px] lg:w-[529px] md:flex gap-[15px] hidden'>
          <Button
            green={buttons.button1}
            value='General'
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
              });
            }}
            className='min-h-[38px] lg:w-[197px] border-[1px] py-[12px] px-[24px] text-[14px] leading-[22.4px] font-medium border-[#D6DDEB]'
          />
          <Button
            green={buttons.button2}
            value='For Landlord'
            onClick={() => {
              setButtons({
                button1: false,
                button2: true,
                button3: false,
              });
            }}
            className='min-h-[38px] lg:w-[197px] border-[1px] py-[12px] px-[24px] text-[14px] leading-[22.4px] font-medium border-[#D6DDEB]'
          />

          <Button
            green={buttons.button3}
            value='For Tenants'
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: true,
              });
            }}
            className='min-h-[38px] lg:w-[197px] border-[1px] py-[12px] px-[24px] text-[14px] leading-[22.4px] font-medium border-[#D6DDEB]'
          />
        </div>
        <div className='flex flex-col min-h-[584px] gap-[25px] w-full'>
          {/**General */}
          {buttons.button1 &&
            GeneralFAQsData.map(
              (item: { heading: string; text: string }, idx: number) => (
                <Details key={idx} {...item} />
              )
            )}
          {/**For Landlord */}
          {buttons.button2 &&
            LandlordFAQsData.map(
              (item: { heading: string; text: string }, idx: number) => (
                <Details key={idx} {...item} />
              )
            )}
          {/**For Tenants */}
          {buttons.button3 &&
            TenantsFAQsData.map(
              (item: { heading: string; text: string }, idx: number) => (
                <Details key={idx} {...item} />
              )
            )}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
