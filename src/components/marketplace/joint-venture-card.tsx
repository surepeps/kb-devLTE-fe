/** @format */
'use client';
import Image from 'next/image';
import React from 'react';
import imageSample from '@/assets/assets.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
import markerIcon from '@/svgs/marker.svg';
import Button from '../general-components/button';

interface CardDataProps {
  isRed?: boolean;
  onClick?: () => void;
  className?: string;
  isPremium?: boolean;
  style?: React.CSSProperties;
  isDisabled?: boolean;
}

const JointVentureModalCard = ({
  isRed,
  onClick,
  className,
  style,
  isDisabled,
}: CardDataProps) => {
  return (
    <div className='md:w-[261px] w-full h-[287px] p-[12px] flex flex-col gap-[11px] bg-[#FFFFFF]'>
      <div className='min-h-[62px] w-full flex gap-[10px] items-end'>
        <Image
          src={imageSample}
          width={61}
          height={62}
          className='w-[61px] h-[62px] object-cover'
          alt=''
        />
        <h3 className='font-semibold text-[#000000] text-lg'>
          N {Number(300000000).toLocaleString()}
        </h3>
        {/**Premium */}
        <div className='w-[98px] absolute mb-[35px] ml-[151px] h-[28px] py-[8px] px-[6px] text-white flex justify-between items-center bg-[#FF3D00]'>
          <span>Premium</span>
          <FontAwesomeIcon icon={faStarOfDavid} size='sm' />
        </div>
      </div>
      <div className='h-[81px] w-full flex flex-col gap-[5px]'>
        <div className='flex gap-[5px] items-center'>
          <Image
            src={markerIcon}
            alt='marker'
            width={16}
            height={16}
            className='w-[16px] h-[16px]'
          />
          <span className='text-xs text-[#000000]'>GRA, Ikeja, Lagos.</span>
        </div>
        <div className='flex flex-wrap gap-[5px] min-h-[57px]'>
          {/**Land sqft */}
          <div className='bg-[#E4EFE7] px-[7px] h-[26px] w-[50%] text-xs text-[#000000] flex items-center'>
            4000 sqft
          </div>
          <div className='bg-[#09391C] px-[7px] h-[26px] text-xs flex items-center text-white'>
            Joint venture (JV)
          </div>
          <div className='bg-[#E4EFE7] px-[7px] text-xs text-[#000000] h-[26px] flex items-center min-w-fit'>
            deed of assignment
          </div>
          <div className='bg-[#E4EFE7] px-[7px] text-xs text-[#000000] h-[26px] w-[45%] flex items-center'>
            Fence
          </div>
        </div>
      </div>
      <hr />
      <div className='flex flex-col gap-[10px]'>
        <Button
          value={`Submit LOI`}
          type='button'
          // green={isRed ? false : true}
          //red={isRed}
          //onClick={onClick}
          className='min-h-[38px] px-[24px] bg-[#1976D2] text-[#FFFFFF] text-base leading-[25.6px] font-bold'
        />
        <Button
          value={`Select for Inspection`}
          type='button'
          //green={isRed ? false : true}
          //red={isRed}
          onClick={onClick}
          isDisabled={isDisabled} // Disable the button if the property is already selected
          className={`min-h-[50px] py-[12px] px-[24px] ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#8DDB90] hover:bg-[#76c77a]'
          } text-[#FFFFFF] text-base leading-[25.6px] font-bold`}
        />
      </div>
    </div>
  );
};

export default JointVentureModalCard;
