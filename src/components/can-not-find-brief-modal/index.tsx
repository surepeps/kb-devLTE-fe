/** @format */

import React, { FC, Fragment, MouseEvent } from 'react';

type ModalProps = {
  formik: any;
  submitPreference: (event: MouseEvent<HTMLButtonElement>) => void;
};
const SubmitPrefrenceModal: FC<ModalProps> = ({ formik, submitPreference }) => {
  return (
    <div className='min-h-[106px] w-full lg:w-[1153px] py-[23px] px-[20px] md:px-[40px] gap-[10px] bg-white'>
      <div className='w-full min-h-[60px] flex md:flex-row flex-col gap-[20px] justify-between md:gap-0'>
        <div className='flex flex-col'>
          <h2 className='text-[18px] text-[#09391C] leading-[28.8px] font-medium'>
            Can&apos;t find the brief you&apos;re looking for? Don&apos;t worry!
            We&apos;ll provide a reference brief for you
          </h2>
          <div className='flex gap-[5px] flex-wrap'>
            {Object.entries(formik.values).map(
              ([, items]: [unknown: any, items: any], idx: number) => {
                if (typeof items === 'object') {
                  return (
                    <Crumb
                      key={idx}
                      text={Object.values(items)
                        .map((item) => item)
                        .join(', ')}
                    />
                  );
                }
                return <Crumb key={idx} text={items} />;
              }
            )}
          </div>
        </div>
        <button
          type='button'
          onClick={submitPreference}
          className='text-base leading-[25.6px] font-bold text-[#09391C] lg:min-w-[245px] h-[58px] border-[1px] py-[12px] px-[24px] border-[#09391C]'>
          Submit your preferences
        </button>
      </div>
    </div>
  );
};

const Crumb = ({ text }: { text: any }) => {
  return (
    <Fragment>
      {text ? (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className='bg-[#F7F7F8] min-h-[28px] min-w-fit py-[3px] px-[6px] text-[14px] text-[#0B0D0C] leading-[22.4px] font-normal tracking-[0.1px] cursor-not-allowed font-ubuntu rounded-[5px] hover:bg-[#e1e1e1] transition-all duration-300'
        />
      ) : null}
    </Fragment>
  );
};

export default SubmitPrefrenceModal;
