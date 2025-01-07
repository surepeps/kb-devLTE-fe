/** @format */

'use client';
import React from 'react';
import Image from 'next/image';
import homeImage from '@/assets/assets.png';
import lineStyle from '@/svgs/linestyle.svg';
import Button from './button';

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center min-h-[536px] w-full overflow-hidden'>
      <div className='container h-full border border-dashed flex lg:flex-row flex-col px-[20px] slide-from-bottom'>
        <div className='lg:w-[40%] w-full lg:h-[536px] flex flex-col gap-[20px] bg-[#0B423D] flex-grow-1 px-[20px] lg:px-[40px] py-[20px] lg:py-[40px]'>
          <h2 className='lg:text-[60px] font-semibold text-[50px] leading-[55px] lg:leading-[66px] text-[#FFFFFF]'>
            Embrace The Future With{' '}
            <span className='text-[#8DDB90]'>Khabiteq</span>
          </h2>
          <Image
            src={lineStyle}
            width={1000}
            height={1000}
            alt=''
            className='w-[455px] h-[40px]'
          />
          <p className='font-normal text-[20px] lg:leading-[32px] leading-[25px] text-[#FFFFFF]'>
            Tell us what you&apos;re looking for! Submit your property
            preferences below and let us find the perfect match for you
          </p>
          <Button
            green={true}
            className='h-[66px] w-full lg:w-[393px] py-[12px] px-[24px] text-white text-[20px] leading-[32px] font-bold'
            value='Enter Preference'
          />
        </div>
        <Image
          src={homeImage}
          className='lg:w-[60%] w-full h-[294px] lg:h-[536px]'
          alt=''
          width={1000}
          height={1000}
        />
      </div>
    </section>
  );
};

export default HeroSection;
