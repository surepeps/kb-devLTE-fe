/** @format */

import React, { FC } from 'react';
import icon from '@/svgs/icon.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HighlightUnitProps {
  title: string;
  text: string;
}

const HighlightUnit: FC<HighlightUnitProps> = ({ title, text }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className='py-[15px] cursor-pointer px-[24px] flex-shrink-0 lg:flex-shrink w-[366px] min-h-[176px] lg:min-h-[208px] border-[1px] lg:py-[20px] lg:px-[32px] flex flex-col lg:gap-[16px] gap-[15px] border-[#D6DDEB]'>
      <Image
        src={icon}
        width={42}
        height={35}
        alt=''
        className='w-[42px] h-[35px]'
      />
      <div className='flex flex-col gap-[4px] min-h-[91px]'>
        <h2 className='text-[24px] text-[#09391C] font-semibold leading-[28.8px]'>
          {title}
        </h2>
        <span className='font-normal text-[18px] leading-[28.8px] text-[#5A5D63]'>
          {text}
        </span>
      </div>
    </motion.div>
  );
};

export default HighlightUnit;
