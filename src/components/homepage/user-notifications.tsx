/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import useClickOutside from '@/hooks/clickOutside';

type UserNotificationsProps = {
  closeNotificationModal: (type: boolean) => void;
};

const UserNotifications: React.FC<UserNotificationsProps> = ({
  closeNotificationModal,
}) => {
  const divRef = React.useRef<HTMLDivElement | null>(null);

  useClickOutside(divRef, () => closeNotificationModal(false));
  return (
    <motion.div
      ref={divRef}
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      className='absolute mt-[70px] md:-ml-[400px] w-[443px] h-[512px] bg-white p-[19px] shadow-md flex flex-col gap-[25px]'>
      <h2 className='text-base font-medium text-black'>Notification</h2>
      <div className='flex flex-col gap-[10px] overflow-y-auto'>
        {Array.from({ length: 6 }).map((__, idx: number) => (
          <DetailsUnit key={idx} />
        ))}
      </div>
    </motion.div>
  );
};

const DetailsUnit = () => {
  return (
    <div className='w-full bg-[#FAFAFA] min-h-[76px] py-[21px] px-[18px] flex flex-col justify-center gap-[5px]'>
      <h2 className='text-base text-black'>A user vied your listing with</h2>
      <span className='text-xs text-[#5A5D63]'>
        Ref. No 9876601/02/2025 9:00AM
      </span>
    </div>
  );
};

export default UserNotifications;
