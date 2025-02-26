/** @format */
'use client';
import { GlobalContextTypes } from '@/types';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { createContext, useContext, useState } from 'react';

interface Option {
  value: string;
  label: string;
}
const PageContext = createContext<GlobalContextTypes | undefined>(undefined);

export const PageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isContactUsClicked, setIsContactUsClicked] = useState<boolean>(false);
  const [rentPage, setRentPage] = useState({
    isSubmitForInspectionClicked: false,
  });
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const [selectedNav, setSelectedNav] = useState<string>('Create Brief'); //Agent Navigation

  /**Property Details */
  const [propertyDetails, setPropertyDetails] = useState<{
    propertyType: string;
    usageOptions: string[];
    price: string | number;
    documents: string[];
    noOfBedroom: string;
    additionalFeatures: string;
    selectedState: Option | null;
    selectedCity: Option | null;
  }>({
    propertyType: '',
    usageOptions: [],
    price: '',
    documents: [],
    noOfBedroom: '',
    additionalFeatures: '',
    selectedCity: null,
    selectedState: null,
  });

  /**
   * View image
   */
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [imageData, setImageData] = useState<StaticImport[]>([]);

  //Submitted successfully context logic.
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] =
    useState<boolean>(false);

  //Buy page - property referenece
  const [propertyReference, setPropertyReference] = useState({});

  return (
    <PageContext.Provider
      value={{
        isContactUsClicked,
        setIsContactUsClicked,
        rentPage,
        setRentPage,
        selectedNav,
        setSelectedNav,
        isModalOpened,
        setIsModalOpened,
        viewImage,
        setViewImage,
        imageData,
        setImageData,
        isSubmittedSuccessfully,
        setIsSubmittedSuccessfully,
        propertyDetails,
        setPropertyDetails,
        propertyReference,
        setPropertyReference,
      }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('');
  }
  return context;
};
