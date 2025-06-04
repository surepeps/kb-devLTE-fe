/** @format */

'use client';
import React, { useState } from 'react';

const ReferralPage = () => {
  const [selectedOption, setSelectedOption] = useState<
    'Share Invite' | 'Reward History'
  >('Share Invite');

  const renderContent = (): React.JSX.Element => {
    switch (selectedOption) {
      case 'Share Invite':
        return <></>;
      case 'Reward History':
        return <></>;
    }
  };

  return (
    <div className='w-full flex justify-center items-center pb-[40px]'>
      <div className='container flex items-center justify-center flex-col gap-[30px]'>
        <h2 className={`text-center text-black text-2xl font-medium`}>
          Invite friends and get rewarded
        </h2>
        <div className='flex h-[51px] gap-[20px]'>
          <button
            onClick={() => setSelectedOption('Share Invite')}
            className={`h-[51px] ${
              selectedOption === 'Share Invite'
                ? 'bg-[#8DDB90]/[20%] text-[#09391C] font-medium'
                : 'text-[#5A5D63] font-normal bg-transparent'
            } border-[1px] text-lg border-[#C7CAD0] w-[162px]`}
            type='button'>
            Share Invite
          </button>
          <button
            onClick={() => setSelectedOption('Reward History')}
            className={`h-[51px] ${
              selectedOption === 'Reward History'
                ? 'bg-[#8DDB90]/[20%] text-[#09391C] font-medium'
                : 'text-[#5A5D63] font-normal bg-transparent'
            } border-[1px] text-lg border-[#C7CAD0] w-[162px]`}
            type='button'>
            Reward History
          </button>
        </div>
        <div className='lg:min-w-[930px] border-[1px] border-dashed border-black min-h-[473px]'>
          {selectedOption && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
