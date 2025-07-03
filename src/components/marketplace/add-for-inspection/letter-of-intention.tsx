/** @format */

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AttachFile from '@/components/general-components/attach_file';
import { archivo } from '@/styles/font';
import toast from 'react-hot-toast';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitLOI = async () => {
    if (!fileUrl) {
      toast.error('Please upload your Letter of Intention document');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare LOI submission payload
      const loiPayload = {
        propertyId,
        letterOfIntention: fileUrl,
        message: 'Letter of Intention submitted for joint venture consideration',
        type: 'LOI_SUBMISSION'
      };

      // Submit LOI to the backend
      const response = await POST_REQUEST(
        `${URLS.BASE}/loi/submit`,
        loiPayload,
        Cookies.get('token')
      );

      if (response) {
        toast.success('Letter of Intention submitted successfully!');

        // Update inspection payload
        setSubmitInspectionPayload({
          ...submitInspectionPayload,
          propertyId,
          letterOfIntention: fileUrl,
          loiSubmitted: true,
          transaction: {
            ...submitInspectionPayload.transaction,
          },
        });

        // Close modal and proceed
        setIsModalClosed(false);
        closeSelectPreferableModal(true);
      } else {
        toast.error('Failed to submit Letter of Intention');
      }
    } catch (error) {
      console.error('Error submitting LOI:', error);
      toast.error('An error occurred while submitting your LOI');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalClosed(false);
  };

  return (
    <div className='w-full max-w-4xl mx-auto p-4 md:p-6'>
      <div className='bg-white rounded-lg p-6 md:p-8 space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h2 className='font-bold text-black text-xl md:text-2xl'>
            Upload your Letter of Intention
          </h2>
          <p className='text-sm md:text-base text-[#5A5D63] max-w-2xl mx-auto'>
            Please address your letter to{' '}
            <span className='font-bold text-black'>
              Khabi-Teq Limited
            </span>{' '}
            and include our office address: Goldrim Plaza, Mokuolu Street,
            Ifako Agege Lagos 101232, Nigeria
          </p>
        </div>

        {/* LOI Guidelines */}
        <div className='bg-[#E8F3FE] border border-[#A8ADB7] rounded-lg p-4 space-y-3'>
          <h3 className='font-semibold text-[#09391C]'>LOI Guidelines:</h3>
          <ul className='text-sm text-[#5A5D63] space-y-1 list-disc list-inside'>
            <li>Clearly state your intention for joint venture partnership</li>
            <li>Include your proposed terms and profit-sharing arrangement</li>
            <li>Specify your financial contribution or expertise offering</li>
            <li>Mention the property address and reference ID if available</li>
            <li>Provide your contact information and company details</li>
          </ul>
        </div>

        {/* File Upload */}
        <div className='flex justify-center'>
          <div className='w-full max-w-md'>
            <AttachFile
              style={{ width: '100%' }}
              id='loi_attachment'
              setFileUrl={setFileUrl}
              heading='Upload your LOI Document'
              acceptedFileTypes='.pdf,.doc,.docx'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={handleSubmitLOI}
            disabled={!fileUrl || isSubmitting}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white transition-colors
              ${!fileUrl || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#8DDB90] hover:bg-[#7BC87F]'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit LOI'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className={`
              px-6 py-3 rounded-lg font-semibold border-2 border-[#5A5D63] text-[#5A5D63]
              hover:bg-[#5A5D63] hover:text-white transition-colors
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Cancel
          </button>
        </div>

        {/* Status Message */}
        {fileUrl && (
          <div className='text-center'>
            <p className='text-sm text-green-600'>
              ✓ LOI document uploaded successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
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