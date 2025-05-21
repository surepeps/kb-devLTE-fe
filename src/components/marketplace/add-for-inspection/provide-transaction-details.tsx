/** @format */

'use client';
import { archivo } from '@/styles/font';
import { FormikProps, useFormik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import banks from '@/data/nigeria-banks.json';
import { Option } from '../types/option';
import Select, { SingleValue } from 'react-select';
import customStyles from '@/styles/inputStyle';
import AttachFile from '@/components/general-components/attach_file';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { motion } from 'framer-motion';
import SubmitPopUp from '@/components/submit';

type ProvideTransactionDetailsProps = {
  amountToPay: number;
};

const ProvideTransactionDetails: React.FC<ProvideTransactionDetailsProps> = ({
  amountToPay,
}) => {
  const [allBanks, setAllBanks] = useState<Option[]>([
    {
      label: '',
      value: '',
    },
  ]);

  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
    useState<boolean>(false);

  const [fileURL, setFileURL] = useState<string | null>(null); //get uploaded receipt

  const validationSchema = Yup.object({
    bankName: Yup.string().required('Bank Name is a required field'),
    accountNumber: Yup.number().required('Account Number is a required field'),
    accountName: Yup.string().required('Account Name is a required field'),
    transactionReference: Yup.string().required(
      'Transaction Reference is a required field'
    ),
  });
  const formik = useFormik({
    initialValues: {
      bankName: '',
      accountNumber: undefined,
      accountName: '',
      transactionReference: '',
    },
    validationSchema,
    onSubmit: async (values: TransactionDetailsProps) => {
      console.log(values);

      const payload = {
        ...values,
        imageReceipt: fileURL,
      };

      // try {
      //   const response = await axios.post(URLS.BASE + '/', payload);
      //   if (response.status === 200) {
      //     //do something
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
      console.log(payload);
      setIsSuccessfullySubmitted(true);
    },
  });

  useEffect(() => {
    const options = banks.map((bank) => ({
      value: bank.code,
      label: bank.name,
    }));
    if (options.length > 0) return setAllBanks(options);
  }, []);
  return (
    <Fragment>
      <aside className='w-full flex justify-center items-center py-[40px]'>
        <div className='lg:w-[1057px] w-full flex gap-[35px]'>
          {/**First div */}
          <div className='lg:w-[420px] h-full flex flex-col gap-[10px]'>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              exit={{ y: 20, opacity: 0 }}
              viewport={{ once: true }}
              className='w-full bg-white py-[22px] px-[28px] flex flex-col gap-[10px]'>
              {/**Make payment to */}
              <div className='flex flex-col'>
                <h3
                  className={`${archivo.className} text-lg font-bold text-black`}>
                  Make payment to
                </h3>
                <h2
                  className={`${archivo.className} text-3xl font-bold text-black`}>
                  N{Number(amountToPay).toLocaleString()}
                </h2>
              </div>
              {/**Account details */}
              <div className='flex flex-col gap-[7px]'>
                <h4
                  className={`${archivo.className} text-lg font-bold text-black`}>
                  Account details
                </h4>
                {/**Bank */}
                <p
                  className={`text-[#5A5D63] ${archivo.className} text-lg font-medium`}>
                  Bank{' '}
                  <span
                    className={`${archivo.className} text-lg font-medium text-black`}>
                    GTB
                  </span>
                </p>
                {/**Account number */}
                <p
                  className={`text-[#5A5D63] ${archivo.className} text-lg font-medium`}>
                  Account Number{' '}
                  <span
                    className={`${archivo.className} text-lg font-medium text-black`}>
                    0234567894
                  </span>
                </p>
                {/**Account Name */}
                <p
                  className={`text-[#5A5D63] ${archivo.className} text-lg font-medium`}>
                  Account Name{' '}
                  <span
                    className={`${archivo.className} text-lg font-medium text-black`}>
                    Khabi-Teq Reality
                  </span>
                </p>
              </div>
            </motion.div>
            {/**PS */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              exit={{ y: 20, opacity: 0 }}
              viewport={{ once: true }}
              className={`text-[#1976D2] font-medium text-lg`}>
              Note that this process is subject to Approval by khabiteq realty
            </motion.p>
          </div>
          {/**Second div - form section */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            exit={{ y: 20, opacity: 0 }}
            viewport={{ once: true }}
            onSubmit={formik.handleSubmit}
            className='lg:w-[602px] h-full flex flex-col gap-[20px]'>
            {/**Provide the Transaction Details */}
            <h2 className={`text-xl text-[#09391C] font-semibold`}>
              Provide Transaction Details
            </h2>
            <div className='w-full h-[181px] gap-x-[20px] gap-y-[10px] grid grid-cols-2'>
              {/**Select Bank */}
              <label
                htmlFor={'bankName'}
                className={`w-full flex flex-col gap-[4px]`}>
                <span
                  className={`text-base text-[#24272C] ${archivo.className} font-medium`}>
                  Enter Bank
                </span>
                <Select
                  styles={customStyles}
                  name='bankName'
                  options={allBanks}
                  id='bankName'
                  placeholder='Select Bank'
                  onBlur={formik.handleBlur}
                  onChange={(
                    event: SingleValue<{ value: string; label: string }>
                  ) => {
                    formik.setFieldValue('bankName', event?.label);
                  }}
                />
                {(formik.errors.bankName || formik.touched.bankName) && (
                  <span className={`${archivo.className} text-xs text-red-500`}>
                    {formik.errors.bankName}
                  </span>
                )}
              </label>

              {/**Enter Account Number */}
              <Input
                formikType={formik}
                id='accountNumber'
                type='number'
                name='accountNumber'
                placeholder='Enter Account Number'
                heading='Enter Account Number'
              />

              {/**Enter Account Name */}
              <Input
                formikType={formik}
                id='accountName'
                type='text'
                name='accountName'
                placeholder='Enter Account Name'
                heading='Enter Account Name'
              />

              {/**Insert Transaction Reference */}
              <Input
                formikType={formik}
                id='transactionReference'
                type='text'
                name='transactionReference'
                placeholder='Insert Transaction Reference'
                heading='Insert Transaction Reference'
              />
            </div>
            {/**Attach Receipt */}
            <div className='h-[58px] flex justify-between items-center'>
              {/* <h4 className={`text-base font-medium text-[#202430]`}>
              Upload your transaction receipt.
            </h4> */}
              <AttachFile
                heading='Upload your transaction receipt.'
                style={{
                  width: '283px',
                }}
                id='transaction_receipt'
                setFileUrl={setFileURL}
              />
            </div>
            {/**button to submit */}
            <button
              type='submit'
              className='h-[65px] w-full bg-[#8DDB90] text-base font-bold text-[#FAFAFA]'>
              Submit
            </button>
          </motion.form>
        </div>
        {isSuccessfullySubmitted && <SubmitPopUp />}
      </aside>
    </Fragment>
  );
};

interface TransactionDetailsProps {
  bankName: string;
  accountNumber: number | undefined;
  accountName: string;
  transactionReference: string;
}

type InputProps = {
  id: 'bankName' | 'accountNumber' | 'accountName' | 'transactionReference';
  placeholder?: string;
  type: 'number' | 'text';
  name: string;
  heading: string;
  // value?: string | number;
  // onChange?: (type: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  formikType: FormikProps<TransactionDetailsProps>;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  heading,
  type,
  placeholder,
  name,
  isDisabled,
  formikType,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={`w-full flex flex-col gap-[4px] ${className}`}>
      <span
        className={`text-base text-[#24272C] ${archivo.className} font-medium`}>
        {heading}
      </span>
      <input
        name={name}
        onChange={formikType.handleChange}
        id={id}
        type={type}
        onBlur={formikType.handleBlur}
        value={formikType.values[id]}
        disabled={isDisabled}
        placeholder={placeholder ?? 'This is a placeholder'}
        className={`px-[12px] h-[50px] bg-[#FFFFFF] border-[1px] border-[#E9EBEB] w-full text-base placeholder:text-[#A7A9AD] text-black ${archivo.className} rounded-[5px] outline-none`}
      />
      {(formikType.errors[id] || formikType.touched[id]) && (
        <span className={`${archivo.className} text-xs text-red-500`}>
          {formikType.errors[id]}
        </span>
      )}
    </label>
  );
};

export default ProvideTransactionDetails;
