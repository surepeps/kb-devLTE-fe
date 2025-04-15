/** @format */

import { StaticImageData } from 'next/image';

export interface DataProps {
  areYouTheOwner?: boolean;
  createdAt?: string;
  docOnProperty: { docName: string; isProvided: boolean; _id: string }[];
  isApproved?: boolean;
  isAvailable?: boolean;
  isRejected?: boolean;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  owner?: string;
  ownerModel?: string;
  pictures?: string[];
  price: number | string;
  propertyFeatures?: {
    additionalFeatures: string[];
    noOfBedrooms: number;
  };
  propertyType: string;
  updatedAt?: string;
  propertyPrice: string | number;
  usageOptions?: string[];
  __v?: number;
  _id?: string;
}

export type DataPropsArray = DataProps[];
