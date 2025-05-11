/** @format */

'use client';
import { usePageContext } from '@/context/page-context';
import React, { Fragment, useEffect, useState } from 'react';
import Card from '../general-components/card';
import { epilogue } from '@/styles/font';
import sampleImage from '@/assets/Agentpic.png';
import toast from 'react-hot-toast';
import Loading from '../loading-component/loading';
import { IsMobile } from '@/hooks/isMobile';
import RentSearchModal from './rent-search-modal';
import BuyAPropertySearchModal from './buy-a-property-modal';
import JointVentureModal from './joint-venture-modal';
import JointVentureModalCard from './joint-venture-card';

const SearchModal = () => {
  const [selectedType, setSelectedType] = useState<string>('Land');
  const { selectedType: userSelectedMarketPlace } = usePageContext();
  const [uniqueProperties, setUniqueProperties] = useState<Set<string>>(
    new Set()
  );
  const [formikStatus, setFormikStatus] = useState<
    'idle' | 'pending' | 'success' | 'failed'
  >('success');

  const renderDynamicComponent = () => {
    switch (userSelectedMarketPlace) {
      case 'Buy a property':
        return (
          <>
            <BuyAPropertySearchModal selectedBriefs={uniqueProperties.size} />
            <section className='flex justify-center items-center mt-[20px]'>
              {formikStatus && renderBriefs()}
            </section>
          </>
        );
      case 'Rent/Lease a property':
        return (
          <>
            <RentSearchModal />
            <section className='flex justify-center items-center mt-[20px]'>
              {formikStatus && renderBriefs()}
            </section>
          </>
        );
      case 'Find property for Joint Venture':
        return (
          <>
            <JointVentureModal />
            <section className='flex justify-center items-center mt-[20px]'>
              {formikStatus && renderBriefs(userSelectedMarketPlace)}
            </section>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderBriefs = (type?: string) => {
    switch (formikStatus) {
      case 'success':
        return (
          <div className='flex flex-col gap-[21px] lg:w-[1154px]'>
            <h2
              className={`text-[#09391C] font-semibold ${epilogue.className} text-lg`}>
              Select the property brief you wish to inspect
            </h2>
            <div className='grid grid-cols-4 gap-[37px]'>
              {Array.from({ length: 12 }).map((__, idx: number) => {
                if (type === 'Find property for Joint Venture') {
                  return <JointVentureModalCard key={idx} />;
                }
                return (
                  <Card
                    style={{ width: '281px' }}
                    images={[sampleImage]}
                    onClick={() =>
                      handlePropertiesSelection(idx.toLocaleString())
                    }
                    cardData={dummyCardData}
                    key={idx}
                  />
                );
              })}
            </div>
          </div>
        );
      case 'pending':
        return <Loading />;
      case 'idle':
        return <p>Failed to Load</p>;
      default:
        return <p>Failed to Load</p>;
    }
  };

  const handlePropertiesSelection = (id: string) => {
    if (uniqueProperties.has(id)) {
      return toast.error('Property already selected');
    }
    setUniqueProperties((prev) => new Set([...prev, id]));
    toast.success('Property selected');
  };

  const is_mobile = IsMobile();

  useEffect(() => {}, []);

  return (
    <Fragment>
      {is_mobile ? (
        <p>View is not allowed on mobile yet</p>
      ) : (
        userSelectedMarketPlace && renderDynamicComponent()
      )}
    </Fragment>
  );
};

const dummyCardData = [
  {
    header: 'Property Type',
    value: 'N/A',
  },
  {
    header: 'Price',
    value: `₦${Number(2180000).toLocaleString()}`,
  },
  {
    header: 'Bedrooms',
    value: 'N/A',
  },
  {
    header: 'Location',
    value: `N/A`,
  },
  {
    header: 'Documents',
    value: `N/A`,
  },
];

export default SearchModal;
