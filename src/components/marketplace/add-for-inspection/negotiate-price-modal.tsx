/** @format */

'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { archivo } from '@/styles/font';
import Input from '@/components/general-components/Input';

type NegotiationModalProps = {
  id: string | null;
  isOpened: boolean;
  askingPrice: number | string | undefined;
  yourPrice: number | string | undefined;
};

const NegiotiatePrice = ({
  selectedCard,
  allNegotiation,
  setAllNegotiation,
  setSelectedCard,
  getID,
}: {
  getID: string | null;
  selectedCard: NegotiationModalProps;
  setSelectedCard: (type: NegotiationModalProps) => void;
  allNegotiation: NegotiationModalProps[];
  setAllNegotiation: (type: NegotiationModalProps[]) => void;
}): React.JSX.Element => {
  const handleSubmit = () => {
    //to avoid duplicates

    //check if ID is not null
    if (getID === null) return;

    const findSelectedCard = allNegotiation.find((item) => item.id === getID);
    //if it doesn't exist
    if (!findSelectedCard) {
      //save formal values and add new one
      return setAllNegotiation([...allNegotiation, selectedCard]);
    }

    //if the card exists, modify
    findSelectedCard.yourPrice = selectedCard.yourPrice;

    //close the modal
    setSelectedCard({
      ...selectedCard,
      isOpened: false,
    });
  };

  useEffect(() => {
    const findSelectedCard = allNegotiation.find((item) => item.id === getID);

    if (!findSelectedCard) return;

    //console.log(findSelectedCard);
    setSelectedCard({
      ...selectedCard,
      yourPrice: findSelectedCard.yourPrice,
    });
  }, []);
  return (
    <div className='w-full h-full border-black border-[1px] fixed top-0 left-0 transition-all duration-500 flex items-center justify-center bg-[#000000]/[30%]'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className='lg:w-[615px] w-full h-[637px] flex flex-col gap-[26px]'>
        <div className='flex items-center justify-end'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            type='button'
            className='w-[51px] h-[51px] rounded-full bg-white flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              onClick={() =>
                setSelectedCard({
                  ...selectedCard,
                  isOpened: false,
                })
              }
              className='w-[24px] h-[24px]'
              color='#181336'
            />
          </motion.button>
        </div>
        <form
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
          }}
          className='w-full rounded-[4px] bg-[#FFFFFF] shadow-md py-[40px] px-[80px]'>
          <div className='w-full h-[400px] flex flex-col gap-[20px]'>
            <div className='flex flex-col gap-[4px]'>
              <h2
                className={`${archivo.className} font-bold text-2xl text-black text-center`}>
                Negotiate price with the seller
              </h2>
              <p
                className={`${archivo.className} text-[#515B6F] text-lg text-center`}>
                You&apos;re welcome to negotiate the price directly with the
                seller even before arranging an inspection. Please enter your
                proposed offer below
              </p>
            </div>
            {/**Asking Price */}
            <Input
              label='Asking Price'
              name='asking_price'
              type='text'
              isDisabled
              value={Number(selectedCard.askingPrice).toLocaleString()}
              onChange={() => {
                setSelectedCard({
                  ...selectedCard,
                });
              }}
            />
            {/**Enter your price */}
            <Input
              label='Enter your price'
              name='enter_your_price'
              type='number'
              placeholder='Enter amount'
              value={selectedCard.yourPrice}
              onChange={(event) => {
                const value =
                  'value' in event.target ? event.target.value : '';
                setSelectedCard({
                  ...selectedCard,
                  yourPrice: value,
                });
              }}
            />
            {/** Submit and Cancel buttons */}
            <div className='w-full flex gap-[15px]'>
              <button
                onClick={handleSubmit}
                className={`h-[57px] bg-[#8DDB90] w-[260px] text-lg text-[#FFFFFF] font-bold ${archivo.className}`}
                type='submit'>
                Submit
              </button>
              <button
                className={`h-[57px] bg-white border-[1px] border-[#5A5D63] w-[260px] text-lg text-[#5A5D63] font-bold ${archivo.className}`}
                type='button'>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NegiotiatePrice;
