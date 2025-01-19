/** @format */

import AttachFile from '@/components/attach_file';
import Button from '@/components/button';
import Input from '@/components/Input';
import RadioCheck from '@/components/radioCheck';

const PropertyType = () => {
  const docOfTheProperty: string[] = [
    'C of O',
    'Survey document',
    'receipt',
    'Governor',
  ]; //Document on the property

  return (
    <div className='lg:w-[805px] min-h-[797px] gap-[30px] px-[30px] mt-[60px]'>
      <div className='flex flex-col gap-[35px] w-full'>
        {/**Property Type */}
        <div className='lg:w-[535px] min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Property Type
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex gap-[50px]'>
            <RadioCheck type='radio' name='propertyType' value='Residential' />
            <RadioCheck type='radio' name='propertyType' value='Commercial' />
            <RadioCheck type='radio' name='propertyType' value='Land' />
          </div>
        </div>
        {/**Location */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Location
          </h2>
          {/**inputs */}
          <div className='min-h-[26px] w-full flex gap-[15px]'>
            <Input name='State' type='input' className='w-1/3' />
            <Input name='Local government' type='input' className='w-1/3' />
            <Input name='Area' type='input' className='w-1/3' />
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
            />
          </div>
        </div>
        {/**Document on the property */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Document on the property
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex gap-[30px]'>
            {docOfTheProperty.map((item: string, idx: number) => (
              <RadioCheck
                type='checkbox'
                key={idx}
                value={item}
                name={'docOnTheProperty'}
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
            />
            <Input
              name='Additional Features'
              type='text'
              className='lg:w-1/2 w-full'
            />
          </div>
        </div>
        {/**Upload Image | Documents */}
        <AttachFile heading='Upload image(optional)' />
        {/**Button */}
        <div className='min-h-[50px] w-full flex justify-end items-center'>
          <Button
            value='Submit Brief'
            className='min-h-[50px] lg:w-[256px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyType;
