/** @format */
'use client';
import React, { FC, useRef, useState } from 'react';
import '@/styles/newsection.css';
import arrowIcon from '@/svgs/curvedArrow.svg';
import reverseArrowIcon from '@/svgs/reverseArrow.svg';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import icon from '@/svgs/icon.svg';
import arrowRight from '@/svgs/arrowRight.svg';

const NewSection = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const isInView = useInView(ref, { once: false });
  const isInView2 = useInView(ref2, { once: false });
  const isInView3 = useInView(ref3, { once: false });
  return (
    <section className='w-full flex items-center justify-center pt-[70px]'>
      <div className='container w-full flex lg:flex-row flex-col min-h-[528px] gap-[64px] lg:pl-[20px] lg:pr-0 px-[20px]'>
        <div className='lg:w-[483px] min-h-[496px] flex flex-col gap-[31px]'>
          <h2 className='leading-[41.02px] text-[35px] text-[#09391C] font-bold'>
            How Khabi-Teq Works for You
          </h2>
          <div className='w-full flex flex-col gap-[25px]'>
            {data.map((item: ContainerProps, idx: number) => (
              <Container key={idx} {...item} />
            ))}
          </div>
        </div>
        <div className='lg:w-[773px] w-full min-h-[528px] bg-[#8DDB90] px-[20px] lg:px-0 flex flex-col gap-[20px] lg:gap-0 items-center justify-center overflow-hidden'>
          {/**first card and arrow */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className='flex z-10 items-center'>
            <Card
              heading='Submit Your Preference'
              desc='Share details like location, budget, and desired feature'
              backgroundColor='#F2FCF3'
              headingColor='#000000'
              descColor='#596066'
            />
            <Image
              src={arrowIcon}
              width={129}
              height={103}
              alt=''
              className='w-[129px] h-[103px] mt-[90px]'
            />
          </motion.div>
          {/**second card and arrow */}
          <motion.div
            ref={ref2}
            initial={{ opacity: 0, x: -80 }}
            animate={isInView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className='flex flex-row-reverse z-10 items-center lg:ml-[200px] -mt-[45px]'>
            <Card
              heading='Match with Properties'
              desc='Our platform finds options that meet your criteria'
              backgroundColor='#073563'
              headingColor='#8DDB90'
              descColor='#FFFFFF'
            />
            <Image
              src={reverseArrowIcon}
              width={129}
              height={103}
              alt=''
              className='w-[129px] h-[103px] mt-[90px]'
            />
          </motion.div>
          {/**simply card */}
          <motion.div
            ref={ref3}
            initial={{ opacity: 0, x: 80 }}
            animate={isInView3 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className='flex flex-row-reverse z-10 items-center lg:-ml-[100px]'>
            <Card
              heading='Inspect and Decide'
              desc='Our platform finds options that meet your criteria'
              backgroundColor='#09391C'
              headingColor='#8DDB90'
              descColor='#FFFFFF'
            />
          </motion.div>
          {/**Logo */}
          <div className='newsec-image absolute lg:w-[583px] lg:h-[500px] w-full lg:ml-[140px] lg:mt-[30px]'></div>
        </div>
      </div>
    </section>
  );
};
/**
 * width: 583px;
  height: 500px;
  margin-left: 140px;
  margin-top: 30px;
 */

interface CardProps {
  heading: string;
  headingColor: string;
  desc: string;
  descColor: string;
  backgroundColor: string;
}

const Card: FC<CardProps> = ({
  heading,
  headingColor,
  desc,
  descColor,
  backgroundColor,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ backgroundColor: backgroundColor }}
      className='lg:w-[314px] min-h-[101px] cursor-pointer flex flex-col gap-[10px] p-[15px] shadow-lg shadow-[#00000040]'>
      <h2
        style={{ color: headingColor }}
        className='text-[20px] leading-[23.44px] font-semibold'>
        {heading}
      </h2>
      <p
        style={{ color: descColor }}
        className='text-base leading-[18.75px] font-normal'>
        {desc}
      </p>
    </motion.div>
  );
};

