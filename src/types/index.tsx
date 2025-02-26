/** @format */
//import { useRouter } from 'next/router';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface Option {
  value: string;
  label: string;
}
export interface GlobalContextTypes {
  isContactUsClicked: boolean;
  setIsContactUsClicked: (type: boolean) => void;
  rentPage: {
    isSubmitForInspectionClicked: boolean;
  };
  setRentPage: ({
    isSubmitForInspectionClicked,
  }: {
    isSubmitForInspectionClicked: boolean;
  }) => void;
  //router: ReturnType<typeof useRouter> | null;
  selectedNav: string;
  setSelectedNav: (type: string) => void;
  //modal bar
  isModalOpened: boolean;
  setIsModalOpened: (type: boolean) => void;
  //view Image
  viewImage: boolean;
  setViewImage: (type: boolean) => void;
  //image data
  imageData: StaticImport[];
  setImageData: ([]: StaticImport[]) => void;
  //submitted successfully type
  isSubmittedSuccessfully: boolean;
  setIsSubmittedSuccessfully: (type: boolean) => void;
  //propertyDetailsProps
  propertyDetails: {
    propertyType: string;
    usageOptions: string[];
    price: string | number;
    documents: string[];
    noOfBedroom: string;
    additionalFeatures: string;
    selectedState: Option | null;
    selectedCity: Option | null;
  };
  setPropertyDetails: ({}: {
    propertyType: string;
    usageOptions: string[];
    price: string | number;
    documents: string[];
    noOfBedroom: string;
    additionalFeatures: string;
    selectedState: Option | null;
    selectedCity: Option | null;
  }) => void;
  propertyReference: object;
  setPropertyReference: ({}: object) => void;
}
