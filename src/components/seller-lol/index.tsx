/** @format */
'use client';
import { URLS } from '@/utils/URLS';
import axios from 'axios';
import React, { FC, useEffect, useState, Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '../loading-component/loading';
import Input from '../general-components/Input';
import SubmitOffer from '../seller-negotiation-inspection/submit-offer';
import SelectPreferableInspectionDate from '../seller-negotiation-inspection/select-date-time';
import AcceptRejectOfferModal from '../seller-negotiation-inspection/accept-reject-offer-modal';
import { archivo } from '@/styles/font';
import SubmitPopUp from '../submit';
import Image from 'next/image';
import sampleImg from '@/assets/Agentpic.png';

type MainEntryprops = {
  potentialClientID: string;
};

type RenderModalProps = {
  //Component: React.ElementType;
  props?: Record<string, any>;
};

const Index: FC<MainEntryprops> = ({ potentialClientID }) => {
  const [formStatus, setFormStatus] = useState<
    'idle' | 'success' | 'failed' | 'pending'
  >('pending');

  const [details, setDetails] = useState<NegotiationProps | null>(null);
  const [contentTracker, setContentTracker] = useState<
    'Negotiation' | 'Confirm Inspection Date'
  >('Negotiation');
  const [isNegotiated, setIsNegotiated] = useState<boolean>(false);

  const renderModal = ({ props }: RenderModalProps): React.ReactNode => {
    switch (formStatus) {
      case 'pending':
        return <Loading />;
      case 'success':
        return <Negotiation {...(props as NegotiationProps)} />;
      case 'failed':
        return (
          <div className='w-full flex items-center justify-center h-[400px]'>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              exit={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}>
              Failed to Load...
            </motion.p>
          </div>
        );
      default:
        return <Negotiation {...(props as NegotiationProps)} />;
    }
  };

  const renderContentDynamically = (): { content: any; header: string } => {
    switch (contentTracker) {
      case 'Negotiation':
        return {
          content: (
            <NegotiationPage
              setIsNegotiated={setIsNegotiated}
              setContentTracker={setContentTracker}
            />
          ),
          header: contentTracker,
        };
      case 'Confirm Inspection Date':
        return {
          content: <ConfirmInspectionDate isNegotiated={isNegotiated} />,
          header: contentTracker,
        };
      default:
        return { content: <></>, header: contentTracker };
    }
  };

  useEffect(() => {
    const fetchPotentialClientDetails = async (): Promise<void> => {
      setFormStatus('pending');
      try {
        const response = await axios.get(URLS.BASE);
        if (response.status === 200) {
          setFormStatus('success');
          //do something
          //will also set the contentTracker as well depending on the payload
          //from the backend
          //same with isNegotiated
        }
      } catch (error) {
        //setFormStatus('failed');
        console.log(error);
      } finally {
        setFormStatus('idle');
      }
    };
    fetchPotentialClientDetails();
  }, []);
  return (
    <Fragment>
      <aside className='w-full flex justify-center items-center'>
        <div className='container flex items-center justify-center'>
          <AnimatePresence>
            {formStatus &&
              renderModal({
                props: {
                  firstName: details?.firstName ?? 'Wale', //temporary ternary
                  lastName: details?.lastName ?? 'Abba', //temporary ternary
                  contentTracker: contentTracker,
                  setContentTracker: setContentTracker,
                  renderDynamicContent: () => renderContentDynamically(),
                },
              })}
          </AnimatePresence>
        </div>
      </aside>
    </Fragment>
  );
};

type NegotiationProps = {
  firstName: string;
  lastName: string;
  currentAmount: number;
  buyOffer: number;
  contentTracker?: 'Negotiation' | 'Confirm Inspection Date';
  setContentTracker?: (type: 'Negotiation' | 'Confirm Inspection Date') => void;
  renderDynamicContent: () => { content: any; header: string };
};

const Negotiation = (props: NegotiationProps): React.ReactNode => {
  const { firstName, lastName } = props;

  useEffect(() => console.log(props.contentTracker), [props.contentTracker]);

  return (
    <motion.div className='w-full flex items-center justify-center flex-col gap-[20px] md:gap-[40px] md:py-[50px] px-[20px] pb-[20px]'>
      <div className='flex gap-[20px] md:gap-[40px] justify-center items-center flex-col'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className='font-display text-3xl md:text-4xl text-center font-semibold text-[#09391C]'>
          {props.contentTracker && props.renderDynamicContent().header}
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className='flex flex-col gap-[1px] items-center justify-center'>
          <p className='text-center text-base md:text-lg text-black'>
            Hi, Mr {firstName} {lastName},
          </p>
          <p className='text-center text-base md:text-lg text-black'>
            A potential client has submitted an offer and is waiting for your
            response
          </p>
          <p className='text-center text-base md:text-lg text-black'>
            Please reply within{' '}
            <span className='text-base md:text-lg text-[#FF3D00]'>
              48 hours
            </span>{' '}
            — the countdown starts now.
          </p>
        </motion.div>
      </div>
      <AnimatePresence>
        {props.contentTracker && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            exit={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className='lg:w-[933px] w-full flex flex-col gap-[30px] bg-[#FFFFFF] py-[30px] md:py-[50px] md:px-[50px] px-[30px] border-[1px] border-[#C7CAD0]'>
            <time
              dateTime=''
              className='font-semibold text-black font-display text-2xl text-center'>
              24 : 11 : 24
            </time>
            {props.contentTracker && props?.renderDynamicContent()?.content}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type PriceProps = {
  amount: number;
  heading: string;
  subHeading: string;
  viewPropertyDetails: boolean;
  setContentTracker?: (type: 'Negotiation' | 'Confirm Inspection Date') => void;
  isViewed?: boolean;
  setIsViewed?: (type: boolean) => void;
};

const Price = ({
  viewPropertyDetails,
  amount,
  heading,
  subHeading,
  isViewed,
  setIsViewed,
}: PriceProps): React.ReactNode => {
  useEffect(() => console.log(isViewed), [isViewed]);
  return (
    <Fragment>
      <div className='w-full h-[127px] flex flex-col gap-[15px]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[#1E1E1E] font-medium text-xl'>{heading}</h2>
          {viewPropertyDetails ? (
            <span
              className='text-base cursor-pointer text-[#1976D2] underline'
              onClick={() => setIsViewed?.(true)}>
              view property details
            </span>
          ) : null}
        </div>
        <Input
          label={subHeading}
          name='current_amount'
          type='text'
          value={Number(amount).toLocaleString()}
          isDisabled
        />
      </div>
    </Fragment>
  );
};

const NegotiationPage = ({
  setContentTracker,
  setIsNegotiated,
}: {
  setContentTracker?: (type: 'Negotiation' | 'Confirm Inspection Date') => void;
  setIsNegotiated?: (type: boolean) => void;
}) => {
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const [contentToPass, setContentToPass] = useState<{
    heading: string;
    passContent: string | React.ReactNode;
    handleSubmitFunction: () => void;
  } | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  const AcceptOffer = () => {
    return setContentTracker?.('Confirm Inspection Date');
  };
  const RejectOffer = () => {
    setIsNegotiated?.(true);
    return setContentTracker?.('Confirm Inspection Date');
  };

  const handleButtonClick = (type: 'Accept offer' | 'Reject offer') => {
    setIsButtonClicked(true);
    switch (type) {
      case 'Accept offer':
        return setContentToPass({
          heading: type,
          passContent: (
            <p
              className={`text-lg text-[#515B6F] text-center ${archivo.className}`}>
              <span
                className={`text-lg text-black font-semibold ${archivo.className}`}>
                {' '}
                Have you reviewed the submitted LOI before accepting the offer?
              </span>
              <br />
              Please note that your response will be communicated to the
              developer.
            </p>
          ),
          handleSubmitFunction: AcceptOffer,
        });
      case 'Reject offer':
        return setContentToPass({
          heading: type,
          passContent: (
            <p
              className={`text-lg text-[#515B6F] text-center ${archivo.className}`}>
              <span
                className={`text-lg text-black font-semibold ${archivo.className}`}>
                {' '}
                Have you reviewed the submitted LOI before accepting the offer?
              </span>
              <br />
              Please note that your response will be communicated to the
              developer.
            </p>
          ),
          handleSubmitFunction: RejectOffer,
        });
      default:
        return null;
    }
  };
  return (
    <Fragment>
      <div className='w-full flex flex-col gap-[35px]'>
        <div className='w-full flex flex-col'>
          <p className='text-base font-semibold text-[#1976D2]'>
            {' '}
            Note: The buyer has made a deposit to initiate this negotiation.
          </p>
          <p className='text-base font-semibold text-[#1976D2]'>
            {' '}
            Please respond to the proposed price—whether you{' '}
            <span className='text-[#34A853] text-base font-semibold'>
              accept
            </span>{' '}
            ,{' '}
            <span className='text-[#FF2539] text-base font-semibold'>
              reject
            </span>
            .{' '}
          </p>
          <p className='text-base font-semibold text-[#1976D2]'>
            Your timely response is appreciated
          </p>
        </div>

        {/**Lol Document */}
        <div className='w-full flex flex-col gap-[10px] md:gap-[25px] pt-[10px]'>
          <div className='flex justify-between items-center'>
            <h2 className='text-base md:text-xl text-[#1E1E1E] font-medium'>
              LOI Document
            </h2>
            <span
              className='text-sm md:text-base cursor-pointer text-[#1976D2] underline'
              //onClick={() => setIsViewed(true)}
            >
              view property details
            </span>
          </div>
          <div className='flex md:flex-row flex-col gap-[15px] justify-between items-start'>
            <h3 className='text-sm md:text-base font-semibold text-[#202430]'>
              Developer LOI document: kindly click on the document before you
              <br />
              Accept or reject offer
            </h3>
            <div className='flex flex-col'>
              <Image
                style={{
                  backgroundBlendMode: 'luminosity',
                  backgroundColor: '',
                }}
                src={sampleImg}
                className='w-[80px] h-[57px] object-cover'
                alt=''
                width={80}
                height={57}
              />
              <p className='absolute text-xs mt-5 ml-2 text-white'>
                View details
              </p>
            </div>
          </div>
        </div>

        {/**buttons */}
        <div className='h-[50px] w-full flex justify-between gap-[35px]'>
          <button
            type='button'
            onClick={() => {
              handleButtonClick('Accept offer');
            }}
            className='bg-[#8DDB90] hover:bg-[#38723a] transition-all duration-200 w-[349px] h-[50px] text-base text-[#FAFAFA] font-bold'>
            Accept offer
          </button>
          <button
            type='button'
            onClick={() => {
              handleButtonClick('Reject offer');
            }}
            className='bg-[#FF3D00] hover:bg-[#993719] transition-all duration-200 w-[349px] h-[50px] text-base text-[#FAFAFA] font-bold'>
            Reject offer
          </button>
          {/* <button
            type='button'
            onClick={() => setIsViewed(true)}
            className='bg-[#1976D2] hover:bg-[#114d89] transition-all duration-200 w-[221px] h-[50px] text-base text-[#FAFAFA] font-bold'>
            Negotiation
          </button> */}
        </div>
      </div>
      <AnimatePresence>
        {' '}
        {isViewed && (
          <SubmitOffer nextPage={setContentTracker} closeModal={setIsViewed} />
        )}
        {isButtonClicked && (
          <AcceptRejectOfferModal
            closeModal={setIsButtonClicked}
            {...contentToPass}
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
};

const ConfirmInspectionDate = ({ isNegotiated }: { isNegotiated: boolean }) => {
  const [dateTimeObj, setDateTimeObj] = useState<{
    selectedDate: string;
    selectedTime: string;
  }>({
    selectedDate: '',
    selectedTime: '',
  });
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [isProceedClicked, setIsProceedClicked] = useState<boolean>(false);
  const [contentToPass, setContentToPass] = useState<{
    heading: string;
    passContent: string | React.ReactNode;
    handleSubmitFunction: () => void;
    headerTextStyling?: React.CSSProperties;
  } | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  const AcceptOffer = () => {};
  const RejectOffer = () => {};

  const handleButtonClick = (
    type: 'Available of Inspection' | 'Unavailable of Inspection'
  ) => {
    setIsButtonClicked(true);
    switch (type) {
      case 'Available of Inspection':
        return setContentToPass({
          heading: type,
          headerTextStyling: { color: '#000000' },
          passContent: (
            <p className={`${archivo.className} text-lg text-[#515B6F]`}>
              Please ensure that this property is always available for
              inspection. If the property is unavailable,{' '}
              <span
                className={`${archivo.className} text-lg text-black font-semibold`}>
                your account may be flagged and restricted from using the system
              </span>
            </p>
          ),
          handleSubmitFunction: AcceptOffer,
        });
      case 'Unavailable of Inspection':
        return setContentToPass({
          heading: type,
          passContent: (
            <p className={`${archivo.className} text-lg text-[#515B6F]`}>
              If the property is unavailable for inspection, it will be disabled
              from the system. You will need to provide evidence to reactivate
              it
            </p>
          ),
          handleSubmitFunction: RejectOffer,
        });
      default:
        return null;
    }
  };
  return (
    <Fragment>
      <div className='w-full flex flex-col gap-[20px] md:gap-[35px]'>
        <div className='w-full flex flex-col'>
          <p className='text-base font-semibold text-[#0C70D3]'>
            {' '}
            Note: The buyer has made a deposit to initiate this negotiation.
          </p>
          <p className='text-base font-semibold text-[#0C70D3]'>
            {' '}
            Please respond to the proposed price—whether you{' '}
            <span className='text-[#34A853] text-base font-semibold'>
              Available
            </span>{' '}
            ,{' '}
            <span className='text-[#FF2539] text-base font-semibold'>
              Unavailable
            </span>{' '}
            , or{' '}
            <span className='text-[#4285F4] text-base font-semibold'>
              Update inspection
            </span>
            .{' '}
          </p>
          <p className='text-base font-semibold text-[#0C70D3]'>
            Your timely response is appreciated
          </p>
        </div>
        {/**Buyer Inspection Date */}
        <div className='w-full flex flex-col gap-[15px]'>
          <div className='flex flex-col md:flex-row justify-between md:items-end'>
            <h2 className='text-[#1E1E1E] text-lg md:text-xl font-medium'>
              Buyer Inspection Date
            </h2>
            <span
              className='text-sm md:text-base cursor-pointer text-[#1976D2] underline'
              //onClick={() => setIsViewed(true)}
            >
              view property details
            </span>
          </div>
          <div className='w-full flex md:flex-row flex-col gap-[15px]'>
            <ShowDateTimeSelected
              heading='Select Date'
              value={dateTimeObj.selectedDate ?? 'N/A'}
              id='select_date'
              name='select_date'
              // isModalOpened={isModalOpened}
              // setIsModalOpened={setIsModalOpened}
            />
            <ShowDateTimeSelected
              heading='Select Time'
              value={dateTimeObj.selectedTime ?? 'N/A'}
              id='select_time'
              name='select_time'
              // isModalOpened={isModalOpened}
              // setIsModalOpened={setIsModalOpened}
            />
          </div>
          <div className='flex flex-wrap w-full justify-between gap-[10px] md:gap-[35px] mt-6'>
            {isNegotiated ? (
              <>
                <button
                  onClick={() => handleButtonClick('Available of Inspection')}
                  className={`w-[349px] bg-[#8DDB90] text-white h-[50px] text-lg ${archivo.className} font-bold`}
                  type='button'>
                  Available
                </button>
                <button
                  onClick={() => handleButtonClick('Unavailable of Inspection')}
                  className={`w-[349px] bg-[#FF2539] text-white h-[50px] text-lg ${archivo.className} font-bold`}
                  type='button'>
                  Unavailable
                </button>
                <button
                  onClick={() => setIsModalOpened(true)}
                  className={`w-[349px] bg-[#000000] text-white h-[50px] text-lg ${archivo.className} font-bold`}
                  type='button'>
                  Update Inspection date
                </button>
              </>
            ) : (
              <>
                {' '}
                <button
                  onClick={() => setIsModalOpened(true)}
                  className={`w-[349px] bg-[#000000] text-white h-[50px] text-lg ${archivo.className} font-bold`}
                  type='button'>
                  Update Inspection date
                </button>
                <button
                  onClick={() => setIsProceedClicked(true)}
                  className={`w-[349px] bg-[#8DDB90] text-white h-[50px] text-lg ${archivo.className} font-bold`}
                  type='button'>
                  Proceed
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpened && (
          <SelectPreferableInspectionDate
            closeModal={setIsModalOpened}
            details={dateTimeObj}
            setDetails={setDateTimeObj}
          />
        )}
        {isProceedClicked && <SubmitPopUp />}
        {isButtonClicked && (
          <AcceptRejectOfferModal
            closeModal={setIsButtonClicked}
            {...contentToPass}
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
};

type ShowDateSelectedProps = {
  heading: 'Select Date' | 'Select Time';
  value: string;
  id: string;
  name: string;
  isModalOpened?: boolean;
  setIsModalOpened?: (type: boolean) => void;
};
const ShowDateTimeSelected = ({
  id,
  heading,
  value,
  name,
  setIsModalOpened,
  isModalOpened,
}: ShowDateSelectedProps) => {
  return (
    <Fragment>
      <label htmlFor={id} className='flex flex-col gap-[4px]'>
        <h5 className='text-base font-medium text-[#1E1E1E]'>{heading}</h5>
        <input
          type='text'
          readOnly
          onClick={() => setIsModalOpened?.(!isModalOpened)}
          value={value}
          name={name}
          className='w-[183px] cursor-pointer py-[16px] px-[12px] bg-[#FAFAFA] border-[1px] border-[#D6DDEB] text-base text-[#000000] font-semibold'
        />
      </label>
    </Fragment>
  );
};

export default Index;
