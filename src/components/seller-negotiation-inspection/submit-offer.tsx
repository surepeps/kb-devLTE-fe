/** @format */

import React, { useState } from 'react';
import PopUpModal from '../pop-up-modal-reusability';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { archivo } from '@/styles/font';
import Input from '../general-components/Input';
import toast from 'react-hot-toast';

type SubmitOfferProps = {
  closeModal: (type: boolean) => void;
  nextPage?: (type: 'Negotiation' | 'Confirm Inspection Date') => void;
};

const SubmitOffer: React.FC<SubmitOfferProps> = ({ closeModal, nextPage }) => {
  const [offerPrice, setOfferPrice] = useState<number | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (offerPrice === undefined || offerPrice === 0)
      return toast.error('Please, input a value before proceeding');

    nextPage?.('Confirm Inspection Date');
  };
  return (
    <PopUpModal>
      <motion.form
        initial={{ y: 40, opacity: 0 }}
        exit={{ y: 20, opacity: 1 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
        className='lg:w-[649px] w-full flex flex-col gap-[26px]'>
        <div className='flex items-start justify-end'>
          <button
            type='button'
            onClick={() => closeModal(false)}
            className='w-[51px] h-[51px] rounded-full flex items-center justify-center bg-[#FFFFFF]'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
              color='#181336'
            />
            {''}
          </button>
        </div>
        <div className='lg:w-[649px] w-full py-[40px] px-[20px] md:px-[80px] bg-white rounded-[4px] shadow-md flex items-center justify-center'>
          <div className='w-full flex flex-col gap-[42px] items-center justify-center'>
            <div className='w-full flex flex-col gap-[4px] items-center justify-center'>
              <h2
                className={`text-2xl text-[#000000] ${archivo.className} font-bold text-center`}>
                Submit your Offer
              </h2>
              <p
                className={`text-center text-lg text-[#515B6F] ${archivo.className}`}>
                Enter you amount you are willing to offer the buyer to ecyire
                your property
              </p>
            </div>
            <div className='w-full flex flex-col gap-[20px]'>
              <Input
                label={'Your posted property Price'}
                name='posted_property_price'
                type='text'
                value={Number(350000000).toLocaleString()}
                isDisabled
              />
              <Input
                label={'Buyer Negotiated price'}
                name='buyer_negotiated_price'
                type='text'
                value={Number(300000000).toLocaleString()}
                isDisabled
              />
              <Input
                label={'Enter your Offer'}
                name='offer'
                type='number'
                value={offerPrice}
                onChange={(event) => {
                  setOfferPrice(Number(event.target.value));
                }}
              />
            </div>
            {/**buttons */}
            <div className='w-full flex flex-col gap-[15px]'>
              <button
                onClick={handleSubmit}
                className={`w-full bg-[#8DDB90] text-white h-[57px] text-lg ${archivo.className} font-bold`}
                type='button'>
                Submit
              </button>
              <button
                onClick={() => {
                  closeModal(false);
                }}
                className={`w-full border-[1px] border-[#FF2539] text-[#FF2539] h-[57px] text-lg ${archivo.className} font-bold`}
                type='button'>
                Not sure
              </button>
            </div>
          </div>
        </div>
      </motion.form>
    </PopUpModal>
  );
};

export default SubmitOffer;
