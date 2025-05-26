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
import { POST_REQUEST } from '@/utils/requests';

type PayloadProps = {
  twoDifferentInspectionAreas: boolean;
  initialAmount: number;
  toBeIncreaseBy: number;
};

const SearchModal = ({
  isAddForInspectionModalOpened,
  setIsAddInspectionModalOpened,
  setPropertiesSelected,
  propertiesSelected,
  addForInspectionPayload,
  setAddForInspectionPayload,
  isComingFromPriceNeg,
  comingFromPriceNegotiation,
  inspectionType,
  setInspectionType,
  isComingFromSubmitLol,
  setIsComingFromSubmitLol,
}: {
  isAddForInspectionModalOpened: boolean;
  setIsAddInspectionModalOpened: (type: boolean) => void;
  propertiesSelected: any[];
  setPropertiesSelected: (type: any[]) => void;
  addForInspectionPayload: PayloadProps;
  setAddForInspectionPayload: (type: PayloadProps) => void;
  /**
   * coming from the price negotiation button
   */
  isComingFromPriceNeg?: boolean;
  comingFromPriceNegotiation?: (type: boolean) => void;
  //inspection type
  inspectionType: 'Buy' | 'JV' | 'Rent/Lease';
  setInspectionType: (type: 'Buy' | 'JV' | 'Rent/Lease') => void;
  /**
   * coming from submit Lol button
   */
  isComingFromSubmitLol: boolean;
  setIsComingFromSubmitLol: (type: boolean) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string>('Land');
  const { selectedType: userSelectedMarketPlace } = usePageContext();
  // const [uniqueProperties, setUniqueProperties] = useState<Set<string>>(new Set());
  const [selectedBriefs, setSelectedBriefs] = useState<any[]>([]); // Store selected briefs
  const [uniqueProperties, setUniqueProperties] = useState<Set<any>>(
    new Set(propertiesSelected)
  );
  const [formikStatus, setFormikStatus] = useState<
    'idle' | 'pending' | 'success' | 'failed'
  >('success');
  const [errMessage, setErrMessage] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [usageOptions, setUsageOptions] = useState<string[]>([]);
  const [rentFilterBy, setRentFilterBy] = useState<string[]>([]);
  const [jvFilterBy, setJvFilterBy] = useState<string[]>(['All']);
  const [homeCondition, setHomeCondition] = useState<string>('');
  const [briefToFetch, setBriefToFetch] = useState<string>(
    URLS.buyersFetchBriefs
  );

  const router = useRouter();

  useEffect(() => {
    console.log(usageOptions);
  }, [usageOptions]);


const handleSearch = async (searchPayload: any) => {
  setFormikStatus('pending');
    console.log("searchPayload", searchPayload);
  try {
    await toast.promise(
      POST_REQUEST(URLS.BASE + URLS.searchBrief, {
        ...searchPayload,
      }).then((response) => {
        const data = Array.isArray(response) ? response : response?.data;
        if (!data) {
          setErrMessage('Failed to fetch data');
          setFormikStatus('failed');
          throw new Error('Failed to fetch data');
        }
        setFormikStatus('success');
        const shuffledData = shuffleArray(data);
        setProperties(shuffledData.slice(0, 10));
        // setUsageOptions(['All'])
      }),
      {
        loading: 'Searching...',
        success: 'Properties loaded!',
        error: 'Failed to load properties',
      }
    );
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error(err);
      setErrMessage(err.message || 'An error occurred');
      setFormikStatus('failed');
    }
  }
};


    useEffect(() => {
      let briefType = '';
      switch (userSelectedMarketPlace) {
        case 'Buy a property':
          briefType = 'Outright Sales';
          break;
        case 'Find property for Joint Venture':
          briefType = 'Joint Venture';
          break;
        case 'Rent/Lease a property':
          briefType = 'Rent';
          break;
        default:
          briefType = 'Outright Sales';
      }
      // You can set default page and limit as needed
      setBriefToFetch(`${URLS.fetchBriefs}?page=1&limit=10&briefType=${encodeURIComponent(briefType)}`);
    }, [userSelectedMarketPlace]);

  const renderDynamicComponent = () => {
    switch (userSelectedMarketPlace) {
      case 'Buy a property':
        return (
          <div className='relative w-full flex flex-col'>
            <BuyAPropertySearchModal
              usageOptions={usageOptions}
              addForInspectionPayload={addForInspectionPayload}
              setUsageOptions={setUsageOptions}
              selectedBriefs={uniqueProperties.size}
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
              onSearch={handleSearch}
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
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              addForInspectionPayload={addForInspectionPayload}
              setUsageOptions={setUsageOptions}
              inspectionType={inspectionType}
              setInspectionType={setInspectionType}
              onSearch={handleSearch}
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
            <JointVentureModal
              onSearch={handleSearch}
              selectedBriefs={uniqueProperties.size}
              addForInspectionPayload={addForInspectionPayload}
              // setUsageOptions={setUsageOptions}
              setSelectedBriefs={setUniqueProperties}
              setAddInspectionModal={setIsAddInspectionModalOpened}
              inspectionType={inspectionType}
              usageOptions={jvFilterBy}
              setUsageOptions={setJvFilterBy}
              setInspectionType={setInspectionType}
            />
            <section className='flex-1 overflow-y-auto flex justify-center items-start md:mt-[20px]'>
              {formikStatus && renderBriefs(userSelectedMarketPlace, jvFilterBy)}
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
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures || [sampleImage]}
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  isComingFromPriceNeg={isComingFromPriceNeg}
                  setIsComingFromPriceNeg={comingFromPriceNegotiation}
                  property={property}
                  onCardPageClick={() => {
                    router.push(`/property/${type}/${property._id}`);
                  }}
                  onClick={() => {
                    handlePropertiesSelection(property);
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
                  isDisabled={uniqueProperties.has(property)}
                />
              );
            } else if (
              /**If filters include all or none is selected, display all */
              filterBy?.includes('All') ||
              filterBy?.length === 0
              // filterBy?.['length'] === 0
            ) {
              return (
                <Card
                  style={is_mobile ? { width: '100%' } : { width: '281px' }}
                  images={property?.pictures}
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  isComingFromPriceNeg={isComingFromPriceNeg}
                  setIsComingFromPriceNeg={comingFromPriceNegotiation}
                  property={property}
                  onCardPageClick={() => {
                    router.push(`/property/${type}/${property._id}`);
                  }}
                  onClick={() => {
                    handlePropertiesSelection(property);
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
                  isDisabled={uniqueProperties.has(property)}
                />
              );
            }
          });
        case 'Find property for Joint Venture':
          return properties?.map((property, idx: number) => {
            if (
              (filterBy?.includes('Land') &&
                property.propertyType === 'Land') ||
              (filterBy?.includes('Residential') &&
                property.propertyType === 'Residential') ||
              (filterBy?.includes('Commercial') &&
                property.propertyType === 'Commercial')
            ) {
              return (
                <JointVentureModalCard
                  key={idx}
                  onClick={() => handlePropertiesSelection(property)}
                  isDisabled={uniqueProperties.has(property)}
                  isComingFromSubmitLol={isComingFromSubmitLol}
                  setIsComingFromSubmitLol={setIsComingFromSubmitLol}
                  cardData={[]}
                  images={[]}
                  property={property}
                  properties={properties}
                  isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                />
              );
            } else if (
              /**If filters include all or none is selected, display all */
              filterBy?.includes('All') ||
              filterBy?.length === 0
              // filterBy?.['length'] === 0
            ) {
              return (
                <JointVentureModalCard
                  key={idx}
                  onClick={() => handlePropertiesSelection(property)}
                  isDisabled={uniqueProperties.has(property)}
                  isComingFromSubmitLol={isComingFromSubmitLol}
                  setIsComingFromSubmitLol={setIsComingFromSubmitLol}
                  cardData={[]}
                  images={[]}
                  property={property}
                  properties={properties}
                  isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                />
              );
            }
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
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  isComingFromPriceNeg={isComingFromPriceNeg}
                  setIsComingFromPriceNeg={comingFromPriceNegotiation}
                  property={property}
                  onCardPageClick={() => {
                    router.push(`/property/Rent/${property._id}`);
                  }}
                  onClick={() => {
                    handlePropertiesSelection(property);
                  }}
                  cardData={[
                    {
                      header: 'Property Type',
                      value: property.propertyType,
                    },
                    {
                    header: 'Price',
                    value: property.price
                      ? `₦${Number(property.price).toLocaleString()}`
                      : 'N/A',
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
                  isDisabled={uniqueProperties.has(property)}
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
                  property={property}
                  setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  setPropertySelected={setPropertiesSelected}
                  isComingFromPriceNeg={isComingFromPriceNeg}
                  setIsComingFromPriceNeg={comingFromPriceNegotiation}
                  onCardPageClick={() => {
                    router.push(`/property/Rent/${property._id}`);
                  }}
                  onClick={() => {
                    handlePropertiesSelection(property);
                  }}
                  cardData={[
                    {
                      header: 'Property Type',
                      value: property.propertyType,
                    },
                      {
                        header: 'Price',
                        value: property.price
                          ? `₦${Number(property.price).toLocaleString()}`
                          : 'N/A',
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
                  isDisabled={uniqueProperties.has(property)}
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

  const handlePropertiesSelection = (property: any) => {
    //console.log('Clicked');
    const maximumSelection: number = 2;
    if (uniqueProperties.size === maximumSelection) {
      return toast.error(`Maximum of ${maximumSelection} reached`);
    }
    uniqueProperties.add(property);
    setPropertiesSelected(Array.from(uniqueProperties));
    toast.success('Property selected');
  };

  useEffect(() => {
    //update the payload whenever the propertiesSelected changes
    const [a, b, c] = propertiesSelected.map((item) => item.location.state);

    const uniqueStates = new Set([a, b, c]);
    if (uniqueStates.size === 1) {
      //All states are the same
      setAddForInspectionPayload({
        initialAmount: 10000,
        toBeIncreaseBy: 0,
        twoDifferentInspectionAreas: false,
      });
    } else if (uniqueStates.size === 2) {
      //One is different
      setAddForInspectionPayload({
        initialAmount: 10000,
        toBeIncreaseBy: 5000,
        twoDifferentInspectionAreas: true,
      });
    } else if (uniqueStates.size === 3) {
      //All are different
      setAddForInspectionPayload({
        initialAmount: 0,
        toBeIncreaseBy: 0,
        twoDifferentInspectionAreas: true,
      });
    }
  }, [propertiesSelected]);

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
          selectedBriefsList={uniqueProperties} // pass the array
          onSubmitForInspection={(selectedBriefsList: Set<any>) => {
          setPropertiesSelected(Array.from(selectedBriefsList));
          setIsAddInspectionModalOpened(true);
        }}
        />
      ) : (
        <>{userSelectedMarketPlace && renderDynamicComponent()}</>
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
