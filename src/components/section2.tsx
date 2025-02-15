/** @format */

'use client';
import React, { useRef, useState } from 'react';
import Button from '@/components/button';
// import HouseFrame from './house-frame';
// import houseImage from '@/assets/assets.png';
import Image from 'next/image';
import arrowIcon from '@/svgs/arrowIcon.svg';
import { useVisibility } from '@/hooks/useVisibility';
import Card from './card';
import { motion, useInView } from 'framer-motion';
import { cardDataArray } from '@/data';
//import { usePageContext } from '@/context/page-context';
import imgSample from '@/assets/assets.png';

const Section2 = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
  });
  //const { setImageData} = usePageContext()

  const buttonsRef = useRef<HTMLDivElement>(null);
  const housesRef = useRef<HTMLDivElement>(null);

  const areButtonsVisible = useVisibility(buttonsRef);
  const areHousesVisible = useInView(housesRef, { once: false });

  return (
    <section className='flex justify-center items-center bg-[#8DDB901A] pb-[30px]'>
      <div className='container min-h-[700px] flex flex-col justify-center items-center gap-[20px] px-[20px] overflow-hidden'>
        <div className='min-h-[128px] w-full lg:w-[870px] flex flex-col justify-center items-center gap-[9px] pt-[40px]'>
          <h2 className='text-[24px] leading-[28.13px] lg:text-[36px] lg:leading-[57.6px] md:leading-[32px] text-[#09391C] text-center font-semibold'>
            See What Other Buyers Are Exploring
          </h2>
          <p className='text-[#5A5D63] text-[18px] leading-[28.8px] tracking-[5%] font-normal text-center'>
            Your trusted partner in Lagos&apos; real estate market. Since 2020,
            we&apos;ve been delivering expert solutions with integrity and
            personalized service, helping you navigate property sales, rentals,
            and more. Let us help you find your perfect property today
          </p>
        </div>

        <div
          ref={buttonsRef}
          className={`w-[344px] md:min-w-[466px] min-h-[38px] py-[10px] gap-[15px] flex ${
            areButtonsVisible && 'slide-from-top'
          }`}>
          <Button
            value='Property insight'
            green={buttons.button1}
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
              });
            }}
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
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
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
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
            className={`border-[1px] py-[12px] md:px-[24px] px-[15px] text-[12px] md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button3 ? '' : 'text-[#5A5D63] '
            }`}
          />
        </div>
        <motion.div
          ref={housesRef}
          initial={{ opacity: 0, x: 20 }}
          animate={areHousesVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={`lg:w-[1154px] w-full min-h-[446px] grid lg:grid-cols-4 lg:gap-[83px] grid-cols-1 md:grid-cols-2 gap-[24px]`}>
          {cardDataArray.map((item, idx: number) => {
            if (idx <= 3) {
              return (
                <Card
                  images={Array(19).fill(imgSample)}
                  cardData={item}
                  key={idx}
                />
              );
            }
          })}
        </motion.div>
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
