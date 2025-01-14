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
}
