/** @format */

import React from 'react';
import Button from './button';

const HelpButton = () => {
  return (
    <section className='w-full bg-white flex justify-center items-center py-[40px]'>
      <Button
        type='button'
        value='How Can We Help You'
        className='h-[50px] font-bold text-[#FFFFFF] text-base w-[249px] py-[12px] px-[24px] bg-[#8DDB90] leading-[25.6px]'
      />
    </section>
  );
};

export default HelpButton;
