/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { DataProps } from '@/types/agent_data_props';
import { FC, useEffect, useState } from 'react';
import DetailsToCheck from '@/components/detailsToCheck';
import { ShowTableProps } from '@/types/show_table';
import ShowTable from '@/components/showTable';
import Briefs from './mobileBrief';
import axios from 'axios';
import { URLS } from '@/utils/URLS';

interface TotalBriefProps extends ShowTableProps {
  detailsToCheck: DataProps;
}

const Brief: FC<TotalBriefProps> = ({
  data,
  heading,
  setShowFullDetails,
  setDetailsToCheck,
  showFullDetails,
  detailsToCheck,
  headerData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [briefsData, setBriefsData] = useState([]);

  useEffect(() => {
    const getTotalBriefs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(URLS.BASE + '/agent/properties');
        const data = response.data;
        console.log(data);
        setIsLoading(false);
        setBriefsData(data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getTotalBriefs();
  }, []);
  return (
    <div className='lg:w-[863px] w-full mt-[60px] flex items-center justify-center'>
      {showFullDetails ? (
        <DetailsToCheck
          heading={heading}
          setIsFullDetailsClicked={setShowFullDetails}
          detailsToCheck={detailsToCheck}
        />
      ) : (
        <div className='container'>
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
        </div>
      )}
    </div>
  );
};

export default Brief;
