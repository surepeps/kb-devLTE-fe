/** @format */

import React, { ChangeEventHandler, FC, FocusEventHandler } from 'react';

interface InputProps {
  name: string;
  placeholder?: string;
  type: string;
  className?: string;
  id?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

const Input: FC<InputProps> = ({
  className,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <label
      htmlFor={id}
      className={`min-h-[80px] ${className} flex flex-col gap-[4px]`}>
      <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
        {name}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder ?? 'This is placeholder'}
        className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px]'
      />
      <span></span>
    </label>
  );
};

export default Input;
