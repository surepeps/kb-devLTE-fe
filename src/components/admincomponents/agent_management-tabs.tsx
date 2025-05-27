/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/** @format */

'use client';

import AgentLists from '@/components/admincomponents/agent_lists';
import LandOwnersLists from './landowners-lists';
import { motion } from 'framer-motion';

type AgentManagementTabsProps = {
  setDetails?: (details: any) => void;
  activeUserType?: 'agent' | 'landlord';
};

export default function AgentManagementTabs({
  setDetails,
  activeUserType = 'agent',
}: AgentManagementTabsProps) {
  return (
    <motion.div
      className='w-full overflow-hidden'
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}>
      <div className='flex flex-col w-full'>
        <div className='w-full'>
          {activeUserType === 'agent' ? (
            <AgentLists setDetails={setDetails} />
          ) : (
            <LandOwnersLists setDetails={setDetails} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
