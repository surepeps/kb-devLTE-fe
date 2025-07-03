/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//import AttachFile from '@/components/multipleAttachFile';
import Button from '@/components/general-components/button';
import Cookies from 'js-cookie';
import Input from '@/components/general-components/Input';
import RadioCheck from '@/components/general-components/radioCheck';
import { toast } from 'react-hot-toast';
import { GET_REQUEST, POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '@/context/user-context';
import React, { FC, useEffect, useRef, useState } from 'react';
import naijaStates from 'naija-state-local-government';
import { propertyReferenceData } from '@/data/buy_page_data';
import ReactSelect from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { usePageContext } from '@/context/page-context';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import SubmitPopUp from '@/components/submit';
import AttachFile from '../create_brief_image_upload';
import customStyles from '@/styles/inputStyle';
import { usePathname, useRouter } from 'next/navigation';
import {
  editBriefProps,
  useEditBriefContext,
} from '@/context/admin-context/brief-management/edit-brief';
import convertToNumber from '@/utils/convertToNumber';
import {
  createBriefProps,
  useCreateBriefContext,
} from '@/context/admin-context/brief-management/create-brief';
import { archivo } from '@/styles/font';
import MultiSelectionProcess from '../multiSelectionProcess';

interface Option {
  value: string;
  label: string;
}
const CreateBrief = ({
  closeModal,
}: {
  closeModal?: (type: boolean) => void;
}) => {
  const { editBrief, setEditBrief } = useCreateBriefContext();
  const { user } = useUserContext();
  const [selectedBrief, setSelectedBrief] = useState<string>('Rental Brief');
  useEffect(() => {
    console.log(user);
  }, []);
  const attachRef = useRef<{ triggerUpload: () => void }>(null);
  // const [selectedState, setSelectedState] = useState<Option | null>(null);
  // const [selectedLGA, setSelectedLGA] = useState<Option | null>(null);
  // const [stateOptions, setStateOptions] = useState<Option[]>([]);
  // const [lgaOptions, setLgaOptions] = useState<Option[]>([]);
  // const [fileUrl, setFileUrl] = useState<{ id: string; image: string }[]>([]);
  const { setViewImage, setImageData } = usePageContext();
  // const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  useEffect(() => {
    // Load Nigerian states correctly
    setEditBrief({
      ...editBrief,
      stateOptions: naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      })),
    });
  }, []);

  const handleLGAChange = (selected: Option | null) => {
    // formik.setFieldValue('selectedLGA', selected?.value);
    setEditBrief({
      ...editBrief,
      selectedLGA: selected,
    });
  };

  const handleStateChange = (selected: Option | null) => {
    // formik.setFieldValue('selectedState', selected?.value);
    // setSelectedState(selected);
    console.log(selected);
    setEditBrief({
      ...editBrief,
      selectedState: selected,
    });
    console.log('Selected state: ' + editBrief.selectedState);
    if (selected) {
      const lgas = naijaStates.lgas(selected.value)?.lgas;
      if (Array.isArray(lgas)) {
        console.log(lgas);
        setEditBrief({
          ...editBrief,
          selectedState: selected,
          lgaOptions: lgas.map((lga: string) => ({
            value: lga,
            label: lga,
          })),
        });
      } else {
        setEditBrief({
          ...editBrief,
          lgaOptions: [],
        });
        console.log(lgas);
      }
    }
  };

  useEffect(() => {
    console.log(editBrief);
  }, [editBrief]);

  const dynamicContentToRender = () => {
    switch (selectedBrief) {
      case 'Rental Brief':
        return (
          <RentalBrief
            editBrief={editBrief}
            handleLGAChange={handleLGAChange}
            setEditBrief={setEditBrief}
            handleStateChange={handleStateChange}
            setViewImage={setViewImage}
            setImageData={setImageData}
            attachRef={attachRef}
          />
        );

      case 'Property Brief':
        return <>{selectedBrief}</>;
      default:
        return (
          <RentalBrief
            editBrief={editBrief}
            handleLGAChange={handleLGAChange}
            setEditBrief={setEditBrief}
            handleStateChange={handleStateChange}
            setViewImage={setViewImage}
            setImageData={setImageData}
            attachRef={attachRef}
          />
        );
    }
  };

  return (
    <>
      {editBrief.isSubmittedSuccessfully && (
        <SubmitPopUp
          title='Brief Successfully Submitted'
          subheader='Brief will be approved before uploading'
          buttonText='OVERVIEW'
          href={'/agent/briefs'}
          onClick={() =>
            setEditBrief({
              ...editBrief,
              isSubmittedSuccessfully: true,
            })
          } // Ensure modal closes
        />
      )}
      <motion.section
        initial={{ x: 90, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='w-full flex flex-col items-end fixed top-0 left-0 right-0 bottom-0 bg-[#00000080] z-[100] overflow-y-scroll'>
        <section className='flex flex-col gap-[20px] lg:w-[805px] w-full'>
          <form
            // onSubmit={handleSubmit}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            // onSubmit={formik.handleSubmit}
            className='lg:w-[805px] bg-white p-[20px] lg:py-[40px] lg:px-[40px] w-full h-full gap-[30px] md:px-[30px]'>
            <div className='w-full'>
              <div className='w-full flex'>
                {/**Exit the pop up */}
                <button
                  type='button'
                  onClick={() => {
                    closeModal?.(false);
                  }}
                  className='w-[41px] h-[41px] flex justify-center items-center rounded-full bg-gray-100'>
                  <FontAwesomeIcon icon={faClose} size='lg' />
                  {''}
                </button>
              </div>
              <div className='flex flex-col gap-[20px]'>
                <h2
                  className={`text-[#2E2C34] text-2xl font-bold ${archivo.className} mt-4`}>
                  Create inhouse Brief
                </h2>
                <div className='lg:w-[425px] h-[40px] flex gap-[30px]'>
                  {['Rental Brief', 'Property Brief'].map(
                    (item: string, idx: number) => (
                      <button
                        key={idx}
                        type='button'
                        onClick={() => setSelectedBrief(item)}
                        className={`w-[209px] py-[12px] px-[7px] flex items-center justify-center ${
                          selectedBrief === item
                            ? 'bg-[#8DDB90] text-[#FFFFFF] font-semibold'
                            : 'bg-[#FAFAFA] text-black font-normal'
                        } text-base ${archivo.className} rounded-[4px]`}>
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
              {/**Selected brief */}
              <div className='h-[60px] border-y-[1px] border-[#CFD0D5] mt-[20px] flex items-center'>
                <h2
                  className={`text-lg ${archivo.className} text-[#2E2C34] font-bold`}>
                  Create {selectedBrief}
                </h2>
              </div>
              {/**Form to fill */}
              {selectedBrief && dynamicContentToRender()}
            </div>
          </form>
        </section>
      </motion.section>
    </>
  );
};

export default CreateBrief;

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: any[];
  formik?: any;
  allowMultiple?: boolean;
  name: string;
  setCreateBrief?: (type: createBriefProps) => void;
  createBrief: createBriefProps;
  values?: string[];
}

// const Select: React.FC<SelectProps> = ({
//   heading,
//   options,
//   formik,
//   allowMultiple,
//   name,
//   setCreateBrief,
//   createBrief,
//   values,
// }) => {
//   const opts = options.map((item) => ({
//     value: typeof item === 'string' ? item.toLowerCase() : `${item} Bedroom`,
//     label: typeof item === 'number' ? Number(item) : item,
//   }));

//   return (
//     <label
//       htmlFor='select'
//       className='min-h-[80px] lg:w-[243.25px] w-full flex flex-col gap-[4px]'>
//       <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
//         {name}
//       </h2>
//       <ReactSelect
//         isMulti={allowMultiple}
//         name={name}
//         onChange={(selectedOption: any) =>
//           allowMultiple
//             ? setCreateBrief?.((prev: any) => {
//                 const existing = Array.isArray(prev?.[heading])
//                   ? prev[heading]
//                   : [];

//                 const newLabels = Array.isArray(selectedOption)
//                   ? selectedOption.map((opt) => opt.label).filter(Boolean)
//                   : [];

//                 return {
//                   ...prev,
//                   [heading]: Array.from(new Set([...existing, ...newLabels])),
//                 };
//               })
//             : // : formik.setFieldValue(heading, selectedOption?.label ?? '')
//               setCreateBrief?.({
//                 ...createBrief,
//                 [heading]: selectedOption?.label,
//               })
//         }
//         onBlur={formik?.handleBlur}
//         value={values?.map((item: string) => ({ label: item, value: item }))}
//         options={opts}
//         className={`w-full`}
//         styles={customStyles}
//         placeholder='Select'
//       />
//     </label>
//   );
// };

type ImageContainerProps = {
  image: string;
  alt: string;
  heading: string;
  removeImage: () => void;
  id: string;
  setViewImage: (type: boolean) => void;
  setImageData: (type: StaticImport[] | string[]) => void;
};

const ImageContainer: FC<ImageContainerProps> = ({
  image,
  removeImage,
  id,
  setViewImage,
  setImageData,
}) => {
  return (
    <div
      title={image}
      id={id}
      className='w-[64px] h-[84px] flex flex-col shrink-0 gap-[4px] justify-end items-end'>
      <FontAwesomeIcon
        icon={faTrashCan}
        size='sm'
        color='#FF2539'
        className='cursor-pointer'
        title='delete'
        onClick={removeImage}
      />
      <motion.img
        onClick={() => {
          setViewImage(true);
          setImageData([image]);
        }}
        src={image}
        alt=''
        width={100}
        height={70}
        className='w-full h-[62px] filter brightness-75 hover:brightness-100 transition duration-500 border-[1px] rounded-[4px] bg-gray-100 object-cover'
      />
    </div>
  );
};

const RentalBrief = ({
  editBrief,
  setEditBrief,
  handleStateChange,
  handleLGAChange,
  setViewImage,
  setImageData,
  attachRef,
}: {
  editBrief: createBriefProps;
  setEditBrief: (type: createBriefProps) => void;
  handleStateChange: (selected: Option | null) => void;
  handleLGAChange: (selected: Option | null) => void;
  setViewImage: (type: boolean) => void;
  setImageData: (type: StaticImport[] | string[]) => void;
  attachRef: React.RefObject<{
    triggerUpload: () => void;
  } | null>;
}) => {
  const [isBedroomModalOpend, setIsBedroomModalOpened] =
    useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      bedroom: '',
    },
    onSubmit: (values) => console.log(values),
  });
  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);
  return (
    <div className='flex flex-col gap-[35px] w-full px-[40px]'>
      {/** Display Formik validation errors for owner's information */}
      <div className='w-full flex flex-col gap-[15px]'></div>
      {/**Property Type */}
      <div className='lg:w-[535px] min-h-[73px] flex flex-col gap-[15px]'>
        <h2 className='text-[20px] leading-[32px] font-semibold text-[#1E1E1E]'>
          Property Type
        </h2>
        {/**options */}
        <div className='min-h-[26px] w-full flex flex-wrap gap-[20px] lg:gap-[50px]'>
          <RadioCheck
            isChecked={editBrief.propertyType === 'Residential'}
            selectedValue={editBrief?.propertyType}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Residential');
              setEditBrief({
                ...editBrief,
                propertyType: 'Residential',
              });
            }}
            type='radio'
            name='propertyType'
            value='Residential'
          />
          <RadioCheck
            selectedValue={editBrief?.propertyType}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Commercial');
              setEditBrief({
                ...editBrief,
                propertyType: 'Commercial',
              });
            }}
            type='radio'
            name='propertyType'
            value='Commercial'
            isChecked={editBrief.propertyType === 'Commercial'}
          />
          <RadioCheck
            selectedValue={editBrief?.propertyType}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Land');
              setEditBrief({
                ...editBrief,
                propertyType: 'Land',
              });
            }}
            type='radio'
            name='propertyType'
            value='Land'
            isChecked={editBrief.propertyType === 'Land'}
          />
        </div>
      </div>

      {/**Property condition */}
      <div className='lg:w-[535px] min-h-[73px] flex flex-col gap-[15px]'>
        <h2 className='text-[20px] leading-[32px] font-semibold text-[#1E1E1E]'>
          Property condition
        </h2>
        {/**options */}
        <div className='min-h-[26px] w-full flex flex-wrap gap-[20px] lg:gap-x-[30px]'>
          <RadioCheck
            //isChecked={editBrief.propertyCondition === 'Residential'}
            selectedValue={editBrief?.propertyCondition}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Residential');
              setEditBrief({
                ...editBrief,
                propertyCondition: 'Brand New',
              });
            }}
            type='radio'
            name='propertyCondition'
            value='Brand New'
          />
          <RadioCheck
            selectedValue={editBrief?.propertyCondition}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Commercial');
              setEditBrief({
                ...editBrief,
                propertyCondition: 'Good Condition',
              });
            }}
            type='radio'
            name='propertyCondition'
            value='Good Condition'
            //isChecked={editBrief.propertyType === 'Commercial'}
          />
          <RadioCheck
            selectedValue={editBrief?.propertyCondition}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Land');
              setEditBrief({
                ...editBrief,
                propertyCondition: 'Fairly Used',
              });
            }}
            type='radio'
            name='propertyCondition'
            value='Fairly Used'
            //isChecked={editBrief.propertyType === 'Land'}
          />
          <RadioCheck
            selectedValue={editBrief?.propertyCondition}
            handleChange={() => {
              // formik.setFieldValue('propertyType', 'Land');
              setEditBrief({
                ...editBrief,
                propertyCondition: 'Needs Renovation',
              });
            }}
            type='radio'
            name='propertyCondition'
            value='Needs Renovation'
            //isChecked={editBrief.propertyType === 'Land'}
          />
        </div>
      </div>
      {/**Location */}
      <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
        <h2 className='text-[20px] leading-[32px] font-semibold text-[#1E1E1E]'>
          Location
        </h2>
        {/**inputs */}
        <div className='min-h-[26px] w-full flex flex-col flex-wrap lg:grid lg:grid-cols-2 gap-[15px]'>
          <Input
            label='State'
            name='selectedState'
            forState={true}
            forLGA={false}
            type='text'
            placeholder='Select State'
            // formik={formik}
            selectedState={editBrief.selectedState}
            stateOptions={editBrief?.stateOptions}
            setSelectedState={handleStateChange}
          />
          <Input
            label='Local Government'
            name='selectedLGA'
            type='text'
            // formik={formik}
            forLGA={true}
            forState={false}
            selectedLGA={editBrief.selectedLGA}
            lgasOptions={editBrief?.lgaOptions}
            stateValue={editBrief?.selectedState?.label}
            setSelectedLGA={handleLGAChange}
          />
          <Input
            label='Rental Price'
            name='rentalPrice'
            value={editBrief?.price}
            onChange={(event) => {
              setEditBrief({
                ...editBrief,
                price: event.target.value,
              });
            }}
            type='number'
          />
          <Input
            label='Number of Bedroom'
            name='noOfBedroom'
            value={editBrief?.noOfBedroom}
            onChange={(event) => {
              setEditBrief({
                ...editBrief,
                noOfBedroom: Number(event.target.value) as number,
              });
            }}
            type='number'
          />
        </div>
      </div>

      {/**Property Features */}
      <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
        <h2 className='text-[20px] leading-[32px] font-semibold text-[#1E1E1E]'>
          Features
        </h2>
        {/**options */}
        <div className='grid grid-cols-3 gap-[10px]'>
          {[
            'Furnished',
            'Security',
            'Closets',
            'Bath Tub',
            'Unfurnished',
            'Secure Estate',
            'Water Heaters',
            'Balconies',
            'Parking Space',
            'Spacious Compound',
            'Security Features (CCTV)',
            'Swimming Pool',
          ].map((item: string, idx: number) => (
            <RadioCheck
              selectedValue={item}
              key={idx}
              handleChange={() => {
                setEditBrief({
                  ...editBrief,
                  features: Array.from(new Set([...editBrief.features, item])),
                });
              }}
              type='checkbox'
              name='propertyCondition'
              value={item}
              //isChecked={editBrief.propertyType === 'Land'}
            />
          ))}
        </div>
      </div>
      {/**Tenanat Criteria */}
      <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
        <h2 className='text-[20px] leading-[32px] font-semibold text-[#1E1E1E]'>
          Tenant Criteria
        </h2>
        {/**options */}
        <div className='grid grid-cols-3 gap-[20px]'>
          {[
            'No Pets Allowed',
            'Corporate Tenant',
            'Male',
            'Female',
            'Individual Tenant',
            'Employee',
            'Self Employed',
            'Student',
            'Must Provide Credit Report',
          ].map((item: string, idx: number) => (
            <RadioCheck
              selectedValue={item}
              key={idx}
              handleChange={() => {
                setEditBrief({
                  ...editBrief,
                  tenantCriteria: Array.from(
                    new Set([...(editBrief.tenantCriteria ?? item), item])
                  ),
                });
              }}
              type='checkbox'
              name='propertyCondition'
              value={item}
              //isChecked={editBrief.propertyType === 'Land'}
            />
          ))}
        </div>
      </div>

      {/**Button */}
      <div className='min-h-[50px] w-full flex justify-end items-center'>
        <Button
          value='Submit Brief'
          type='submit'
          className='min-h-[50px] w-full lg:w-[256px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold'
        />
      </div>
    </div>
  );
};
