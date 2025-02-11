/** @format */
'use client';
import Loading from '@/components/loading';
import { useLoading } from '@/hooks/useLoading';
import { propertyReferenceDataWithoutUsageOption } from '@/data/buy_page_data';
import { usePageContext } from '@/context/page-context';
//import Card from '@/components/card';
import { Fragment, useState } from 'react';
//import Button from '@/components/button';
import ContactUs from '@/components/contact_information';
import RentalReference from '@/components/rentalReference';
import HouseFrame from '@/components/house-frame';
import imgSample from '@/assets/assets.png';
import { useRouter } from 'next/navigation';

export default function Rent() {
  const isLoading = useLoading();
  const { rentPage } = usePageContext();
  const router = useRouter();
  // const [found, setFound] = useState({
  //   isFound: false,
  //   count: 0,
  // });
  //const [isSelectedBriefClicked, setIsSelectedBriefClicked] =
  useState<boolean>(false);
  //const [text, setText] = useState<string>('View selected Brief');

  // const viewSelectedBrief = () => {
  //   if (text === 'View selected Brief') {
  //     setIsSelectedBriefClicked(true);
  //     setText('Hide selected Brief');
  //   } else if (text === 'Hide selected Brief') {
  //     setIsSelectedBriefClicked(!isSelectedBriefClicked);
  //     setText('View selected Brief');
  //   }
  // };

  if (isLoading) return <Loading />;
  return (
    <Fragment>
      <section
        className={`w-full bg-[#EEF1F1] flex justify-center items-center ${
          rentPage.isSubmitForInspectionClicked &&
          'filter brightness-[30%] transition-all duration-500'
        }`}>
        <div className='container min-h-[800px] py-[48px] px-[20px] lg:px-[0px] flex flex-col items-center gap-[40px]'>
          <h2 className='lg:text-[40px] lg:leading-[64px] text-[30px] leading-[41px] text-center text-[#09391C]  font-semibold font-epilogue'>
            Submit Your <span className='text-[#8DDB90] font-display'>Rental Reference</span>
          </h2>
          <RentalReference
            rentalReferenceData={propertyReferenceDataWithoutUsageOption}
          />
          {/* <div className='w-full flex lg:flex-row flex-col lg:w-[1154px] gap-[15px]'>
            
            <div className='flex flex-col gap-2 w-full'>
              {found.isFound && (
                <div className='flex justify-between'>
                  {' '}
                  <h2 className='text-[18px] leading-[28.8px] text-[#1976D2] font-semibold'>
                    {found.count} match Found
                  </h2>
                  <h2 className='flex gap-[5px] lg:hidden'>
                    <svg
                      width='24'
                      height='25'
                      viewBox='0 0 24 25'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M7 4.5C6.73478 4.5 6.48043 4.60536 6.29289 4.79289C6.10536 4.98043 6 5.23478 6 5.5V19.5C6 19.7652 6.10536 20.0196 6.29289 20.2071C6.48043 20.3946 6.73478 20.5 7 20.5H17C17.2652 20.5 17.5196 20.3946 17.7071 20.2071C17.8946 20.0196 18 19.7652 18 19.5L18 9.91421L12.5859 4.50011L7 4.5ZM4.87868 3.37868C5.44129 2.81607 6.20435 2.5 7 2.5H12.586C13.1163 2.50011 13.6251 2.71086 14.0001 3.08589M14.0001 3.08589L19.414 8.49979C19.414 8.49975 19.414 8.49982 19.414 8.49979C19.789 8.87476 19.9999 9.38345 20 9.91379V19.5C20 20.2957 19.6839 21.0587 19.1213 21.6213C18.5587 22.1839 17.7957 22.5 17 22.5H7C6.20435 22.5 5.44129 22.1839 4.87868 21.6213C4.31607 21.0587 4 20.2957 4 19.5V5.5C4 4.70435 4.31607 3.94129 4.87868 3.37868M8 12.5C8 11.9477 8.44772 11.5 9 11.5H15C15.5523 11.5 16 11.9477 16 12.5C16 13.0523 15.5523 13.5 15 13.5H9C8.44772 13.5 8 13.0523 8 12.5ZM8 16.5C8 15.9477 8.44772 15.5 9 15.5H15C15.5523 15.5 16 15.9477 16 16.5C16 17.0523 15.5523 17.5 15 17.5H9C8.44772 17.5 8 17.0523 8 16.5Z'
                        fill='#FF3D00'
                      />
                      <rect
                        x='8'
                        y='11.5'
                        width='8'
                        height='2'
                        rx='1'
                        fill='#FF3D00'
                      />
                      <rect
                        x='8'
                        y='15.5'
                        width='8'
                        height='2'
                        rx='1'
                        fill='#FF3D00'
                      />
                    </svg>
                    <span
                      onClick={viewSelectedBrief}
                      className='text-base leading-[25.6px] font-medium text-[#FF3D00]'>
                      {text}
                    </span>
                  </h2>
                </div>
              )}
              <div
                className={`${
                  found.isFound ? 'lg:w-[858px]' : 'lg:w-[1154px]'
                } w-full flex flex-col gap-[21px] lg:grid ${
                  found.isFound ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                } ${
                  isSelectedBriefClicked ? 'hidden lg:grid' : 'flex lg:grid'
                }`}>
                {Array.from({ length: 8 }).map((__, idx: number) => (
                  <Card key={idx} />
                ))}
              </div>
            </div>
           
            {found.isFound && (
              <div
                className={`lg:flex flex-col lg:border-l-[1px] lg:border-[#A8ADB7] lg:pl-[20px] ${
                  isSelectedBriefClicked ? 'flex lg:flex' : 'hidden lg:flex'
                }`}>
                <h2 className='text-[24px] leading-[38.4px] text-[#09391C] font-epilogue font-semibold'>
                  Submit for inspection
                </h2>
                <div className='lg:w-[266px] w-full flex flex-col gap-[14px]'>
                  {Array.from({ length: 2 }).map((__, idx: number) => (
                    <Card isRed={true} key={idx} />
                  ))}
                </div>
                <Button
                  green={true}
                  value='Submit'
                  onClick={() => {
                    setRentPage({ isSubmitForInspectionClicked: true });
                  }}
                  className='py-[12px] px-[24px] h-[64px] text-[#FFFFFF] text-base leading-[25.6px] font-bold mt-6'
                />
              </div>
            )}
          </div> */}
          <div className='w-full px-[20px] flex flex-col lg:w-[1153px]'>
            <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]'>
              {Array.from({ length: 8 }).map((__, idx: number) => (
                <HouseFrame
                  key={idx}
                  title='Sample'
                  image={imgSample}
                  location=''
                  bedroom={4}
                  bathroom={3}
                  carPark={2}
                  onClick={() => {
                    router.push(`/buy_page/details/${idx}`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {rentPage.isSubmitForInspectionClicked && <ContactUs />}
    </Fragment>
  );
}
