/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import faClose from '@/svgs/cancelIcon.svg';
import { archivo } from '@/styles/font';
import { usePageContext } from '@/context/page-context';

const RejectBriefs = () => {
  const { dashboard, setDashboard } = usePageContext();
  return (
    <section className='w-full h-full fixed top-0 left-0 bg-transparent z-[10] flex justify-center items-center px-[10px]'>
      <motion.div
        initial={{
          y: 90,
          opacity: 0,
        }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className='lg:w-[649px] w-full h-[505px] flex flex-col justify-between bg-transparent gap-[26px]'>
        <div className='w-full flex justify-end items-start'>
          <motion.button
            title='Close modal'
            onClick={() => {
              setDashboard({
                ...dashboard,
                approveBriefsTable: {
                  ...dashboard.approveBriefsTable,
                  isApproveClicked: false,
                  isDeleteClicked: false,
                  isRejectClicked: false,
                },
              });
            }}
            className='w-[51px] h-[51px] flex justify-center items-center rounded-full bg-[#FFFFFF]'
            whileHover={{
              scale: 1.1,
            }}>
            <Image
              src={faClose}
              alt=''
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
            />
          </motion.button>
        </div>
        <div className='min-h-[428px] w-full bg-[#FFFFFF] rounded-[4px] py-[40px] px-[20px] md:px-[80px] flex flex-col justify-center items-center gap-[25px]'>
          <div className='flex flex-col gap-[42px]'>
            <div className='flex flex-col justify-center items-center gap-[4px]'>
              <h2
                className={`text-[#FB7515] text-[28px] leading-[40.4px] font-bold ${archivo.className}`}>
                Reject Brief
              </h2>
              <p
                className={`text-lg text-[#515B6F] ${archivo.className} font-normal text-center`}>
                Lorem ipsum dolor sit amet consectetur. Aliquam scelerisque duis
                mollis ullamcorper ac felis. Commodo duis metus facilisi.
              </p>
            </div>
            {/**Buttons */}
            <div className='h-[129px] w-full flex flex-col gap-[15px]'>
              <button
                type='button'
                className={`h-[57px] border-[1px] border-[#E9EBEB] w-full hover:bg-gray-200 bg-white transition duration-500 rounded-[5px] font-medium text-lg text-[#FB7515] ${archivo.className}`}>
                Reject Brief
              </button>
              <button
                onClick={() => {
                  setDashboard({
                    ...dashboard,
                    approveBriefsTable: {
                      ...dashboard.approveBriefsTable,
                      isApproveClicked: false,
                      isDeleteClicked: false,
                      isRejectClicked: false,
                    },
                  });
                }}
                type='button'
                className={`h-[57px] w-full bg-[#45D884] hover:bg-[#266555] transition duration-500 rounded-[5px] font-bold text-lg text-white ${archivo.className}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RejectBriefs;
