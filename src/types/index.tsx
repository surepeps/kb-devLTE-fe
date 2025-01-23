/** @format */
//import { useRouter } from 'next/router';

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
}
