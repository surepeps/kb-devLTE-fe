/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { FC } from 'react';
import Button from './button';
import Input from './Input';
import Select from './select';
import AttachFile from '@/components/attach_file';

interface AgentDataProps {
  withID: boolean;
}

const AgentData: FC<AgentDataProps> = ({ withID }) => {
  const { isContactUsClicked } = usePageContext();

  return (
    <section
      className={`flex items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        isContactUsClicked && 'brightness-[30%]'
      }`}>
      <div className='lg:w-[870px] flex flex-col justify-center items-center gap-[40px] w-full'>
        <div className='w-full min-h-[137px] flex flex-col gap-[24px] justify-center items-center'>
          <h2 className='text-center text-[40px] leading-[49.2px] font-bold text-[#09391C]'>
            Welcome to <span className='text-[#8DDB90]'>Khabi-teq</span> realty
          </h2>
          <p className='text-[#5A5D63] text-[20px] leading-[32px] text-center tracking-[5%]'>
            Lorem ipsum dolor sit amet consectetur. Ornare feugiat suspendisse
            tincidunt erat scelerisque. Tortor aenean a urna metus cursus dui
            commodo velit. Tellus mattis quam.
          </p>
        </div>

        <div className='lg:w-[602px] min-h-[654px] flex flex-col gap-[40px]'>
          <div className='flex flex-col w-full gap-[20px]'>
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
              Address Information
            </h2>
            <div className='w-full flex flex-col gap-[20px] min-h-[181px]'>
              <div className='min-h-[80px] flex gap-[15px] lg:flex-row flex-col'>
                <Input
                  name='Street'
                  type='text'
                  placeholder='This is a placeholder'
                />
                <Input
                  name='State'
                  type='text'
                  placeholder='This is a placeholder'
                />
                <Input
                  name='Local Government Area'
                  type='text'
                  placeholder='This is a placeholder'
                />
              </div>
              <Input
                name='Region of Operation'
                className='w-full'
                type='text'
                placeholder='This is a placeholder'
              />
            </div>
            {/**Agent Type */}
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
              Agent Type
            </h2>
            <div className='w-full min-h-[259px] flex flex-col gap-[20px]'>
              <Select
                name='Are you an Individual Agent or Corporate Agent?'
                className='cursor-pointer'
                options={['Individual Agent', 'Corporate Agent']}
              />
              <div className='w-full min-h-[80px] gap-[15px] flex lg:flex-row flex-col'>
                {withID ? (
                  <Input
                    name='Type of ID'
                    className='md:w-1/2 w-full'
                    type='text'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    name='Business/Company Name'
                    className='md:w-1/2 w-full'
                    type='text'
                    placeholder='This is a placeholder'
                  />
                )}
                {withID ? (
                  <Input
                    name='ID Number'
                    className='md:w-1/2 w-full'
                    type='number'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    name='Registration Number'
                    className='md:w-1/2 w-full'
                    type='number'
                    placeholder='This is a placeholder'
                  />
                )}
              </div>
              <AttachFile heading='Upload your document' />
            </div>
          </div>
          <Button
            value='Submit'
            green={true}
            className='bg-[#8DDB90] min-h-[50px] py-[12px] px-[24px] w-full text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </div>
    </section>
  );
};

export default AgentData;
