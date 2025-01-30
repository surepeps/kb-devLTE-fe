/** @format */
'use client';
import Image from 'next/image';
import arrowRight from '@/svgs/arrowR.svg';
import { DataProps } from '@/types/agent_data_props';
import { FC } from 'react';

interface DetailsToCheckProps {
  setIsFullDetailsClicked: (type: boolean) => void;
  detailsToCheck: DataProps;
  heading?: string;
}

const DetailsToCheck: FC<DetailsToCheckProps> = ({
  setIsFullDetailsClicked,
  detailsToCheck,
  heading,
}) => {
  return (
    <div className='lg:w-[863px] w-full min-h-[342px] mt-[5px] lg:mt-[60px] flex flex-col gap-[20px] lg:gap-[60px]'>
      <div className='min-h-[32px] lg:min-w-[268px] flex gap-[24px] items-center'>
        <Image
          src={arrowRight}
          width={24}
          height={24}
          alt='Go Back'
          title='Go Back'
          onClick={() => {
            setIsFullDetailsClicked(false);
          }}
          className='w-[24px] h-[24px]'
        />
        <div className='flex items-center gap-[8px]'>
          <span className='text-[20px] leading-[32px] text-[#25324B] font-normal'>
            {heading}
          </span>
          <svg
            width='4'
            height='4'
            viewBox='0 0 4 4'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <circle cx='2' cy='2' r='2' fill='#25324B' />
          </svg>
          <span className='text-[20px] leading-[32px] text-[#25324B] font-semibold font-epilogue'>
            Full Details
          </span>
        </div>
      </div>

      <div className='w-full min-h-[310px] border-[1px] py-[30px] flex lg:flex-row flex-col items-center gap-[39px] border-[#E9EBEB] bg-[#FFFFFF]'>
        <div className='h-[250px] lg:w-[592px] w-full'>
          {/**Property Type and Property Price */}
          <div className='w-full min-h-[70px] py-[9px] px-[24px] flex gap-[100px]'>
            <div className='lg:min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Property Type
              </span>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'>
                {detailsToCheck.propertyType}
              </span>
            </div>
            <div className='lg:min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Property price
              </span>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'>
                N {detailsToCheck.propertyPrice}
              </span>
            </div>
          </div>

          {/**Location and Property Features */}
          <div className='w-full min-h-[70px] py-[9px] px-[24px] flex gap-[100px]'>
            <div className='lg:min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Location
              </span>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'>
                {detailsToCheck.location}
              </span>
            </div>
            <div className='lg:min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Property Features
              </span>
              <ol
                className='text-[14px] list-disc list-inside leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'
                dangerouslySetInnerHTML={{
                  __html: `<li>Sample</li>`,
                }}
              />
            </div>
          </div>

          {/**Date Created and Document  */}
          <div className='w-full min-h-[70px] py-[9px] px-[24px] flex gap-[100px]'>
            <div className='lg:min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Date Created
              </span>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'>
                {detailsToCheck.date}
              </span>
            </div>
            <div className='min-w-[142px] min-h-[52px] flex flex-col'>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-normal text-[#585B6C]'>
                Document
              </span>
              <span className='text-[14px] leading-[22.4px] tracking-[0.1px] font-medium text-[#141A16]'>
                {detailsToCheck.document}
              </span>
            </div>
          </div>
        </div>

        {/**Images */}
        <div className='w-[131px] flex flex-col gap-[10px]'>
          <h2 className='text-[#585B6C] text-[14px] leading-[22.4px] tracking-[0.1px] font-normal'>
            Upload Image
          </h2>
          <div className='w-full h-[98px] bg-[#D9D9D9]'></div>
          <div className='w-full h-[89px] bg-[#D9D9D9]'></div>
        </div>
      </div>
    </div>
  );
};

export default DetailsToCheck;
