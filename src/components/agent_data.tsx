/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { useState } from 'react';
import Button from './button';
import Input from './Input';
import Select from './select';
import AttachFile from '@/components/attach_file';
import { useFormik } from 'formik';
//import * as Yup from 'yup';

const AgentData = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const [selectedAgentType, setSelectedAgentType] =
    useState<string>('Individual Agent');

  const formik = useFormik({
    initialValues: {
      street: '',
      state: '',
      localGovtArea: '',
      regionOfOperation: '',
      typeOfID: '',
      companyName: '',
      idNumber: '',
      registrationNumber: '',
    },
    onSubmit: (values) => {
      console.log(values);
      window.location.href = '/auth/agent/createBrief';
    },
  });

  return (
    <section
      className={`flex items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        (isContactUsClicked || isModalOpened) && 'brightness-[30%]'
      }`}>
      <form
        onSubmit={formik.handleSubmit}
        className='lg:w-[870px] flex flex-col justify-center items-center gap-[40px] w-full px-[20px]'>
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
                  value={formik.values.street}
                  id='street'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='This is a placeholder'
                />
                <Input
                  name='State'
                  type='text'
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id='state'
                  placeholder='This is a placeholder'
                />
                <Input
                  name='Local Government Area'
                  type='text'
                  value={formik.values.localGovtArea}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id='localGovtArea'
                  placeholder='This is a placeholder'
                />
              </div>
              <Input
                name='Region of Operation'
                className='w-full'
                type='text'
                value={formik.values.regionOfOperation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id='regionOfOperation'
                placeholder='This is a placeholder'
              />
            </div>
            {/**Agent Type */}
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
              Agent Type
            </h2>
            <div className='w-full min-h-[259px] flex flex-col gap-[20px]'>
              <Select
                value={selectedAgentType}
                onChange={(e: { target: { value: string } }) => {
                  setSelectedAgentType(e.target.value);
                }}
                name='Are you an Individual Agent or Corporate Agent?'
                className='cursor-pointer'
                options={['Individual Agent', 'Corporate Agent']}
              />
              <div className='w-full min-h-[80px] gap-[15px] flex lg:flex-row flex-col'>
                {selectedAgentType === 'Individual Agent' ? (
                  <Input
                    name='Type of ID'
                    className='md:w-1/2 w-full'
                    type='text'
                    value={formik.values.typeOfID}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='typeOfID'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    name='Business/Company Name'
                    className='md:w-1/2 w-full'
                    type='text'
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='companyName'
                    placeholder='This is a placeholder'
                  />
                )}
                {selectedAgentType === 'Individual Agent' ? (
                  <Input
                    name='ID Number'
                    className='md:w-1/2 w-full'
                    type='number'
                    value={formik.values.idNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='idNumber'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    name='Registration Number'
                    className='md:w-1/2 w-full'
                    type='number'
                    value={formik.values.registrationNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='registrationNumber'
                    placeholder='This is a placeholder'
                  />
                )}
              </div>
              <AttachFile heading='Upload your document' />
            </div>
          </div>
          <Button
            value='Submit'
            type='submit'
            green={true}
            className='bg-[#8DDB90] min-h-[50px] py-[12px] px-[24px] w-full text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </form>
    </section>
  );
};

export default AgentData;
