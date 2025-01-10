/** @format */

import { cardData } from '@/data';
import React from 'react';
import arrowDown from '@/svgs/arrowDown.svg';
import Image from 'next/image';

const Card = () => {
  return (
    <div className='md:w-[266px] min-h-[446px] border-[1px] py-[21px] px-[19px] gap-[10px]'>
      <div className='flex flex-col gap-[3px]'>
        <BreadCrumb />
        <button
          type='button'
          className='min-h-[42px] border-[1px] py-[10px] px-[20px] bg-[#F3F8FC] flex justify-center items-center text-[14px] leading-[22.4px] text-[#1976D2] tracking-[0.1px]'>
          View Image
        </button>
        <button
          type='button'
          className='min-h-[37px] border-[1px] py-[10px] px-[20px] bg-[#F7F7F8] flex justify-center items-center text-[12px] leading-[19.2px] text-[#5A5D63] tracking-[0.1px] gap-1'>
          <span>View more</span>
          <Image
            src={arrowDown}
            alt=''
            width={16}
            height={16}
            className='w-[16px] h-[16px]'
          />
        </button>
        <button
          type='button'
          className='min-h-[50px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold'>
          Select of Inspection
        </button>
      </div>
    </div>
  );
};

const BreadCrumb = () => {
  return (
    <>
      {cardData.map((item, idx: number) => (
        <div
          key={idx}
          className='min-h-[60px] w-full py-[5px] px-[20px] gap-[6px] flex flex-col bg-[#F7F7F8]'>
          <h2 className='text-[14px] leading-[22.4px] tracking-[0.1px] text-[#707281]'>
            {item.header}
          </h2>
          <span className='font-medium text-[14px] leading-[22.4px] tracking-[0.1px] text-[#0B0D0C]'>
            {item.value}
          </span>
        </div>
      ))}
    </>
  );
};

export default Card;
