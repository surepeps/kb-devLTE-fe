/** @format */
'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React, { FC } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  heading: string;
  image: StaticImport;
  paragraphs: string[];
  color: string;
  secondaryColor: string;
  buttonText: string;
  link: string;
}

const Card: FC<CardProps> = ({
  heading,
  image,
  paragraphs,
  color,
  secondaryColor,
  buttonText,
  link,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      style={{
        backgroundColor: secondaryColor,
        border: `1px solid ${color}`,
      }}
      className='card w-[356.33px] shrink-0 min-h-[412px] flex flex-col gap-[10px] p-[30px]'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        style={{
          backgroundColor: color,
        }}
        className='w-[53px] h-[53px] rounded-[15px] flex items-center justify-center'>
        <Image
          src={image}
          alt=''
          width={24}
          height={24}
          className='w-[24px] h-[24px]'
        />
      </motion.div>

      <div className='w-full lg:w-[304px] mt-6 min-h-[238px] flex flex-col justify-between gap-[15px]'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className='text-[24px] leading-[28.13px] text-[#1A1D1F] font-bold'>
          {heading}
        </motion.h2>
        <hr className='w-full border-[1px] border-[#CED2D6]' />
        {paragraphs.map((paragraph: string, idx: number) => (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            key={idx}
            className='text-base leading-[25px] tracking-[3%] font-normal text-[#596066]'>
            {paragraph}
          </motion.p>
        ))}
        <button
          style={{
            backgroundColor: color,
          }}
          type='button'
          className='h-[54px] flex items-center justify-center w-full text-base font-bold text-white'>
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};

export default Card;
