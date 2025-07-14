/** @format */

'use client';
import React from 'react';
import PopUpModal from '../pop-up-modal-reusability';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { archivo } from '@/styles/font';
import { useNegotiationModals } from '@/context/negotiation-context';

type AcceptRejectOfferModalProps = {
  heading?: string;
  passContent?: string | React.ReactNode;
  handleSubmitFunction?: () => void;
  headerTextStyling?: React.CSSProperties;
};

const AcceptRejectOfferModal = ({
  heading = 'Accept offer',
  passContent,
  handleSubmitFunction,
  headerTextStyling,
}: AcceptRejectOfferModalProps) => {
  const { 
    isAcceptingOffer, 
    isRejectingOffer, 
    closeAcceptRejectModal 
  } = useNegotiationModals();

  const isSubmitting = isAcceptingOffer || isRejectingOffer;

  return (
    <PopUpModal>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        exit={{ y: 20, opacity: 0 }}
        className='lg:w-[649px] w-full flex flex-col gap-[26px]'>
        <div className='flex justify-end items-start'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            type='button'
            className='w-[51px] h-[51px] rounded-full bg-white flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              onClick={closeAcceptRejectModal}
              className='w-[24px] h-[24px]'
              color='#181336'
            />
          </motion.button>
        </div>
        <div className='w-full bg-white py-[40px] px-[20px] md:px-[60px] rounded-[4px] shadow-md flex justify-center items-center'>
          <div className='w-full flex flex-col gap-[42px] items-center justify-center'>
            <div className='flex flex-col gap-[4px] items-center justify-center'>
              <h2
                style={headerTextStyling}
                className={`${
                  heading === 'Accept offer'
                    ? 'text-[#000000]'
                    : 'text-[#FF2539]'
                } ${archivo.className} text-2xl font-bold text-center`}>
                {heading}
              </h2>
              {typeof passContent !== 'string' ? (
                <div className="text-center w-full">{passContent}</div>
              ) : (
                <p
                  className={`text-[#515B6F] ${archivo.className} text-lg text-center`}>
                  {passContent}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-[15px]'>
              <button
                onClick={handleSubmitFunction}
                className={`w-full bg-[#8DDB90] text-white h-[57px] text-lg ${archivo.className} font-bold`}
                type='button'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={closeAcceptRejectModal}
                className={`w-full border-[1px] border-[#FF2539] text-[#FF2539] h-[57px] text-lg ${archivo.className} font-bold`}
                type='button'>
                Back
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </PopUpModal>
  );
};

export default AcceptRejectOfferModal;