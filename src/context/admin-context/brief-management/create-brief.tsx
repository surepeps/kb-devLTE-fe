/** @format */

'use client';

import { createContext, useContext, useState } from 'react';

export type createBriefProps = {
  selectedState: Option | null;
  selectedLGA: Option | null;
  stateOptions: Option[];
  lgaOptions: Option[];
  fileUrl: { id: string; image: string }[];
  isSubmittedSuccessfully: boolean;
  agentType: string;
  usageOptions: string[];
  price: string | number;
  amount: string;
  landSize: string;
  documents: string[];
  noOfBedroom: number | undefined;
  features: string[];
  selectedCity: string;
  areYouTheOwner: boolean;
  typeOfMeasurement: string;
  createdAt?: string;
  email?: string;
  id?: string;
  isApproved?: boolean;
  isRejected?: boolean;
  legalName?: string;
  location?: string;
  phoneNumber?: string;
  pictures?: string[];
  propertyCondition?: string;
  propertyType?: string;
  propertyId?: string;
  tenantCriteria?: string;
};
interface CreateBriefContextProps {
  editBrief: createBriefProps;
  setEditBrief: ({}: createBriefProps) => void;
}
interface Option {
  value: string;
  label: string;
}

const CreateBriefContext = createContext<CreateBriefContextProps | undefined>(
  undefined
);

export const CreateBriefProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /**
   * Edit Brief values
   */
  const [createBrief, setCreateBrief] = useState<createBriefProps>({
    selectedState: null,
    selectedLGA: null,
    stateOptions: [],
    lgaOptions: [],
    fileUrl: [],
    isSubmittedSuccessfully: false,
    agentType: '',
    usageOptions: [],
    price: '',
    landSize: '',
    documents: [],
    noOfBedroom: undefined,
    features: [],
    // selectedState: string,
    selectedCity: '',
    areYouTheOwner: false,
    typeOfMeasurement: '',
    amount: '',
    createdAt: '',
    email: '',
    id: '',
    isApproved: false,
    isRejected: false,
    legalName: '',
    location: '',
    phoneNumber: '',
    pictures: [],
    propertyCondition: '',
    propertyType: '',
    propertyId: '',
    tenantCriteria: '',
  });

  return (
    <CreateBriefContext.Provider
      value={{
        editBrief: createBrief,
        setEditBrief: setCreateBrief,
      }}>
      {children}
    </CreateBriefContext.Provider>
  );
};

export const useCreateBriefContext = () => {
  const context = useContext(CreateBriefContext);
  if (context === undefined) {
    throw new Error('');
  }
  return context;
};
