/** @format */

'use client';
import React, { useRef, useState } from 'react';
import Button from '@/components/button';
import HouseFrame from './house-frame';
import houseImage from '@/assets/assets.png';
import Image from 'next/image';
import arrowIcon from '@/svgs/arrowIcon.svg';
import { useVisibility } from '@/utils/useVisibility';

const Section2 = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
  });

  const buttonsRef = useRef<HTMLDivElement>(null);
  const housesRef = useRef<HTMLDivElement>(null);

  const areButtonsVisible = useVisibility(buttonsRef);
  const areHousesVisible = useVisibility(housesRef);

  return (
    <section className='flex justify-center items-center min-h-[1050px]'>
      <div className='container min-h-[1050px] flex flex-col gap-[20px] px-[20px] overflow-hidden'>
        <div
          ref={buttonsRef}
          className={`w-[344px] md:min-w-[466px] min-h-[38px] gap-[15px] flex ${
            areButtonsVisible && 'slide-from-top'
          }`}>
          <Button
            value='Hone for sale'
            green={buttons.button1}
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
              });
            }}
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:w-[168px] ${
              buttons.button1 ? '' : 'text-[#5A5D63]'
            }`}
          />
          <Button
            green={buttons.button2}
            value='Land for sale'
            onClick={() => {
              setButtons({
                button1: false,
                button2: true,
                button3: false,
              });
            }}
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:w-[168px] ${
              buttons.button2 ? '' : 'text-[#5A5D63]'
            }`}
          />
          <Button
            green={buttons.button3}
            value='Rent'
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: true,
              });
            }}
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:w-[168px] ${
              buttons.button3 ? '' : 'text-[#5A5D63] '
            }`}
          />
        </div>
        <div
          ref={housesRef}
          className={`min-h-[729px] w-full lg:grid lg:grid-cols-3 lg:gap-[83px] flex flex-col gap-[24px] px-[20px] md:px-0 ${
            areHousesVisible && 'slide-from-right'
          }`}>
          {Array.from({ length: 6 }).map((__, idx: number) => {
            return (
              <HouseFrame
                key={idx}
                image={houseImage}
                title='Contemporary Bedroom Home'
                location='Ikoyi'
                bedroom={5}
                bathroom={2}
                carPark={3}
              />
            );
          })}
        </div>
        <div className='flex justify-center items-center mt-6'>
          <button
            type='button'
            className='flex justify-center items-center gap-2'>
            <span className='text-base text-[#09391C] leading-[25px] font-semibold'>
              Show more
            </span>{' '}
            <Image
              src={arrowIcon}
              width={12}
              height={15}
              alt=''
              className='w-[12px] h-[15px]'
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section2;
