export type PropertyProps = {
  propertyId: string;
  price: number;
  propertyType: string;
  bedRoom: number;
  propertyStatus: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  landSize: {
    measurementType: string;
    size: number | null;
  };
  additionalFeatures: {
    additionalFeatures: string[];
  };
  features: string[];
  tenantCriteria: { _id: string; criteria: string }[];
  areYouTheOwner: boolean;
  isAvailable: boolean | string;
  isApproved?: boolean;
  isRejected?: boolean;
  isPreference?: boolean;
  isPremium?: boolean;
  pictures: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  docOnProperty: { isProvided: boolean; _id: string; docName: string }[];
  briefType?: string;
  propertyCondition?: string;
  _id?: string;
  __v?: number;
};