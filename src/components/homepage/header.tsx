/** @format */

'use client';
import React, {
  Fragment,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import khabiteqIcon from '@/svgs/khabi-teq.svg';
import Button from '@/components/general-components/button';
import Image from 'next/image';
import { navData } from '@/data';
import Link from 'next/link';
import barIcon from '@/svgs/bars.svg';
import { usePageContext } from '@/context/page-context';
import { reducer } from '@/hooks/reducer';
// import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import SideBar from '../general-components/sideBar';
import { FaCaretDown } from 'react-icons/fa';
import useClickOutside from '@/hooks/clickOutside';

const Header = () => {
  const {
    isContactUsClicked,
    rentPage,
    isModalOpened,
    setIsModalOpened,
    viewImage,
    isSubmittedSuccessfully,
    setIsContactUsClicked,
  } = usePageContext();
  const [state, dispatch] = useReducer(reducer, navData);
  const pathName = usePathname();
  const [isMarketplaceModalOpened, setIsMarketplaceModalOpened] =
    useState<boolean>(false);

  useEffect(() => {
    console.log(isModalOpened);
  }, [isModalOpened]);
  return (
    <Fragment>
      <header
        className={`w-full flex justify-center items-center py-[20px] pl-[10px] bg-[#EEF1F1] pr-[20px] ${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened ||
            viewImage ||
            isSubmittedSuccessfully ||
            rentPage.submitPreference) &&
          'filter brightness-[30%] transition-all duration-500 overflow-hidden'
        } ${'slide-from-top'}`}>
        <nav className={`h-[50px] container flex justify-between items-center`}>
          <Image
            src={khabiteqIcon}
            width={1000}
            height={1000}
            className='md:w-[169px] md:h-[25px] w-[144px] h-[30px]'
            alt=''
          />
          <div className='lg:flex gap-[20px] hidden'>
            {state.map(
              (
                item: { name: string; url: string; isClicked: boolean },
                idx: number
              ) => {
                if (item.name === 'Marketplace') {
                  return (
                    <div
                      key={idx}
                      className='flex flex-col'
                      onMouseEnter={() =>
                        setIsMarketplaceModalOpened(true)
                      }
                      // onMouseLeave={() =>
                      //   setIsMarketplaceModalOpened(false)
                      // }
                      >
                      <div className='flex items-center gap-1 cursor-pointer'>
                        <span
                          className={` transition-all duration-500 font-medium text-[18px] leading-[21px] hover:text-[#8DDB90] ${
                            item.url === pathName
                              ? 'text-[#8DDB90]'
                              : 'text-[#000000]'
                          }`}>
                          {item.name}
                        </span>
                        {/* <FaCaretDown
                          size={'sm'}
                          width={16}
                          height={16}
                          className='w-[16px] h-[16px]'
                        /> */}
                      </div>
                      {isMarketplaceModalOpened && (
                        <MarketplaceOptions
                          setModal={setIsMarketplaceModalOpened}
                        />
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={idx}
                    href={item.url}
                    onClick={() => {
                      // e.preventDefault();
                      dispatch({
                        type: item.name,
                        name: item.name,
                      });
                    }}
                    className={` transition-all duration-500 font-medium text-[18px] leading-[21px] hover:text-[#8DDB90] ${
                      item.url === pathName
                        ? 'text-[#8DDB90]'
                        : 'text-[#000000]'
                    }`}>
                    {item.name}
                  </Link>
                );
              }
            )}
          </div>
          {/**Buttons */}
          <div className='hidden lg:flex lg:w-[226px]'>
            <Button
              value='Sign up'
              green={true}
              onClick={() => {
                //setIsContactUsClicked(true);
              }}
              className='text-base text-[#FFFFFF] leading-[25px] font-bold w-[155px] h-[50px]'
            />
            <Button
              value='Login'
              onClick={() => {
                //setIsContactUsClicked(true);
              }}
              className='text-base bg-transparent leading-[25px] font-bold w-[71px] h-[50px] text-black'
            />
          </div>

          <Image
            src={barIcon}
            onClick={() => {
              setIsModalOpened(!isModalOpened);
            }}
            width={35}
            height={22}
            alt=''
            className='w-[35px] h-[22px] lg:hidden'
          />
        </nav>
      </header>
      <SideBar
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
      />
    </Fragment>
  );
};

const marketPlaceData: { name: string; url: string; isClicked: boolean }[] = [
  {
    name: 'Buy a Property',
    url: '/buy_page',
    isClicked: false,
  },

  {
    name: 'Sell a Property',
    url: '/sell_page',
    isClicked: false,
  },
  {
    name: 'Rent a Property',
    url: '/rent_page',
    isClicked: false,
  },
  {
    name: 'Property Joint Venture',
    url: '/joint_ventures',
    isClicked: false,
  },
];

const MarketplaceOptions = ({
  setModal,
}: {
  setModal: (type: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useClickOutside(ref, () => setModal(false));
  return (
    <div
      ref={ref}
      className='w-[231px] mt-[30px] p-[19px] flex flex-col gap-[25px] bg-[#FFFFFF] shadow-lg absolute'>
      {marketPlaceData.map(
        (
          item: { name: string; url: string; isClicked: boolean },
          idx: number
        ) => (
          <Link
            onClick={() => setModal(false)}
            className='text-base font-medium text-[#000000] hover:text-[#8DDB90]'
            href={item.url}
            key={idx}>
            {item.name}
          </Link>
        )
      )}
    </div>
  );
};

export default Header;
