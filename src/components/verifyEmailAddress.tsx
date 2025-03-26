/** @format */

'use client';
import Image from 'next/image';
import React from 'react';
import emailIcon from '@/svgs/emaiIcon.svg';

const VerifyEmail = () => {
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='container min-h-[400px] flex flex-col justify-center items-center gap-[20px]'>
        <div className='lg:w-[654px] flex flex-col justify-center items-center gap-[20px] w-full px-[20px]'>
          <div className='w-[81px] h-[81px] rounded-full bg-[#8DDB90] flex items-center justify-center'>
            <Image
              src={emailIcon}
              width={40}
              height={40}
              alt=''
              className='w-[40px] h-[40px]'
            />
          </div>
          <div className='flex flex-col justify-center items-center gap-[4px]'>
            <h2 className='font-display text-center text-xl md:text-2xl text-[#09391C]'>
              Verify your email address
            </h2>
            <p className='text-base md:text-[20px] text-center text-[#5A5D63] leading-[160%] tracking-[5%]'>
              Please verify your email address by clicking the link sent to your
              inbox to complete your onboarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
