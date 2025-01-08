/** @format */

import React, { FC } from 'react';

interface ClientProps {
  name: string;
  text: string;
  title: string;
  starsRated?: number;
}

const CEO: FC<ClientProps> = ({ name, text, title }) => {
  return (
    <div className='lg:w-[1007px] w-full flex md:flex-row flex-col gap-[20px] lg:gap-[60px] md:items-center'>
      <div className='md:w-[306px] w-[100%] h-[268px] bg-[#D9D9D9]'></div>
      <div className='min-h-[157px] w-full lg:w-[562px] flex flex-col gap-[15px]'>
        <h2 className='lg:text-[36px] text-[24px] leading-[26.4px] lg:leading-[39px] text-[#09391C]'>
          {name}
        </h2>
        <h3 className='lg:text-[24px] leading-[26px] font-semibold text-[#5A5D63]'>
          {title}
        </h3>
        <p className='text-[18px] leading-[21px] font-normal flex-wrap text-[#5A5D63]'>
          {text}
        </p>
      </div>
    </div>
  );
};

export default CEO;
