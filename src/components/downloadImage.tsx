/** @format */

import React from 'react';
import { motion } from 'framer-motion';

const DownloadImage = ({
  downloadImage,
  status,
}: {
  downloadImage: () => void;
  status?: 'idle' | 'pending' | 'success' | 'failed';
}) => {
  return (
    <motion.button
      onClick={downloadImage}
      type='button'
      className='w-fit px-2 py-1 rounded-[5px] bg-gray-100 hover:bg-gray-300 transition duration-500 border-[2px] border-gray-200 shadow-md mt-[10px]'>
      {status === 'pending' && (
        <span className='text-gray-500'>Downloading...</span>
      )}
      {status === 'success' && (
        <span className='text-green-500'>Downloaded!</span>
      )}
      {status === 'failed' && (
        <span className='text-red-500'>Failed to download</span>
      )}
      {status === 'idle' && <span className='text-gray-500'>Download</span>}
    </motion.button>
  );
};

export default DownloadImage;
