/** @format */

import React from 'react';

const Feedback = () => {
  return (
    <section className='min-h-[359px] flex justify-center items-center mt-[100px]'>
      <div className='container min-h-[359px] flex flex-col gap-[45px] justify-center items-center px-[20px]'>
        <h2 className='text-[42px] leading-[46px] text-[#09391C] font-semibold'>
          What our client are saying
        </h2>
        <div className='min-h-[268px] w-full border-2 border-dashed flex'>
          <div className='min-w-[928px] flex gap-[60px] items-center'>
            <div className='w-[306px] h-[268px] bg-[#D9D9D9]'></div>
            <div className='h-[157px] w-[562px] border-2 border-dashed'></div>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
