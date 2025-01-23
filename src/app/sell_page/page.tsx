/** @format */
'use client';
import Button from '@/components/button';
import Loading from '@/components/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React from 'react';
import RadioCheck from '@/components/radioCheck';
import Input from '@/components/Input';
import Select from '@/components/select';

const Sell = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const isLoading = useLoading();

  if (isLoading) return <Loading />;
  return (
    <section
      className={`min-h-[800px] bg-[#EEF1F1] w-full flex justify-center items-center ${
        (isContactUsClicked || isModalOpened) && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex flex-col justify-center items-center gap-[30px] my-[60px] px-[20px]'>
        <h2 className='text-[#09391C] lg:text-[40px] lg:leading-[64px] font-semibold font-epilogue text-center text-[30px] leading-[41px]'>
          Submit Your <span className='text-[#8DDB90]'>Property Brief</span>
        </h2>
        <div className='lg:w-[953px] w-full text-[24px] leading-[38.4px] text-[#5A5D63] font-normal text-center'>
          Khabi-Teq helps you reach a wide network of potential buyers and
          simplifies the property selling process. Our platform ensures your
          property is showcased effectively, connects you with verified buyers,
          and streamlines negotiations for a smooth and successful sale
        </div>
        <div className='lg:w-[877px] w-full'>
          <h3 className='text-[24px] leading-[38.4px] font-semibold text-[#09391C] lg:py-[40px] py-[20px] lg:px-[80px] w-full'>
            Brief Details
          </h3>

          <div className='w-full border-t-[1px] border-[#8D909680] min-h-[1177px] flex flex-col'>
            <div className='min-h-[629px] py-[40px] lg:px-[80px] border-[#8D909680] border-y-[1px] w-full'>
              <div className='w-full min-h-[629px] flex flex-col gap-[46px]'>
                {/**Property Type */}
                <div className='min-h-[73px] gap-[15px] flex flex-col lg:w-[535px] w-full'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Property Type
                  </h2>
                  <div className='w-full gap-[20px] lg:gap-[50px] flex flex-row flex-wrap'>
                    <RadioCheck
                      type='radio'
                      value='Residential'
                      name='property'
                    />
                    <RadioCheck
                      type='radio'
                      value='Commercial'
                      name='property'
                    />
                    <RadioCheck type='radio' value='Land' name='property' />
                  </div>
                </div>
                {/**Location */}
                <div className='min-h-[127px] w-full flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Location
                  </h2>
                  <div className='min-h-[80px] flex gap-[15px] lg:flex-row flex-col'>
                    <Input name='State' type='text' />
                    <Input name='local government' type='text' />
                    <Input name='Area' type='text' />
                  </div>
                </div>
                {/**Price */}
                <div className='min-h-[127px] flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Price
                  </h2>
                  <div className='min-h-[80px] flex gap-[15px]'>
                    <Input
                      name='Enter property price'
                      className='w-full'
                      type='text'
                    />
                  </div>
                </div>
                {/**Document of the property */}
                <div className='min-h-[73px] flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Document on the property
                  </h2>
                  <div className='flex flex-wrap gap-[15px] w-full'>
                    <RadioCheck
                      type='checkbox'
                      value='C of O'
                      name='documentOfProperty'
                    />
                    <RadioCheck
                      type='checkbox'
                      value='Survey document'
                      name='documentOfProperty'
                    />
                    <RadioCheck
                      type='checkbox'
                      value='Receipt'
                      name='documentOfProperty'
                    />
                    <RadioCheck
                      type='checkbox'
                      value='Governor Consent'
                      name='documentOfProperty'
                    />
                    <RadioCheck
                      type='checkbox'
                      value='deed of assignment'
                      name='documentOfProperty'
                    />
                  </div>
                </div>
                {/**Property Features */}
                <div className='min-h-[129px] gap-[15px] flex flex-col w-full'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Property Features
                  </h2>
                  <div className='w-full gap-[15px] flex lg:flex-row flex-col'>
                    <Input
                      name='Number of Bedroom'
                      className='lg:w-1/2 w-full'
                      type='number'
                    />
                    <Input
                      name='Additional Features'
                      className='lg:w-1/2 w-full'
                      type='text'
                    />
                  </div>
                </div>
                {/**end */}
              </div>
            </div>
            {/**contact detail */}
            <div className='min-h-[348px] py-[40px] lg:px-[80px] border-[#8D909680] border-b-[1px] w-full'>
              <div className='w-full min-h-[348px] flex flex-col gap-[40px]'>
                <h2 className='text-[#09391C] text-[24px] leading-[38.4px] font-semibold'>
                  Contact Detail
                </h2>

                <div className='w-full flex flex-col gap-[15px] min-h-[270px]'>
                  <Select
                    options={['Yes', 'No', 'Prefer not to say']}
                    name='Are you the owner of the property'
                  />
                  <div className='flex lg:flex-row flex-col w-full gap-[15px]'>
                    <Input
                      name='Full name'
                      className='lg:w-1/2 w-full'
                      type='text'
                    />
                    <Input
                      name='Phone'
                      className='lg:w-1/2 w-full'
                      type='number'
                    />
                  </div>
                  <Input name='Email' className='w-full' type='email' />
                </div>
              </div>
            </div>

            {/**Button */}
            <div className='w-full flex justify-center items-center mt-8'>
              <Button
                value='Submit Brief'
                className='bg-[#8DDB90] lg:w-[459px] text-white text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px]'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sell;
