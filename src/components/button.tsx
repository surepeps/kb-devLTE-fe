/** @format */

import React, { FC, MouseEventHandler } from 'react';

interface ButtonProps {
  value: string;
  title?: string;
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  green?: boolean;
  red?: boolean;
}

const Button: FC<ButtonProps> = ({
  value,
  title,
  isDisabled,
  onClick,
  className,
  type,
  green,
  red,
}) => {
  return (
    <button
      title={title ? title : value}
      onClick={isDisabled ? undefined : onClick}
      className={`${className} ${green && 'bg-[#8DDB90] text-white'} ${
        red && 'bg-[#FF3D00] text-white'
      }`}
      type={type ? type : 'button'}>
      {value}
    </button>
  );
};

export default Button;
