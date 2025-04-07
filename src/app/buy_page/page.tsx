/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * eslint-disable react-hooks/exhaustive-deps
 *
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any*/
'use client';
import Loading from '@/components/loading';
import { useLoading } from '@/hooks/useLoading';
import { propertyReferenceData } from '@/data/buy_page_data';
import { usePageContext } from '@/context/page-context';
import Card from '@/components/card';
import { Fragment, useEffect, useState, useRef, FC } from 'react';
import Button from '@/components/button';
// import Buyer_Contact from '@/components/buyer_contact';
import PropertyReference from '@/components/propertyReference';
//import HouseFrame from '@/components/house-frame';
import imgSample from '@/assets/assets.png';
//import { cardDataArray } from '@/data';
import { toast } from 'react-hot-toast';
//import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import { BriefType } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import ContactUs from '@/components/contact_information';
import { IsMobile } from '@/hooks/isMobile';

//type CardData = { header: string; value: string }[];

import Image from 'next/image';
import React from 'react';
import comingSoon from '@/assets/cominsoon.png';

export default function Rent() {
  const router = useRouter();
  const pathname = usePathname();
  const [usageOption, setUsageOption] = useState('');
  const selectedBriefsRef = useRef<HTMLDivElement>(null);
  const { setPropertyRefSelectedBriefs } = usePageContext();

  const isLoading = useLoading();
  const {
    isContactUsClicked,
    rentPage,
    setRentPage,
    isModalOpened,
    selectedBriefs,
    removeBrief,
    addBrief,
  } = usePageContext();
  const [found, setFound] = useState({
    isFound: false,
    count: 0,
  });
  const [isSelectedBriefClicked, setIsSelectedBriefClicked] =
    useState<boolean>(false);
  const [text, setText] = useState<string>('View selected Brief');
  const [selectedBrief, setSelectedBrief] = useState<BriefType | null>(null);

  const [properties, setProperties] = useState<any[]>([]);
  const [isFetchingData, setFetchingData] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  useEffect(() => {
    // Check sessionStorage for the previous page
    const previousPage = sessionStorage.getItem('previousPage');

    if (previousPage === '/joint_ventures') {
      setUsageOption('Joint Venture');
    }
    console.log('Previous page: ', previousPage);
    // Update the previous page in sessionStorage
    // sessionStorage.setItem("previousPage", pathname);
  }, [pathname]);

  const viewSelectedBrief = () => {
    if (text === 'View selected Brief') {
      setIsSelectedBriefClicked(true);
      setText('< Back');
    } else if (text === '< Back') {
      setIsSelectedBriefClicked(!isSelectedBriefClicked);
      setText('View selected Brief');
    }
  };

  useEffect(() => {
    console.log(selectedBriefs);
  }, [selectedBriefs]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllData = async () => {
      setFetchingData(true);
      try {
        const response = await fetch(URLS.BASE + URLS.buyersFetchBriefs, {
          signal,
        });

        if (!response.ok) {
          setErrMessage('Failed to fetch data');
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
        const randomIndex = Math.floor(
          Math.random() * (data.data.length - 10 + 1)
        );
        const randomData = data.data.slice(randomIndex, randomIndex + 10);

        setProperties(randomData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setErrMessage(err.message || 'An error occurred');
        }
      } finally {
        setFetchingData(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort(); // Cleanup to prevent memory leaks
    };
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('selectedBriefs');

    if (!data) return;
    try {
      const parsedData: BriefType[] = JSON.parse(data);

      if (!Array.isArray(parsedData) || parsedData.length === 0) return;

      console.log('Parsed data:', parsedData);
      parsedData.forEach((item) => addBrief(item));
    } catch (error) {
      console.error('Error parsing selectedBriefs from localStorage:', error);
    }
  }, [addBrief]);

  // scroll to selectedBriefs section on mobile view
  useEffect(() => {
    if (window.innerWidth <= 768 && selectedBriefsRef.current) {
      selectedBriefsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedBriefs]);

  if (isLoading) return <Loading />;
  return (
    <Fragment>
        <div className='w-full flex justify-center items-center'>
          <div className='container min-h-[600px] flex flex-col justify-center items-center gap-[10px] px-4 md:px-8'>
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
                  We are working hard to bring you an amazing experience. Stay tuned for updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      {/* <section
        className={`w-full bg-[#EEF1F1] flex justify-center items-center ${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened ||
            rentPage.submitPreference) &&
          'filter brightness-[30%] transition-all duration-500'
        }`}>
        <div className='container min-h-[800px] py-[38px] md:py-[48px] px-[20px] lg:px-[0px] flex flex-col items-center gap-[30px] md:gap-[40px]'>
          <h2 className='lg:text-[40px] lg:leading-[64px] text-[30px] leading-[41px] text-center text-[#09391C]  font-semibold font-display'>
            Enter Your{' '}
            <span className='text-[#8DDB90] font-display'>
              Property Preference
            </span>
          </h2>
          <PropertyReference
            found={found}
            setFound={setFound}
            setAllCards={setProperties}
            usageOption={usageOption}
            propertyReferenceData={propertyReferenceData}
          />
          <div className='w-full flex lg:flex-row flex-col lg:w-[1154px] gap-[15px] overflow-hidden'>
            <div className='flex flex-col gap-2 w-full'>
              <div className='flex justify-between'>
                {' '}
                {found.isFound ? (
                  <h2 className='text-[18px] leading-[28.8px] text-[#1976D2] font-semibold'>
                    {found.count} match Found
                  </h2>
                ) : (
                  <div></div>
                )}
                <h2 className='flex gap-[5px] lg:hidden cursor-pointer'>
                  <span
                    onClick={viewSelectedBrief}
                    className='text-base leading-[25.6px] font-medium text-[#FF3D00]'>
                    {text}
                  </span>
                </h2>
              </div>
              <div
                className={`
                  ${
                    [...selectedBriefs].length !== 0
                      ? 'lg:w-[858px]'
                      : 'lg:w-[1154px]'
                  }
                 w-full flex flex-col gap-[21px] lg:grid ${
                   [...selectedBriefs].length !== 0
                     ? 'lg:grid-cols-3'
                     : 'lg:grid-cols-4'
                 } ${
                  isSelectedBriefClicked ? 'hidden lg:grid' : 'flex lg:grid'
                }`}>
                {properties?.length !== 0 &&
                  properties?.map((property, idx: number) => (
                    <Card
                      images={Array(12).fill(imgSample)}
                      onClick={() => {
                        if (selectedBriefs.has(property)) {
                          return toast.error(
                            'This property has already been added for inspection.'
                          );
                        }
                        if (selectedBriefs.size >= 3) {
                          return toast.error(
                            'You can only submit up to 3 briefs for inspection.'
                          );
                        }
                        addBrief(property);
                        if (selectedBriefs.has(property)) {
                          return toast.success('Already added for inspection');
                        }
                        toast.success('Successfully added for inspection');
                        setSelectedBrief(property);
                      }}
                      cardData={[
                        {
                          header: 'Property Type',
                          value: property.propertyType,
                        },
                        {
                          header: 'Price',
                          value: `₦${Number(property.price).toLocaleString()}`,
                        },
                        {
                          header: 'Bedrooms',
                          value:
                            property.propertyFeatures?.noOfBedrooms || 'N/A',
                        },
                        {
                          header: 'Location',
                          value: `${property.location.state}, ${property.location.localGovernment}`,
                        },
                        {
                          header: 'Documents',
                          value: `<ol class='' style='list-style: 'dics';'>${property.docOnProperty.map(
                            (item: { _id: string; docName: string }) =>
                              `<li key={${item._id}>${item.docName}</li>`
                          )}<ol>`,
                        },
                      ]}
                      key={idx}
                    />
                  ))}
              </div>
              {isFetchingData && (
                <div className='container min-h-[300px] flex items-center justify-center'>
                  <p>Loading...</p>
                </div>
              )}
              {errMessage !== '' && (
                <div className='container min-h-[300px] flex items-center justify-center'>
                  <p className='text-base font-medium text-center'>
                    {errMessage}, check your internet connection and{' '}
                    <span
                      onClick={() => {
                        router.refresh();
                      }}>
                      reload
                    </span>{' '}
                    <FontAwesomeIcon icon={faWifi} />
                  </p>
                </div>
              )}
            </div>
            {[...selectedBriefs].length !== 0 && (
              <SubmitForInspectionComponents
                removeBrief={removeBrief}
                setPropertyRefSelectedBriefs={setPropertyRefSelectedBriefs}
                setRentPage={setRentPage}
                rentPage={rentPage}
                data={selectedBriefs}
                isViewBriefClicked={isSelectedBriefClicked}
              />
            )}
          </div>
        </div>
      </section> */}
      {/* {rentPage.isSubmitForInspectionClicked && (
        <Buyer_Contact
          propertyId={selectedBrief?._id || ''}
          propertyType='PropertySell'
        />
      )} */}

      {rentPage.submitPreference && <ContactUs />}
    </Fragment>
  );
}

/**
 * Section for Inspection
 */

type SubmitForInspectionComponentsProps = {
  data: Set<BriefType>;
  removeBrief: (type: BriefType) => void;
  setRentPage: (args: {
    isSubmitForInspectionClicked: boolean;
    submitPreference: boolean;
  }) => void;
  rentPage: {
    isSubmitForInspectionClicked: boolean;
    submitPreference: boolean;
  };
  setPropertyRefSelectedBriefs: (type: BriefType[]) => void;
  isViewBriefClicked: boolean;
};
const SubmitForInspectionComponents: FC<SubmitForInspectionComponentsProps> = ({
  data,
  removeBrief,
  setRentPage,
  rentPage,
  setPropertyRefSelectedBriefs,
  isViewBriefClicked,
}) => {
  const isMobile = IsMobile();
  return (
    <div
      // ref={selectedBriefsRef}
      className={`lg:flex ${
        isMobile && isViewBriefClicked ? 'flex' : 'hidden'
      } flex-col lg:border-l-[1px] lg:border-[#A8ADB7] lg:pl-[20px] `}>
      <h2 className='text-[24px] leading-[38.4px] text-[#09391C] font-display font-semibold'>
        Submit for inspection
      </h2>
      <div className='lg:w-[266px] w-full flex flex-col gap-[14px]'>
        {[...data].map((selectedBrief: BriefType, idx: number) => (
          <Card
            key={idx}
            images={Array(12).fill(imgSample)}
            onClick={() => {
              removeBrief(selectedBrief);
              localStorage.clear();
              toast.success('Removed successfully');
            }}
            cardData={[
              {
                header: 'Property Type',
                value: selectedBrief?.propertyType,
              },
              {
                header: 'Price',
                value: `₦${Number(selectedBrief?.price).toLocaleString()}`,
              },
              {
                header: 'Bedrooms',
                value: selectedBrief?.propertyFeatures?.noOfBedrooms || 'N/A',
              },
              {
                header: 'Location',
                value: `${selectedBrief?.location.state}, ${selectedBrief?.location.localGovernment}`,
              },
              {
                header: 'Documents',
                value: `<ol>${selectedBrief?.docOnProperty.map(
                  (item: { _id: string; docName: string }) =>
                    `<li key={${item._id}>${item.docName}</li>`
                )}<ol>`,
              },
            ]}
            isRed={true}
          />
        ))}
      </div>
      <Button
        green={true}
        value='Submit'
        onClick={() => {
          setRentPage({
            ...rentPage,
            isSubmitForInspectionClicked: true,
          });
          setPropertyRefSelectedBriefs(Array.from(data));
        }}
        className='py-[12px] px-[24px] h-[64px] text-[#FFFFFF] text-base leading-[25.6px] font-bold mt-6'
      />
    </div>
  );
};

/**
 * --turbopack
 */
