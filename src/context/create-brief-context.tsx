/** @format */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type createBriefProps = {
  selectedState: Option | null;
  selectedLGA: Option | null;
  stateOptions: Option[];
  lgaOptions: Option[];
  fileUrl: { id: string; image: string }[];
  isSubmittedSuccessfully: boolean;
  propertyType: string;
  usageOptions: string[];
  price: string;
  landSize: string;
  documents: string[];
  noOfBedroom: number | undefined;
  additionalFeatures: string[] | undefined;
  selectedCity: string;
  areYouTheOwner: boolean;
  typeOfMeasurement: string;
};
interface CreateBriefContextProps {
  createBrief: createBriefProps;
  setCreateBrief: ({}: createBriefProps) => void;
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
   * Create Brief values
   */
  const [createBrief, setCreateBrief] = useState<createBriefProps>({
    selectedState: null,
    selectedLGA: null,
    stateOptions: [],
    lgaOptions: [],
    fileUrl: [],
    isSubmittedSuccessfully: false,
    propertyType: '',
    usageOptions: [],
    price: '',
    landSize: '',
    documents: [],
    noOfBedroom: undefined,
    additionalFeatures: [],
    // selectedState: string,
    selectedCity: '',
    areYouTheOwner: false,
    typeOfMeasurement: '',
  });

  return (
    <CreateBriefContext.Provider
      value={{
        createBrief,
        setCreateBrief,
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
