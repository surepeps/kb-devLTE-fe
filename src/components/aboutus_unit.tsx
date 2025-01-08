/** @format */

import React, { FC } from 'react';

interface HeadingProps {
  heading: string;
  description: string;
}

const AboutUsUnit: FC<HeadingProps> = ({ heading, description }) => {
  return (
    <div className='flex flex-col gap-[24px] w-full lg:w-[870px] h-[129px]'>
      <h2 className='font-bold lg:text-[35px] lg:leading-[41px] text-[#09391C]'>
        {heading}
      </h2>
      <span className='font-normal text-[20px] leading-[32px] tracking-[5%] text-[#5A5D63]'>
        {description}
      </span>
    </div>
  );
};

export default AboutUsUnit;
