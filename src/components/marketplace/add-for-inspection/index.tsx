/** @format */

import React, { Fragment, useEffect, useState } from 'react';
import Card from './card';
import { IsMobile } from '@/hooks/isMobile';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import { epilogue } from '@/styles/font';
import { FaArrowLeft } from 'react-icons/fa';
import NegiotiatePrice from './negotiate-price-modal';
import SelectPreferableInspectionDate from './select-preferable-inspection-date';
import { AnimatePresence } from 'framer-motion';

type PayloadProps = {
  twoDifferentInspectionAreas: boolean;
  initialAmount: number;
  toBeIncreaseBy: number;
};

type NegotiationModalProps = {
  id: string | null;
  isOpened: boolean;
  askingPrice: number | string | undefined;
  yourPrice: number | string | undefined;
};

const AddForInspection = ({
  propertiesSelected,
  setPropertiesSelected,
  setIsAddForInspectionModalOpened,
  payload,
}: {
  propertiesSelected: any[];
  setPropertiesSelected: (type: any[]) => void;
  setIsAddForInspectionModalOpened: (type: boolean) => void;
  payload: PayloadProps;
}) => {
  const is_mobile = IsMobile();
  const router = useRouter();
  const [negotiationModal, setNegationModal] =
    React.useState<NegotiationModalProps>({
      id: null,
      isOpened: false,
      askingPrice: undefined,
      yourPrice: undefined,
    });
  const [allNegotiations, setAllNegotiations] = React.useState<
    NegotiationModalProps[]
  >([]);
  const [
    isSelectPreferableInspectionDateModalOpened,
    setSelectPreferableInspectionDateModalOpened,
  ] = React.useState<boolean>(false);

  const renderCards = ({ length }: { length: number }): React.JSX.Element => {
    /**
     * check for properties selected,
     * if one ~ render two slots that can be added
     * if two ~ render one slot that can be addedd
     * if none ~ it wouldn't display this page (not to worry about this as it has been handled outside of this file)
     * for safety purpose, we can still render some static content.
     */

    switch (length) {
      case 1:
        return (
          <Fragment>
            {propertiesSelected.map((property, idx: number) => (
              <Card
                style={is_mobile ? { width: '100%' } : { width: '281px' }}
                images={property?.pictures}
                onCardPageClick={() => {
                  router.push(`/property/Rent/${property._id}`);
                }}
                onClick={() => {
                  const filteredArray: Array<any> = propertiesSelected.filter(
                    (item) => item._id !== property._id
                  );
                  setPropertiesSelected(filteredArray);
                }}
                onPriceNegotiation={() => {
                  setNegationModal({
                    isOpened: true,
                    id: property._id,
                    askingPrice: property.price,
                    yourPrice: undefined,
                  });
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
                    value: property.noOfBedrooms || 'N/A',
                  },
                  {
                    header: 'Location',
                    value: `${property.location.state}, ${property.location.localGovernment}`,
                  },
                  {
                    header: 'Documents',
                    value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                      (item: { _id: string; docName: string }) =>
                        `<li key={${item._id}>${item.docName}</li>`
                    )}<ol>`,
                  },
                ]}
                key={idx}
                //isDisabled={uniqueProperties.has(property._id)}
              />
            ))}
            <Slot
              propertiesSelected={propertiesSelected}
              setIsAddForInspectionModalOpened={
                setIsAddForInspectionModalOpened
              }
              setPropertiesSelected={setPropertiesSelected}
            />
            <Slot
              propertiesSelected={propertiesSelected}
              setIsAddForInspectionModalOpened={
                setIsAddForInspectionModalOpened
              }
              setPropertiesSelected={setPropertiesSelected}
            />
          </Fragment>
        );

      case 2:
        return (
          <Fragment>
            {propertiesSelected.map((property, idx: number) => (
              <Card
                style={is_mobile ? { width: '100%' } : { width: '281px' }}
                images={property?.pictures}
                onCardPageClick={() => {
                  router.push(`/property/Rent/${property._id}`);
                }}
                onPriceNegotiation={() => {
                  setNegationModal({
                    isOpened: true,
                    id: property._id,
                    askingPrice: property.price,
                    yourPrice: undefined,
                  });
                }}
                onClick={() => {
                  const filteredArray: Array<any> = propertiesSelected.filter(
                    (item) => item._id !== property._id
                  );
                  setPropertiesSelected(filteredArray);
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
                    value: property.noOfBedrooms || 'N/A',
                  },
                  {
                    header: 'Location',
                    value: `${property.location.state}, ${property.location.localGovernment}`,
                  },
                  {
                    header: 'Documents',
                    value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                      (item: { _id: string; docName: string }) =>
                        `<li key={${item._id}>${item.docName}</li>`
                    )}<ol>`,
                  },
                ]}
                key={idx}
                //isDisabled={uniqueProperties.has(property._id)}
              />
            ))}
            <Slot
              propertiesSelected={propertiesSelected}
              setIsAddForInspectionModalOpened={
                setIsAddForInspectionModalOpened
              }
              setPropertiesSelected={setPropertiesSelected}
            />
          </Fragment>
        );
      case 3:
        return (
          <Fragment>
            {propertiesSelected.map((property, idx: number) => (
              <Card
                style={is_mobile ? { width: '100%' } : { width: '281px' }}
                images={property?.pictures}
                onCardPageClick={() => {
                  router.push(`/property/Rent/${property._id}`);
                }}
                onClick={() => {
                  const filteredArray: Array<any> = propertiesSelected.filter(
                    (item) => item._id !== property._id
                  );
                  setPropertiesSelected(filteredArray);
                }}
                onPriceNegotiation={() => {
                  setNegationModal({
                    isOpened: true,
                    id: property._id,
                    askingPrice: property.price,
                    yourPrice: undefined,
                  });
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
                    value: property.noOfBedrooms || 'N/A',
                  },
                  {
                    header: 'Location',
                    value: `${property.location.state}, ${property.location.localGovernment}`,
                  },
                  {
                    header: 'Documents',
                    value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                      (item: { _id: string; docName: string }) =>
                        `<li key={${item._id}>${item.docName}</li>`
                    )}<ol>`,
                  },
                ]}
                key={idx}
                //isDisabled={uniqueProperties.has(property._id)}
              />
            ))}
          </Fragment>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    console.log(allNegotiations);
  }, [allNegotiations]);

  return (
    <Fragment>
      <div className='w-full flex justify-center items-center py-[30px] px-[30px]'>
        <div className='container flex flex-col gap-[10px]'>
          <div className='flex items-center gap-[24px]'>
            <FontAwesomeIcon
              icon={faArrowLeft}
              width={24}
              height={24}
              onClick={() => setIsAddForInspectionModalOpened(false)}
              className='w-[24px] h-[24px]'
            />
            <div className='flex gap-[10px] items-center'>
              <span className='text-xl text-[#25324B]'>marketplace</span>
              <span>.</span>
              <span
                className={`text-xl text-[#25324B] ${epilogue.className} font-semibold`}>
                Back
              </span>
            </div>
          </div>
          <div className='flex w-full items-center justify-center flex-col gap-[10px]'>
            <h2
              className={`text-2xl font-display font-semibold text-[#09391C] text-center`}>
              Add for Inspection
            </h2>
            <p className='text-xl text-[#5A5D63]'>
              Here are the briefs you selected for inspection.{' '}
              <span className='text-xl text-black'>
                You can negotiate the price for each property
              </span>
            </p>
          </div>
          <div className='flex justify-center items-center gap-[20px] mt-4'>
            {propertiesSelected &&
              renderCards({ length: propertiesSelected['length'] })}
          </div>
          <div className='flex flex-col gap-[10px] justify-center items-center'>
            <h2 className='text-lg text-black text-center items-center'>
              To confirm your inspection, please pay the inspection fee to
              proceed
            </h2>
            {payload.toBeIncreaseBy > 0 && (
              <span className='text-base text-[#1976D2] text-center'>
                Your inspection fee increased because you selected two different
                inspection areas.
              </span>
            )}
            {/**Amount to be paid */}
            <h2 className='text-center font-display font-semibold text-black text-3xl'>
              N{' '}
              {Number(
                payload.initialAmount + payload.toBeIncreaseBy
              ).toLocaleString()}
            </h2>
            {/**Submit */}
            <button
              onClick={() => setSelectPreferableInspectionDateModalOpened(true)}
              className='h-[65px] w-[292px] bg-[#8DDB90] text-lg font-bold text-[#FAFAFA]'
              type='button'>
              Proceed
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {negotiationModal.isOpened && (
          <NegiotiatePrice
            getID={negotiationModal.id}
            allNegotiation={allNegotiations}
            setAllNegotiation={setAllNegotiations}
            setSelectedCard={setNegationModal}
            selectedCard={negotiationModal}
          />
        )}
        {isSelectPreferableInspectionDateModalOpened && (
          <SelectPreferableInspectionDate
            closeModal={setSelectPreferableInspectionDateModalOpened}
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
};

const Slot = ({
  propertiesSelected,
  setIsAddForInspectionModalOpened,
  setPropertiesSelected,
}: {
  propertiesSelected: any;
  setIsAddForInspectionModalOpened: (type: boolean) => void;
  setPropertiesSelected: (type: any[]) => void;
}) => {
  return (
    <div className='w-[261px] h-[440px] border-[1px] border-dashed border-[#5A5D63] flex items-center justify-center'>
      <span
        title='Click to add for inspection'
        onClick={() => {
          //remove the add for inspection modal
          //save the properties already selected temporarily unless resetted by user
          setIsAddForInspectionModalOpened(false);
          setPropertiesSelected(propertiesSelected);
        }}
        className='text-lg text-black cursor-pointer font-semibold'>
        Empty slot
      </span>
    </div>
  );
};

export default AddForInspection;
