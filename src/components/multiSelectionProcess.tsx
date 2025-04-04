/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { FC, useRef, useState } from 'react';
import useClickOutside from '@/hooks/clickOutside';
import arrowIcon from '@/svgs/arrowDown.svg';
import Image from 'next/image';
import naijaStates from 'naija-state-local-government';

type OptionType = {
  value: string;
  label: string;
};
interface MultiSelectionProcessProps {
  selectionLimits?: number;
  heading: string;
  closeModalFunction: (type: boolean) => void;
  options: OptionType[];
  firstSelectedOption?: string;
  formik: any;
  name: string;
  type: string;
}
const MultiSelectionProcess: FC<MultiSelectionProcessProps> = ({
  closeModalFunction,
  heading,
  options,
  formik,
  name,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    closeModalFunction(false);
  });

  const [dataOptions, setDataOptions] = useState<OptionType[]>(options);
  const [specifiedName, setSpecifiedName] = useState<string>(name);
  const [modifyHeading, setModifyHeading] = useState<string>(heading);

  return (
    <div
      ref={ref}
      className='w-[241px] min-h-fit absolute z-30 mt-[100px] flex flex-col p-[19px] gap-[13px] shadow-md bg-[#FFFFFF]'>
      <div className='py-[2px] flex items-center'>
        <h2 className='text-sm font-medium text-[#000000] flex gap-3'>
          {modifyHeading !== 'location' ? (
            <Image
              src={arrowIcon}
              width={20}
              height={20}
              className='w-[20px] h-[20px] transform rotate-90 cursor-pointer'
              alt='arrow icon'
              onClick={() => {
                setDataOptions(options);
                if (modifyHeading === 'Preferred Location') {
                  setModifyHeading('location');
                }
                if (modifyHeading === 'Land Size') {
                  setModifyHeading('Land size');
                }
                formik.setFieldValue('selectedState', '');
                setSpecifiedName('selectedState');
                console.log(formik.values);
              }}
            />
          ) : null}
          <span>Filter by {modifyHeading}</span>
        </h2>
      </div>
      <div className='w-full h-[166px] overflow-y-auto flex flex-col gap-[20px] border-t-[1px] py-[15px] hide-scrollbar border-[#1E1E1E]'>
        {dataOptions.length !== 0 ? (
          dataOptions.map((option: OptionType, idx: number) => (
            <div
              key={idx}
              title={option.label}
              onClick={() => {
                if (specifiedName === 'selectedState') {
                  formik.setFieldValue(name, option.label);
                  formik.setFieldValue('selectedLGA', '');
                  setModifyHeading(`${option.label} state`);
                  //console.log(formik.values);

                  const lgas = naijaStates.lgas(option.label)?.lgas;
                  // console.log('Raw LGA Data:', lgas); // Log raw LGA data

                  if (Array.isArray(lgas)) {
                    setDataOptions(
                      lgas.map((lga: string) => ({
                        value: lga,
                        label: lga,
                      }))
                    );
                    setSpecifiedName('selectedLGA');
                    console.log(specifiedName);
                  } else {
                    console.error('LGAs not returned as an array:', lgas);
                    setDataOptions(options);
                  }
                } else if (specifiedName === 'selectedLGA') {
                  formik.setFieldValue('selectedLGA', option.label);
                  console.log(specifiedName, formik.values);
                  closeModalFunction(false);
                }

                if (specifiedName === 'landSize') {
                  formik.setFieldValue(specifiedName, option.label);
                  setModifyHeading(option.label);
                  setDataOptions([]);
                }
              }}
              className='w-full flex items-center justify-between cursor-pointer'>
              <span className='text-base font-normal text-[#000000]'>
                {option.label}
              </span>
              <Image
                src={arrowIcon}
                width={20}
                height={20}
                className='w-[20px] h-[20px] transform -rotate-90'
                alt='arrow icon'
              />
            </div>
          ))
        ) : (
          <InputValue formik={formik} heading={modifyHeading} />
        )}
      </div>
    </div>
  );
};

type InputValueProps = {
  heading: string;
  formik: any;
};
const InputValue: FC<InputValueProps> = ({ heading, formik }) => {
  return (
    <label htmlFor={heading} className='flex flex-col gap-2'>
      <span className='text-sm text-[#1E1E1E] font-normal'>{heading}</span>
      <input
        onChange={(e) => {
          formik.setFieldValue('landType', heading);
          if (heading === 'Plot') {
            formik.setFieldValue('landSize', e.target.value);
          }
        }}
        className='h-[56px] bg-[#FFFFFF] border-[1px] border-[#D6DDEB] px-[12px]'
        placeholder='This is placeholder'
        type='number'
      />
    </label>
  );
};

export default MultiSelectionProcess;
