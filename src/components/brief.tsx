/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { DataProps } from '@/types/agent_data_props';
import { FC } from 'react';
import DetailsToCheck from '@/components/detailsToCheck';
import { ShowTableProps } from '@/types/show_table';
import ShowTable from '@/components/showTable';
import Briefs from './mobileBrief';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { GET_REQUEST } from '@/utils/requests';
//import { useUserContext } from '@/context/user-context';
//import Cookies from 'js-cookie';
// import { BriefType } from '@/types';
// import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

interface TotalBriefProps extends ShowTableProps {
  detailsToCheck: DataProps;
  isLoading?: boolean;
}

const Brief: FC<TotalBriefProps> = ({
  data,
  heading,
  setShowFullDetails,
  setDetailsToCheck,
  showFullDetails,
  detailsToCheck,
  headerData,
  isLoading,
}) => {
  return (
    <div className=' w-full mt-[60px] flex items-center justify-center px-[20px]'>
      {showFullDetails ? (
        <div>
          <DetailsToCheck
            heading={heading}
            setIsFullDetailsClicked={setShowFullDetails}
            detailsToCheck={detailsToCheck}
          />
          <div className='flex flex-col gap-[10px] bg-[#FFFFFF] '>
            <button
              type='button'
              className='w-[90%] ml-[5%] min-h-[50px] flex justify-center items-center border-[1px] border-blue-500 text-blue-500 rounded-[8px] font-ubuntu'>
              Edit
            </button>
            <button
              type='button'
              className='w-[90%] ml-[5%] min-h-[50px] flex justify-center items-center border-[1px] border-red-500 text-red-500 rounded-[8px] font-ubuntu'>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className='container'>
          {isLoading ? (
            <div className='w-full h-full flex justify-center items-center'>
              <div className='flex items-center gap-1'>
                <span className='text-base'>Loading</span>
                <FontAwesomeIcon
                  icon={faRefresh}
                  spin
                  width={25}
                  height={25}
                  className='w-[20px] h-[20px]'
                />
              </div>
            </div>
          ) : (
            <>
              <div className='hidden md:flex'>
                <ShowTable
                  headerData={headerData}
                  setDetailsToCheck={setDetailsToCheck}
                  setShowFullDetails={setShowFullDetails}
                  heading={heading}
                  data={data}
                />
              </div>
              {/**Mobile View */}
              <div className='w-full'>
                <Briefs
                  setDetailsToCheck={setDetailsToCheck}
                  setShowFullDetails={setShowFullDetails}
                  header={heading}
                  briefData={data}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Brief;
