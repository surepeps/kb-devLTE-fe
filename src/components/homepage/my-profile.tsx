/** @format */

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import useClickOutside from '@/hooks/clickOutside';
import Image from 'next/image';
import userIcon from '@/svgs/user2.svg';
import faLock from '@/svgs/lock.svg';
import { User, useUserContext } from '@/context/user-context';
import { archivo } from '@/styles/font';

type userDetailsProps = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  id: string;
  _id: string;
} | null;
interface UserProfileModalProps {
  closeUserProfileModal: (type: boolean) => void;
  userDetails: User | null;
}

const UserProfile: React.FC<UserProfileModalProps> = ({
  closeUserProfileModal,
  userDetails,
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { logout } = useUserContext();

  useClickOutside(ref, () => closeUserProfileModal(false));
  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      className='absolute mt-[70px] z-50 -ml-[160px] md:-ml-[210px] w-[268px] h-[435px] bg-white flex flex-col gap-[25px] p-[19px] shadow-md'>
      <h2
        className={`text-base font-medium text-[#000000] ${archivo.className}`}>
        My Profile
      </h2>
      <div className='flex flex-col gap-[30px]'>
        <div className='w-full flex flex-col py-[15px] px-[10px] min-h-[154px] gap-[10px] bg-[#F7F7F8] border-[1px] border-[#D6DDEB] overflow-x-auto hide-scrollbar'>
          {/**User ID */}
          <div className='flex items-end gap-[10px]'>
            <span className='text-base text-[#7C8493]'>User ID</span>
            <span className='text-base text-[#25324B]'>
              {userDetails?._id?.slice(0, 15)}...
            </span>
          </div>
          {/**Name */}
          <div className='flex items-center gap-[10px]'>
            <span className='text-base text-[#7C8493]'>Name</span>
            <span className='text-base text-[#25324B]'>
              {userDetails?.firstName} {userDetails?.lastName}
            </span>
          </div>
          {/**Email */}
          <div className='flex items-center gap-[10px]'>
            <span className='text-base text-[#7C8493]'>Email</span>
            <span className='text-base text-[#25324B]'>
              {userDetails?.email}
            </span>
          </div>
          {/**phone number */}
          <div className='flex items-center gap-[10px]'>
            <span className='text-base text-[#7C8493]'>Phone</span>
            <span className='text-base text-[#25324B]'>
              {userDetails?.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/**Referral */}
      <button
        type='button'
        className='w-full h-[26px] flex items-end gap-[10px]'>
        <Image
          alt='lock'
          src={userIcon}
          width={24}
          height={24}
          className='w-[24px] h-[24px]'
        />
        <span className='text-base font-medium underline'>Referral</span>
      </button>
      {/**Change Password */}
      <button
        type='button'
        className='w-full h-[26px] flex items-end gap-[10px]'>
        <Image
          alt='lock'
          src={faLock}
          width={24}
          height={24}
          className='w-[24px] h-[24px]'
        />
        <span className='text-base font-medium underline'>Change Password</span>
      </button>

      {/**button to sign out */}
      <button
        type='button'
        onClick={() => {
          logout();
        }}
        className='w-full h-[50px] border-[1px] text-base font-medium border-[#FF3D00] text-[#FF2539]'>
        Sign out
      </button>
    </motion.div>
  );
};

export default UserProfile;
