/* eslint-disable @typescript-eslint/no-unused-vars */
/** @format */

'use client';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ActivitiesScroll from '@/components/admincomponents/activities_scroll';
import { useState } from 'react';
import PendingBriefs from '@/components/admincomponents/incoming_inspections';
import AgentLists from '@/components/admincomponents/agent_lists';
import PreferenceAttention from '@/components/admincomponents/preference_requiring_attention';
import { motion } from 'framer-motion';
import filterIcon from '@/svgs/filterIcon.svg';
import Image from 'next/image';
import { manrope } from '@/styles/font';

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
