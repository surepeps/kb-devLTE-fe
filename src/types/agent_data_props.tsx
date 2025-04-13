/** @format */

export interface DataProps {
  id?: string;
  date: string;
  propertyType: string;
  location: string;
  propertyPrice: string | number;
  document?: string;
  amountSold?: string | number;
  propertyFeatures?: {
    additionalFeatures: string[];
    noOfBedrooms: number;
  };
  docOnProperty?: { _id: string; isProvided: boolean; docName: string }[];
  actualLocation?: {
    state: string;
    localGovernment: string;
    area: string;
  };
  pictures?: string[];
}

export type DataPropsArray = DataProps[];