type ContainerProps = {
  heading: string;
  text: string;
  buttons: { value: string; url: string }[];
};

const Container: FC<ContainerProps> = ({ heading, text, buttons }) => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  return (
    <div
      // onMouseOut={() => {
      //   setIsModalOpened(false);
      // }}
      // onMouseOver={() => {
      //   setIsModalOpened(true);
      // }}
      className={`w-full min-h-[85px] border-[1px] ${
        isModalOpened ? 'border-[#8DDB90]' : 'border-[#C7CAD0]'
      } bg-[#EEF1F1] p-[20px] flex flex-col gap-[20px] items-center justify-center`}>
      <div className='w-full min-h-[24px] flex items-center justify-between'>
        <div className='flex gap-[24px] items-center'>
          <Image
            src={icon}
            width={29}
            height={24}
            className='w-[29px] h-[24px]'
            alt=''
          />
          <h2 className='text-[20px] leading-[24.2px] font-semibold text-[#09391C]'>
            {heading}
          </h2>
        </div>
        <Image
          src={arrowRight}
          alt=''
          width={24}
          height={24}
          onClick={() => {
            setIsModalOpened(!isModalOpened);
          }}
          className={`w-[24px] h-[24px] cursor-pointer ${
            isModalOpened ? 'transform rotate-90' : 'transform rotate-0'
          } transition-all duration-500`}
        />
      </div>
      <motion.div
        initial={{ visibility: 'hidden', height: 0 }}
        animate={
          isModalOpened
            ? { visibility: 'visible', minHeight: '100px' }
            : { visibility: 'hidden', height: 0 }
        }
        transition={{ delay: 0.3 }}
        className='w-full px-[30px] flex flex-col gap-[5px]'>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isModalOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.2 }}
          className='text-[14px] leading-[24px] tracking-[-2%] text-[#596066] font-normal'>
          {text}
        </motion.p>
        <div className='w-full flex gap-4'>
          {buttons.map((item: { url: string; value: string }, idx: number) => (
            <UniformButton key={idx} {...item} isModalOpened={isModalOpened} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

interface UniformButtonprops {
  isModalOpened: boolean;
  value: string;
  url: string;
}

const UniformButton = ({ isModalOpened, value, url }: UniformButtonprops) => {
  return (
    <motion.button
      onClick={() => {
        window.open(url, '_blank');
      }}
      initial={{ opacity: 0 }}
      animate={isModalOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: 0.3 }}
      className='min-h-[38px] border-[1px] py-[12px] px-[24px] border-[#09391C] min-w-[141px] text-[14px] text-[#09391C] leading-[22.4px] text-center font-medium'>
      {value}
    </motion.button>
  );
};

const data: ContainerProps[] = [
  {
    heading: 'For Buyers and Tenants',
    text: `Tell us what you're looking for! Submit your preferences below and let us find the perfect match for you`,
    buttons: [
      {
        value: 'Buyer Preference',
        url: '#',
      },
      {
        value: 'Tenant Preference',
        url: '#',
      },
    ],
  },
  {
    heading: 'For Sellers and Landlords',
    text: `Tell us what you're looking for! Submit your preferences below and let us find the perfect match for you`,
    buttons: [
      {
        value: 'Buyer Preference',
        url: '#',
      },
      {
        value: 'Tenant Preference',
        url: '#',
      },
    ],
  },
  {
    heading: 'For Developers Seeking JV',
    text: `Tell us what you're looking for! Submit your preferences below and let us find the perfect match for you`,
    buttons: [
      {
        value: 'Buyer Preference',
        url: '#',
      },
      {
        value: 'Tenant Preference',
        url: '#',
      },
    ],
  },
];

export default NewSection;
