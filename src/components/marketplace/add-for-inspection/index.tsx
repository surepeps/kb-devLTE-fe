/** @format */

import React, { Fragment, useEffect, useState } from 'react';
import Card from './card';
import { IsMobile } from '@/hooks/isMobile';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowLeftLong,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { archivo, epilogue } from '@/styles/font';
import { FaArrowLeft } from 'react-icons/fa';
import {
  NegiotiatePrice,
  NegiotiatePriceWithSellerModal,
} from './negotiate-price-modal';
import SelectPreferableInspectionDate from './select-preferable-inspection-date';
import { AnimatePresence } from 'framer-motion';
import ProvideTransactionDetails from './provide-transaction-details';
import { motion } from 'framer-motion';
import Input from '@/components/general-components/Input';
import JointVentureModalCard from '../joint-venture-card';
import { Span } from 'next/dist/trace';
import LetterOfIntention from './letter-of-intention';
import UploadLolDocumentModal from './upload-your-lol-document';
import { usePageContext } from '@/context/page-context';
import { SubmitInspectionPayloadProp } from '../types/payload';

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
  isComingFromPriceNeg,
  comingFromPriceNegotiation,
  inspectionType,
  isComingFromSubmitLol,
  setIsComingFromSubmitLol,
  isAddForInspectionModalOpened,
}: {
  propertiesSelected: any[];
  setPropertiesSelected: (type: any[]) => void;
  isAddForInspectionModalOpened: boolean;
  setIsAddForInspectionModalOpened: (type: boolean) => void;
  payload: PayloadProps;
  /**
   * coming from the price negotiation button
   */
  isComingFromPriceNeg?: boolean;
  comingFromPriceNegotiation?: (type: boolean) => void;
  /**Type of inspection */
  inspectionType: 'Buy' | 'JV' | 'Rent/Lease';
  setInspectionType: (type: 'Buy' | 'JV' | 'Rent/Lease') => void;
  /**
   * coming from submit Lol button
   */
  isComingFromSubmitLol: boolean;
  setIsComingFromSubmitLol: (type: boolean) => void;
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
  const [isProvideTransactionDetails, setIsProvideTransactionDetails] =
    React.useState<boolean>(false);
  const [actionTracker, setActionTracker] = React.useState<
    { lastPage: 'SelectPreferableInspectionDate' | '' }[]
  >([]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { propertySelectedForInspection } = usePageContext();

  const [isLolGuidelineModalOpened, setIsLolGuidelineModalOpened] =
    useState<boolean>(true);
  const [isLetterOfIntentionModalOpened, setIsLetterOfIntentionModalOpened] =
    useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(
    payload.initialAmount + payload.toBeIncreaseBy
  );

  const [submitPayload, setSubmitPayload] =
    useState<SubmitInspectionPayloadProp>({} as SubmitInspectionPayloadProp);

  useEffect(() => {
    setTotalAmount(payload.initialAmount + payload.toBeIncreaseBy);
  }, [payload]);

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
            {propertiesSelected.map((property, idx: number) => {
              if (inspectionType === 'Buy' || inspectionType === 'Rent/Lease') {
                return (
                  <Card
                    style={is_mobile ? { width: '100%' } : { width: '281px' }}
                    images={property?.pictures}
                    isAddInspectionModalOpened={isAddForInspectionModalOpened}
                    //setIsAddInspectionModalOpened={setIsAddInspectionModalOpened}
                    setPropertySelected={setPropertiesSelected}
                    // isComingFromPriceNeg={isComingFromPriceNeg}
                    setIsComingFromPriceNeg={comingFromPriceNegotiation}
                    property={property}
                    allProperties={propertiesSelected}
                    onCardPageClick={() => {
                      router.push(`/property/Rent/${property._id}`);
                    }}
                    onClick={() => {
                      const filteredArray: Array<any> =
                        propertiesSelected.filter(
                          (item) => item._id !== property._id
                        );
                      setPropertiesSelected(filteredArray);
                    }}
                    onPriceNegotiation={() => {
                      setAllNegotiations(arrayOfPropertiesSelected);
                      setCurrentIndex(idx);
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
                        value: `₦${Number(
                          property?.price ?? property?.rentalPrice
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
                  />
                );
              } else if (inspectionType === 'JV') {
                return (
                  <JointVentureModalCard
                    key={idx}
                    onClick={() => {}}
                    cardData={[]}
                    isComingFromSubmitLol={isComingFromSubmitLol}
                    setIsComingFromSubmitLol={setIsComingFromSubmitLol}
                    images={[]}
                    property={property}
                    properties={propertiesSelected}
                    isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                    setPropertySelected={setPropertiesSelected}
                    setIsAddInspectionModalOpened={
                      setIsAddForInspectionModalOpened
                    }
                    onSubmitLoi={() => setIsLetterOfIntentionModalOpened(true)}
                  />
                );
              }
            })}
            <Slot
              propertiesSelected={propertiesSelected}
              setIsAddForInspectionModalOpened={
                setIsAddForInspectionModalOpened
              }
              setPropertiesSelected={setPropertiesSelected}
              inspectionType={inspectionType}
            />
          </Fragment>
        );

      case 2:
        return (
          <Fragment>
            {propertiesSelected.map((property, idx: number) => {
              if (inspectionType === 'Buy' || inspectionType === 'Rent/Lease') {
                return (
                  <Card
                    style={is_mobile ? { width: '100%' } : { width: '281px' }}
                    images={property?.pictures}
                    setPropertySelected={setPropertiesSelected}
                    // isComingFromPriceNeg={isComingFromPriceNeg}
                    setIsComingFromPriceNeg={comingFromPriceNegotiation}
                    isAddInspectionModalOpened={isAddForInspectionModalOpened}
                    property={property}
                    allProperties={propertiesSelected}
                    onCardPageClick={() => {
                      router.push(`/property/Rent/${property._id}`);
                    }}
                    onPriceNegotiation={() => {
                      setAllNegotiations(arrayOfPropertiesSelected);
                      setCurrentIndex(idx);
                      setNegationModal({
                        isOpened: true,
                        id: property._id,
                        askingPrice: property.price,
                        yourPrice: undefined,
                      });
                    }}
                    onClick={() => {
                      const filteredArray: Array<any> =
                        propertiesSelected.filter(
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
                );
              } else if (inspectionType === 'JV') {
                return (
                  <JointVentureModalCard
                    key={idx}
                    onClick={() => {}}
                    cardData={[]}
                    images={[]}
                    isComingFromSubmitLol={isComingFromSubmitLol}
                    setIsComingFromSubmitLol={setIsComingFromSubmitLol}
                    property={property}
                    properties={propertiesSelected}
                    isAddInspectionalModalOpened={isAddForInspectionModalOpened}
                    setPropertySelected={setPropertiesSelected}
                    setIsAddInspectionModalOpened={
                      setIsAddForInspectionModalOpened
                    }
                    onSubmitLoi={() => setIsLetterOfIntentionModalOpened(true)}
                  />
                );
              }
            })}
          </Fragment>
        );
      default:
        return <></>;
    }
  };

  const arrayOfPropertiesSelected = propertiesSelected?.map((property) => {
    return {
      isOpened: false as boolean,
      id: property?._id as string | null,
      askingPrice: (property?.price ?? property?.rentalPrice) as
        | number
        | undefined
        | string,
      yourPrice: undefined as number | undefined | string,
    };
  });

  // useEffect(() => {
  //   console.log(allNegotiations);
  // }, [allNegotiations]);

  // useEffect(() => console.log(isComingFromSubmitLol), [isComingFromSubmitLol]);

  // useEffect(() => {
  //   console.log(submitPayload);
  // }, [submitPayload, setSubmitPayload]);

  return (
    <Fragment>
      <div className='w-full flex justify-center items-center py-[30px] px-[30px]'>
        <div className='container flex flex-col gap-[10px]'>
          <div className='flex items-center gap-[24px]'>
            <FontAwesomeIcon
              icon={faArrowLeft}
              width={24}
              height={24}
              onClick={() => {
                const getLastAction = actionTracker[actionTracker.length - 1];
                if (getLastAction === undefined)
                  return setIsAddForInspectionModalOpened(false);
                const { lastPage } = getLastAction;
                if (lastPage === 'SelectPreferableInspectionDate') {
                  setIsAddForInspectionModalOpened(true);
                  setIsProvideTransactionDetails(false);
                  setActionTracker([]); //reset after performing the expected action
                  return;
                }
                setIsAddForInspectionModalOpened(false);
              }}
              className='w-[24px] h-[24px] cursor-pointer'
              title='Back'
            />
            <div className='flex gap-[10px] items-center'>
              <span className='text-xl text-[#25324B]'>Market place</span>
              <span>.</span>
              <span
                className={`text-xl text-[#25324B] ${epilogue.className} font-semibold`}>
                Back
              </span>
            </div>
          </div>
          <AnimatePresence>
            {isProvideTransactionDetails ? (
              <ProvideTransactionDetails
                amountToPay={payload.initialAmount + payload.toBeIncreaseBy}
                setSubmitInspectionPayload={setSubmitPayload}
                submitInspectionPayload={submitPayload}
              />
            ) : (
              <Fragment>
                <div className='flex w-full items-center justify-center flex-col gap-[10px]'>
                  <h2
                    className={`text-2xl font-display font-semibold text-[#09391C] text-center`}>
                    Add for Inspection
                  </h2>
                  <p className='text-center text-base md:text-xl text-[#5A5D63]'>
                    Here are the briefs you selected for inspection.{' '}
                    <span className='text-base md:text-xl text-black'>
                      {inspectionType === 'Buy' &&
                        'You can negotiate the price for each property'}
                      {inspectionType === 'JV' &&
                        'You can Submit LOI for each property'}
                    </span>
                    &nbsp;
                    {inspectionType === 'JV' && !isLolGuidelineModalOpened && (
                      <span
                        onClick={() => setIsLolGuidelineModalOpened(true)}
                        className='text-sm cursor-pointer font-medium text-[#1976D2] underline'>
                        LOI guideline instruction
                      </span>
                    )}
                  </p>
                </div>
                {/**
                 * Info on how to submit Lol guidelines
                 */}
                {inspectionType === 'JV' ? (
                  <AnimatePresence>
                    {isLolGuidelineModalOpened && (
                      <div className='w-full flex justify-center items-center'>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          viewport={{ once: true }}
                          exit={{ y: 20, opacity: 0 }}
                          className='border-[1px] bg-[#E8F3FE] border-[#A8ADB7] lg:w-[667px] h-[217px] p-[20px] flex flex-col gap-[24px]'>
                          <h2 className='text-black font-bold text-xl'>
                            How to submit LOI guideline
                          </h2>
                          <FontAwesomeIcon
                            icon={faClose}
                            size='sm'
                            width={24}
                            height={24}
                            color='#181336'
                            title='close modal'
                            className='w-[24px] h-[24px] absolute lg:ml-[600px] mt-[20px] cursor-pointer'
                            onClick={() => setIsLolGuidelineModalOpened(false)}
                          />
                          <div className='flex flex-col gap-[2px]'>
                            <span className='text-base text-[#5A5D63]'>
                              Please address your letter to{' '}
                              <span className='font-bold text-base text-black'>
                                Khabi-Teq Limited
                              </span>{' '}
                              and include our office address:
                            </span>
                            <span className='text-base text-[#5A5D63]'>
                              Goldrim Plaza
                            </span>
                            <span className='text-base text-[#5A5D63]'>
                              Mokuolu Street, Ifako Agege
                            </span>
                            <span className='text-base text-[#5A5D63]'>
                              Lagos 101232, Nigeria
                            </span>
                            <span className='text-base text-[#1976D2]'>
                              Kindly note that all documents will be reviewed
                              prior to approval.
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                ) : null}
                <div className='flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mt-4 w-full'>
                  {propertiesSelected &&
                    renderCards({ length: propertiesSelected.length })}
                </div>
                <div className='flex flex-col gap-[10px] justify-center items-center'>
                  <h2 className='text-lg text-black text-center items-center'>
                    To confirm your inspection, please pay the inspection fee to
                    proceed
                  </h2>
                  {payload.toBeIncreaseBy > 0 && (
                    <span className='text-base text-[#1976D2] text-center'>
                      Your inspection fee increased because you selected two
                      different inspection areas.
                    </span>
                  )}
                  {/**Amount to be paid */}
                  <h2 className='text-center font-display font-semibold text-black text-3xl'>
                    N {Number(totalAmount).toLocaleString()}
                  </h2>
                  {/**Submit */}
                  <button
                    // onClick={() => {
                    //   if (
                    //     inspectionType === 'Buy' ||
                    //     inspectionType === 'Rent/Lease'
                    //   ) {
                    //     setSubmitPayload((prev) => ({
                    //       ...prev,
                    //       propertyId: propertiesSelected[0]?._id, 
                    //     }));
                    //     setSelectPreferableInspectionDateModalOpened(true);
                    //   } else if (inspectionType === 'JV')
                    //     return setIsLetterOfIntentionModalOpened(true);
                    // }}
                    onClick={() => {
                        setSubmitPayload((prev) => ({
                          ...prev,
                          propertyId: propertiesSelected[0]?._id, 
                        }));
                        setSelectPreferableInspectionDateModalOpened(true);
                    }}
                    className='h-[65px] w-[292px] bg-[#8DDB90] text-lg font-bold text-[#FAFAFA]'
                    type='button'>
                    Proceed
                  </button>
                </div>
              </Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {currentIndex < allNegotiations.length && (
          <NegiotiatePrice
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            key={allNegotiations[currentIndex].id}
            getID={allNegotiations[currentIndex].id}
            allNegotiation={allNegotiations}
            setAllNegotiation={setAllNegotiations}
            setSelectPreferableInspectionDateModalOpened={
              setSelectPreferableInspectionDateModalOpened
            }
            setSubmitInspectionPayload={setSubmitPayload}
            submitInspectionPayload={submitPayload}
          />
        )}
        {isSelectPreferableInspectionDateModalOpened && (
          <SelectPreferableInspectionDate
            actionTracker={actionTracker}
            setActionTracker={setActionTracker}
            setIsProvideTransactionDetails={setIsProvideTransactionDetails}
            closeModal={setSelectPreferableInspectionDateModalOpened}
            setSubmitInspectionPayload={setSubmitPayload}
            submitInspectionPayload={submitPayload}
          />
        )}
        {isComingFromPriceNeg && (
          <NegiotiatePriceWithSellerModal
            getID={
              propertiesSelected[0].id ?? propertySelectedForInspection?._id
            }
            allNegotiation={
              propertiesSelected ?? [propertySelectedForInspection]
            } //the first property
            setSubmitInspectionPayload={setSubmitPayload}
            submitInspectionPayload={submitPayload}
            closeModal={comingFromPriceNegotiation}
            actionTracker={actionTracker}
            setActionTracker={setActionTracker}
            setIsProvideTransactionDetails={setIsProvideTransactionDetails}
            closeSelectPreferableModal={
              setSelectPreferableInspectionDateModalOpened
            }
          />
        )}
        {isLetterOfIntentionModalOpened && (
          <LetterOfIntention
            setIsModalClosed={setIsLetterOfIntentionModalOpened}
            closeSelectPreferableModal={
              setSelectPreferableInspectionDateModalOpened
            }
            propertyId={propertiesSelected[0]?._id}
            submitInspectionPayload={submitPayload}
            setSubmitInspectionPayload={setSubmitPayload}
          />
        )}
        {isComingFromSubmitLol && (
          <UploadLolDocumentModal
            getID={propertiesSelected[0].id}
            propertyId={propertiesSelected[0]?._id}
            allNegotiation={propertiesSelected}
            closeModal={setIsComingFromSubmitLol}
            actionTracker={actionTracker}
            setActionTracker={setActionTracker}
            setIsProvideTransactionDetails={setIsProvideTransactionDetails}
            closeSelectPreferableModal={
              setSelectPreferableInspectionDateModalOpened
            }
            setSubmitInspectionPayload={setSubmitPayload}
            submitInspectionPayload={submitPayload}
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
  inspectionType,
}: {
  propertiesSelected: any;
  setIsAddForInspectionModalOpened: (type: boolean) => void;
  setPropertiesSelected: (type: any[]) => void;
  inspectionType: 'Buy' | 'JV' | 'Rent/Lease';
}) => {
  return (
    <div
      className={`w-[261px] ${inspectionType === 'JV' && 'h-[300px]'} ${
        (inspectionType === 'Buy' || inspectionType === 'Rent/Lease') &&
        'h-[440px]'
      } border-[1px] border-dashed border-[#5A5D63] flex items-center justify-center`}>
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
