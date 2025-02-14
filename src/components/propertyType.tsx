/** @format */
'use client';
import AttachFile from '@/components/attach_file';
import Button from '@/components/button';
import Input from '@/components/Input';
import RadioCheck from '@/components/radioCheck';
import { useEffect, useState } from 'react';

interface Option {
  value: string;
  label: string;
}
const PropertyType = () => {
  const docOfTheProperty: string[] = [
    'C of O',
    'Survey document',
    'receipt',
    'Governor',
  ]; //Document on the property
  const [details, setDetails] = useState<{
    propertyType: string;
    usageOptions: string[];
    price: string;
    documents: string[];
    noOfBedroom: string;
    additionalFeatures: string;
  }>({
    propertyType: '',
    usageOptions: [],
    price: '',
    documents: [],
    noOfBedroom: '',
    additionalFeatures: '',
  });

  const [currentItem, setCurrentItem] = useState<string>('');
  //const [documentItem, setDocumentItem] = useState<string>('');
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedCity, setSelectedCity] = useState<Option | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);

  useEffect(() => {
    console.log(details);
  }, [details, setDetails]);

  return (
    <div className='lg:w-[805px] w-full min-h-[797px] gap-[30px] md:px-[30px] mt-[60px]'>
      <div className='flex flex-col gap-[35px] w-full'>
        {/**Property Type */}
        <div className='lg:w-[535px] min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Property Type
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex flex-wrap gap-[20px] lg:gap-[50px]'>
            <RadioCheck
              selectedValue={details.propertyType}
              handleChange={() => {
                setDetails({ ...details, propertyType: 'Residential' });
              }}
              type='radio'
              name='propertyType'
              value='Residential'
            />
            <RadioCheck
              selectedValue={details.propertyType}
              handleChange={() => {
                setDetails({ ...details, propertyType: 'Commercial' });
              }}
              type='radio'
              name='propertyType'
              value='Commercial'
            />
            <RadioCheck
              selectedValue={details.propertyType}
              handleChange={() => {
                setDetails({ ...details, propertyType: 'Land' });
              }}
              type='radio'
              name='propertyType'
              value='Land'
            />
          </div>
        </div>
        {/**Usage Options */}
        <div className='min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Usage Options
          </h2>
          <div className='flex flex-wrap gap-[30px]'>
            {['All', 'Lease', 'Joint Venture(JV)', 'Outright Sale'].map(
              (item: string, idx: number) => (
                <RadioCheck
                  type='checkbox'
                  value={item}
                  key={idx}
                  name='Usage Options'
                  handleChange={() => {
                    if (details.usageOptions.includes(item)) {
                      setCurrentItem((prevItem) => prevItem);
                      return setDetails({
                        ...details,
                        usageOptions: details.usageOptions.filter(
                          (item) => item !== currentItem
                        ),
                      });
                    }
                    return setDetails({
                      ...details,
                      usageOptions: [
                        ...new Set([...details.usageOptions, item]),
                      ],
                    });
                  }}
                />
              )
            )}
          </div>
        </div>
        {/**Location */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Location
          </h2>
          {/**inputs */}
          <div className='min-h-[26px] w-full flex flex-col flex-wrap lg:grid lg:grid-cols-3 gap-[15px]'>
            {/* <Input name='State' type='input' className='lg:w-1/3 w-full' />
            <Input
              name='Local government'
              type='input'
              className='lg:w-1/3 w-full'
            />
            <Input name='Area' type='input' className='lg:w-1/3 w-full' /> */}
            <Input
              name='Address'
              selectedCountry={selectedCountry}
              setSelectedCountry={(option) => {
                setSelectedCountry(option);
                setSelectedState(null); // Reset state when country changes
                setSelectedCity(null); // Reset city when country changes
              }}
              forCountry={true}
              type='text'
            />
            <Input
              name='State'
              selectedCountry={selectedCountry} // Ensure state dropdown receives country
              selectedState={selectedState}
              setSelectedState={(option) => {
                setSelectedState(option);
                setSelectedCity(null); // Reset city when state changes
              }}
              forState={true}
              type='text'
            />
            <Input name='Local Government' type='text' />
            <Input
              name='Area or Neighborhood'
              forCity={true}
              selectedCountry={selectedCountry}
              selectedState={selectedState} // Ensure city dropdown receives state
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              type='text'
            />
          </div>
        </div>
        {/**Price */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Price
          </h2>
          {/**input */}
          <div className='min-h-[26px] w-full flex gap-[50px]'>
            <Input
              name='Enter property price'
              type='input'
              className='w-full'
              value={details.price}
              onChange={(e: { target: { value: string } }) => {
                setDetails({ ...details, price: e.target.value });
              }}
            />
          </div>
        </div>
        {/**Document on the property */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Document on the property
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex flex-wrap gap-[30px]'>
            {docOfTheProperty.map((item: string, idx: number) => (
              <RadioCheck
                type='checkbox'
                key={idx}
                value={item}
                name={'docOnTheProperty'}
                handleChange={() => {
                  if (details.documents.includes(item)) {
                    const index = details.documents.indexOf(item);
                    return setDetails({
                      ...details,
                      documents: details.documents.splice(index),
                    });
                  }
                  return setDetails({
                    ...details,
                    documents: [...new Set([...details.documents, item])],
                  });
                }}
              />
            ))}
          </div>
        </div>
        {/**Property Features */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Property Features
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex gap-[15px]'>
            <Input
              name='Number of Bedroom'
              type='number'
              className='lg:w-1/2 w-full'
              value={details.noOfBedroom}
              onChange={(e: { target: { value: string } }) => {
                setDetails({ ...details, noOfBedroom: e.target.value });
              }}
            />
            <Input
              name='Additional Features'
              type='text'
              className='lg:w-1/2 w-full'
              value={details.additionalFeatures}
              onChange={(e: { target: { value: string } }) => {
                setDetails({ ...details, additionalFeatures: e.target.value });
              }}
            />
          </div>
        </div>
        {/**Upload Image | Documents */}
        <AttachFile heading='Upload image(optional)' />
        {/**Button */}
        <div className='min-h-[50px] w-full flex justify-end items-center'>
          <Button
            value='Submit Brief'
            className='min-h-[50px] w-full lg:w-[256px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyType;
