/** @format */

'use client';
import React from 'react';
import khabiteqIcon from '@/svgs/khabi-teq.svg';
import Button from '@/components/button';
import Image from 'next/image';
import { navData } from '@/data';
import Link from 'next/link';
import barIcon from '@/svgs/bars.svg';

const Header = () => {
  return (
    <header
      className={`w-full flex justify-center items-center py-[20px] pl-[10px] pr-[20px] ${'slide-from-top'}`}>
      <nav className='h-[50px] container flex justify-between items-center'>
        <Image
          src={khabiteqIcon}
          width={1000}
          height={1000}
          className='md:w-[169px] md:h-[25px] w-[144px] h-[30px]'
          alt=''
        />
        <div className='lg:flex gap-[27px] hidden'>
          {navData.map((item: { name: string; url: string }, idx: number) => {
            return (
              <Link
                key={idx}
                href={item.url}
                className='text-[#000000] transition-all duration-500 font-medium text-[18px] leading-[21px] hover:text-[#8DDB90]'>
                {item.name}
              </Link>
            );
          })}
        </div>
        <Button
          value="Let's talk"
          green={true}
          className='text-base text-[#FFFFFF] leading-[25px] font-bold w-[155px] h-[50px] hidden lg:inline'
        />
        <Image
          src={barIcon}
          width={35}
          height={22}
          alt=''
          className='w-[35px] h-[22px] lg:hidden'
        />
      </nav>
    </header>
  );
};

export default Header;
