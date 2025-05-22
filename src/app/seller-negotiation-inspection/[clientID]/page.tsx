/** @format */
'use client';
import Index from '@/components/seller-negotiation-inspection';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  //const searchParams = useSearchParams();
  const [ID, setID] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    if (typeof id === 'string') return setID(id);
  }, []);
  return <Index potentialClientID={ID} />;
};

export default Page;
