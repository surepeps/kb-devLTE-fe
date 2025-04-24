/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Loading from '@/components/loading';
import { useLoading } from '@/hooks/useLoading';
import { propertyReferenceDataWithoutUsageOption } from '@/data/buy_page_data';
import { usePageContext } from '@/context/page-context';
import { Fragment, useEffect, useState } from 'react';
import RentalReference from '@/components/rentalReference';
import HouseFrame from '@/components/house-frame';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { epilogue } from '@/styles/font';

import Image from 'next/image';
import comingSoon from '@/assets/cominsoon.png';
import { shuffleArray } from '@/utils/shuffleArray';
import ContactUs from '@/components/contact_information';

type HouseFrameProps = {
  propertyType: string;
  pictures: string[];
  features: { featureName: string; id: string }[];
  location: {
    state: string;
    area: string;
    localGovernment: string;
  };
  noOfBedrooms: number;
  _id: string;
};
export default function Rent() {
  const isLoading = useLoading();
  const { rentPage } = usePageContext();
  const router = useRouter();
  const [isDataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [isComingSoon, setIsComingSoon] = useState<boolean>(false);
  const [found, setFound] = useState({
    isFound: false,
    count: 0,
  });

  const getAllRentProperties = async () => {
    setDataLoading(true);
    try {
      const response = await axios.get(URLS.BASE + '/properties/rents/all');
      console.log(response);
      if (response.status === 200) {
        const shuffled = shuffleArray(response.data.data);
        setData(shuffled.slice(0, 8));
        setDataLoading(false);
      }
    } catch (error) {
      console.log(error);
      setDataLoading(false);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getAllRentProperties();
  }, []);

  if (isLoading) return <Loading />;
  if (isComingSoon) return <UseIsComingPage />;
  {
    /**${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened ||
            rentPage.submitPreference) &&
          'filter brightness-[30%] transition-all duration-500'
        } */
  }
  return (
    <Fragment>
      <section
        className={`w-full bg-[#EEF1F1] flex justify-center items-center ${
          rentPage.isSubmitForInspectionClicked ||
          (rentPage.submitPreference &&
            'filter brightness-[30%] transition-all duration-500')
        }`}>
        <div className='container min-h-[800px] py-[48px] px-[20px] lg:px-[0px] flex flex-col items-center gap-[40px]'>
          <h2 className='lg:text-[40px] lg:leading-[64px] text-[30px] leading-[41px] text-center text-[#09391C]  font-semibold font-display'>
            Submit Your{' '}
            <span className='text-[#8DDB90] font-display'>
              Rental Reference
            </span>
          </h2>
          <RentalReference
            found={found}
            setFound={setFound}
            setData={setData}
            setDataLoading={setDataLoading}
            rentalReferenceData={propertyReferenceDataWithoutUsageOption}
          />
          <div className='w-full flex flex-col gap-[15px] lg:w-[1153px]'>
            <h2
              className={`text-[#09391C] ${epilogue.className} text-base md:text-lg font-semibold`}>
              {isDataLoading ? (
                'Loading...'
              ) : data.length !== 0 ? (
                'Choose the property you want to rent'
              ) : (
                <span
                  className={`text-[#09391C] ${epilogue.className} text-base md:text-lg font-semibold`}>
                  No property available at the moment!,{' '}
                  <span
                    className={`text-[#09391C] ${epilogue.className} underline-offset-4 underline text-base md:text-lg font-semibold`}
                    onClick={getAllRentProperties}>
                    See available?
                  </span>
                </span>
              )}
            </h2>
            <div
              className={`flex flex-col justify-center items-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]`}>
              {isDataLoading ? (
                <div className='flex w-full justify-center items-center md:col-span-2 lg:col-span-3'>
                  <Loading />
                </div>
              ) : (
                data?.map((item: HouseFrameProps, idx: number) => (
                  <HouseFrame
                    key={idx}
                    title={item.propertyType}
                    images={item?.pictures}
                    features={item.features}
                    location={`${item.location.state}, ${item.location.localGovernment}`}
                    bedroom={item.noOfBedrooms}
                    onClick={() => {
                      router.push(`/buy_page/details/${item._id}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {rentPage.submitPreference && <ContactUs />}
    </Fragment>
  );
}

const UseIsComingPage = () => {
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='container min-h-[600px] flex flex-col justify-center items-center gap-[20px] px-4 md:px-8'>
        <div className='lg:w-[654px] flex flex-col justify-center items-center gap-[20px] w-full'>
          <div className='w-full flex justify-center'>
            <Image
              src={comingSoon}
              width={400}
              height={50}
              alt='Coming Soon Icon'
              className='w-full max-w-[400px] h-auto'
            />
          </div>
          <div className='flex flex-col justify-center items-center gap-[10px]'>
            <p className='text-4xl md:text-2xl font-bold text-center text-[#5A5D63] leading-[160%] tracking-[5%]'>
              We are working hard to bring you an amazing experience. Stay tuned
              for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
