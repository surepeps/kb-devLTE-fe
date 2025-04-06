/**
 * eslint-disable react-hooks/exhaustive-deps
 *
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/button';
// import HouseFrame from './house-frame';
// import houseImage from '@/assets/assets.png';
import Image from 'next/image';
import arrowIcon from '@/svgs/arrowIcon.svg';
import Card from './card';
import { motion, useInView } from 'framer-motion';
//import { cardDataArray } from '@/data';
import toast from 'react-hot-toast';
//import { usePageContext } from '@/context/page-context';
import imgSample from '@/assets/assets.png';
import { URLS } from '@/utils/URLS';
import { usePageContext } from '@/context/page-context';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'ldrs/react/Trio.css';
import { Trio } from 'ldrs/react';
import { epilogue } from '@/styles/font';

const Section2 = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
  });
  const { setCardData } = usePageContext();
  //const [fetchingData, setFetchingData] = useState(false);
  const [properties, setProperties] = useState([]);
  //const [errMessage, setErrMessage] = useState('');

  const housesRef = useRef<HTMLDivElement>(null);

  const areHousesVisible = useInView(housesRef, { once: true });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllData = async () => {
      // setFetchingData(true);
      setIsLoading(true);
      try {
        const response = await fetch(URLS.BASE + '/properties/sell/all', {
          signal,
        });

        if (!response.ok) {
          setIsLoading(false);
          // setErrMessage('Failed to fetch data');
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
        //cut a section of the array data randomly, that the objects in the array are only four
        const randomIndex = Math.floor(
          Math.random() * (data.data.length - 4 + 1)
        );
        const randomData = data.data.slice(randomIndex, randomIndex + 4);
        setProperties(randomData);
        setCardData(data);
        setIsLoading(false);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
          // setErrMessage(err.message || 'An error occurred');
          setIsLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      controller.abort(); // Cleanup to prevent memory leaks
    };
  }, [setCardData]);

  return (
    <section className='flex justify-center items-center bg-[#8DDB901A] pb-[30px]'>
      <div className='container min-h-[700px] flex flex-col justify-center items-center gap-[20px] px-[20px] overflow-hidden'>
        <div className='min-h-[128px] w-full lg:w-[870px] flex flex-col justify-center items-center gap-[9px] pt-[40px]'>
          <h2 className='text-[24px] leading-[28.13px] lg:text-[36px] lg:leading-[57.6px] md:leading-[32px] text-[#09391C] text-center font-semibold'>
            See What Other Buyers Are Exploring
          </h2>
          <p className='text-[#5A5D63] text-base md:text-[18px] leading-[28.8px] tracking-[5%] font-normal text-center'>
            {/* Your trusted partner in Lagos&apos; real estate market. Since 2020,
            we&apos;ve been delivering expert solutions with integrity and
            personalized service, helping you navigate property sales, rentals,
            and more. Let us help you find your perfect property today */}
            Discover properties recently viewed by buyers like you. Stay
            inspired by trending options and explore opportunities you might
            have missed
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`w-[344px] md:min-w-[466px] min-h-[38px] py-[10px] gap-[15px] flex`}>
          <Button
            value='Property insight'
            green={buttons.button1}
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
              });
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button1 ? '' : 'text-[#5A5D63]'
            }`}
          />
          <Button
            green={buttons.button2}
            value='Land for sale'
            onClick={() => {
              setButtons({
                button1: false,
                button2: true,
                button3: false,
              });
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button2 ? '' : 'text-[#5A5D63]'
            }`}
          />
          <Button
            green={buttons.button3}
            value='Rent'
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: true,
              });
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button3 ? '' : 'text-[#5A5D63] '
            }`}
          />
        </motion.div>
        <motion.div
          ref={housesRef}
          initial={{ opacity: 0, x: 20 }}
          animate={areHousesVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={`lg:w-[1154px] w-full min-h-[446px] grid lg:grid-cols-4 lg:gap-[83px] grid-cols-1 md:grid-cols-2 gap-[24px]`}>
          {isLoading ? (
            <div className='w-[inherit] flex justify-center items-center'>
              <Trio size={50} speed={1.3} color='#09391C' />
            </div>
          ) : properties.length !== 0 ? (
            properties?.map((property: any, idx: number) => {
              return (
                <Card
                  images={Array(12).fill(imgSample)}
                  onClick={() => {
                    //Retrieve existing selectedBriefs from localStorage
                    const existingBriefs = JSON.parse(
                      localStorage.getItem('selectedBriefs') || '[]'
                    );

                    //check if the new property exists
                    const isPropertyExisting = existingBriefs.find(
                      (brief: any) => brief._id === property._id
                    );

                    if (isPropertyExisting) {
                      //apply toast warning
                      toast.error('Property already selected');
                      return;
                    }

                    //check if the properties selected has exceeded 3
                    if (existingBriefs.length >= 3) {
                      //apply toast warning
                      toast.error('Maximum properties selected');
                      return;
                    }

                    //Ensure it's an array and add the new property
                    const updatedBriefs = Array.isArray(existingBriefs)
                      ? [...existingBriefs, property]
                      : [property];

                    //Save back to localStorage
                    localStorage.setItem(
                      'selectedBriefs',
                      JSON.stringify(updatedBriefs)
                    );
                    toast.success('Successfully added for inspection');
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
                      value: property.propertyFeatures?.noOfBedrooms || 'N/A',
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
              );
            })
          ) : (
            <div className='w-[inherit] flex justify-center items-center'>
              <p
                className={`text-[#09391C] text-base font-semibold ${epilogue.className}`}>
                No properties available at the moment
              </p>
            </div>
          )}
        </motion.div>
        <div className='flex justify-center items-center mt-6'>
          <button
            onClick={() => {
              window.location.href = '/buy_page';
            }}
            type='button'
            className='flex justify-center items-center gap-2'>
            <span className='text-base text-[#09391C] leading-[25px] font-semibold'>
              Show more
            </span>{' '}
            <Image
              src={arrowIcon}
              width={12}
              height={15}
              alt=''
              className='w-[12px] h-[15px]'
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section2;
