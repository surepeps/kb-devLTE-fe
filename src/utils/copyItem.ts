/** @format */

import { useState } from 'react';
import toast from 'react-hot-toast';

const copy = async (text: string) => {
  //const [isCopied, setIsCopied] = useState<boolean>(false);
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied');
  } catch (error: any) {
    toast.error(`Failed to copy: ${error}`);
  }
};

export default copy;
