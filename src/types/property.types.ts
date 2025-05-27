/** @format */

export type PropertyProps = {
  propertyId: string;
  _id?: string;
  id?: string;
  price: number;
  propertyType: string;
  bedRoom: number;
  noOfBedrooms?: number;
  propertyStatus: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  tenantCriteria: { _id: string; criteria: string }[];
  docOnProperty: string[];
  pictures: string[];
  createdAt: string;
  owner: string;
  updatedAt: string;
  isAvailable: boolean;
};
