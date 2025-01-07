/** @format */

import Image, { StaticImageData } from 'next/image';
import React, { FC } from 'react';
import locationIcon from '@/svgs/location.svg';

interface HouseFrameProps {
  image: StaticImageData;
  title: string;
  location: string;
  bedroom: number;
  bathroom: number;
  carPark: number;
}

const HouseFrame: FC<HouseFrameProps> = ({
  image,
  title,
  location,
  bedroom,
  bathroom,
  carPark,
}) => {
  return (
    <div className='lg:w-[343px] min-h-[342px] flex flex-col gap-[11px]'>
      <Image
        src={image}
        width={1000}
        height={1000}
        alt=''
        className='lg:w-[343px] h-[222px]'
      />
      <div className='flex flex-col min-h-[109px] gap-[7px]'>
        <h2 className='lg:text-[18px] leading-[29px] font-medium text-[#000000]'>
          {title}
        </h2>
        <span className='flex gap-1 items-center'>
          <Image
            src={locationIcon}
            width={20}
            height={20}
            className='w-[16px] h-[16px]'
            alt=''
          />
          <span>{location}</span>
        </span>
        <div className='min-h-[44px] flex gap-[17px]'>
          <div className='flex flex-col border-r-[1px] pr-[10px] border-[#C7CAD0]'>
            <span className='text-[14px] leading-[22px]'>Bedroom</span>
            <span className='text-[14px] leading-[22px]'>{bedroom}</span>
          </div>
          <div className='flex flex-col border-r-[1px] pr-[10px] border-[#C7CAD0]'>
            <span className='text-[14px] leading-[22px]'>Bathroom</span>
            <span className='text-[14px] leading-[22px]'>{bathroom}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-[14px] leading-[22px]'>Car Park</span>
            <span className='text-[14px] leading-[22px]'>{carPark}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseFrame;
