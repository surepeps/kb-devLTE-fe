/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any*/
'use client';
import Loading from '@/components/loading';
import { useLoading } from '@/hooks/useLoading';
import { propertyReferenceData } from '@/data/buy_page_data';
import { usePageContext } from '@/context/page-context';
import Card from '@/components/card';
import { Fragment, useEffect, useState } from 'react';
import Button from '@/components/button';
import ContactUs from '@/components/contact_information';
import PropertyReference from '@/components/propertyReference';
//import HouseFrame from '@/components/house-frame';
import imgSample from '@/assets/assets.png';
//import { cardDataArray } from '@/data';
import { toast } from 'react-hot-toast';
//import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

//type CardData = { header: string; value: string }[];

export default function Rent() {
  const isLoading = useLoading();
  const { isContactUsClicked, rentPage, setRentPage, isModalOpened } =
    usePageContext();
  const [found, setFound] = useState({
    isFound: false,
    count: 0,
  });
  const [isSelectedBriefClicked, setIsSelectedBriefClicked] =
    useState<boolean>(false);
  const [text, setText] = useState<string>('View selected Brief');
  const [selectedBriefs, setSelectedBriefs] = useState<Set<any>>(new Set([]));
  const [tracker, setTracker] = useState<number>(0);
  const [briefIDs, setBriefIDs] = useState<Set<number>>(new Set([]));
  //const [allCards, setAllCards] = useState(cardDataArray);
  const [properties, setProperties] = useState<any[]>([]);
  const [isFetchingData, setFetchingData] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

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

  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     setFetchingData(true);
  //     try {
  //       // const response = await GET_REQUEST(URLS.BASE + '/properties/sell/all');
  //       const response = await fetch(URLS.BASE + '/properties/sell/all');
  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(data);
  //         setFetchingData(false);
  //         setProperties(data);
  //       } else {
  //         setFetchingData(false);
  //         setErrMessage('Failed to fetch data');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       setFetchingData(false);
  //     }
  //   };
  //   fetchAllData();
  // }, []);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllData = async () => {
      setFetchingData(true);
      try {
        const response = await fetch(URLS.BASE + '/properties/sell/all', {
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setProperties(data);
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
  }, []); // Add dependencies if necessary

  if (isLoading) return <Loading />;
  return (
    <Fragment>
      <section
        className={`w-full bg-[#EEF1F1] flex justify-center items-center ${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened) &&
          'filter brightness-[30%] transition-all duration-500'
        }`}>
        <div className='container min-h-[800px] py-[48px] px-[20px] lg:px-[0px] flex flex-col items-center gap-[40px]'>
          <h2 className='lg:text-[40px] lg:leading-[64px] text-[30px] leading-[41px] text-center text-[#09391C]  font-semibold font-display'>
            Enter Your{' '}
            <span className='text-[#8DDB90] font-display'>
              Property Reference
            </span>
          </h2>
          <PropertyReference
            found={found}
            setFound={setFound}
            setAllCards={setProperties}
            propertyReferenceData={propertyReferenceData}
          />
          {/**All cards for isnpection */}
          {
            <div className='w-full flex lg:flex-row flex-col lg:w-[1154px] gap-[15px] overflow-hidden'>
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
                    [...selectedBriefs].length !== 0
                      ? 'lg:w-[858px]'
                      : 'lg:w-[1154px]'
                  } w-full flex flex-col gap-[21px] lg:grid ${
                    [...selectedBriefs].length !== 0
                      ? 'lg:grid-cols-3'
                      : 'lg:grid-cols-4'
                  } ${
                    isSelectedBriefClicked ? 'hidden lg:grid' : 'flex lg:grid'
                  }`}>
                  {properties?.map((property, idx: number) => (
                    <Card
                      images={Array(12).fill(imgSample)}
                      onClick={() => {
                        setBriefIDs((prevItems) => new Set(prevItems).add(idx));
                        setSelectedBriefs((prevItems) =>
                          new Set(prevItems).add(property)
                        );
                        if (selectedBriefs.has(property)) {
                          return toast.success('Already added for inspection');
                        }
                        toast.success('Successfully added for inspection');
                      }}
                      cardData={[
                        {
                          header: 'Property Type',
                          value: property.propertyType,
                        },
                        {
                          header: 'Price',
                          value: `N${Number(property.price).toLocaleString()}`,
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
                      {errMessage}, check your internet connection and reload{' '}
                      <FontAwesomeIcon icon={faWifi} />
                    </p>
                  </div>
                )}
              </div>

              {[...selectedBriefs].length !== 0 && (
                <div
                  className={`lg:flex flex-col lg:border-l-[1px] lg:border-[#A8ADB7] lg:pl-[20px] ${
                    isSelectedBriefClicked ? 'flex lg:flex' : 'hidden lg:flex'
                  }`}>
                  <h2 className='text-[24px] leading-[38.4px] text-[#09391C] font-display font-semibold'>
                    Submit for inspection
                  </h2>
                  <div className='lg:w-[266px] w-full flex flex-col gap-[14px]'>
                    {[...selectedBriefs].map((brief, idx: number) => (
                      <Card
                        images={Array(12).fill(imgSample)}
                        onClick={() => {
                          setTracker(idx);
                          console.log(idx, briefIDs);
                          const filteredIDx = briefIDs.has(tracker);
                          console.log(filteredIDx);
                          setSelectedBriefs((prevBriefs) => {
                            const newSet = new Set(prevBriefs);
                            newSet.delete(brief);
                            return newSet;
                          });
                          toast.success('Removed successfully');
                        }}
                        cardData={[
                          {
                            header: 'Property Type',
                            value: brief.propertyType,
                          },
                          {
                            header: 'Price',
                            value: `N${Number(brief.price).toLocaleString()}`,
                          },
                          {
                            header: 'Bedrooms',
                            value:
                              brief.propertyFeatures?.noOfBedrooms || 'N/A',
                          },
                          {
                            header: 'Location',
                            value: `${brief.location.state}, ${brief.location.localGovernment}`,
                          },
                          {
                            header: 'Documents',
                            value: `<ol>${brief.docOnProperty.map(
                              (item: { _id: string; docName: string }) =>
                                `<li key={${item._id}>${item.docName}</li>`
                            )}<ol>`,
                          },
                        ]}
                        isRed={true}
                        key={idx}
                      />
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
            </div>
          }
        </div>
      </section>
      {rentPage.isSubmitForInspectionClicked && <ContactUs />}
    </Fragment>
  );
}
