/** @format */

import { useEffect, useState } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutID);
  }, []);

  return isLoading;
};
