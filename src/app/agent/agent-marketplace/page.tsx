/** @format */
'use client';

import AgentMarketPlace from '@/components/agent-page-components/agent-marketplace';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user-context';


const page = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  if (!user || user.userType !== 'Agent') {
    router.replace('/auth/login');
  } else {
    document.title = 'Agent Marketplace';
  }
}, [user, router]);

 if (loading || !user || user.userType !== 'Agent') return null;

  return <AgentMarketPlace />;
};

export default page;
