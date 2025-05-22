/** @format */
'use client';
import { URLS } from '@/utils/URLS';
import axios from 'axios';
import React, { FC, useEffect, useState, Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '../loading-component/loading';
import Input from '../general-components/Input';
import SubmitOffer from './submit-offer';

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

  useEffect(() => {
    const fetchPotentialClientDetails = async (): Promise<void> => {
      setFormStatus('pending');
      try {
        const response = await axios.get(URLS.BASE);
        if (response.status === 200) {
          setFormStatus('success');
          //do something
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
};

const Negotiation = (props: NegotiationProps): React.ReactNode => {
  const { firstName, lastName } = props;

  return (
    <motion.div className='w-full flex items-center justify-center flex-col gap-[40px] py-[50px]'>
      <div className='flex gap-[40px] justify-center items-center flex-col'>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className='font-display text-4xl text-center font-semibold text-[#09391C]'>
          Negotiation
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className='flex flex-col gap-[1px] items-center justify-center'>
          <p className='text-center text-lg text-black'>
            Hi, Mr {firstName} {lastName},
          </p>
          <p className='text-center text-lg text-black'>
            A potential client has submitted an offer and is waiting for your
            response
          </p>
          <p className='text-center text-lg text-black'>
            Please reply within{' '}
            <span className='text-lg text-[#FF3D00]'>48 hours</span> — the
            countdown starts now.
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
        className='lg:w-[933px] flex flex-col gap-[30px] bg-[#FFFFFF] py-[100px] px-[50px] border-[1px] border-[#C7CAD0]'>
        <time
          dateTime=''
          className='font-semibold text-black font-display text-2xl text-center'>
          24 : 11 : 24
        </time>
        <div className='w-full h-[502px] flex flex-col gap-[35px]'>
          <div className='w-full flex flex-col'>
            <p className='text-base font-semibold text-black'>
              {' '}
              Note: The buyer has made a deposit to initiate this negotiation.
            </p>
            <p className='text-base font-semibold text-black'>
              {' '}
              Please respond to the proposed price—whether you{' '}
              <span className='text-[#34A853] text-base font-semibold'>
                accept
              </span>{' '}
              ,{' '}
              <span className='text-[#FF2539] text-base font-semibold'>
                reject
              </span>{' '}
              , or make a{' '}
              <span className='text-[#4285F4] text-base font-semibold'>
                counter-offer
              </span>
              .{' '}
            </p>
            <p className='text-base font-semibold text-black'>
              Your timely response is appreciated
            </p>
          </div>
          {/**prices */}
          <div className='w-full flex flex-col justify-between gap-[25px] border-t-[1px] pt-[30px] border-[#8D9096]/[50%]'>
            {[
              {
                heading: 'Current property Price',
                subHeading: 'Current amount',
                viewPropertyDetails: true,
                amount: 350000000,
              },
              {
                heading: 'Buyer negotiation price',
                subHeading: 'Buyer Offer',
                viewPropertyDetails: false,
                amount: 300000000,
              },
            ].map((item: PriceProps, idx: number) => (
              <Price key={idx} {...item} />
            ))}
          </div>
          {/**buttons */}
          <div className='h-[50px] w-full flex justify-between gap-[35px]'>
            <button
              type='button'
              className='bg-[#8DDB90] hover:bg-[#38723a] transition-all duration-200 w-[221px] h-[50px] text-base text-[#FAFAFA] font-bold'>
              Accept offer
            </button>
            <button
              type='button'
              className='bg-[#FF3D00] hover:bg-[#993719] transition-all duration-200 w-[221px] h-[50px] text-base text-[#FAFAFA] font-bold'>
              Reject offer
            </button>
            <button
              type='button'
              className='bg-[#1976D2] hover:bg-[#114d89] transition-all duration-200 w-[221px] h-[50px] text-base text-[#FAFAFA] font-bold'>
              Negotiation
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

type PriceProps = {
  amount: number;
  heading: string;
  subHeading: string;
  viewPropertyDetails: boolean;
};

const Price = ({
  viewPropertyDetails,
  amount,
  heading,
  subHeading,
}: PriceProps): React.ReactNode => {
  const [isViewed, setIsViewed] = useState<boolean>(false);
  useEffect(() => console.log(isViewed), [isViewed]);
  return (
    <Fragment>
      <div className='w-full h-[127px] flex flex-col gap-[15px]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[#1E1E1E] font-medium text-xl'>{heading}</h2>
          {viewPropertyDetails ? (
            <span
              className='text-base cursor-pointer text-[#1976D2] underline'
              onClick={() => setIsViewed(true)}>
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
      <AnimatePresence>
        {' '}
        {isViewed && <SubmitOffer closeModal={setIsViewed} />}
      </AnimatePresence>
    </Fragment>
  );
};

export default Index;
