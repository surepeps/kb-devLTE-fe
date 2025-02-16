/** @format */
'use client';
import Button from '@/components/button';
import Loading from '@/components/loading';
// import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React from 'react';
import RadioCheck from '@/components/radioCheck';
import Input from '@/components/Input';
import Select from '@/components/select';
import { featuresData, tenantCriteriaData } from '@/data/landlord';

const Landlord = () => {
  const isLoading = useLoading();

  if (isLoading) return <Loading />;
  return (
    <section
      className={`min-h-[800px] bg-[#EEF1F1] w-full flex justify-center items-center transition-all duration-500`}>
      <div className='container flex flex-col justify-center items-center gap-[30px] my-[60px] px-[20px]'>
        <h2 className='text-[#09391C] lg:text-[40px] lg:leading-[64px] font-semibold font-epilogue text-center text-[30px] leading-[41px]'>
          Submit Your&nbsp;
          <span className='text-[#8DDB90]'>Landlord Brief</span>
        </h2>
        <div className='lg:w-[953px] w-full text-[24px] leading-[38.4px] text-[#5A5D63] font-normal text-center'>
          Khabi-Teq connects you with{' '}
          <span className='text-[#8DDB90]'>verified tenants</span> and
          simplifies property management. From tenant onboarding to rent
          collection and maintenance coordination, we handle it all so you can
          focus on growing your property portfolio with confidence and ease
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
                  </div>
                </div>
                {/**Property condition */}
                <div className='min-h-[73px] gap-[15px] flex flex-col lg:w-[535px] w-full'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Property condition
                  </h2>
                  <div className='w-full gap-[20px] lg:gap-[50px] flex flex-row flex-wrap'>
                    <RadioCheck
                      type='radio'
                      value='New Building'
                      name='propertyCondition'
                    />
                    <RadioCheck
                      type='radio'
                      value='Old Building'
                      name='propertyCondition'
                    />
                  </div>
                </div>
                {/**Location */}
                <div className='min-h-[127px] w-full flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Location
                  </h2>
                  <div className='min-h-[80px] flex gap-[15px] lg:flex-row flex-col'>
                    <Input
                      label='State'
                      name='State'
                      type='text'
                      className='lg:w-1/2 w-full'
                    />
                    <Input
                      label='Local Government'
                      name='local government'
                      type='text'
                      className='lg:w-1/2 w-full'
                    />
                  </div>
                </div>
                {/**Other section (Rental Price | no of Bedroom) */}
                <div className='w-full flex flex-col gap-[15px]'>
                  <div className='min-h-[80px] flex gap-[15px] lg:flex-row flex-col'>
                    <Input
                      label='Rental Price'
                      name='Rental Price'
                      type='number'
                      className='lg:w-1/2 w-full'
                    />
                    <Input
                      label='Number of Bedroom'
                      name='Number of Bedroom'
                      type='number'
                      className='lg:w-1/2 w-full'
                    />
                  </div>
                </div>
                {/**Features */}
                <div className='min-h-[73px] flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Features
                  </h2>
                  <div className='grid lg:grid-cols-3 grid-cols-1 gap-[15px] w-full'>
                    {featuresData.map((item: string, idx: number) => (
                      <RadioCheck
                        key={idx}
                        type='checkbox'
                        value={item}
                        name='features'
                      />
                    ))}
                  </div>
                </div>
                {/**Tenant Criteria */}
                <div className='min-h-[73px] flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Tenant Criteria
                  </h2>
                  <div className='grid lg:grid-cols-2 gap-[15px] w-full'>
                    {tenantCriteriaData.map((item: string, idx: number) => (
                      <RadioCheck
                        key={idx}
                        type='checkbox'
                        value={item}
                        name='tenantCriteria'
                      />
                    ))}
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
                      label='Full name'
                      name='Full name'
                      className='lg:w-1/2 w-full'
                      type='text'
                    />
                    <Input
                      label='Phone'
                      name='Phone'
                      className='lg:w-1/2 w-full'
                      type='number'
                    />
                  </div>
                  <Input 
                    label='Email'
                    name='Email' 
                    className='w-full' 
                    type='email' 
                  />
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

export default Landlord;
