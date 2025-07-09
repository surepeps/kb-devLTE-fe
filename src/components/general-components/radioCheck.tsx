"use client";

import React, { ChangeEventHandler, FC } from "react";

interface RadioCheckProps {
  id?: string;
  title?: string;
  value: string;
  name: string;
  type?: "radio" | "checkbox";
  isDisabled?: boolean;
  className?: string;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
  isChecked?: boolean;
  selectedValue?: string;
  modifyStyle?: React.CSSProperties;
  onClick?: () => void;
}

const RadioCheck: FC<RadioCheckProps> = ({
  id,
  title,
  value,
  name,
  type = "radio",
  isDisabled,
  className,
  handleChange,
  isChecked,
  selectedValue,
  modifyStyle,
  onClick,
}) => {
  const inputId = id ?? `${name}-${value}`;
  const isSelected =
    isChecked !== undefined ? isChecked : selectedValue === value;

  return (
    <label
      title={title ?? value}
      htmlFor={inputId}
      className={`flex gap-[17px] cursor-pointer items-center ${className}`}
    >
      <input
        id={inputId}
        type={type}
        name={name}
        disabled={isDisabled}
        checked={isSelected}
        onChange={handleChange}
        onClick={onClick}
        style={{
          accentColor: "#8DDB90",
          width: "24px",
          height: "24px",
          backgroundColor: "transparent",
        }}
        className="w-[24px] h-[24px] rounded border-[#5A5D63] border-[2px]"
      />
      <span
        style={modifyStyle}
        className="text-base leading-[25.6px] font-normal text-[#000000]"
      >
        {value}
      </span>
    </label>
  );
};

export default RadioCheck;
