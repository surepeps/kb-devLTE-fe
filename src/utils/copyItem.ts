/** @format */

import { useState } from 'react';

const copy = async (text: string) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  try {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  } catch (error) {
    console.error('Failed to copy:', error);
    setIsCopied(false);
  }

  return isCopied;
};

export default copy;
