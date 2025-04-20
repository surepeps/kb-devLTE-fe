/** @format */

'use client';
import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import faClose from '@/svgs/cancelIcon.svg';
import { archivo } from '@/styles/font';

interface DeleteBriefsProps {
  brief: any;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isAgentApproval?: boolean;
}

const DeleteBriefs: FC<DeleteBriefsProps> = ({ brief, onConfirm, onCancel, isAgentApproval }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (isAgentApproval && !reason.trim()) {
      alert('Please provide a reason for deleting the agent.');
      return;
    }
    onConfirm(reason);
  };

  return (
    <section className='w-full h-full fixed top-0 left-0 bg-transparent z-[10] flex justify-center items-center px-[10px]'>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='lg:w-[649px] w-full min-h-[505px] flex flex-col justify-between bg-transparent gap-[26px]'>
        <div className='w-full flex justify-end items-start'>
          <motion.button
            title='Close modal'
            onClick={onCancel}
            className='w-[51px] h-[51px] flex justify-center items-center rounded-full bg-[#FFFFFF]'
            whileHover={{ scale: 1.1 }}>
            <Image
              src={faClose}
              alt='Close'
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
            />
          </motion.button>
        </div>
        <div className='h-[428px] w-full bg-[#FFFFFF] rounded-[4px] py-[40px] px-[20px] md:px-[80px] flex flex-col justify-center items-center gap-[25px]'>
          <div className='flex flex-col gap-[42px]'>
            <div className='flex flex-col justify-center items-center gap-[4px]'>
              <h2
                className={`text-[#FB1515] text-[28px] leading-[40.4px] font-bold ${archivo.className}`}>
                {isAgentApproval ? 'Delete Agent' : 'Delete Brief'}
              </h2>
              <p
                className={`text-lg text-[#515B6F] ${archivo.className} text-center font-normal`}>
                {isAgentApproval
                  ? `Are you sure you want to delete the agent ${brief?.firstName || brief?.email}?`
                  : `Are you sure you want to delete the brief for ${brief?.buyerContact?.name}?`}
              </p>
            </div>
            {isAgentApproval && (
              <textarea
                placeholder='Enter reason for deletion'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className='w-full h-[100px] border-[1px] border-[#E9EBEB] rounded-[5px] p-2 text-[#515B6F] text-lg'
              />
            )}
            <div className='h-[129px] w-full flex flex-col gap-[15px]'>
              <button
                onClick={handleConfirm}
                type='button'
                className={`h-[57px] w-full bg-[#FB1515] hover:bg-[#C90000] transition duration-500 rounded-[5px] font-bold text-lg text-white ${archivo.className}`}>
                Confirm
              </button>
              <button
                onClick={onCancel}
                type='button'
                className={`h-[57px] border-[1px] border-[#E9EBEB] w-full hover:bg-gray-200 bg-white transition duration-500 rounded-[5px] font-medium text-lg text-[#414357] ${archivo.className}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DeleteBriefs;
