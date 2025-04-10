/** @format */

'use client';
import { BriefType, GlobalContextTypes } from '@/types';
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
    submitPreference: false,
  });
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  // const [selectedNav, setSelectedNav] = useState<string>('Create Brief'); //Agent Navigation
  const [selectedNav, setSelectedNav] = useState<string>('Overview'); //Agent Navigation

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
  const [imageData, setImageData] = useState<StaticImport[] | string[]>([]);

  //Submitted successfully context logic.
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] =
    useState<boolean>(false);

  //Buy page - property referenece
  const [propertyReference, setPropertyReference] = useState({});

  /**Selected Briefs for Buy Page - property reference */
  const [propertyRefSelectedBriefs, setPropertyRefSelectedBriefs] = useState<
    BriefType[]
  >([]);

  //all card data
  const [cardData, setCardData] = useState<[]>([]);

  //selecting cards for inspection
  const [selectedBriefs, setSelectedBriefs] = useState<Set<BriefType>>(
    new Set()
  );

  const addBrief = (brief: BriefType) => {
    setSelectedBriefs((prev) => new Set([...prev, brief])); // Ensure immutability
  };

  const removeBrief = (brief: BriefType) => {
    setSelectedBriefs((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(brief);
      return updatedSet;
    });
  };

  const clearBriefs = () => {
    setSelectedBriefs(new Set());
  };

  /**
   * Agent Brief Settings
   */
  const [settings, setSettings] = useState({
    selectedNav: 'Change Password',
    isUpgradeButtonClicked: false,
    upgradeStatus: {
      isYetToUpgrade: true,
      isAwatingUpgrade: false,
      isUpgraded: false,
    },
    onUpgradeData: {
      companyName: '',
      regNo: 0,
      image: [''],
    },
  });

  /**
   * Dashboard
   */
  const [dashboard, setDashboard] = useState({
    approveBriefsTable: {
      isApproveClicked: false,
      isRejectClicked: false,
      isDeleteClicked: false,
    },
  });

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
        cardData,
        setCardData,
        selectedBriefs,
        addBrief,
        clearBriefs,
        removeBrief,
        propertyRefSelectedBriefs,
        setPropertyRefSelectedBriefs,
        settings,
        setSettings,
        dashboard,
        setDashboard,
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
