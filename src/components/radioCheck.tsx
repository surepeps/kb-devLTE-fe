/** @format */

import React, { FC } from 'react';

interface RadioCheckProps {
  id?: string;
  title?: string;
  value: string;
  name: string;
  type?: 'radio' | 'checkbox';
}

const RadioCheck: FC<RadioCheckProps> = ({ id, title, value, name, type }) => {
  return (
    <label
      title={title ?? value}
      htmlFor={id}
      className='flex gap-[17px] cursor-pointer'>
      <input
        title={title ?? value}
        type={type}
        name={name}
        id={id}
        className='peer hidden'
      />
      {type === 'radio' ? (
        <span className='w-[24px] h-[24px] flex items-center justify-center rounded-full border-white peer-checked:bg-[#8DDB90] border-[5px]'></span>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          className='peer-checked:bg-[#8DDB90] peer-checked:text-[#8DDB90]'
          xmlns='http://www.w3.org/2000/svg'>
          <rect x='0.5' y='0.5' width='23' height='23' fill='none' />
          <rect x='0.5' y='0.5' width='23' height='23' stroke='#8DDB90' />
          <path
            d='M6.66699 12L10.667 16L17.3337 8'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      )}
      <span className='text-base leading-[25.6px] font-normal text-[#000000]'>
        {value}
      </span>
    </label>
  );
};

export default RadioCheck;
