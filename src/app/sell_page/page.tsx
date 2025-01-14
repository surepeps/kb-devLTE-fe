/** @format */
'use client';
import Loading from '@/components/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React, { FC } from 'react';

const Sell = () => {
  const { isContactUsClicked } = usePageContext();
  const isLoading = useLoading();

  if (isLoading) return <Loading />;
  return (
    <section
      className={`min-h-[800px] bg-[#EEF1F1] w-full flex justify-center items-center ${
        isContactUsClicked && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex flex-col justify-center items-center gap-[30px] mt-[60px]'>
        <h2 className='text-[#09391C] text-[40px] leading-[64px] font-semibold font-epilogue'>
          Submit Your <span className='text-[#8DDB90]'>Property Brief</span>
        </h2>
        <div className='lg:w-[953px] text-[24px] leading-[38.4px] text-[#5A5D63] font-normal text-center'>
          Khabi-Teq helps you reach a wide network of potential buyers and
          simplifies the property selling process. Our platform ensures your
          property is showcased effectively, connects you with verified buyers,
          and streamlines negotiations for a smooth and successful sale
        </div>
        <div className='lg:w-[877px]'>
          <h3 className='text-[24px] leading-[38.4px] font-semibold text-[#09391C] py-[40px] px-[80px] w-full'>
            Brief Details
          </h3>

          <div className='w-full border-y-[1px] border-[#8D909680] min-h-[1177px] flex flex-col'>
            <div className='min-h-[629px] py-[40px] px-[80px] border-zinc-900 border-dashed border-y-[1px] w-full'>
              <div className='w-full min-h-[629px] flex flex-col gap-[46px]'>
                {/**Property Type */}
                <div className='min-h-[73px] gap-[15px] flex flex-col lg:w-[535px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Property Type
                  </h2>
                  <div className='w-full gap-[50px] flex'>
                    <Radio value='Residential' name='property' />
                    <Radio value='Commercial' name='property' />
                    <Radio value='Land' name='property' />
                  </div>
                </div>
                {/**Location */}
                <div className='min-h-[127px] flex flex-col gap-[15px]'>
                  <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                    Location
                  </h2>
                  <div className='min-h-[80px] flex gap-[15px]'>
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
                  {/* <div className='min-h-[80px] flex gap-[15px]'>
                    <Input
                      name='Enter property price'
                      className='w-full'
                      type='text'
                    />
                  </div> */}
                </div>
              </div>
            </div>
            {/**contact detail */}
            <div className='min-h-[348px] py-[40px] px-[80px] border-zinc-900 border-dashed border-y-[1px] w-full'>
              <div className='w-full min-h-[348px] border-2 border-dashed'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface RadioProps {
  id?: string;
  title?: string;
  value: string;
  name: string;
}

const Radio: FC<RadioProps> = ({ id, title, value, name }) => {
  return (
    <label
      title={title ?? value}
      htmlFor={id}
      className='flex gap-[17px] cursor-pointer'>
      <input
        title={title ?? value}
        type='radio'
        name={name}
        id={id ?? value}
        className='peer hidden'
      />
      <span className='w-[24px] h-[24px] flex items-center justify-center rounded-full border-white peer-checked:bg-[#8DDB90] border-[5px]'></span>
      <span className='text-base leading-[25.6px] font-normal text-[#000000]'>
        {value}
      </span>
    </label>
  );
};

interface InputProps {
  name: string;
  placeholder?: string;
  type: string;
  className?: string;
  id?: string;
}

const Input: FC<InputProps> = ({ className, id, name, type, placeholder }) => {
  return (
    <label
      htmlFor={id ?? name}
      className={`min-h-[80px] ${className} flex flex-col gap-[4px]`}>
      <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
        {name}
      </span>
      <input
        type={type}
        placeholder={placeholder ?? 'This is placeholder'}
        className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px]'
      />
      <span></span>
    </label>
  );
};
export default Sell;
