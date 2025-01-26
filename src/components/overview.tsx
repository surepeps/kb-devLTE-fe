/** @format */

'use client';
import { Fragment, useEffect, useState } from 'react';
import ShowTable from '@/components/showTable';
import { DataProps } from '@/types/agent_data_props';
import DetailsToCheck from '@/components/detailsToCheck';
import { briefData } from '@/data/sampleDataForAgent';
import Briefs from './mobileBrief';

const Overview = () => {
  const [briefs, setBriefs] = useState({
    totalBrief: 0,
    draftBrief: 0,
    completeTransaction: 0,
    totalAmount: 3000000000.0,
  });

  const [isFullDetailsClicked, setIsFullDetailsClicked] =
    useState<boolean>(false);

  useEffect(() => {
    setBriefs({
      totalBrief: 80,
      draftBrief: 2,
      completeTransaction: 35,
      totalAmount: 3000000000.0,
    });
  }, []);

  const [detailsToCheck, setDetailsToCheck] = useState<DataProps>({
    date: '12/12/2024',
    propertyType: 'Residential',
    location: 'Lagos, Ikeja',
    propertyPrice: '200,000,000',
    document: 'C of o, recepit,...',
  });

  return (
    <Fragment>
      {isFullDetailsClicked ? (
        <DetailsToCheck
          heading='Overview'
          setIsFullDetailsClicked={setIsFullDetailsClicked}
          detailsToCheck={detailsToCheck}
        />
      ) : (
        <div className='lg:w-[805px] w-full bg-transparent gap-[30px] lg:px-[30px] mt-[60px] flex flex-col'>
          <div className='w-full min-h-[140px] grid grid-cols-2 lg:flex lg:flex-nowrap items-center gap-[20px]'>
            {/**Total Brief */}
            <div className='lg:w-[220px] w-full h-[127px] bg-[#FFFFFF] rounded-[4px] border-[1px] border-[#E4DFDF] py-[25px] px-[23px] flex flex-col gap-[35px]'>
              <h4 className='text-[#2CAF67] text-base leading-[18px] tracking-[1.25px] font-normal font-archivo'>
                Total Brief
              </h4>
              <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                {briefs.totalBrief}
              </h2>
            </div>
            {/**Draft Brief */}
            <div className='lg:w-[220px] w-full h-[127px] bg-[#FFFFFF] rounded-[4px] border-[1px] border-[#E4DFDF] py-[25px] px-[23px] flex flex-col gap-[35px]'>
              <h4 className='text-[#2CAF67] text-base leading-[18px] tracking-[1.25px] font-normal font-archivo'>
                Draft Brief
              </h4>
              <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                {briefs.draftBrief}
              </h2>
            </div>
            {/**Complete Transaction */}
            <div className='lg:w-[356px] col-span-2 w-full h-[127px] bg-[#F1FFF7] rounded-[4px] border-[1px] border-[#2CAF67] p-[20px] flex flex-col justify-between'>
              <div className='flex justify-between min-h-[24px] border-b-[1px] border-[#E4DFDF] pb-1 w-full'>
                <span className='text-base leading-[18px] text-[#2CAF67] tracking-[0.25px] font-archivo'>
                  Complete Transaction
                </span>
                <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                  {briefs.completeTransaction}
                </h2>
              </div>
              {/**Total Amount */}
              <div className='min-h-[44px] flex flex-col gap-[4px]'>
                <span className='text-[14px] leading-[18px] text-[#181336] tracking-[0.25px] font-archivo'>
                  Total Amount
                </span>
                <h2 className='text-[24px] leading-[22px] tracking-[0.25px] font-semibold font-archivo font-[#181336]'>
                  N{' '}
                  {Number(briefs.totalAmount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
            </div>
          </div>

          {/**Second section */}
          {/**PC View */}
          <div className='hidden md:flex'>
            {' '}
            <ShowTable
              headerData={headerData}
              setDetailsToCheck={setDetailsToCheck}
              setShowFullDetails={setIsFullDetailsClicked}
              heading='Publish Brief'
              data={briefData}
            />
          </div>

          {/**Mobile View */}
          <Briefs
            header='Publish Brief'
            headerData={headerData}
            briefData={briefData}
          />
        </div>
      )}
    </Fragment>
  );
};

const headerData: string[] = [
  'Date',
  'Property Type',
  'Location',
  'Property price',
  'Document',
  'Full details',
];

export default Overview;
