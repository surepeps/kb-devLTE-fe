/** @format */
'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; 

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
  const router = useRouter();
  
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
      className='card w-full md:w-[250px] shrink-0 md:h-[412px] flex flex-col gap-[10px] p-[20px] overflow-hidden justify-center'>
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

      <div className='w-full mt-6 flex-1 flex flex-col justify-between gap-[10px] overflow-hidden min-h-0'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className='text-[18px] leading-[28.13px] text-[#1A1D1F] font-bold break-words whitespace-normal overflow-hidden text-ellipsis flex-shrink-0'>
          {heading}
        </motion.h2>
        <hr className='w-full border-[1px] border-[#CED2D6] flex-shrink-0' />
        <div className='flex-1 overflow-hidden min-h-0'>
          {paragraphs.map((paragraph: string, idx: number) => (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              key={idx}
              className='text-base leading-[25px] tracking-[3%] font-normal text-[#596066] break-words whitespace-normal overflow-hidden'>
              {paragraph}
            </motion.p>
          ))}
        </div>
        <button
          style={{
            backgroundColor: color,
          }}
          type='button'
          onClick={() => router.push(link)}
          className='h-[54px] flex items-center justify-center w-[100%] text-base font-bold text-white flex-shrink-0 break-words whitespace-normal mt-2 md:mt-0'>
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};

export default Card;
