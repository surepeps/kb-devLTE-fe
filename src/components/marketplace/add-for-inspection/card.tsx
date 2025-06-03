/** @format */
'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/general-components/button';
//import ViewImage from './viewImage';
import { usePageContext } from '@/context/page-context';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { motion } from 'framer-motion';
import randomImage from '@/assets/ChatGPT Image Apr 11, 2025, 12_48_47 PM.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
import markerSVG from '@/svgs/marker.svg';
import { usePathname } from 'next/navigation';
interface CardDataProps {
  isRed?: boolean;
  cardData: { header: string; value: string }[];
  onClick?: () => void;
  className?: string;
  images: StaticImport[];
  isPremium?: boolean;
  style?: React.CSSProperties;
  isDisabled?: boolean;
  onCardPageClick?: () => void;
  onPriceNegotiation?: () => void;
  isAddInspectionModalOpened: boolean;
  setIsAddInspectionModalOpened?: (type: boolean) => void;
  property: any;
  allProperties: any[];
  setPropertySelected: (type: any[]) => void;
  isComingFromPriceNeg?: boolean;
  setIsComingFromPriceNeg?: (type: boolean) => void;
}

const Card = ({
  isRed,
  cardData,
  onClick,
  className,
  images,
  style,
  isDisabled,
  onCardPageClick,
  onPriceNegotiation,
  setIsAddInspectionModalOpened,
  property,
  setPropertySelected,
  isComingFromPriceNeg,
  setIsComingFromPriceNeg,
  isAddInspectionModalOpened,
  allProperties,
}: CardDataProps) => {
  const [count, setCount] = useState<number>(4);
  const [text, setText] = useState<string>('View more');
  const { setViewImage, setImageData } = usePageContext();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const path = usePathname();

  const getValidImageUrl = (url: string | StaticImport | undefined) => {
  if (!url) return randomImage.src; // fallback image
  if (typeof url === 'string') {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // If it looks like a cloudinary or external url but missing protocol, add https://
    if (url.startsWith('www.')) return `https://${url}`;
    // If it's a local image, ensure it starts with /
    if (url.startsWith('/')) return url;
    // fallback
    return randomImage.src;
  }
  // If it's a StaticImport (local import), return as is
  return url;
};

  useEffect(() => {
    if (count === 6) {
      setText('View less');
    } else if (count === 4) {
      setText('View more');
    }
  }, [count]);
  return (
    <Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        ref={cardRef}
        style={style}
        className={`w-full md:w-[296px] shrink-0 bg-white border-[1px] py-[21px] px-[19px] gap-[10px] transition-all duration-500 ${className}`}>
        <div className='flex flex-col gap-[11px] w-full'>
          <div className={`w-full h-[148px] bg-gray-200`}>
            {/**Premium */}
            <div
              // style={{
              //   position: '',
              // }}
              className='w-[98px] h-[28px] py-[8px] px-[6px] text-white flex justify-between items-center bg-[#FF3D00]'>
              <span>Premium</span>
              <FontAwesomeIcon icon={faStarOfDavid} size='sm' />
            </div>
          <Image
            src={getValidImageUrl(Array.isArray(images) && images[0] ? images[0] : undefined)}
            alt=''
            width={400}
            height={200}
            className='w-full h-[148px] object-cover'
          />
          </div>
          <div className='flex flex-col gap-[2px] mt-6'>
            <div className='flex gap-[7px]'>
              {cardData.map(
                (item: { header: string; value: string }, idx: number) => {
                  if (item.header === 'Property Type') {
                    return (
                      <div
                        key={idx}
                        className='min-w-fit h-[26px] px-[6px] flex items-center rounded-[3px] bg-[#E4EFE7] text-xs text-[#000000]'>
                        {item.value}
                      </div>
                    );
                  }
                }
              )}
            </div>
            {/**price */}
            <div>
              {cardData.map(
                (item: { header: string; value: string }, idx: number) => {
                  if (item.header === 'Price') {
                    return (
                      <h2
                        key={idx}
                        className='text-lg font-semibold text-[#000000]'>
                        {item.value}
                      </h2>
                    );
                  }
                }
              )}
            </div>
            {/**Bedrooms | Bathroom | sqft */}
            <div className='flex gap-[9px]'>
              {cardData.map(
                (item: { header: string; value: string }, idx: number) => {
                  if (item.header === 'Bedrooms') {
                    return (
                      <h2
                        key={idx}
                        className='text-xs font-normal text-[#000000]'>
                        {item.value} Bedrooms
                      </h2>
                    );
                  }
                }
              )}
            </div>
            {/**Location and see images */}
            <div className='flex justify-between items-center'>
              <div className='flex gap-[5px]'>
                <Image
                  src={markerSVG}
                  width={16}
                  height={16}
                  alt='marker'
                  className='w-[16px] h-[16px]'
                />
                {cardData.map(
                  (item: { header: string; value: string }, idx: number) => {
                    if (item.header === 'Location') {
                      return (
                        <h2
                          key={idx}
                          className='text-xs font-normal text-[#000000]'>
                          {item.value}
                        </h2>
                      );
                    }
                  }
                )}
              </div>

              <button
                type='button'
                onClick={() => {
                  // setImageData(images);
                  // setViewImage(true);
                  onCardPageClick?.();
                }}
                className='text-xs font-semibold text-[#0B423D] underline'>
                View Details
              </button>
            </div>
          </div>
            <Button
              value={`Price Negotiation`}
              type='button'
              red={isRed}
              onClick={() => {
                if (onPriceNegotiation) {
                  // This will be used in AddForInspection to open NegiotiatePrice
                  onPriceNegotiation();
                } else if (isAddInspectionModalOpened) {
                  // Marketplace context with inspection modal open
                  const isPropertySelected = allProperties?.some(
                    (item: any) => item?._id === property?._id
                  );
                  if (isPropertySelected) {
                    const newProperties = allProperties?.filter(
                      (item: any) => item?._id !== property?._id
                    );
                    setIsComingFromPriceNeg?.(true);
                    setPropertySelected([property, ...newProperties]);
                  } else {
                    setPropertySelected([property, ...allProperties]);
                  }
                } else {
                  // Marketplace context without inspection modal open
                  setPropertySelected([property]);
                  setIsComingFromPriceNeg?.(true);
                }
              }}
              className='min-h-[50px] py-[12px] px-[24px] bg-[#1976D2] text-[#FFFFFF] text-base leading-[25.6px] font-bold'
            />
          <Button
            value={`Remove`}
            type='button'
            // green={!isRed}
            // red={isRed}
            onClick={onClick}
            isDisabled={isDisabled} // Disable the button if the property is already selected
            className={`min-h-[50px] py-[12px] px-[24px] ${
              isDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#FF3D00] hover:bg-[#8a3318]'
            } text-[#FFFFFF] text-base leading-[25.6px] font-bold`}
          />
        </div>
      </motion.div>
    </Fragment>
  );
};

const BreadCrumb = ({
  limit,
  cardData,
}: {
  limit: number;
  cardData: { header: string; value: string }[];
}) => {
  return (
    <>
      {cardData?.map((item, idx: number) => {
        if (idx < limit) {
          return (
            <div
              key={idx}
              className='min-h-[60px] w-full py-[5px] px-[20px] gap-[6px] flex flex-row justify-between items-center lg:items-start lg:flex-col bg-[#F7F7F8]'>
              <h2 className='text-[14px] font-ubuntu leading-[22.4px] tracking-[0.1px] text-[#707281]'>
                {item.header}
              </h2>
              <span
                dangerouslySetInnerHTML={{ __html: item.value }}
                className={`font-medium overflow-hidden ${
                  limit < 6 ? 'h-[20px]' : 'min-h-[20px]'
                } text-[14px] font-ubuntu leading-[22.4px] tracking-[0.1px] text-[#0B0D0C]`}
              />
            </div>
          );
        }
      })}
    </>
  );
};

export default Card;
