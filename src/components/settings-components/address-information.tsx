/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
//import ReactSelect from 'react-select';
import naijaStates from 'naija-state-local-government';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../Input';

interface Option {
  value: string;
  label: string;
}
const AddressInformation = () => {
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Option | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<Option | null>(null);

  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [regionOptions, setRegionOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);

  const validationSchema = Yup.object({
    selectedLGA: Yup.string().required('LGA is required'),
    selectedState: Yup.string().required('State is required'),
    street: Yup.string().required('Street is required'),
    selectedRegion: Yup.string().required('Region of operation is required'),
  });

  const formik = useFormik({
    initialValues: {
      selectedState: '',
      selectedLGA: '',
      street: '',
      selectedRegion: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    // Load Nigerian states correctly
    setStateOptions(
      naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      }))
    );
    setRegionOptions(
      naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      }))
    );
  }, []);

  const handleLGAChange = (selected: Option | null) => {
    formik.setFieldValue('selectedLGA', selected?.value);
    console.log('Selected LGA:', formik.values); // Debugging
    setSelectedLGA?.(selected);
  };

  const handleStateChange = (selected: Option | null) => {
    console.log(formik.values);
    formik.setFieldValue('selectedState', selected?.value);
    setSelectedState?.(selected);

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
      setLgaOptions([]);
      setSelectedLGA?.(null);
    }
  };

  /**Handle Region Change */
  const handleRegionChange = (selected: Option | null) => {
    console.log(formik.values);
    formik.setFieldValue('selectedRegion', selected?.value);
    setSelectedRegion?.(selected);
  };

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      initial={{ y: 80, opacity: 0 }}
      viewport={{ once: true }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className='lg:w-[662px] lg:h-[383px] bg-[#FFFFFF] border-[#C7CAD0] border-[1px] p-[30px] flex flex-col gap-[40px]'>
      <div className='flex flex-col lg:h-[233px] gap-[20px]'>
        <h2 className='text-[20px] font-semibold leading-[160%] text-[#09391C]'>
          Address Information
        </h2>
        <div className='w-full lg:h-[181px] flex flex-col gap-[20px]'>
          {/**Inputs - Street, state, and Local Govt area */}
          <div className='w-full md:grid md:grid-cols-3 flex flex-col gap-[15px]'>
            {/**Street */}
            <Input
              label='Street'
              name='street'
              value={formik.values.street}
              onChange={formik.handleChange}
              type='text'
            />
            {/**State */}
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
            {/**Local Government Area */}
            <Input
              label='Local Government Area'
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
          {/**Region of Operation */}
          <Input
            label='Region of Operation'
            name='regionOfOperation'
            forState={false}
            forLGA={false}
            forRegion={true}
            type='text'
            placeholder='Select Region of Operation'
            formik={formik}
            selectedRegion={selectedRegion}
            stateOptions={regionOptions}
            setSelectedRegion={handleRegionChange}
            // isDisabled={areInputsDisabled}
          />
        </div>
      </div>
      {/**Button to Save */}
      <button
        type='submit'
        className={`bg-[#8DDB90] gap-[10px] h-[50px] w-full text-base font-bold text-[#FAFAFA]`}>
        Save
      </button>
    </motion.form>
  );
};

// interface SelectProps {
//   heading: string;
//   placeholder?: string;
//   options: any[];
//   formik: any;
//   allowMultiple?: boolean;
//   name: string;
// }

// const Select: React.FC<SelectProps> = ({
//   heading,
//   options,
//   formik,
//   allowMultiple,
//   name,
// }) => {
//   // const [valueSelected, setValueSelected] =
//   //   useState<SingleValue<OptionType>>(null);

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
//         onChange={(selectedOption) =>
//           allowMultiple
//             ? formik.setFieldValue(
//                 heading,
//                 [
//                   ...(Array.isArray(selectedOption)
//                     ? selectedOption.map((opt: any) => opt.label)
//                     : []),
//                 ].filter(Boolean) // Removes undefined values
//               )
//             : formik.setFieldValue(heading, selectedOption?.label ?? '')
//         }
//         /** const selectedLabels = selectedOption ? selectedOption.map(opt => opt.label) : [];
//     formik.setFieldValue(heading, selectedLabels); */
//         onBlur={formik.handleBlur}
//         value={formik.values[heading]?.label}
//         options={opts}
//         className={`w-full`}
//         styles={{
//           control: (base) => ({
//             ...base,
//             height: '50px',
//             background: '#FFFFFF00',
//             overflow: 'hidden',
//             display: 'flex',
//             width: '100%',
//           }),
//         }}
//         placeholder='Select'
//       />
//       {/* <select
//         onChange={(e) => {
//           setValueSelected(e.target.value);
//         }}
//         value={valueSelected}
//         className='min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FFFFFF00] border-[#D6DDEB]'
//         name='select'
//         id='select'>
//         {options.map((option: string, idx: number) => (
//           <option value={option} key={idx}>
//             {option}
//           </option>
//         ))}
//       </select> */}
//     </label>
//   );
// };

export default AddressInformation;
