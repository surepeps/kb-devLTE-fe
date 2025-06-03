/** @format */

'use client';
import React, {
  Fragment,
  useReducer,
  useState,
  useEffect,
  useRef,
} from 'react';
import khabiteqIcon from '@/svgs/khabi-teq.svg';
// import Button from '@/components/button';
import Image from 'next/image';
import { agentnavData, navData } from '@/data';
import Link from 'next/link';
import barIcon from '@/svgs/bars.svg';
import { usePageContext } from '@/context/page-context';
import { reducer } from '@/hooks/reducer';
import SideBar from '../general-components/sideBar';
import { useRouter, usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
import { useUserContext } from '@/context/user-context';
import userIcon from '@/svgs/user.svg';
import UserProfile from '../homepage/my-profile';

const AgentHeader = () => {
  const {
    isContactUsClicked,
    rentPage,
    isModalOpened,
    setIsModalOpened,
    viewImage,
    settings,
  } = usePageContext();
  const { logout, user } = useUserContext();
  const [state, dispatch] = useReducer(reducer, agentnavData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserProfileModalOpened, setIsUserProfileModal] =
    useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  const pathName = usePathname();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <Fragment>
      <header
        className={`w-full flex justify-center items-center py-[20px] pl-[10px] border-b-[1px] border-[#C7CAD0] bg-[#EEF1F1] pr-[20px] ${
          (isContactUsClicked ||
            rentPage.isSubmitForInspectionClicked ||
            isModalOpened ||
            viewImage ||
            settings.isUpgradeButtonClicked) &&
          'filter brightness-[30%] transition-all duration-500 overflow-hidden'
        } ${'slide-from-top'}`}>
        <nav className='h-[50px] container flex justify-between items-center'>
          <Image
            src={khabiteqIcon}
            width={1000}
            height={1000}
            className='md:w-[169px] md:h-[25px] w-[144px] h-[30px]'
            alt=''
          />
          <div className='lg:flex gap-[27px] hidden'>
            {state.map(
              (
                item: { name: string; url: string; isClicked: boolean },
                idx: number
              ) => {
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
                      item.url === pathname
                        ? 'text-[#8DDB90]'
                        : 'text-[#000000]'
                    }`}>
                    {item.name}
                  </Link>
                );
              }
            )}
          </div>
          <div className='relative' ref={dropdownRef}>
            <button
              type='button'
              className='w-[61px] h-[61px] hidden lg:flex rounded-full bg-[#FAFAFA] justify-center items-center'
              onClick={handleDropdownClick}>
              {''}
              <svg
                width='25'
                height='25'
                viewBox='0 0 25 25'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M16.5 7.5C16.5 8.56087 16.0786 9.57828 15.3284 10.3284C14.5783 11.0786 13.5609 11.5 12.5 11.5C11.4391 11.5 10.4217 11.0786 9.67157 10.3284C8.92143 9.57828 8.5 8.56087 8.5 7.5C8.5 6.43913 8.92143 5.42172 9.67157 4.67157C10.4217 3.92143 11.4391 3.5 12.5 3.5C13.5609 3.5 14.5783 3.92143 15.3284 4.67157C16.0786 5.42172 16.5 6.43913 16.5 7.5V7.5ZM12.5 14.5C10.6435 14.5 8.86301 15.2375 7.55025 16.5503C6.2375 17.863 5.5 19.6435 5.5 21.5H19.5C19.5 19.6435 18.7625 17.863 17.4497 16.5503C16.137 15.2375 14.3565 14.5 12.5 14.5V14.5Z'
                  stroke='#8DDB90'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className='absolute left-6 transform -translate-x-1/2 mt-2 w-40 max-w-xs bg-white border border-gray-200 rounded-md shadow-lg md:-ml-[40px]'>
                <ul>
                  {pathname !== '/agent/under-review' && (
                    <>
                      <li
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                        onClick={() => handleItemClick('/agent/briefs')}>
                        Create Brief
                      </li>
                      <li
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                        onClick={() => handleItemClick('/agent/briefs')}>
                        Dashboard
                      </li>
                    </>
                  )}
                  <li
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#FF3D00]'
                    onClick={() => logout()}>
                    Log out
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className='flex items-center gap-[20px] lg:hidden'>
            {user?._id ? (
              <div className='flex flex-col gap-[10px]'>
                <button
                  type='button'
                  title='User'
                  onClick={() => setIsUserProfileModal(true)}
                  className='w-[45px] h-[45px] border-[1px] border-[#A8ADB7] cursor-pointer rounded-full flex items-center justify-center bg-[#FAFAFA]'>
                  <Image
                    src={userIcon}
                    width={1000}
                    height={1000}
                    alt=''
                    className='w-[20px] h-[20px]'
                  />
                </button>
                {/**User Profile Modal */}
                {isUserProfileModalOpened && (
                  <UserProfile
                    userDetails={user}
                    closeUserProfileModal={setIsUserProfileModal}
                  />
                )}
              </div>
            ) : null}
            <Image
              src={barIcon}
              width={35}
              height={22}
              alt=''
              className='w-[35px] h-[22px] lg:hidden'
              onClick={() => {
                setIsModalOpened(true);
              }}
            />
          </div>
        </nav>
      </header>
      <SideBar
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
      />
    </Fragment>
  );
};

export default AgentHeader;
