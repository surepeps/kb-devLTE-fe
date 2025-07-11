/** @format */

"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import SelectStateLGA from "./select-state-lga";
import Input from "../general-components/Input";
import PriceRange from "./price-range";
import BedroomComponent from "./bedroom";
import MoreFilter from "./more-filter";
import DocumentTypeComponent from "./document-type";
import React from "react";
import RadioCheck from "../general-components/radioCheck";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/context/marketplace-context";

type PayloadProps = {
  twoDifferentInspectionAreas: boolean;
  initialAmount: number;
  toBeIncreaseBy: number;
};
 
const JointVentureModal = ({
  addForInspectionPayload,
  setAddInspectionModal,
  setSelectedBriefs,
  inspectionType,
  setInspectionType,
  onSearch,
}: {
  addForInspectionPayload: PayloadProps;
  setAddInspectionModal?: (type: boolean) => void;
  setSelectedBriefs: React.Dispatch<React.SetStateAction<Set<any>>>;
  inspectionType: "Buy" | "JV" | "Rent/Lease";
  setInspectionType: (type: "Buy" | "JV" | "Rent/Lease") => void;
  onSearch: (payload: any) => void;
}) => {
  // Use marketplace context
  const {
    jvFilterBy: usageOptions,
    setJvFilterBy: setUsageOptions,
    selectedForInspection,
    clearInspectionSelection,
  } = useMarketplace();

  const selectedBriefs = selectedForInspection.length;
  // const [usageOptions, setUsageOptions] = useState<string[]>([]);
  const formik = useFormik({
    initialValues: {
      selectedLGA: "",
      selectedState: "",
    },
    onSubmit: (values) => {
      // console.log(values);
    },
  });

  const priceFormik = useFormik({
    initialValues: {
      minPrice: 0,
      maxPrice: 0,
    },
    onSubmit: (values) => {
      // console.log(values);
    },
  });

  const router = useRouter();
  const [isPriceRangeModalOpened, setIsPriceRangeModalOpened] =
    useState<boolean>(false);
  const [priceRadioValue, setPriceRadioValue] = useState<string>("");
  const [isDocumentModalOpened, setIsDocumentModalOpened] =
    useState<boolean>(false);
  const [documentsSelected, setDocumentsSelected] = useState<string[]>([]);
  const [isBedroomModalOpened, setIsBedroomModalOpened] =
    useState<boolean>(false);
  const [noOfBedrooms, setNoOfBedrooms] = useState<number | undefined>(
    undefined,
  ); 
  const [isMoreFilterModalOpened, setIsMoreFilterModalOpened] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<{
    bathroom: number | undefined | string;
    landSize: {
      type: string;
      size: undefined | number;
    };
    desirer_features: string[];
  }>({
    bathroom: undefined,
    landSize: {
      type: "plot",
      size: undefined,
    },
    desirer_features: [],
  });

  // Removed duplicate priceFormik declaration

  // const handleSubmit = () => {
  const payload = {
    usageOptions,
    location: {
      state: formik.values.selectedState,
      lga: formik.values.selectedLGA,
    },
    price:
      priceFormik.values.maxPrice > 0
        ? { $lte: priceFormik.values.maxPrice }
        : undefined,
    docsOnProperty: documentsSelected,
    bedroom: noOfBedrooms,
    bathroom: filters.bathroom,
    landSize: filters.landSize,
    desirerFeatures: filters.desirer_features,
    briefType: "Joint Venture",
  };
  // console.log(payload);
  // };

  const handleUsageOptionChange = (item: string) => {
    if (item === "All") {
      setUsageOptions(["All"]);
    } else {
      const newOptions = usageOptions.includes(item)
        ? usageOptions.filter((opt) => opt !== item)
        : [...usageOptions.filter((opt) => opt !== "All"), item];
      setUsageOptions(newOptions.length === 0 ? ["All"] : newOptions);
    }
  };

  // useEffect(
  //   () => handleSubmit(),
  //   [priceRadioValue, formik.values, priceFormik.values, documentsSelected]
  // );

  const docsValues = documentsSelected.map((item: string) => item);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="container min-h-[181px] hidden md:flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF] sticky top-0 z-20"
    >
      <div className="w-full pb-[10px] flex  flex-wrap justify-between items-center gap-[20px] border-b-[1px] border-[#C7CAD0]">
        <div className="flex flex-wrap gap-[15px]">
          <h3 className="font-semibold text-[#1E1E1E]">Usage Options</h3>
          {["All", "Land", "Residential", "Commercial"].map(
            (item: string, idx: number) => (
              <RadioCheck
                key={idx}
                type="checkbox"
                name="usageOptions"
                value={item}
                handleChange={() => handleUsageOptionChange(item)}
              />
            ),
          )}
        </div>
        <div className="flex gap-[30px]">
          <button
            className="h-[34px] w-[133px] bg-[#8DDB90] text-white shadow-md font-medium text-sm"
            type="button"
            onClick={() => {
              router.push("/post_property");
            }}
          >
            List property
          </button>
          <button
            className="h-[34px] w-[133px] bg-transparent text-[#FF3D00] border-[1px] border-[#FF3D00] font-medium text-sm"
            type="button"
            onClick={() => {
              setInspectionType("JV");
              if (addForInspectionPayload.initialAmount === 0) {
                setAddInspectionModal?.(false);
                return toast.error("All states can not be different");
              }
              if (selectedBriefs === 0) {
                return toast.error(
                  "Please, Select at least one for inspection before listing",
                );
              }
              setAddInspectionModal?.(true);
            }}
          >
            {selectedBriefs} selected briefs
          </button>
          {selectedBriefs > 0 && (
            <button
              onClick={() => {
                clearInspectionSelection();
                setSelectedBriefs(new Set([]));
              }}
              className="h-[34px] w-[133px] bg-transparent text-black border-[1px] border-zinc-800 font-medium text-sm"
              type="button"
            >
              reset
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-[20px] items-end">
        {/**Preferred Location */}
        <SelectStateLGA
          placeholder="Enter state, lga, city...."
          formik={formik}
          heading="Location"
        />
        {/**Price Range */}
        <div className="flex flex-col gap-[10px] z-50">
          <Input
            className="w-[189px]"
            placeholder="Price Range"
            type="text"
            label=""
            showDropdownIcon={true}
            readOnly
            value={
              priceRadioValue !== ""
                ? priceRadioValue
                : priceFormik.values.minPrice === 0 &&
                    priceFormik.values.maxPrice === 0
                  ? undefined // Allow placeholder to show
                  : `${Number(
                      priceFormik.values.minPrice,
                    ).toLocaleString()} - ${Number(
                      priceFormik.values.maxPrice,
                    ).toLocaleString()}`
            }
            name=""
            onClick={() => setIsPriceRangeModalOpened(true)}
          />
          {isPriceRangeModalOpened && (
            <PriceRange
              setSlectedRadioValue={setPriceRadioValue}
              selectedRadioValue={priceRadioValue}
              formik={priceFormik}
              closeModal={setIsPriceRangeModalOpened}
              heading="Price Range"
            />
          )}
        </div>
        {/**Document Type */}
        <div className="flex flex-col gap-[10px] z-50">
          <Input
            className="w-[189px] text-sm"
            placeholder="Document Type"
            type="text"
            label=""
            showDropdownIcon={true}
            readOnly
            name=""
            value={docsValues.toString()}
            onClick={() => setIsDocumentModalOpened(true)}
          />
          {isDocumentModalOpened && (
            <DocumentTypeComponent
              docsSelected={documentsSelected}
              setDocsSelected={setDocumentsSelected}
              closeModal={setIsDocumentModalOpened}
            />
          )}
        </div>
        {/**Bedroom Component */}
        <div className="flex flex-col gap-[10px] z-50">
          <Input
            className="w-[189px] text-sm"
            placeholder="bedroom"
            type="text"
            label=""
            showDropdownIcon={true}
            readOnly
            name=""
            value={noOfBedrooms}
            onClick={() => setIsBedroomModalOpened(true)}
          />
          {isBedroomModalOpened && (
            <BedroomComponent
              noOfBedrooms={noOfBedrooms}
              closeModal={setIsBedroomModalOpened}
              setNumberOfBedrooms={setNoOfBedrooms}
            />
          )}
        </div>
        {/**Buttons ~ More Filter and Search */}
        <div className="flex gap-[20px] z-50">
          <div className="flex flex-col gap-[10px]">
            <button
              type="button"
              onClick={() => setIsMoreFilterModalOpened(true)}
              className="w-[133px] h-[50px] border-[1px] border-[#09391C] text-base text-[#09391C]"
            >
              More filter
            </button>
            {isMoreFilterModalOpened && (
              <MoreFilter
                filters={filters}
                setFilters={setFilters}
                closeModal={setIsMoreFilterModalOpened}
              />
            )}
          </div>
          <button
            type="button"
            className="w-[153px] h-[50px] bg-[#8DDB90] text-base text-white font-bold"
            onClick={() => onSearch(payload)}
          >
            Apply
          </button>
        </div>
      </div>
    </form>
  );
};

export default JointVentureModal;
