/** @format */
'use client';
import React from 'react';
import Counts from './counts';
import { motion } from 'framer-motion';
/**
 *
 * @returns Join our trusted network of agents and access exclusive property listings, connect with verified buyers and sellers, and grow your real estate business seamlessly
 */

const Section1 = () => {
  return (
    <section className='flex items-center justify-center pb-10'>
      <div className='container flex flex-col gap-[20px] items-center justify-center px-[10px] md:px-[20px] overflow-hidden'>
        <div className='md:px-[10px] mt-4 w-full flex flex-col gap-[24px] justify-center items-center '>
          <motion.span
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={`font-normal lg:text-[18px] text-base leading-[25px] lg:leading-[28px] text-[#5A5D63] tracking-[5%] text-center`}>
            Your trusted partner in Lagos&apos; real estate market. Since 2020,
            we&apos;ve been delivering expert solutions with integrity and
            personalized service, helping you navigate property sales, rentals,
            and more. Let us help you find your perfect property today
          </motion.span>
        </div>
        {
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={`min-h-[49px] py-2 lg:h-[72px] w-full md:px-0 lg:w-[518px] flex  items-center justify-center`}>
            <Counts />
          </motion.div>
        }
      </div>
    </section>
  );
};

export default Section1;
