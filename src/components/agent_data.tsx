/**
 * eslint-disable react-hooks/exhaustive-deps
 *
 * @format
 */

/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { usePageContext } from '@/context/page-context';
import React, { FC, useEffect, useState } from 'react';
import Button from './button';
import Input from './Input';
import Select from './select';
import AttachFile from '@/components/attach_file';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
//import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { PUT_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { useUserContext } from '@/context/user-context';
import naijaStates from 'naija-state-local-government';
import ReactSelect from 'react-select';

interface Option {
  value: string;
  label: string;
}
const AgentData = () => {
  const router = useRouter();
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const { user } = useUserContext();
  const [selectedAgentType, setSelectedAgentType] =
    useState<string>('Individual Agent');
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<Option | null>(null);

  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Load Nigerian states correctly
    setStateOptions(
      naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      }))
    );
  }, []);

  const handleLGAChange = (selected: Option | null) => {
    formik.setFieldValue('localGovtArea', selected?.value);
    console.log('Selected LGA:', formik.values); // Debugging
    setSelectedLGA?.(selected);
  };

  const handleStateChange = (selected: Option | null) => {
    console.log(formik.values);
    formik.setFieldValue('state', selected?.value);
    setSelectedState?.(selected);
    // console.log(lgaOptions, regionOptions);

    if (selected) {
      const lgas = naijaStates.lgas(selected.value)?.lgas;
      console.log('Raw LGA Data:', lgas); // Log raw LGA data

      if (Array.isArray(lgas)) {
        setLgaOptions(
          lgas.map((lga: string) => ({
            value: lga,
            label: lga,
          }))
        );
      } else {
        console.error('LGAs not returned as an array:', lgas);
        setLgaOptions([]);
      }
      setSelectedLGA?.(null);
    } else {
      // console.log('Hey');
      setLgaOptions([]);
      setSelectedLGA?.(null);
    }
  };

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      street: '',
      state: '',
      localGovtArea: '',
      selectedRegion: [''],
      typeOfID: '',
      companyName: '',
      idNumber: '',
      registrationNumber: '',
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
    },
    onSubmit: async (values) => {
      console.log(values);

      if (fileUrl === null) return toast.error('Please upload your document');
      const payload = {
        token: Cookies.get('token'),
        address: {
          street: formik.values.street,
          city: 'Anytown',
          state: formik.values.state,
          localGovtArea: formik.values.localGovtArea,
        },
        regionOfOperation: formik.values.selectedRegion,
        agentType:
          selectedAgentType === 'Individual Agent' ? 'Individual' : 'Company',
        ...(selectedAgentType === 'Individual Agent'
          ? {
              individualAgent: {
                typeOfId: formik.values.typeOfID,
                idNumber: formik.values.idNumber,
              },
            }
          : {
              companyAgent: {
                companyName: formik.values.companyName,
                regNumber: String(formik.values.registrationNumber),
              },
            }),
        doc: fileUrl, // Assuming doc is a static value or should be handled separately
        phoneNumber: formik.values.phoneNumber,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
      };
      await toast.promise(
        PUT_REQUEST(
          URLS.BASE + URLS.agentOnboarding,
          payload,
          Cookies.get('token')
        )
          .then((response) => {
            if (response.success) {
              console.log('response from form', response);
              toast.success('Agent data submitted successfully');
              Cookies.set(
                'token',
                (response as unknown as { token: string }).token
              );
              router.push('/agent/briefs');
              return 'Agent data submitted successfully';
            } else {
              const errorMessage =
                (response as any).error || 'Submission failed';
              toast.error(errorMessage);
              throw new Error(errorMessage);
            }
          })
          .catch((error) => {
            console.log('error', error);
            return error.message || 'Submission failed';
          }),
        {
          loading: 'Submitting...',
          success: 'Agent data submitted successfully',
          // error: 'An error occurred, please try again',
        }
      );
    },
  });

  useEffect(() => {
    // if(!user) router.push('/auth/agent/login')
    if (user) {
      formik.setValues({
        street: user?.address?.street || '',
        state: user?.address?.state || '',
        localGovtArea: user.address?.localGovtArea || '',
        selectedRegion: user.selectedRegion || [],
        typeOfID:
          user.agentType === 'Individual'
            ? user.individualAgent?.typeOfId || ''
            : '',
        companyName:
          user.agentType === 'Company'
            ? user?.companyAgent?.companyName || ''
            : '',
        idNumber:
          user.agentType === 'Individual'
            ? user.individualAgent?.idNumber || ''
            : '',
        registrationNumber:
          user.agentType === 'Company'
            ? user.companyAgent?.companyRegNumber || ''
            : '',
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);
  return (
    <section
      className={`flex items-center filter justify-center transition duration-500 bg-[#EEF1F1] min-h-[800px] py-[40px]  ${
        (isContactUsClicked || isModalOpened) && 'brightness-[30%]'
      }`}>
      <form
        onSubmit={formik.handleSubmit}
        className='lg:w-[870px] flex flex-col justify-center items-center gap-[40px] w-full px-[20px]'>
        <div className='w-full min-h-[137px] flex flex-col gap-[24px] justify-center items-center'>
          <h2 className='text-center text-[40px] leading-[49.2px] font-display font-bold text-[#09391C]'>
            Welcome to{' '}
            <span className='text-[#8DDB90] font-display'>Khabi-teq</span>{' '}
            realty
          </h2>
          <p className='text-[#5A5D63] text-[20px] leading-[32px] text-center tracking-[5%]'>
            Lorem ipsum dolor sit amet consectetur. Ornare feugiat suspendisse
            tincidunt erat scelerisque. Tortor aenean a urna metus cursus dui
            commodo velit. Tellus mattis quam.
          </p>
        </div>

        <div className='lg:w-[602px] min-h-[654px] flex flex-col gap-[40px]'>
          <div className='flex flex-col w-full gap-[20px]'>
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
              Address Information
            </h2>
            <div className='w-full flex flex-col gap-[20px] min-h-[181px]'>
              <div className='min-h-[80px] flex gap-[15px] lg:flex-row flex-col'>
                <Input
                  label='Street'
                  name='street'
                  type='text'
                  value={formik.values.street}
                  id='street'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='This is a placeholder'
                />
                {/* <Input
                  label='State'
                  name='state'
                  type='text'
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id='state'
                  placeholder='This is a placeholder'
                />
                <Input
                  label='Local Government Area'
                  name='localGovtArea'
                  type='text'
                  value={formik.values.localGovtArea}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id='localGovtArea'
                  placeholder='This is a placeholder'
                /> */}
                <Input
                  label='State'
                  name='selectedState'
                  forState={true}
                  forLGA={false}
                  type='text'
                  placeholder='Select State'
                  formik={formik}
                  selectedState={selectedState}
                  stateOptions={stateOptions}
                  setSelectedState={handleStateChange}
                  // isDisabled={areInputsDisabled}
                />
                <Input
                  label='Local Government'
                  name='selectedLGA'
                  type='text'
                  formik={formik}
                  forLGA={true}
                  forState={false}
                  selectedLGA={selectedLGA}
                  lgasOptions={lgaOptions}
                  setSelectedLGA={handleLGAChange}
                  // isDisabled={areInputsDisabled}
                />
              </div>
              {/* <Input
                label='Region of Operation'
                name='selectedRegion'
                className='w-full'
                type='text'
                forRegion={true}
                // value={formik.values.regionOfOperation}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                stateOptions={regionOptions}
                selectedRegion={selectedRegion}
                setSelectedRegion={handleRegionChange}
                id='regionOfOperation'
                placeholder='This is a placeholder'
              /> */}
              <RegionMultipleInput
                name='Region of Operation'
                formik={formik}
                allowMultiple={true}
                heading='selectedRegion'
                options={lgaOptions}
              />
            </div>
            {/**Agent Type */}
            <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
              Agent Type
            </h2>
            <div className='w-full min-h-[259px] flex flex-col gap-[20px]'>
              <Select
                value={selectedAgentType}
                // onChange={(e: { target: { value: string } }) => {
                //   setSelectedAgentType(e.target.value);
                // }}
                onChange={(option: any) => setSelectedAgentType(option.value)}
                name='Are you an Individual Agent or Corporate Agent?'
                className='cursor-pointer'
                options={['Individual Agent', 'Corporate Agent']}
              />
              <div className='w-full min-h-[80px] gap-[15px] flex lg:flex-row flex-col'>
                {selectedAgentType === 'Individual Agent' ? (
                  <Input
                    label='Type of ID'
                    name='typeOfID'
                    className='md:w-1/2 w-full'
                    type='text'
                    value={formik.values.typeOfID}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='typeOfID'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    label='Business/Company Name'
                    name='companyName'
                    className='md:w-1/2 w-full'
                    type='text'
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='companyName'
                    placeholder='This is a placeholder'
                  />
                )}
                {selectedAgentType === 'Individual Agent' ? (
                  <Input
                    label='ID Number'
                    name='idNumber'
                    className='md:w-1/2 w-full'
                    type='text'
                    value={formik.values.idNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='idNumber'
                    placeholder='This is a placeholder'
                  />
                ) : (
                  <Input
                    label='Registration Number'
                    name='registrationNumber'
                    className='md:w-1/2 w-full'
                    type='number'
                    value={formik.values.registrationNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='registrationNumber'
                    placeholder='This is a placeholder'
                  />
                )}
              </div>
              <AttachFile
                heading='Upload your document'
                setFileUrl={setFileUrl}
              />
              <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold'>
                Contact Information
              </h2>
              <div className='w-full min-h-[259px] flex flex-col gap-[20px]'>
                <Input
                  label='First Name'
                  name='firstName'
                  className='w-full'
                  id='firstName'
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  placeholder='Enter your first name'
                />
                <Input
                  label='Last Name'
                  name='lastName'
                  className='w-full'
                  id='lastName'
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  placeholder='Enter your first name'
                />
                <Input
                  label='Phone Number'
                  name='phoneNumber'
                  className='w-full'
                  id='phoneNumber'
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type='text'
                  placeholder='Enter your phone number'
                />
              </div>
            </div>
          </div>
          <Button
            value='Submit'
            type='submit'
            green={true}
            className='bg-[#8DDB90] min-h-[50px] py-[12px] px-[24px] w-full text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </form>
    </section>
  );
};

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: any[];
  formik: any;
  allowMultiple?: boolean;
  name: string;
}

const RegionMultipleInput: FC<SelectProps> = ({
  name,
  formik,
  allowMultiple,
  heading,
  options,
}) => {
  useEffect(() => {
    console.log(`options: ${options} \n length: ${options.length}`);
  }, [options]);
  return (
    <label
      htmlFor='select'
      className='min-h-[80px] w-full flex flex-col gap-[4px]'>
      <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
        {name}
      </h2>
      <ReactSelect
        isMulti={allowMultiple}
        name={name}
        onChange={(selectedOption) =>
          allowMultiple
            ? formik.setFieldValue(
                heading,
                [
                  ...(Array.isArray(selectedOption)
                    ? selectedOption.map((opt: any) => opt.label)
                    : []),
                ].filter(Boolean) // Removes undefined values
              )
            : formik.setFieldValue(heading, selectedOption?.label ?? '')
        }
        onBlur={formik.handleBlur}
        value={options.length !== 0 ? formik.values[heading]?.label : null}
        options={options.length !== 0 ? options : []}
        className={`w-full bg-white`}
        styles={{
          control: (base) => ({
            ...base,
            height: '50px',
            background: '#FFFFFF',
            overflow: 'hidden',
            display: 'flex',
            width: '100%',
          }),
        }}
        placeholder='Select'
      />
    </label>
  );
};
export default AgentData;
