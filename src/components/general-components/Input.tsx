/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { faArrowLeft, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  Fragment,
  memo,
  MouseEventHandler,
} from 'react';
//import naijaStates from 'naija-state-local-government';
import Select, { components, MenuListProps } from 'react-select';
//import { useCallback } from 'react';
import customStyles from '@/styles/inputStyle';

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
  className?: string;
  id?: string;
  value?: string | number | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  forState?: boolean;
  forLGA?: boolean;
  forIdtype?: boolean;
  forRegion?: boolean;
  selectedIdType?: Option | null;
  setSelectedIdType?: (option: Option | null) => void;
  selectedState?: Option | null;
  setSelectedState?: (option: Option | null) => void;
  selectedLGA?: Option | null;
  setSelectedLGA?: (option: Option | null) => void;
  selectedRegion?: Option | null;
  setSelectedRegion?: (option: Option | null) => void;
  isDisabled?: boolean;
  minNumber?: number;
  maxNumber?: number;
  formik?: any;
  stateOptions?: Option[];
  lgasOptions?: Option[];
  idTypeOptions?: Option[];
  stateValue?: string;
  readOnly?: boolean;
}

const Input: FC<InputProps> = memo(
  ({
    className,
    id,
    name,
    label,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    forState,
    forLGA,
    forRegion,
    forIdtype,
    isDisabled,
    minNumber,
    maxNumber,
    stateOptions,
    lgasOptions,
    idTypeOptions,
    selectedIdType,
    setSelectedIdType,
    selectedLGA,
    setSelectedLGA,
    selectedState,
    setSelectedState,
    selectedRegion,
    setSelectedRegion,
    formik,
    stateValue,
    onClick,
    onFocus,
    readOnly,
  }) => {
    // useEffect(() => {
    //   console.log('Component re-rendered', formik?.values);
    // });

    // useEffect(() => {
    //   console.log({
    //     selectedState,
    //     selectedLGA,
    //     lgaOptions,
    //   });
    //   // console.log('Formik State:', formik?.values);
    // }, [selectedState, selectedLGA, lgaOptions]);

    // useEffect(() => {
    //   console.log('Component re-rendered', lgaOptions);
    // });

    return (
      <Fragment>
        <label
          htmlFor={id}
          className={`min-h-[80px] w-full ${className} flex flex-col gap-[4px]`}>
          <span
            className={`text-base leading-[25.6px] font-medium text-[#1E1E1E] ${
              isDisabled && 'text-[#847F7F]'
            }`}>
            {label}
          </span>

          {forState && (
            <div className='flex flex-col w-full'>
              <Select
                components={{
                  MenuList: ComponentMenuList('Filter by Location'),
                }}
                options={stateOptions}
                value={selectedState}
                onChange={setSelectedState}
                placeholder='Select State'
                styles={customStyles}
                isDisabled={isDisabled}
                className='disabled:cursor-not-allowed'
              />
              {(formik?.errors?.selectedState ||
                formik?.touched?.selectedState) && (
                <span className='text-red-600 text-xs'>
                  {formik?.errors?.selectedState}
                </span>
              )}
            </div>
          )}

          {forLGA && (
            <div className='flex flex-col w-full'>
              <Select
                options={lgasOptions}
                value={selectedLGA}
                components={{
                  MenuList: ComponentMenuList(
                    `Filter by ${stateValue?.normalize()} state`
                  ),
                }}
                onChange={setSelectedLGA}
                placeholder='Select LGA'
                styles={customStyles}
                isDisabled={lgasOptions?.length === 0}
                className='disabled:cursor-not-allowed'
              />
              {(formik?.errors?.selectedLGA ||
                formik?.touched?.selectedLGA) && (
                <span className='text-red-600 text-xs'>
                  {formik?.errors?.selectedLGA}
                </span>
              )}
            </div>
          )}

          {forRegion && (
            <div className='flex flex-col w-full'>
              <Select
                options={stateOptions}
                value={selectedRegion}
                components={{ MenuList: ComponentMenuList('Filter by Region') }}
                onChange={setSelectedRegion}
                placeholder='Select Region of Operation'
                styles={customStyles}
                isDisabled={isDisabled}
                className='disabled:cursor-not-allowed'
              />
              {(formik?.errors?.selectedRegion ||
                formik?.touched?.selectedRegion) && (
                <span className='text-red-600 text-xs'>
                  {formik?.errors?.selectedRegion}
                </span>
              )}
            </div>
          )}

          {forIdtype && (
            <div className='flex flex-col w-full'>
              <Select
                options={idTypeOptions}
                value={selectedIdType}
                onChange={setSelectedIdType}
                components={{ MenuList: ComponentMenuList('Type of ID') }}
                placeholder='Select Type if ID'
                styles={customStyles}
                isDisabled={isDisabled}
                className='disabled:cursor-not-allowed'
              />
              {(formik?.errors?.selectedIdType ||
                formik?.touched?.selectedIdType) && (
                <span className='text-red-600 text-xs'>
                  {formik?.errors?.selectedIdType}
                </span>
              )}
            </div>
          )}

          {!forLGA && !forState && !forRegion && !forIdtype && (
            <div className='flex flex-col w-full'>
              <div className='flex items-center'>
                <input
                  id={id}
                  name={name}
                  type={type}
                  value={value}
                  onChange={isDisabled ? undefined : onChange}
                  onBlur={onBlur}
                  disabled={isDisabled}
                  onClick={isDisabled ? undefined : onClick}
                  onFocus={isDisabled ? undefined : onFocus}
                  min={type === 'number' ? minNumber : undefined}
                  max={type === 'number' ? maxNumber : undefined}
                  readOnly={readOnly}
                  placeholder={placeholder ?? 'This is placeholder'}
                  className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-white disabled:bg-[#F] border-[#D6DDEB] placeholder:text-[#A8ADB7] disabled:text-[#847F7F] text-black text-base leading-[25.6px] disabled:cursor-not-allowed focus:outline-[1.5px] focus:outline-[#14b8a6] focus:outline-offset-0 rounded-[5px]'
                />
              </div>
              {(formik?.errors?.[name] || formik?.touched?.[name]) && (
                <span className='text-red-600 text-xs'>
                  {formik?.errors?.[name]}
                </span>
              )}
            </div>
          )}
        </label>
      </Fragment>
    );
  }
);

Input.displayName = 'Input';

type OptionType = {
  label: string;
  value: string;
};

// type CustomMenuListProps = MenuListProps<
//   OptionType,
//   false,
//   GroupBase<OptionType>
// > & {
//   heading?: string;
// };

const ComponentMenuList = (heading: string) => {
  const WrappedMenuList = (props: MenuListProps<OptionType, false>) => (
    <components.MenuList {...props}>
      {heading && (
        <div
          className='flex gap-[10px] justify-start items-center border-[#8D9096] border-b-[1px] w-[95%] mx-auto'
          style={{ padding: '8px 12px', fontWeight: 'bold', color: '#555' }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size='sm'
            color='black'
            className='cursor-pointer'
          />
          <span className='text-[#000000] text-sm font-medium'>{heading}</span>
        </div>
      )}
      {props.children}
    </components.MenuList>
  );

  WrappedMenuList.displayName = 'ComponentMenuList';

  return WrappedMenuList;
};

export default Input;
