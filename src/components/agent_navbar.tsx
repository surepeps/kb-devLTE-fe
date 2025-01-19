/** @format */

'use client';
import { usePageContext } from '@/context/page-context';
import { AgentNavData } from '@/enums';
import React from 'react';

const AgentNav = () => {
  const { selectedNav, setSelectedNav } = usePageContext();

  const handleSelect = (text: string) => {
    setSelectedNav(text);
  };

  return (
    <div className='min-h-[51px] flex gap-[20px] w-full flex-wrap justify-center items-center'>
      {navData.map((item: string, idx: number) => (
        <Box
          selectedText={selectedNav}
          onClick={() => {
            handleSelect(item);
          }}
          key={idx}
          name={item}
        />
      ))}
    </div>
  );
};

const {
  CREATE_BRIEF,
  OVERVIEW,
  TOTAL_BRIEF,
  DRAFT_BRIEF,
  TRANSACTION_HISTORY,
  SETTINGS,
} = AgentNavData;

const navData: string[] = [
  CREATE_BRIEF,
  OVERVIEW,
  TOTAL_BRIEF,
  DRAFT_BRIEF,
  TRANSACTION_HISTORY,
  SETTINGS,
];

interface BoxProps {
  name: string;
  onClick: () => void;
  isDisabled?: boolean;
  selectedText: string;
}

const Box: React.FC<BoxProps> = ({
  name,
  onClick,
  isDisabled,
  selectedText,
}) => {
  return (
    <button
      type='button'
      onClick={isDisabled ? undefined : onClick}
      className={`${
        selectedText === name
          ? 'bg-[#09391C] text-[#8DDB90]'
          : 'text-[#5A5D63] bg-transparent'
      } text-[18px] leading-[21.09px] transition-all duration-500 font-semibold py-[15px] px-[20px] gap-[10px] border-[1px] border-[#C7CAD0] border-sm lg:min-w-[202px] hover:bg-[#8DDB90] hover:text-[#FFFFFF]`}>
      {name}
    </button>
  );
};

export default AgentNav;
