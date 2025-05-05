/** @format */

'use client';
import React, { Fragment } from 'react';
import Header from '@/components/homepage/header';
import AgentHeader from '@/components/agent-page-components/agent_header';
import { usePathname } from 'next/navigation';

const HeaderLogic = () => {
  const pathname = usePathname();
  return (
    <Fragment>
      {(pathname.includes('agent') && pathname.includes('briefs')) ||
      (pathname.includes('onboard') && pathname.includes('agent')) ||
      (pathname.includes('under-review') &&
        pathname.includes('under-review')) ? (
        <AgentHeader />
      ) : (
        <Header />
      )}
    </Fragment>
  );
};

export default HeaderLogic;
