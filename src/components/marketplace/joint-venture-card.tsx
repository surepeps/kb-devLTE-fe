/** @format */
'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import imageSample from '@/assets/assets.png';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
import markerIcon from '@/svgs/marker.svg';
import { usePageContext } from '@/context/page-context';
import Button from '../general-components/button';

interface CardDataProps {
  // isRed?: boolean;
  // onClick?: () => void;
  // className?: string;
  // isPremium?: boolean;
  // style?: React.CSSProperties;
  // isDisabled?: boolean;

  isRed?: boolean;
  cardData: { header: string; value: string }[];
  onClick?: () => void;
  className?: string;
  images: StaticImport[];
  isPremium?: boolean;
  style?: React.CSSProperties;
  isDisabled?: boolean;
  onCardPageClick?: () => void;
  /**
   * coming from submit Lol button
   */
  isComingFromSubmitLol: boolean;
  setIsComingFromSubmitLol: (type: boolean) => void;
  setPropertySelected: (type: any[]) => void;
  property: any;
  properties: any[];
  isAddInspectionalModalOpened: boolean;
  setIsAddInspectionModalOpened: (type: boolean) => void;
  onSubmitLoi?: () => void;
}

const JointVentureModalCard = ({
  isRed,
  onClick,
  className,
  cardData,
  images = [],
  style,
  isDisabled,
  onCardPageClick,
  isComingFromSubmitLol,
  setIsComingFromSubmitLol,
  setPropertySelected,
  property,
  setIsAddInspectionModalOpened,
  properties,
  isAddInspectionalModalOpened,
  onSubmitLoi,
}: CardDataProps) => {
  const { setViewImage, setImageData } = usePageContext();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const getValidImageUrl = (url: string | StaticImport | undefined) => {
  if (!url) return imageSample; // fallback image
  if (typeof url === 'string') {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('www.')) return `https://${url}`;
    if (url.startsWith('/')) return url;
    return imageSample;
  }
  return url;
};

  return (
    <Fragment>
      <motion.div
        onClick={onCardPageClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        ref={cardRef}
        style={style}>
        <div className='md:w-[261px] w-full p-[12px] flex flex-col gap-[11px] bg-[#FFFFFF] on'>
          <div className='min-h-[62px] w-full flex gap-[10px] items-end relative'>
            <Image
              src={getValidImageUrl(property?.pictures?.[0])}
              width={61}
              height={62}
              onClick={() => {
                setImageData(property?.pictures ?? []);
                setViewImage(true);
              }}
              className='w-[61px] h-[62px] object-cover'
              alt=''
            />
            <h3 className='font-semibold text-[#000000] text-lg'>
               N {property?.price ? Number(property.price).toLocaleString() : 'N/A'}
            </h3>
            {/**Premium */}
            <div className=' w-[98px] top-0 right-0 md:right-auto absolute mb-[35px] ml-[151px] h-[28px] py-[8px] px-[6px] text-white flex justify-between items-center bg-[#FF3D00]'>
              <span>Premium</span>
              <FontAwesomeIcon icon={faStarOfDavid} size='sm' />
            </div>
          </div>
          <div className='h-[81px] w-full flex flex-col gap-[5px]'>
            <div className='flex gap-[5px] items-center'>
              <Image
                src={markerIcon}
                alt='marker'
                width={16}
                height={16}
                className='w-[16px] h-[16px]'
              />
              <span className='text-xs text-[#000000]'>
                {property?.location
                  ? `${property.location.area || ''}, ${property.location.localGovernment || ''}, ${property.location.state || ''}`
                  : 'N/A'}
              </span>
            </div>
            <div className='flex flex-wrap gap-[2%] min-h-[57px] cursor-pointer'>
              {/**Land sqft */}
              <div className='bg-[#E4EFE7] px-[7px] h-[26px] w-[59%] text-xs text-[#000000] flex items-center mb-2'>
                {property?.landSize?.size
                  ? `${property.landSize.size} ${property.landSize.measurementType || ''}`
                  : 'N/A'}
              </div>
              <div className='bg-[#E4EFE7] px-[7px] text-xs text-[#000000] h-[26px]  w-[39%] flex items-center'>
                  {property?.features && property.features.length > 0
                  ? property.features.slice(0, 2).join(', ')
                  : ''}
              </div>
              <div className='bg-[#E4EFE7] px-[7px] text-xs text-[#000000] h-[26px] w-[100%] flex items-center min-w-fit'>
                  {property?.docOnProperty && property.docOnProperty.length > 0
                    ? property.docOnProperty.slice(0, 2).map((doc: any) => doc.docName).join(', ')
                    : 'N/A'}
              </div>
            </div>
          </div>
          <hr />
          <div className='flex flex-col gap-[10px]'>
            <Button
              value={`Submit LOI`}
              onClick={() => {
                setIsAddInspectionModalOpened(true);
                  if (onSubmitLoi) {
                      onSubmitLoi();
                  }
                if (isAddInspectionalModalOpened) {
                  //preserving the selected properties, and keeping the current
                  // property selected
                  //check if the property selected is already in the list
                  const isPropertySelected = properties?.some(
                    (item: any) => item?._id === property?._id
                  );
                  if (isPropertySelected) {
                    //if the property is already in the list, show property selected first, before the others, without adding it again

                    const newProperties = properties?.filter(
                      (item: any) => item?._id !== property?._id
                    );
                    // setIsComingFromSubmitLol?.(true);
                    setPropertySelected([property, ...newProperties]);
                  } else {
                    //if the property is not selected, add it to the list
                    setPropertySelected([property, ...properties]);
                  }
                } else {
                  setPropertySelected([property]);
                  setIsComingFromSubmitLol?.(true);
                }
              }}
              type='button'
              // green={isRed ? false : true}
              //red={isRed}
              //onClick={onClick}
              className='min-h-[38px] px-[24px] bg-[#1976D2] text-[#FFFFFF] text-base leading-[25.6px] font-bold'
            />
            <Button
              value={`Select for Inspection`}
              type='button'
              //green={isRed ? false : true}
              //red={isRed}
              onClick={onClick}
              isDisabled={isDisabled} // Disable the button if the property is already selected
              className={`min-h-[50px] py-[12px] px-[24px] ${
                isDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8DDB90] hover:bg-[#76c77a]'
              } text-[#FFFFFF] text-base leading-[25.6px] font-bold`}
            />
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};

export default JointVentureModalCard;
