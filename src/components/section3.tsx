/** @format */

import { HighlightData } from '@/data';
import React from 'react';
import HighlightUnit from './hightlight-unit';

const Section3 = () => {
  return (
    <section className='flex md:min-h-[614px] items-center justify-center py-[40px] md:py-0'>
      <div className='container md:h-[614px] flex flex-col gap-[20px] md:gap-0 justify-between items-center px-[20px]'>
        <h2 className='text-[#09391C] text-[24px] text-center lg:text-[42px] leading-[26.4px] lg:leading-[46px] font-semibold'>
          Highlight of Our Real Estate Expertise
        </h2>
        <div className='md:min-h-[469px] w-full gap-[30px] overflow-x-auto lg:overflow-x-visible lg:grid lg:grid-cols-3 lg:gap-[47px] flex'>
          {HighlightData.map(
            (item: { title: string; text: string }, idx: number) => (
              <HighlightUnit key={idx} {...item} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Section3;
