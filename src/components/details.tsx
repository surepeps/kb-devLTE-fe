/** @format */

import React, { FC, useState } from 'react';
import arrowRight from '@/svgs/arrowRight.svg';
import Image from 'next/image';

interface DetailsProps {
  heading: string;
  text: string;
}

const Details: FC<DetailsProps> = ({ heading, text }) => {
  const [isViewed, setIsViewed] = useState<boolean>(false);
  return (
    <div
      className={`py-[24px] px-[55px] flex flex-col gap-[21px] overflow-hidden bg-[#E4EFE7] transition-all duration-500`}>
      <div className='flex justify-between'>
        <h3 className='lg:text-[24px] lg:leading-[26.4px] text-[#000000] font-semibold'>
          {heading}
        </h3>
        <Image
          src={arrowRight}
          width={25}
          height={25}
          alt=''
          onClick={() => {
            setIsViewed(!isViewed);
          }}
          className={`w-[25px] h-[25px] transition-all duration-500 ${
            isViewed ? 'transform rotate-90' : 'transform rotate-270'
          }`}
        />
      </div>
      <div
        className={`transition-all duration-500 ${
          isViewed ? 'visible slide-from-bottom' : 'slide-out hidden'
        } text-[21px] leading-[28px] text-[#5A5D63]`}>
        {text}
      </div>
    </div>
  );
};

export default Details;
