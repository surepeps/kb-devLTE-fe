/** @format */

export interface DataProps {
  date: string;
  propertyType: string;
  location: string;
  propertyPrice: string | number;
  document?: string;
  amountSold?: string | number;
}

export type DataPropsArray = DataProps[];
