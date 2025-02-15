/** @format */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { useState } from 'react';
import Button from './button';
import Input from './Input';
import Select from './select';
import AttachFile from '@/components/attach_file';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
//import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { PUT_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';

const AgentData = () => {
  const router = useRouter();
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const [selectedAgentType, setSelectedAgentType] = useState<string>('Individual Agent');

  const [fileUrl, setFileUrl] = useState<string | null>(null);

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
    onSubmit: async (values) => {
      console.log(values);

      if (fileUrl === null) return toast.error('Please upload your document');
      const payload = {
        token: Cookies.get('token'),
        address: {
          street: formik.values.street,
          city: 'Anytown',
          state: formik.values.state,
          localGovtArea: formik.values.localGovtArea,
        },
        regionOfOperation: formik.values.regionOfOperation,
        agentType: selectedAgentType === 'Individual Agent' ? 'Individual' : 'Company',
        ...(selectedAgentType === 'Individual Agent'
          ? {
              individualAgent: {
                typeOfId: formik.values.typeOfID,
                idNumber: formik.values.idNumber,
              },
            }
          : {
              companyAgent: {
                companyName: formik.values.companyName,
                regNumber: formik.values.registrationNumber,
              },
            }),
        doc: fileUrl, // Assuming doc is a static value or should be handled separately
      };
      await toast.promise(
        PUT_REQUEST(URLS.BASE + URLS.agentOnboarding, payload).then((response) => {
          if (response.success) {
            toast.success('Agent data submitted successfully');
            Cookies.set('token', (response as unknown as { token: string }).token);
            router.push('/auth/agent/createBrief');
            return 'Agent data submitted successfully';
          } else {
            const errorMessage = (response as any).error || 'Submission failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
        }),
        {
          loading: 'Submitting...',
          success: 'Agent data submitted successfully',
          // error: 'An error occurred, please try again',
        }
      );
    },
  });

  return (
    <section
      className={`flex items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        (isContactUsClicked || isModalOpened) && 'brightness-[30%]'
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className='lg:w-[870px] flex flex-col justify-center items-center gap-[40px] w-full px-[20px]'
      >
        <div className='w-full min-h-[137px] flex flex-col gap-[24px] justify-center items-center'>
          <h2 className='text-center text-[40px] leading-[49.2px] font-display font-bold text-[#09391C]'>
            Welcome to <span className='text-[#8DDB90] font-display'>Khabi-teq</span> realty
          </h2>
          <p className='text-[#5A5D63] text-[20px] leading-[32px] text-center tracking-[5%]'>
            Lorem ipsum dolor sit amet consectetur. Ornare feugiat suspendisse tincidunt erat scelerisque. Tortor aenean
            a urna metus cursus dui commodo velit. Tellus mattis quam.
          </p>
        </div>

        <div className='lg:w-[602px] min-h-[654px] flex flex-col gap-[40px]'>
          <div className='flex flex-col w-full gap-[20px]'>
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>Address Information</h2>
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
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>Agent Type</h2>
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
                    type='text'
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
              <AttachFile heading='Upload your document' setFileUrl={setFileUrl} />
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
