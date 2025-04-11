/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import UpgradeNotification from './upgrade-notification';
import { motion } from 'framer-motion';
import Select from '../select';
import Input from '../Input';
import { usePageContext } from '@/context/page-context';
import Image from 'next/image';
//import axios from 'axios';
import sampleImage from '@/assets/bgImg.jpg';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { POST_REQUEST } from '@/utils/requests';
import Cookies from 'js-cookie';

interface SelectOption {
  value: string;
  label: string;
}
const Upgrade = () => {
  const { settings } = usePageContext();
  const [selectedAgentType, setSelectedAgentType] =
    useState<string>('Individual Agent');

  return (
    <section className='flex flex-col gap-[20px] lg:w-[662px] min-h-[400px]'>
      <UpgradeNotification
        isYetToUpgrade={settings.upgradeStatus.isYetToUpgrade}
        isAwaitingUpgrade={settings.upgradeStatus.isAwatingUpgrade}
        isUpgraded={settings.upgradeStatus.isUpgraded}
      />
      <motion.form
        initial={{ y: 80, opacity: 0 }}
        viewport={{ once: true }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='w-full lg:h-[407px] flex flex-col gap-[20px] p-[30px] bg-[#FFFFFF] border-[1px] border-[#C7CAD0]'>
        <h2 className='text-[20px] font-semibold text-[#09391C] leading-[160%]'>
          Agent Type
        </h2>
        <div className='flex flex-col gap-[20px]'>
          <Select
            value={selectedAgentType}
            placeholder='Select Agent Type'
            disable={true}
            onChange={(option: SelectOption | null) =>
              setSelectedAgentType(option?.value ?? '')
            }
            name='Are you an Individual Agent or Corporate Agent?'
            options={['Individual Agent', 'Corporate Agent']}
          />
          <Input
            name='IDNumber'
            label='ID Number'
            placeholder='3i458568686787'
            type='number'
            isDisabled={true}
          />
          <div className='w-full h-[89px] flex justify-between items-center'>
            <h2 className='text-[#202430] text-base font-semibold'>
              Uploaded document
            </h2>
            <Image
              src={sampleImage}
              alt=''
              width={150}
              height={50}
              className='bg-[#D9D9D9] lg:w-[131px] h-full object-cover'
            />
          </div>
        </div>
      </motion.form>
    </section>
  );
};

export default Upgrade;
