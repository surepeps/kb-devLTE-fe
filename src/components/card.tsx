/** @format */

import { cardData } from '@/data';
import React from 'react';

const Card = () => {
  return (
    <div className='w-[266px] min-h-[446px] border-[1px] py-[21px] px-[19px] gap-[10px]'>
      <div className='flex flex-col gap-[20px]'>
        <BreadCrumb />
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
