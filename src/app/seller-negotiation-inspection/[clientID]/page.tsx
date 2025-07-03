'use client';
import Index from '@/components/seller-negotiation-inspection/index';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [ID, setID] = useState<string>('');
  const params = useParams();

  useEffect(() => {
    const clientID = params?.clientID as string;
    console.log('Client ID from params:', clientID);
    if (typeof clientID === 'string') setID(clientID);
    else console.log('Invalid client ID', clientID);
  }, [params]);
  
  return <Index potentialClientID={ID} />;
};

export default Page;