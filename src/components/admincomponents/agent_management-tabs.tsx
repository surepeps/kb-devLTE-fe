/* eslint-disable @typescript-eslint/no-unused-vars */
/** @format */

'use client';

import AgentLists from '@/components/admincomponents/agent_lists';
import { motion } from 'framer-motion';

export default function AgentManagementTabs() {
  return (
    <motion.div
      className='w-full overflow-hidden'
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}>
      <div className='flex flex-col w-full'>
        <div className='w-full'>
          {/* Ensure AgentLists renders updated cards */}
          <AgentLists />
        </div>
      </div>
    </motion.div>
  );
}
