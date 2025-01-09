/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import React, { useState } from 'react';
import arrowRightIcon from '@/svgs/arrowR.svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePageContext } from '@/context/page-context';
import { motion } from 'framer-motion';
import arrow from '@/svgs/arrowRight.svg';
import HouseFrame from '@/components/house-frame';
import houseImage from '@/assets/assets.png';

const Buy = () => {
  const [point, setPoint] = useState<string>('Details');
  const { isContactUsClicked } = usePageContext();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handlePreviousSlide = () => {
    const scrollableElement = document.getElementById(
      'scrollableElement'
    ) as HTMLElement;

    if (scrollableElement) {
      const maxScrollPosition =
        scrollableElement.scrollWidth - scrollableElement.clientWidth;
      const increment = 500; // The amount to scroll each time (in pixels)

      // Calculate the next scroll position
      const newScrollPosition = Math.min(
        scrollPosition - increment,
        maxScrollPosition
      );

      // Scroll the element
      scrollableElement.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });

      // Update the state with the new scroll position
      setScrollPosition(newScrollPosition);
    }
  };

  const handleNextSlide = () => {
    const scrollableElement = document.getElementById(
      'scrollableElement'
    ) as HTMLElement;

    if (scrollableElement) {
      const maxScrollPosition =
        scrollableElement.scrollWidth - scrollableElement.clientWidth;
      const increment = 500; // The amount to scroll each time (in pixels)

      // Calculate the next scroll position
      const newScrollPosition = Math.min(
        scrollPosition + increment,
        maxScrollPosition
      );

      // Scroll the element
      scrollableElement.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });

      // Update the state with the new scroll position
      setScrollPosition(newScrollPosition);
    }
  };

  return (
    <section
      className={`min-h-[1000px] flex justify-center w-full bg-white ${
        isContactUsClicked &&
        'filter brightness-[30%] transition-all duration-500 overflow-hidden'
      }`}>
      <div className='flex flex-col items-center gap-[20px] w-full'>
        <div className='min-h-[90px] container w-full flex items-center lg:px-[40px]'>
          <div className='flex gap-1 items-center'>
            <Image
              alt=''
              src={arrowRightIcon}
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
            />
            <div className='flex gap-2 items-center align-middle'>
              <Link
                href={'/'}
                className='text-[20px] leading-[32px] text-[#25324B] font-normal'>
                Home
              </Link>
              <h3 className='text-[20px] leading-[32px] text-[#25324B] font-semibold'>
                .&nbsp;{point}
              </h3>
            </div>
          </div>
        </div>

        <div
          id='scrollableElement'
          className='w-full hide-scrollbar gap-[30px] overflow-x-auto flex mt-0 md:mt-10 lg:mt-0'>
          {Array.from({ length: 18 }).map((__, idx: number) => (
            <div
              key={idx}
              className='w-[424px] h-[324px] bg-[#D9D9D9] flex-shrink-0'>
              {/* {idx} */}
            </div>
          ))}
        </div>
        <div className='flex gap-[18px]'>
          {/**Previous */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousSlide}
            className='w-[54px] h-[54px] cursor-pointer flex justify-center items-center border-[#5A5D6380] border-[1px]'>
            <Image
              src={arrow}
              width={25}
              height={25}
              alt=''
              className='w-[25px] h-[25px] transform rotate-180'
            />
          </motion.div>
          {/**Next */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextSlide}
            className='w-[54px] h-[54px] cursor-pointer flex justify-center items-center border-[#5A5D6380] border-[1px]'>
            <Image
              src={arrow}
              width={25}
              height={25}
              alt=''
              className='w-[25px] h-[25px]'
            />
          </motion.div>
        </div>

        {/**Next Section */}
        <div className='container px-[40px] border-2 border-dashed min-h-[1400px] flex gap-[40px] py-[20px]'>
          <div className='w-[70%] h-full border-2 border-dashed flex flex-col gap-[20px]'></div>
          <div className='w-[30%] h-full flex flex-col gap-[10px]'>
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
        </div>
      </div>
    </section>
  );
};

export default Buy;

/**
 *
 */
