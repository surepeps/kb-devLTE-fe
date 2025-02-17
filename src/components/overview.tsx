/** @format */

'use client';
import { FC, Fragment, useEffect, useState } from 'react';
import ShowTable from '@/components/showTable';
import { DataProps, DataPropsArray } from '@/types/agent_data_props';
import DetailsToCheck from '@/components/detailsToCheck';
import { briefData } from '@/data/sampleDataForAgent';
import Briefs from './mobileBrief';

const Overview = () => {
  const [briefs, setBriefs] = useState({
    totalBrief: 0,
    draftBrief: 0,
    referredAgent: 0,
    completeTransaction: 0,
    totalAmount: 3000000000.0,
  });

  const [selectedOption, setSelectedOption] =
    useState<string>('Require Attention');
  const [heading, setHeading] = useState<string>(selectedOption);
  const [submitBrief, setSubmitBrief] = useState<boolean>(false);

  const [isFullDetailsClicked, setIsFullDetailsClicked] =
    useState<boolean>(false);

  useEffect(() => {
    setBriefs({
      totalBrief: 80,
      draftBrief: 2,
      referredAgent: 2,
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

  useEffect(() => {
    if (selectedOption === 'Require Attention') {
      setSubmitBrief(true);
    } else {
      setSubmitBrief(false);
    }
  }, [selectedOption]);

  return (
    <Fragment>
      {isFullDetailsClicked ? (
        <div className='w-full mt-[30px]'>
          <DetailsToCheck
            submitBrief={submitBrief}
            heading={heading ?? 'Overview'}
            setIsFullDetailsClicked={setIsFullDetailsClicked}
            detailsToCheck={detailsToCheck}
          />
        </div>
      ) : (
        <div className='lg:w-[1184px] w-full bg-transparent gap-[30px] lg:px-[30px] mt-[60px] flex flex-col'>
          <div className='w-full min-h-[140px] grid md:grid-cols-2 lg:grid-cols-4 items-center gap-[20px]'>
            {/**Total Brief */}
            <div className='w-full h-[127px] bg-[#FFFFFF] rounded-[4px] border-[1px] border-[#E4DFDF] py-[25px] px-[23px] flex flex-col gap-[35px]'>
              <h4 className='text-[#2CAF67] text-base leading-[18px] tracking-[1.25px] font-normal font-archivo'>
                Total Brief
              </h4>
              <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                {briefs.totalBrief}
              </h2>
            </div>
            {/**Draft Brief */}
            <div className='w-full h-[127px] bg-[#FFFFFF] rounded-[4px] border-[1px] border-[#E4DFDF] py-[25px] px-[23px] flex flex-col gap-[35px]'>
              <h4 className='text-[#2CAF67] text-base leading-[18px] tracking-[1.25px] font-normal font-archivo'>
                Draft Brief
              </h4>
              <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                {briefs.draftBrief}
              </h2>
            </div>
            {/**Total Referred Agent */}
            <div className=' w-full h-[127px] bg-[#FFFFFF] rounded-[4px] border-[1px] border-[#E4DFDF] py-[25px] px-[23px] flex flex-col gap-[35px]'>
              <h4 className='text-[#2CAF67] text-base leading-[18px] tracking-[1.25px] font-normal font-archivo'>
                Total referred agent
              </h4>
              <h2 className='text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold font-archivo'>
                {briefs.referredAgent}
              </h2>
            </div>
            {/**Complete Transaction */}
            <div className='w-full h-[127px] bg-[#F1FFF7] rounded-[4px] border-[1px] border-[#2CAF67] p-[20px] flex flex-col justify-between'>
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
                  Total Amount made with us
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

          <div className='w-full min-h-[51px] md:flex flex-wrap gap-[25px] hidden'>
            {OptionData.map((item: string, idx: number) => (
              <Options
                onClick={() => {
                  setSelectedOption(item);
                  setHeading(item);
                }}
                className={`${
                  selectedOption === item
                    ? 'bg-[#8DDB9033] text-[#09391C] font-bold'
                    : 'font-normal text-[#5A5D63]'
                }`}
                key={idx}
                text={item}
              />
            ))}
          </div>

          {/**Second section */}
          {/**PC View */}
          <div className='hidden md:flex'>
            {' '}
            {selectedOption === 'Require Attention' && (
              <Table
                headingColor='#FF3D00'
                headerData={headerData}
                setDetailsToCheck={setDetailsToCheck}
                setShowFullDetails={setIsFullDetailsClicked}
                heading='Urgent Property Request'
                description={`A new buyer preference has been submitted! Review the details and
            match it with available property briefs. Upload suitable options to
            the preference form as soon as possible to ensure a fast and
            seamless transaction`}
                data={briefData}
              />
            )}
            {selectedOption === '3 month ago Brief' && (
              <Table
                headingColor='black'
                headerData={headerData}
                setDetailsToCheck={setDetailsToCheck}
                setShowFullDetails={setIsFullDetailsClicked}
                heading='3 month ago Brief'
                description={`You have property briefs that have been listed for over 3 months without a transaction. Please confirm if these properties are still available or have been sold to keep our listings updated and accurate.`}
                data={briefData}
              />
            )}
            {selectedOption === 'recently publish' && (
              <ShowTable
                headerData={headerData}
                setDetailsToCheck={setDetailsToCheck}
                setShowFullDetails={setIsFullDetailsClicked}
                heading='Publish Brief'
                data={briefData}
              />
            )}
          </div>

          {/**Mobile View */}
          <Briefs
            header='Publish Brief'
            setDetailsToCheck={setDetailsToCheck}
            setShowFullDetails={setIsFullDetailsClicked}
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

interface OptionType {
  className: string;
  text: string;
  onClick: () => void;
}

const Options: FC<OptionType> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className={`min-h-[51px] min-w-[162px] border-[1px] py-[15px] px-[20px] text-[18px] leading-[21.09px] tracking-[0%] border-[#C7CAD0] ${className} transition-all duration-500`}>
      {text}
    </button>
  );
};

const OptionData: string[] = [
  'Require Attention',
  'recently publish',
  'Total referred Agent',
  '3 month ago Brief',
];

interface TableProps {
  data: DataPropsArray;
  showFullDetails?: boolean;
  headerData?: string[];
  setShowFullDetails: (type: boolean) => void;
  setDetailsToCheck: ({}: DataProps) => void;
  heading: string;
  description: string;
  headingColor: string;
}

const Table: FC<TableProps> = ({
  data,
  setShowFullDetails,
  setDetailsToCheck,
  description,
  heading,
  headingColor,
}) => {
  return (
    <section className='lg:w-[1184px] flex flex-col'>
      <div className='lg:w-[1184px] min-h-fit py-[43.9px] px-[41.16px] bg-white flex flex-col gap-[41.6px]'>
        <div className='min-h-[99px] flex flex-col gap-[10px]'>
          <h2
            style={{ color: headingColor }}
            className={`font-archivo text-[24.7px] font-semibold leading-[24.7px] tracking-[0%]`}>
            {heading}
          </h2>
          <span className='text-[20px] leading-[32px] tracking-[5%] font-normal text-[#000000]'>
            {description}
          </span>
        </div>
        {/**table */}
        <table className='w-full flex flex-col gap-[15px]'>
          <thead className='min-h-[54px] p-[16px] bg-[#FAFAFA]'>
            {''}
            <tr className='w-full flex'>
              {headerData?.map((item: string, idx: number) => (
                <td
                  key={idx}
                  className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
                  {item}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className='space-y-6 flex flex-col justify-start overflow-y-scroll hide-scrollbar px-[8px]'>
            {data.map((item, idx: number) => (
              <tr className='w-full flex' key={idx}>
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  {item.date}
                </td>
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  {item.propertyType}
                </td>
                <td className='text-[14px] text-left leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  {item.location}
                </td>
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  N {Number(item.propertyPrice).toLocaleString()}
                </td>
                {item.document ? (
                  <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-nowrap overflow-hidden text-[#181336]'>
                    {item.document.split('').splice(0, 14).join('') + '...'}
                  </td>
                ) : null}
                {item.amountSold ? (
                  <td className='text-[14px] text-[#14B01A] leading-[22.4px] font-normal font-archivo'>
                    N {Number(item.amountSold).toLocaleString()}
                  </td>
                ) : null}
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  <button
                    type='button'
                    onClick={() => {
                      console.log(idx);
                      setShowFullDetails(true);
                      setDetailsToCheck(item);
                    }}
                    className='bg-[#8DDB90] min-h-[50px] py-[12px] px-[24px] text-base leading-[25.6px] font-bold tracking-[0%] text-center text-[#FAFAFA]'>
                    Submit brief
                  </button>
                  {/* <FontAwesomeIcon
                    onClick={() => {
                      console.log(idx);
                      setShowFullDetails(true);
                      setDetailsToCheck(item);
                    }}
                    icon={faEllipsis}
                    width={24}
                    height={24}
                    title={'See full details'}
                    className='w-[24px] h-[24px] cursor-pointer'
                    color={'#181336'}
                  /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default Overview;
