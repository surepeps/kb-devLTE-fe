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
import Button from './general-components/button';
import Input from './general-components/Input';
import Select from './general-components/select';
import AttachFile from '@/components/general-components/attach_file';
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
import customStyles from '@/styles/inputStyle';

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
  const [selectedIdType, setSelectedIdType] = useState<Option | null>(null);

  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);

  const [idFileUrl, setIdFileUrl] = useState<string | null>(null); // For ID upload
  const [utilityBillFileUrl, setUtilityBillFileUrl] = useState<string | null>(
    null
  ); // For utility bill upload

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
    console.log('Selected LGA:', formik.values);
    setSelectedLGA?.(selected);
  };

  const handleStateChange = (selected: Option | null) => {
    console.log(formik.values);
    formik.setFieldValue('state', selected?.value);
    setSelectedState?.(selected);

    if (selected) {
      const lgas = naijaStates.lgas(selected.value)?.lgas;
      console.log('Raw LGA Data:', lgas);

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

  const handleIdTypeChange = (selected: Option | null) => {
    formik.setFieldValue('typeOfID', selected?.value);
    setSelectedIdType(selected);
  };

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
    onSubmit: async () => {
      if (!idFileUrl) {
        return toast.error('Please upload your government-issued ID');
      }
      if (!utilityBillFileUrl) {
        return toast.error(
          'Please upload your utility bill for address verification'
        );
      }

      const payload = {
        token: Cookies.get('token'),
        address: {
          street: formik.values.street,
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
              },
            }
          : {
              companyAgent: {
                companyName: formik.values.companyName,
              },
            }),
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        phoneNumber: formik.values.phoneNumber,
        meansOfId: [
          {
            name:
              selectedAgentType === 'Individual Agent'
                ? selectedIdType?.value
                : 'cac',
            docImg: [idFileUrl], // Use idFileUrl for the ID document
          },
          {
            name: 'utility bill',
            docImg: [utilityBillFileUrl], // Use utilityBillFileUrl for the utility bill
          },
        ],
      };
      // console.log('Payload:', payload);
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
              router.push('/agent/under-review');
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
          // success: 'Agent data submitted successfully',
        }
      );
    },
  });

  useEffect(() => {
    // if(!user) router.push('/auth/agent/login')
    if (user) {
      formik.setValues({
        street: '',
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
            To complete your registration, please upload your government-issued
            ID, company registration number, and a recent utility bill for
            address verification
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
                  onChange={formik.handleChange} // Ensure this is present to make the field editable
                  onBlur={formik.handleBlur}
                  placeholder='This is a placeholder'
                />
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
                  stateValue={selectedState?.label}
                  selectedLGA={selectedLGA}
                  lgasOptions={lgaOptions}
                  setSelectedLGA={handleLGAChange}
                  // isDisabled={areInputsDisabled}
                />
              </div>
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
                    type='text'
                    formik={formik}
                    forIdtype={true}
                    selectedIdType={selectedIdType}
                    idTypeOptions={[
                      {
                        value: 'international passport',
                        label: 'International Passport',
                      },
                      { value: 'nin', label: 'NIN' },
                      { value: 'driver license', label: 'Driver License' },
                      { value: 'voter card', label: 'Voter Card' },
                    ]}
                    setSelectedIdType={handleIdTypeChange}
                    // isDisabled={areInputsDisabled}
                  />
                ) : (
                  <Input
                    label='Business/Company Name'
                    name='companyName'
                    className='md:w-full w-full'
                    type='text'
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id='companyName'
                    placeholder='This is a placeholder'
                  />
                )}
              </div>

              {/**Agent Type */}
              <h2 className='text-[20px] leading-[32px] text-[#09391C] font-semibold mb-[10px]'>
                Upload for verification
              </h2>

              {selectedAgentType === 'Individual Agent' ? (
                <AttachFile
                  heading={`Upload your ${selectedIdType?.label || 'ID'}`}
                  setFileUrl={setIdFileUrl} // Set ID file URL
                  id='id-upload' // Unique ID for ID upload
                />
              ) : (
                <AttachFile
                  heading='Upload your CAC'
                  setFileUrl={setIdFileUrl} // Set CAC file URL
                  id='cac-upload' // Unique ID for CAC upload
                />
              )}

              <AttachFile
                heading='Upload your utility bill to verify your address'
                setFileUrl={setUtilityBillFileUrl} // Set utility bill file URL
                id='utility-bill-upload' // Unique ID for utility bill upload
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
        styles={customStyles}
        placeholder='Select'
      />
    </label>
  );
};
export default AgentData;
