/* eslint-disable @typescript-eslint/no-unused-vars */
/** @format */

'use client';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ActivitiesScroll from '@/components/admincomponents/activities_scroll';
import { useState } from 'react';
import PendingBriefs from '@/components/admincomponents/incoming_inspections';
import OverdueBriefs from '@/components/admincomponents/incoming_briefs';
import PreferenceAttention from '@/components/admincomponents/preference_requiring_attention';
import { motion } from 'framer-motion';
import filterIcon from '@/svgs/filterIcon.svg';
import Image from 'next/image';
import { manrope } from '@/styles/font';

export default function AttentionOverview() {
  const [active, setActive] = useState('Incoming Inspections');

  const renderDynamicComponent = () => {
    switch (active) {
      case 'Incoming Inspections':
        return <PendingBriefs />;
      case 'Incoming Briefs':
        return <OverdueBriefs />;
      case 'Preference Requiring Attention':
        return <PreferenceAttention />;
      default:
        return <PendingBriefs />;
    }
  };
  return (
    <motion.div
      className='w-full overflow-hidden'
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}>
      {/* <div className='bg-white w-full lg:max-w-[1128px] flex flex-col border rounded-md mt-6 mr-3'>
        <div className='border-b flex md:flex-row flex-col gap-2 justify-between items-start md:items-center px-4 md:px-6 py-2'>
          <h3
            className={`text-[#25324B] text-xl font-semibold lg:text-[20px] ${manrope.className}`}>
            Admins Activities
          </h3>
          <div className='flex gap-4'>
            <div className='flex items-center gap-2 border p-2 rounded-md'>
              <Image
                src={filterIcon}
                alt='filter icon'
                width={24}
                height={24}
                className='w-[24px] h-[24px]'
              />
              <span className='text-[#25324B]'>Filter</span>
            </div>
            <div className='flex lg:w-[205px] items-center justify-center gap-2 border p-2 rounded-md'>
              <p className='text-[#0B423D] md:text-base text-sm'>
                View admin activities
              </p>
            </div>
          </div>
        </div>
        <ActivitiesScroll />
      </div> */}
      <div className='flex flex-col w-full'>
        <div className='flex text-lg w-fit gap-4 md:gap-8 mt-6'>
          {texts.map((item, index) => (
            <TextNotification
              key={index}
              text={item.text}
              onClick={() => setActive(item.text)}
              active={active}
              count={item.count}
            />
          ))}
        </div>
        <div className='w-full'>{active && renderDynamicComponent()}</div>
      </div>
    </motion.div>
  );
}

const TextNotification = ({
  text,
  onClick,
  active,
  count,
}: {
  text: string;
  onClick: () => void;
  active: string;
  count: number;
}) => {
  return (
    <div className='flex'>
      <button
        type='button'
        onClick={onClick}
        className={`relative rounded-sm  ${
          active === text
            ? 'border-b-4 border-[#8DDB90]  text-[#181336] font-semibold'
            : 'text-[#515B6F]'
        }`}>
        {text}
      </button>
      <span className=' text-center w-[26px] h-[26px] z-10 -mt-[10px] bg-[#e51313] text-white rounded-full text-base flex justify-center items-center'>
        {count}
      </span>
    </div>
  );
};

const texts = [
  {
    text: 'Incoming Inspections',
    count: 5,
  },
  {
    text: 'Incoming Briefs',
    count: 25,
  },
  {
    text: 'Preference Requiring Attention',
    count: 2,
  },
];
