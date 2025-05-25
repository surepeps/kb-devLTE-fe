/** @format */

import React from 'react';

const PopUpModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='w-full px-[20px] h-screen fixed top-0 left-0 z-20 flex bg-black/[30%] items-center justify-center'>
      {children}
    </section>
  );
};

export default PopUpModal;
