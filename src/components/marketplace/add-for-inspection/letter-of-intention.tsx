/** @format */

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import AttachFile from '@/components/general-components/attach_file';
import { archivo } from '@/styles/font';

type LetterOfIntentionProps = {
  setIsModalClosed: (type: boolean) => void;
  closeSelectPreferableModal: (type: boolean) => void;
  propertyId: string;
  submitInspectionPayload: any;
  setSubmitInspectionPayload: (payload: any) => void;
};

const LetterOfIntention: React.FC<LetterOfIntentionProps> = ({
  setIsModalClosed,
  closeSelectPreferableModal,
  propertyId,
  submitInspectionPayload,
  setSubmitInspectionPayload,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  return (
    <div className='w-full fixed top-0 left-0 h-full flex justify-center items-center bg-black/[30%]'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ y: 20, opacity: 0 }}
        className='lg:w-[665px] h-[489px] flex flex-col gap-[26px]'>
        {/**Button to close Modal section */}
        <div className='flex items-center justify-end'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            type='button'
            className='w-[51px] h-[51px] rounded-full bg-white flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              onClick={() => setIsModalClosed(false)}
              className='w-[24px] h-[24px]'
              color='#181336'
            />
          </motion.button>
        </div>
        <div className='w-full h-[332px] bg-white flex flex-col gap-[55px] items-center justify-center p-[40px]'>
          <div className='w-full h-full flex flex-col items-center justify-center gap-[20px]'>
            {/**Header and sub header */}
            <div className='flex flex-col gap-[4px]'>
              <h2 className='font-bold text-black text-2xl text-center'>
                Upload your letter of intention
              </h2>
              <p className='text-base font-normal text-center text-[#5A5D63]'>
                Please address your letter to{' '}
                <span className='text-base font-bold text-center text-black'>
                  Khabi-Teq Limited
                </span>{' '}
                and include our office address: Goldrim Plaza Mokuolu Street,
                Ifako Agege Lagos 101232, Nigeria
              </p>
            </div>
            {/**Upload your Lol section */}
            <div className='lg:w-[534px]'>
              <AttachFile
                style={{
                  width: '283px',
                }}
                id='attach_file'
                setFileUrl={setFileUrl}
                heading='Upload your LOI'
              />
            </div>
            {/**Submit and cancel buttons */}
            <div className='w-full flex gap-[15px]'>
            <button
              onClick={() => {
                setSubmitInspectionPayload({
                  ...submitInspectionPayload,
                  propertyId,
                  letterOfIntention: fileUrl, 
                  transaction: {
                    ...submitInspectionPayload.transaction,
                  },
                });
                setIsModalClosed(false);
                closeSelectPreferableModal(true);
              }}
              type='button'
              disabled={!fileUrl}
              className={`h-[57px] lg:w-[285px] ${
                  !fileUrl ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#8DDB90]'
                } text-white font-bold text-lg ${archivo.className}`}>
              Submit
            </button>
              <button
                type='button'
                className={`h-[57px] lg:w-[285px] bg-transparent border-[1px] border-[#5A5D63] text-[#5A5D63] font-bold text-lg ${archivo.className}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterOfIntention;
{
}
