/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataProps } from '@/types/agent_data_props';
import { FC, useEffect, useState } from 'react';
import DetailsToCheck from '@/components/detailsToCheck';
import { ShowTableProps } from '@/types/show_table';
import ShowTable from '@/components/showTable';
import Briefs from './mobileBrief';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { GET_REQUEST } from '@/utils/requests';
//import { useUserContext } from '@/context/user-context';
import Cookies from 'js-cookie';
import { BriefType } from '@/types';

interface TotalBriefProps extends ShowTableProps {
  detailsToCheck: DataProps;
}

type BriefDataProps = {
  docOnProperty: { _id: string; isProvided: boolean; docName: string }[];
  pictures: any[];
  propertyType: string;
  price: number;
  location: { state: string; localGovernment: string; area: string };
  propertyFeatures: { additionalFeatures: string[]; noOfBedrooms: number };
  createdAt: string;
};

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
  const [briefsData, setBriefsData] = useState<any[]>([]);
  /**
   * date: string;
  propertyType: string;
  location: string;
  propertyPrice: string | number;
  document?: string;
  amountSold?: string | number;
   */

  useEffect(() => {
    const getTotalBriefs = async () => {
      setIsLoading(true);
      try {
        const response = await GET_REQUEST(
          URLS.BASE + '/agent/properties',
          Cookies.get('token')
        );
        const data = response.data;
        console.log(data);

        const combinedProperties = [
          ...(data?.sellProperties || []),
          ...(data?.rentProperties || []),
        ].map(
          ({
            docOnProperty,
            pictures,
            propertyType,
            price,
            location,
            propertyFeatures,
            createdAt,
          }: BriefDataProps) => ({
            date: createdAt,
            propertyType,
            actualLocation: location,
            propertyPrice: price,
            docOnProperty,
            amountSold: price,
            pictures,
            propertyFeatures,
          })
        );

        setBriefsData(combinedProperties);
      } catch (error) {
        console.log(error);
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
              data={briefsData}
            />
          </div>
          {/**Mobile View */}
          <div className='w-full'>
            <Briefs
              setDetailsToCheck={setDetailsToCheck}
              setShowFullDetails={setShowFullDetails}
              header={heading}
              briefData={briefsData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Brief;
