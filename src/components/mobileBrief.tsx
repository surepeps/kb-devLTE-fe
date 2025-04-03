/** @format */

import { DataProps, DataPropsArray } from '@/types/agent_data_props';
import { FC } from 'react';

interface PublishMobileViewProps {
  item: DataProps;
  setDetailsToCheck: ({}: DataProps) => void;
  setShowFullDetails: (type: boolean) => void;
}
const PublishMobileView: FC<PublishMobileViewProps> = ({
  item,
  setDetailsToCheck,
  setShowFullDetails,
}) => {
  return (
    <div className='w-full min-h-[287px] rounded-[24px] gap-[1px] flex flex-col'>
      <UniformStyling
        className='min-h-[57px] pt-[25px] px-[20px] pb-[10px]'
        name={'Date'}
        value={item.date.split('T')[0]}
      />

      <UniformStyling
        className='py-[10px] px-[20px] min-h-[42px]'
        name='Property Type'
        value={item.propertyType}
      />

      <UniformStyling
        className='py-[10px] px-[20px] min-h-[42px]'
        name='Location'
        value={`${item.actualLocation?.state}`}
      />

      <UniformStyling
        className='py-[10px] px-[20px] min-h-[42px]'
        name='Property price'
        value={`\u20A6${Number(item.propertyPrice).toLocaleString()}`}
      />

      <UniformStyling
        className='py-[10px] px-[20px] min-h-[42px]'
        name='Documents'
        value={
          item.docOnProperty !== undefined
            ? item.docOnProperty[0].docName.split('').splice(0, 6).join('')
            : ''
        }
      />

      <button
        onClick={() => {
          setShowFullDetails(true);
          setDetailsToCheck(item);
        }}
        type='button'
        className={`w-full min-h-[57px] pt-[10px] pr-[20px] pb-[25px] pl-[20px] flex justify-center items-center bg-[#F7F7F8] text-[#09391C] leading-[22.4px] tracking-[0.1px] font-ubuntu`}>
        View full details
      </button>
    </div>
  );
};

interface BriefsProps {
  header: string;
  briefData: DataPropsArray;
  setDetailsToCheck: ({}: DataProps) => void;
  setShowFullDetails: (type: boolean) => void;
}

const Briefs: FC<BriefsProps> = ({
  header,
  briefData,
  setDetailsToCheck,
  setShowFullDetails,
}) => {
  return (
    <div className='flex md:hidden'>
      <div className='w-full border-[1px] border-[#E4DFDF] min-h-[558px] rounded-[4px] py-[32px] px-[30px] flex flex-col gap-[30px] bg-[#FFFFFF]'>
        <h1 className='text-[18px] leading-[18px] text-[#000000] font-semibold font-archivo'>
          {header}
        </h1>
        {briefData.map((item: DataProps, idx: number) => (
          <PublishMobileView
            key={idx}
            item={item}
            setDetailsToCheck={setDetailsToCheck}
            setShowFullDetails={setShowFullDetails}
          />
        ))}
      </div>
    </div>
  );
};

const UniformStyling = ({
  name,
  value,
  className,
}: {
  name: string;
  value: string | undefined;
  className: string;
}) => {
  return (
    <div
      className={`w-full flex justify-between items-center bg-[#F7F7F8] ${className}`}>
      <span className='text-[14px] font-ubuntu text-[#707281] leading-[22.4px] tracking-[0.1px]'>
        {name}
      </span>
      <span className='font-ubuntu font-medium text-[14px] leading-[22.4px] text-[#000000] tracking-[0.1px]'>
        {value?.split('').splice(0, 14).join('') + '...'}
      </span>
    </div>
  );
};

export default Briefs;
