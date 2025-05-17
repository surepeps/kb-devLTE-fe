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
import SelectStateLGA from './select-state-lga';
import { useFormik } from 'formik';
import Mobile from './for-mobile';
import { URLS } from '@/utils/URLS';
import { shuffleArray } from '@/utils/shuffleArray';
import { useRouter } from 'next/navigation';

const SearchModal = () => {
  const [selectedType, setSelectedType] = useState<string>('Land');
  const { selectedType: userSelectedMarketPlace } = usePageContext();
  const [uniqueProperties, setUniqueProperties] = useState<Set<string>>(new Set());
  const [selectedBriefs, setSelectedBriefs] = useState<any[]>([]); // Store selected briefs
  const [formikStatus, setFormikStatus] = useState<
    'idle' | 'pending' | 'success' | 'failed'
  >('success');
  const [errMessage, setErrMessage] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [usageOptions, setUsageOptions] = useState<string[]>([]);
  const [rentFilterBy, setRentFilterBy] = useState<string[]>([]);
  const [homeCondition, setHomeCondition] = useState<string>('');
  const [briefToFetch, setBriefToFetch] = useState<string>(
    URLS.buyersFetchBriefs
  );

  const router = useRouter();

  useEffect(() => {
    console.log(usageOptions);
  }, [usageOptions]);

  useEffect(() => {
    switch (userSelectedMarketPlace) {
      case 'Buy a property':
        return setBriefToFetch(URLS.buyersFetchBriefs);
      case 'Find property for Joint Venture':
        return setBriefToFetch(URLS.buyersFetchBriefs);
      case 'Rent/Lease a property':
        return setBriefToFetch('/properties/rents/all');
      default:
        return setBriefToFetch(URLS.buyersFetchBriefs);
    }
  }, [userSelectedMarketPlace]);

  const renderDynamicComponent = () => {
    switch (userSelectedMarketPlace) {
      case 'Buy a property':
        return (
          <div className='relative w-full flex flex-col'>
            <BuyAPropertySearchModal
              usageOptions={usageOptions}
              setUsageOptions={setUsageOptions}
              selectedBriefs={uniqueProperties.size}
            />
            <section className='w-full flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]'>
              {(formikStatus || usageOptions) &&
                renderBriefs('Buy a property', usageOptions)}
            </section>
          </div>
        );
      case 'Rent/Lease a property':
        return (
          <div className='relative w-full flex flex-col'>
            <RentSearchModal
              homeCondition={homeCondition}
              setHomeCondition={setHomeCondition}
              rentFilterBy={rentFilterBy}
              setRentFilterBy={setRentFilterBy}
              selectedBriefs={uniqueProperties.size}
            />
            <section className='flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]'>
              {formikStatus &&
                renderBriefs(
                  userSelectedMarketPlace,
                  rentFilterBy,
                  homeCondition
                )}
            </section>
          </div>
        );
      case 'Find property for Joint Venture':
        return (
          <div className='relative w-full flex flex-col'>
            <JointVentureModal selectedBriefs={uniqueProperties.size} />
            <section className='flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]'>
              {formikStatus && renderBriefs(userSelectedMarketPlace, [''])}
            </section>
          </div>
        );
      default:
        return <></>;
    }
  };

  const renderBriefs = (
    type: string,
    filterBy: string[],
    condition?: string
  ) => {
    const briefsToDisplay = () => {
      switch (type) {
        /**Buy a property Briefs */
        case 'Buy a property':
          return properties?.map((property, idx: number) => {
            /**Check users filtering options and display based on the filter */
            if (
              (filterBy?.includes('Land') &&
                property.propertyType === 'Land') ||
              (filterBy?.includes('Residential') &&
                property.propertyType === 'Residential') ||
              (filterBy?.includes('Commercial') &&
                property.propertyType === 'Commercial')
            ) {
              console.log(property.propertyType);
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures}
                  onCardPageClick={() => {
                    router.push(`/property/${type}/${property._id}`);
                  }}
                  onClick={() => {
                    handlePropertiesSelection(idx.toLocaleString());
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
                      value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                        (item: { _id: string; docName: string }) =>
                          `<li key={${item._id}>${item.docName}</li>`
                      )}<ol>`,
                    },
                  ]}
                  key={idx}
                  isDisabled={uniqueProperties.has(idx.toLocaleString())}
                />
              );
            } else if (
              /**If filters include all or none is selected, display all */
              filterBy?.includes('All') ||
              filterBy?.['length'] === 0
            ) {
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures}
                  onCardPageClick={() => {
                    router.push(`/property/${type}/${property._id}`);
                  }}
                  onClick={() =>
                    handlePropertiesSelection(idx.toLocaleString())
                  }
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
                      value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                        (item: { _id: string; docName: string }) =>
                          `<li key={${item._id}>${item.docName}</li>`
                      )}<ol>`,
                    },
                  ]}
                  key={idx}
                  isDisabled={uniqueProperties.has(idx.toLocaleString())}
                />
              );
            }
          });
        case 'Find property for Joint Venture':
          return properties?.map((property, idx: number) => {
            return (
              <JointVentureModalCard
                key={idx}
                onClick={() => handlePropertiesSelection(idx.toLocaleString())}
                isDisabled={uniqueProperties.has(idx.toLocaleString())} 
                cardData={[]} 
                images={[]}              
              />
            );
          });

        case 'Rent/Lease a property':
          return properties?.map((property, idx: number) => {
            /**Check users filtering options and display based on the filter */
            if (
              (filterBy?.includes('Land') &&
                property.propertyType === 'Land') ||
              (filterBy?.includes('Residential') &&
                property.propertyType === 'Residential') ||
              (filterBy?.includes('Commercial') &&
                property.propertyType === 'Commercial') ||
              (filterBy?.includes('Duplex') &&
                property.propertyType === 'Duplex') ||
              condition?.includes('Brand new') ||
              condition?.includes('Good condition') ||
              condition?.includes('Fairly used') ||
              condition?.includes('Need Renovation') ||
              condition?.includes('New Building')
            ) {
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures}
                  onCardPageClick={() => {
                    router.push(`/property/Rent/${property._id}`);
                  }}
                  onClick={() =>
                    handlePropertiesSelection(idx.toLocaleString())
                  }
                  cardData={[
                    {
                      header: 'Property Type',
                      value: property.propertyType,
                    },
                    {
                      header: 'Price',
                      value: `₦${Number(
                        property.rentalPrice
                      ).toLocaleString()}`,
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
                  isDisabled={uniqueProperties.has(idx.toLocaleString())}
                />
              );
            } else if (
              /**If filters include all or none is selected, display all */
              filterBy?.includes('All') ||
              filterBy?.['length'] === 0 ||
              condition?.includes('All')
            ) {
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures}
                  onCardPageClick={() => {
                    router.push(`/property/Rent/${property._id}`);
                  }}
                  onClick={() =>
                    handlePropertiesSelection(idx.toLocaleString())
                  }
                  cardData={[
                    {
                      header: 'Property Type',
                      value: property.propertyType,
                    },
                    {
                      header: 'Price',
                      value: `₦${Number(
                        property.rentalPrice
                      ).toLocaleString()}`,
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
                  isDisabled={uniqueProperties.has(idx.toLocaleString())}
                />
              );
            }
          });
      }
    };
    switch (formikStatus) {
      case 'success':
        return (
          <div className='flex flex-col gap-[21px] w-full lg:w-[1154px]'>
            <h2
              className={`text-[#09391C] font-semibold ${epilogue.className} md:inline hidden text-lg`}>
              Select the property brief you wish to inspect
            </h2>
            <div className='grid md:grid-cols-4 gap-[20px] md:gap-[37px]'>
              {type && briefsToDisplay()}
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
    // Find the property by id and add to selectedBriefs
    const idx = Number(id);
    if (!isNaN(idx) && properties[idx]) {
      setSelectedBriefs((prev) => [...prev, properties[idx]]);
    }
    toast.success('Property selected');
  };

  const is_mobile = IsMobile();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllData = async () => {
      setFormikStatus('pending');
      try {
        const response = await fetch(URLS.BASE + briefToFetch, {
          signal,
        });

        if (!response.ok) {
          setErrMessage('Failed to fetch data');
          setFormikStatus('failed');
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
        setFormikStatus('success');
        // const randomIndex = Math.floor(
        //   Math.random() * (data.data.length - 10 + 1)
        // );
        // const randomData = data.data.slice(randomIndex, randomIndex + 10);
        const shuffledData = shuffleArray(data.data);
        setProperties(shuffledData.slice(0, 10));
        console.log(`Properties: ${properties}`);
        console.log(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setErrMessage(err.message || 'An error occurred');
          setFormikStatus('failed');
        }
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, [briefToFetch]);

  return (
    <Fragment>
      {is_mobile ? (
        <Mobile
          selectedMarketPlace={userSelectedMarketPlace}
          renderBrief={renderDynamicComponent}
          selectedBriefs={uniqueProperties.size}
          onSelectBrief={handlePropertiesSelection}
          selectedBriefsList={selectedBriefs} // pass the array
        />
      ) : (
        userSelectedMarketPlace &&
        renderDynamicComponent()
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
