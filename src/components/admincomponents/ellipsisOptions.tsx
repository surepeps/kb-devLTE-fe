/** @format */

'use client';
import useClickOutside from '@/hooks/clickOutside';
import { archivo } from '@/styles/font';
import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface EllipsisOptionsProps {
  onApproveBrief: () => void;
  onDeleteBrief: () => void;
  onRejectBrief: () => void;
  closeMenu?: (type: number | null) => void;
}

const EllipsisOptions: FC<EllipsisOptionsProps> = ({
  onApproveBrief,
  onDeleteBrief,
  onRejectBrief,
  closeMenu,
}) => {
  const ellipsisData = [
    { name: 'Approve brief', onClick: onApproveBrief },
    {
      name: 'Delete brief',
      onClick: onDeleteBrief,
    },
    {
      name: 'Reject brief',
      onClick: onRejectBrief,
    },
  ];
  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => closeMenu?.(null));

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      ref={ref}
      className='w-fit bg-white border-[1px] border-gray-200 flex flex-col p-[10px] gap-[10px] rounded-[4px] shadow-lg absolute z-[20px] md:-ml-[50px] right-0 md:right-[initial]'>
      <div className='flex justify-end absolute -mt-[30px]'>
        <motion.button
          whileHover={{
            scale: 1.1,
          }}
          transition={{ delay: 0.3 }}
          className='w-[15px] h-[15px] ml-[90px] flex justify-center items-center rounded-full bg-white shadow-md'>
          <FontAwesomeIcon
            width={10}
            height={10}
            className='w-[10px] h-[10px]'
            icon={faClose}
            size='sm'
            onClick={() => closeMenu?.(null)}
          />
        </motion.button>
      </div>
      {ellipsisData.map(
        (item: { name: string; onClick: () => void }, index) => (
          <span
            onClick={() => {
              console.log('clicked');
              item?.onClick();
              closeMenu?.(null);
            }}
            className={`text-sm hover:bg-gray-200 px-2 py-1 rounded-[4px] cursor-pointer ${archivo.className}`}
            key={index}>
            {item.name}
          </span>
        )
      )}
    </motion.div>
  );
};

export default EllipsisOptions;
