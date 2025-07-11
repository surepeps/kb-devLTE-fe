"use client";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import useClickOutside from "@/hooks/clickOutside";
import RadioCheck from "@/components/general-components/radioCheck";
import Input from "@/components/general-components/Input";
import Button from "@/components/general-components/button";
import Loading from "@/components/loading-component/loading";
import { useLoading } from "@/hooks/useLoading";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import data from "@/data/state-lga";
import BreadcrumbNav from "@/components/general-components/BreadcrumbNav";
import Select from "react-select";
import { toast } from "react-hot-toast";
import arrowRightIcon from "@/svgs/arrowR.svg";

interface Option {
  value: string;
  label: string;
}

// Define preference types
type PreferenceType = "buyer" | "tenant" | "developer" | "shortlet";

// Define form data structures for each preference type
interface BuyerFormData {
  // Step 1: Property Requirements
  state: string;
  localGovernmentAreas: string[];
  selectedAreas: { [lga: string]: string[] };
  nearbyLandmark?: string;
  minPrice: string;
  maxPrice: string;
  propertyType: "Land" | "Residential" | "Commercial";
  buildingType: "Detached" | "Semi-Detached" | "Block of Flats";
  minBedrooms: string;
  minBathrooms: string;
  propertyCondition: "New" | "Renovated" | "Any";
  purpose: "For living" | "Resale" | "Development";
  baseFeatures: string[];
  premiumFeatures: string[];
  additionalNotes?: string;

  // Step 2: Contact Information
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface TenantFormData {
  // Step 1: Rental Requirements
  state: string;
  localGovernmentAreas: string[];
  selectedAreas: { [lga: string]: string[] };
  minMonthlyRent: string;
  maxMonthlyRent: string;
  propertyType: "Self-con" | "Flat" | "Mini Flat" | "Bungalow";
  minBedrooms: string;
  leaseTerm: "6 Months" | "1 Year";
  propertyCondition: "New" | "Renovated";
  purpose: "Residential" | "Office";
  baseFeatures: string[];
  premiumFeatures: string[];
  additionalNotes?: string;

  // Step 2: Contact Information
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface DeveloperFormData {
  // Step 1: Development Interest
  state: string;
  localGovernmentAreas: string[];
  selectedAreas: { [lga: string]: string[] };
  minLandSize: string;
  budgetRange?: string;
  jvType: "Equity Split" | "Lease-to-Build" | "Development Partner";
  propertyType: "Land" | "Old Building" | "Structure to demolish";
  expectedStructureType: "Mini Flats" | "Luxury Duplexes";
  timeline: "Ready Now" | "In 3 Months" | "Within 1 Year";
  baseFeatures: string[];
  premiumFeatures: string[];
  partnerExpectations?: string;

  // Step 2: Contact Information
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  cacRegistrationNumber?: string;
}

interface ShortletFormData {
  // Step 1: Booking Requirements
  state: string;
  localGovernmentAreas: string[];
  selectedAreas: { [lga: string]: string[] };
  minPricePerNight: string;
  maxPricePerNight: string;
  propertyType: "Studio" | "1-Bed Apartment" | "2-Bed Flat";
  minBedrooms: string;
  numberOfGuests: string;
  checkInDate: string;
  checkOutDate: string;
  baseFeatures: string[];
  premiumFeatures: string[];
  additionalNotes?: string;

  // Step 2: Contact Information
  fullName: string;
  phoneNumber: string;
  email: string;
}

// Feature options for each preference type
const buyerBaseFeatures = [
  "Security",
  "Water Supply",
  "Parking",
  "Power Supply",
  "Title Preference (C of O)",
];

const buyerPremiumFeatures = [
  "Gated Estate",
  "Smart Home Features",
  "Infrastructure",
  "Sea View / Waterfront",
];

const tenantBaseFeatures = [
  "Parking",
  "Power Supply",
  "Clean Water",
  "Security",
  "Accessibility to Road",
];

const tenantPremiumFeatures = [
  "Gated Estate",
  "Furnished",
  "Serviced Apartment",
  "Backup Generator",
  "Proximity to School/Work",
];

const developerBaseFeatures = [
  "Titled Land",
  "Dry Land",
  "Accessible Road",
  "Within Urban Zone",
];

const developerPremiumFeatures = [
  "Existing Drawings",
  "Fenced Land",
  "High-Demand Area",
  "Market Demand for Flats",
];

const shortletBaseFeatures = [
  "Wi-Fi",
  "Power Supply",
  "Clean Bathroom",
  "AC",
  "Kitchen",
];

const shortletPremiumFeatures = [
  "Smart TV / Netflix",
  "Gym",
  "Swimming Pool",
  "Housekeeping",
  "Pet-Friendly",
  "Breakfast",
  "Balcony",
  "Gated Estate",
];

const NewPreference = () => {
  const isLoading = useLoading();
  const router = useRouter();
  const [currentPreferenceType, setCurrentPreferenceType] =
    useState<PreferenceType>("buyer");
  const [currentStep, setCurrentStep] = useState(0);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGAs, setSelectedLGAs] = useState<Option[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<{
    [lga: string]: Option[];
  }>({});
  const [showFinalSubmit, setShowFinalSubmit] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState<boolean>(false);

  const steps = [
    {
      label:
        currentPreferenceType === "buyer"
          ? "Property Requirements"
          : currentPreferenceType === "tenant"
            ? "Rental Requirements"
            : currentPreferenceType === "developer"
              ? "Development Interest"
              : "Booking Requirements",
      status:
        currentStep > 0
          ? "completed"
          : currentStep === 0
            ? "active"
            : ("pending" as const),
    },
    {
      label: "Contact Information",
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "active"
            : ("pending" as const),
    },
  ];

  // Initialize state options
  useEffect(() => {
    setStateOptions(
      Object.keys(data).map((state: string) => ({
        value: state,
        label: state,
      })),
    );
  }, []);

  // Handle state change
  const handleStateChange = (selected: Option | null) => {
    setSelectedState(selected);
    formik.setFieldValue("state", selected?.value || "");

    if (selected) {
      const lgas = data[selected.label as keyof typeof data];
      if (Array.isArray(lgas)) {
        setLgaOptions(
          lgas.map((lga: string) => ({
            value: lga,
            label: lga,
          })),
        );
      } else {
        setLgaOptions([]);
      }
    } else {
      setLgaOptions([]);
    }
    setSelectedLGAs([]);
    setSelectedAreas({});
    formik.setFieldValue("localGovernmentAreas", []);
    formik.setFieldValue("selectedAreas", {});
  };

  // Handle multiple LGA selection
  const handleLGAChange = (selectedOptions: Option[]) => {
    setSelectedLGAs(selectedOptions);
    formik.setFieldValue(
      "localGovernmentAreas",
      selectedOptions.map((option) => option.value),
    );

    // Reset areas for deselected LGAs
    const newSelectedAreas = { ...selectedAreas };
    const selectedLGAValues = selectedOptions.map((option) => option.value);

    Object.keys(newSelectedAreas).forEach((lga) => {
      if (!selectedLGAValues.includes(lga)) {
        delete newSelectedAreas[lga];
      }
    });

    setSelectedAreas(newSelectedAreas);
    formik.setFieldValue("selectedAreas", newSelectedAreas);
  };

  // Handle area selection for specific LGA
  const handleAreaChange = (lga: string, selectedOptions: Option[]) => {
    const newSelectedAreas = {
      ...selectedAreas,
      [lga]: selectedOptions,
    };
    setSelectedAreas(newSelectedAreas);

    const areasObject = Object.keys(newSelectedAreas).reduce(
      (acc, lgaKey) => {
        acc[lgaKey] = newSelectedAreas[lgaKey].map((option) => option.value);
        return acc;
      },
      {} as { [lga: string]: string[] },
    );

    formik.setFieldValue("selectedAreas", areasObject);
  };

  // Sample area options (in real app, this would come from an API or data source)
  const getAreaOptions = (lga: string): Option[] => {
    // This is a simplified example. In practice, you'd have a comprehensive area database
    const sampleAreas = [
      "Ikeja",
      "Victoria Island",
      "Lekki",
      "Surulere",
      "Yaba",
      "Maryland",
      "Gbagada",
      "Ikoyi",
      "Ajah",
      "Oshodi",
      "Alaba",
      "Egbeda",
      "Isolo",
      "Mushin",
      "Apapa",
    ];

    return sampleAreas.map((area) => ({
      value: `${area} - ${lga}`,
      label: `${area} - ${lga}`,
    }));
  };

  // Form validation schemas
  const getValidationSchema = (
    preferenceType: PreferenceType,
    step: number,
  ) => {
    const baseStep1Validation = {
      state: Yup.string().required("State is required"),
      localGovernmentAreas: Yup.array().min(1, "At least one LGA is required"),
    };

    const contactValidation = {
      fullName: Yup.string().required("Full name is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .test("is-valid-phone", "Invalid phone number", (value) =>
          value ? isValidPhoneNumber(value) : false,
        ),
      email: Yup.string().email("Invalid email").required("Email is required"),
    };

    if (step === 0) {
      switch (preferenceType) {
        case "buyer":
          return Yup.object({
            ...baseStep1Validation,
            minPrice: Yup.string().required("Minimum price is required"),
            maxPrice: Yup.string().required("Maximum price is required"),
            propertyType: Yup.string().required("Property type is required"),
            buildingType: Yup.string().required("Building type is required"),
            minBedrooms: Yup.string().required("Minimum bedrooms is required"),
            minBathrooms: Yup.string().required(
              "Minimum bathrooms is required",
            ),
            propertyCondition: Yup.string().required(
              "Property condition is required",
            ),
            purpose: Yup.string().required("Purpose is required"),
          });
        case "tenant":
          return Yup.object({
            ...baseStep1Validation,
            minMonthlyRent: Yup.string().required(
              "Minimum monthly rent is required",
            ),
            maxMonthlyRent: Yup.string().required(
              "Maximum monthly rent is required",
            ),
            propertyType: Yup.string().required("Property type is required"),
            minBedrooms: Yup.string().required("Minimum bedrooms is required"),
            leaseTerm: Yup.string().required("Lease term is required"),
            propertyCondition: Yup.string().required(
              "Property condition is required",
            ),
            purpose: Yup.string().required("Purpose is required"),
          });
        case "developer":
          return Yup.object({
            ...baseStep1Validation,
            minLandSize: Yup.string().required("Minimum land size is required"),
            jvType: Yup.string().required("JV type is required"),
            propertyType: Yup.string().required("Property type is required"),
            expectedStructureType: Yup.string().required(
              "Expected structure type is required",
            ),
            timeline: Yup.string().required("Timeline is required"),
          });
        case "shortlet":
          return Yup.object({
            ...baseStep1Validation,
            minPricePerNight: Yup.string().required(
              "Minimum price per night is required",
            ),
            maxPricePerNight: Yup.string().required(
              "Maximum price per night is required",
            ),
            propertyType: Yup.string().required("Property type is required"),
            minBedrooms: Yup.string().required("Minimum bedrooms is required"),
            numberOfGuests: Yup.string().required(
              "Number of guests is required",
            ),
            checkInDate: Yup.string().required("Check-in date is required"),
            checkOutDate: Yup.string().required("Check-out date is required"),
          });
      }
    } else {
      // Step 1 (Contact Information)
      if (preferenceType === "developer") {
        return Yup.object({
          companyName: Yup.string().required("Company name is required"),
          contactPerson: Yup.string().required("Contact person is required"),
          phoneNumber: Yup.string()
            .required("Phone number is required")
            .test("is-valid-phone", "Invalid phone number", (value) =>
              value ? isValidPhoneNumber(value) : false,
            ),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        });
      } else {
        return Yup.object(contactValidation);
      }
    }
  };

  // Get initial form values based on preference type
  const getInitialValues = (preferenceType: PreferenceType) => {
    const baseValues = {
      state: "",
      localGovernmentAreas: [],
      selectedAreas: {},
    };

    switch (preferenceType) {
      case "buyer":
        return {
          ...baseValues,
          nearbyLandmark: "",
          minPrice: "",
          maxPrice: "",
          propertyType: "Residential" as const,
          buildingType: "Detached" as const,
          minBedrooms: "",
          minBathrooms: "",
          propertyCondition: "New" as const,
          purpose: "For living" as const,
          baseFeatures: [],
          premiumFeatures: [],
          additionalNotes: "",
          fullName: "",
          phoneNumber: "",
          email: "",
        };
      case "tenant":
        return {
          ...baseValues,
          minMonthlyRent: "",
          maxMonthlyRent: "",
          propertyType: "Self-con" as const,
          minBedrooms: "",
          leaseTerm: "1 Year" as const,
          propertyCondition: "New" as const,
          purpose: "Residential" as const,
          baseFeatures: [],
          premiumFeatures: [],
          additionalNotes: "",
          fullName: "",
          phoneNumber: "",
          email: "",
        };
      case "developer":
        return {
          ...baseValues,
          minLandSize: "",
          budgetRange: "",
          jvType: "Equity Split" as const,
          propertyType: "Land" as const,
          expectedStructureType: "Mini Flats" as const,
          timeline: "Ready Now" as const,
          baseFeatures: [],
          premiumFeatures: [],
          partnerExpectations: "",
          companyName: "",
          contactPerson: "",
          phoneNumber: "",
          email: "",
          cacRegistrationNumber: "",
        };
      case "shortlet":
        return {
          ...baseValues,
          minPricePerNight: "",
          maxPricePerNight: "",
          propertyType: "Studio" as const,
          minBedrooms: "",
          numberOfGuests: "",
          checkInDate: "",
          checkOutDate: "",
          baseFeatures: [],
          premiumFeatures: [],
          additionalNotes: "",
          fullName: "",
          phoneNumber: "",
          email: "",
        };
    }
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: getInitialValues(currentPreferenceType),
    validationSchema: getValidationSchema(currentPreferenceType, currentStep),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setAreInputsDisabled(true);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/buyers/submit-preference`;

        // Transform form data based on preference type
        const transformedData = {
          preferenceType: currentPreferenceType,
          ...values,
        };

        console.log("Submitting preference:", transformedData);

        await toast.promise(
          axios.post(url, transformedData).then((response) => {
            if (response.status === 201) {
              console.log("Preference submitted successfully:", response);
              setShowFinalSubmit(true);
              return "Preference submitted successfully";
            } else {
              throw new Error("Submission failed");
            }
          }),
          {
            loading: "Submitting preference...",
            success: "Preference submitted successfully!",
            error: "Failed to submit preference",
          },
        );
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setAreInputsDisabled(false);
      }
    },
  });

  // Handle preference type change
  const handlePreferenceTypeChange = (type: PreferenceType) => {
    setCurrentPreferenceType(type);
    setCurrentStep(0);
    setSelectedState(null);
    setSelectedLGAs([]);
    setSelectedAreas({});
    formik.resetForm();
    formik.setValues(getInitialValues(type));
  };

  // Format number with commas
  const formatNumberWithCommas = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Render preference type selector
  const renderPreferenceTypeSelector = () => (
    <div className="flex items-center justify-center w-full mb-8">
      <div className="flex flex-wrap gap-[10px] md:gap-[20px]">
        {[
          { key: "buyer", label: "Buy a Property", shortLabel: "Buy" },
          { key: "tenant", label: "Rent/Lease a Property", shortLabel: "Rent" },
          {
            key: "developer",
            label: "Joint Venture Interest",
            shortLabel: "Joint Venture",
          },
          {
            key: "shortlet",
            label: "Shortlet Booking",
            shortLabel: "Shortlet",
          },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              handlePreferenceTypeChange(item.key as PreferenceType)
            }
            className={`${
              item.key === currentPreferenceType
                ? "bg-[#8DDB90] font-medium text-[#FFFFFF]"
                : "bg-transparent font-normal text-[#5A5D63] border-[#C7CAD0]"
            } h-[40px] md:h-[51px] min-w-fit border-[1px] border-[#C7CAD0] text-[12px] md:text-lg px-[10px] md:px-[25px] rounded-none`}
          >
            <span className="block md:hidden">{item.shortLabel}</span>
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Render location fields with multiple LGA and area selection
  const renderLocationFields = () => (
    <div className="min-h-[127px] w-full flex flex-col gap-[15px]">
      <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
        Preferred Location
      </h2>

      {/* State Selection */}
      <div className="flex flex-col gap-2">
        <h3>State</h3>
        <Select
          options={stateOptions}
          value={selectedState}
          onChange={handleStateChange}
          placeholder="Select State"
          isDisabled={areInputsDisabled}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: 48,
              height: 48,
              border: "1px solid #D6DDEB",
              backgroundColor: "#FAFAFA",
            }),
          }}
        />
      </div>

      {/* Multiple LGA Selection */}
      {selectedState && (
        <div className="flex flex-col gap-2">
          <h3>Local Government Areas</h3>
          <Select
            options={lgaOptions}
            value={selectedLGAs}
            onChange={handleLGAChange}
            placeholder="Select Local Government Areas"
            isMulti
            isDisabled={areInputsDisabled}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: 48,
                border: "1px solid #D6DDEB",
                backgroundColor: "#FAFAFA",
              }),
            }}
          />
        </div>
      )}

      {/* Dynamic Area Selection for each LGA */}
      {selectedLGAs.map((lga) => (
        <div key={lga.value} className="flex flex-col gap-2">
          <h3>Select preferred areas in {lga.label}</h3>
          <Select
            options={getAreaOptions(lga.value)}
            value={selectedAreas[lga.value] || []}
            onChange={(selectedOptions) =>
              handleAreaChange(lga.value, selectedOptions as Option[])
            }
            placeholder={`Select areas in ${lga.label}`}
            isMulti
            isDisabled={areInputsDisabled}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: 48,
                border: "1px solid #D6DDEB",
                backgroundColor: "#FAFAFA",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "#8DDB90",
                color: "white",
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: "white",
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: "white",
                ":hover": {
                  backgroundColor: "#7BC97F",
                  color: "white",
                },
              }),
            }}
          />
        </div>
      ))}
    </div>
  );

  // Render features section
  const renderFeatures = (
    baseFeatures: string[],
    premiumFeatures: string[],
    fieldNamePrefix: string,
  ) => (
    <div className="flex flex-col gap-[15px]">
      <div>
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E] mb-3">
          Base Features
        </h2>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-[30px] gap-y-[10px] w-full">
          {baseFeatures.map((feature: string, idx: number) => (
            <RadioCheck
              key={idx}
              type="checkbox"
              value={feature}
              name="baseFeatures"
              handleChange={() => {
                const currentFeatures = formik.values.baseFeatures || [];
                const newFeatures = currentFeatures.includes(feature)
                  ? currentFeatures.filter((f) => f !== feature)
                  : [...currentFeatures, feature];
                formik.setFieldValue("baseFeatures", newFeatures);
              }}
              isDisabled={areInputsDisabled}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E] mb-3">
          Premium Features (Optional)
        </h2>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-[30px] gap-y-[10px] w-full">
          {premiumFeatures.map((feature: string, idx: number) => (
            <RadioCheck
              key={idx}
              type="checkbox"
              value={feature}
              name="premiumFeatures"
              handleChange={() => {
                const currentFeatures = formik.values.premiumFeatures || [];
                const newFeatures = currentFeatures.includes(feature)
                  ? currentFeatures.filter((f) => f !== feature)
                  : [...currentFeatures, feature];
                formik.setFieldValue("premiumFeatures", newFeatures);
              }}
              isDisabled={areInputsDisabled}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Render buyer preference Step 1
  const renderBuyerStep1 = () => (
    <div className="flex flex-col gap-[30px]">
      {renderLocationFields()}

      {/* Nearby Landmark */}
      <Input
        label="Nearby Landmark (Optional)"
        name="nearbyLandmark"
        type="text"
        value={formik.values.nearbyLandmark}
        onChange={formik.handleChange}
        placeholder="Enter nearby landmark"
        isDisabled={areInputsDisabled}
      />

      {/* Budget Range */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Budget Range (₦)
        </h2>
        <div className="flex w-full gap-4">
          <Input
            label="Minimum Price"
            name="minPrice"
            type="text"
            value={formik.values.minPrice}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minPrice",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Minimum price"
            isDisabled={areInputsDisabled}
          />
          <Input
            label="Maximum Price"
            name="maxPrice"
            type="text"
            value={formik.values.maxPrice}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxPrice",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Maximum price"
            isDisabled={areInputsDisabled}
          />
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Property Details
        </h2>

        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <h3>Property Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Land", "Residential", "Commercial"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.propertyType}
                handleChange={() => formik.setFieldValue("propertyType", type)}
                type="radio"
                name="propertyType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Building Type */}
        <div className="flex flex-col gap-2">
          <h3>Building Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Detached", "Semi-Detached", "Block of Flats"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.buildingType}
                handleChange={() => formik.setFieldValue("buildingType", type)}
                type="radio"
                name="buildingType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2 gap-2">
            <h3>Minimum Bedrooms</h3>
            <Select
              options={bedroomOptions}
              value={bedroomOptions.find(
                (option) => option.value === formik.values.minBedrooms,
              )}
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "minBedrooms",
                  selectedOption?.value || "",
                );
              }}
              placeholder="Select minimum bedrooms"
              isDisabled={areInputsDisabled}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: 48,
                  height: 48,
                  border: "1px solid #D6DDEB",
                  backgroundColor: "#FAFAFA",
                }),
              }}
            />
          </div>
          <Input
            label="Minimum Bathrooms"
            name="minBathrooms"
            type="number"
            value={formik.values.minBathrooms}
            onChange={formik.handleChange}
            placeholder="Minimum bathrooms"
            isDisabled={areInputsDisabled}
            className="w-1/2"
          />
        </div>

        {/* Property Condition */}
        <div className="flex flex-col gap-2">
          <h3>Property Condition</h3>
          <div className="flex gap-4 flex-wrap">
            {["New", "Renovated", "Any"].map((condition) => (
              <RadioCheck
                key={condition}
                selectedValue={formik.values.propertyCondition}
                handleChange={() =>
                  formik.setFieldValue("propertyCondition", condition)
                }
                type="radio"
                name="propertyCondition"
                value={condition}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-2">
          <h3>Purpose</h3>
          <div className="flex gap-4 flex-wrap">
            {["For living", "Resale", "Development"].map((purpose) => (
              <RadioCheck
                key={purpose}
                selectedValue={formik.values.purpose}
                handleChange={() => formik.setFieldValue("purpose", purpose)}
                type="radio"
                name="purpose"
                value={purpose}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      {renderFeatures(buyerBaseFeatures, buyerPremiumFeatures, "buyer")}

      {/* Additional Information */}
      <Input
        label="Additional Information"
        name="additionalNotes"
        type="textArea"
        multiline={true}
        rows={3}
        value={formik.values.additionalNotes}
        onChange={formik.handleChange}
        placeholder="Notes or custom requirements"
        isDisabled={areInputsDisabled}
      />
    </div>
  );

  // Render tenant preference Step 1
  const renderTenantStep1 = () => (
    <div className="flex flex-col gap-[30px]">
      {renderLocationFields()}

      {/* Rent Budget */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Rent Budget (₦)
        </h2>
        <div className="flex w-full gap-4">
          <Input
            label="Minimum Monthly Rent"
            name="minMonthlyRent"
            type="text"
            value={formik.values.minMonthlyRent}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minMonthlyRent",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Minimum monthly rent"
            isDisabled={areInputsDisabled}
          />
          <Input
            label="Maximum Monthly Rent"
            name="maxMonthlyRent"
            type="text"
            value={formik.values.maxMonthlyRent}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxMonthlyRent",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Maximum monthly rent"
            isDisabled={areInputsDisabled}
          />
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Property Details
        </h2>

        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <h3>Property Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Self-con", "Flat", "Mini Flat", "Bungalow"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.propertyType}
                handleChange={() => formik.setFieldValue("propertyType", type)}
                type="radio"
                name="propertyType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Minimum Bedrooms */}
        <div className="flex flex-col gap-2">
          <h3>Minimum Bedrooms</h3>
          <Select
            options={bedroomOptions}
            value={bedroomOptions.find(
              (option) => option.value === formik.values.minBedrooms,
            )}
            onChange={(selectedOption) => {
              formik.setFieldValue("minBedrooms", selectedOption?.value || "");
            }}
            placeholder="Select minimum bedrooms"
            isDisabled={areInputsDisabled}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: 48,
                height: 48,
                border: "1px solid #D6DDEB",
                backgroundColor: "#FAFAFA",
              }),
            }}
          />
        </div>

        {/* Lease Term */}
        <div className="flex flex-col gap-2">
          <h3>Lease Term</h3>
          <div className="flex gap-4 flex-wrap">
            {["6 Months", "1 Year"].map((term) => (
              <RadioCheck
                key={term}
                selectedValue={formik.values.leaseTerm}
                handleChange={() => formik.setFieldValue("leaseTerm", term)}
                type="radio"
                name="leaseTerm"
                value={term}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Property Condition */}
        <div className="flex flex-col gap-2">
          <h3>Property Condition</h3>
          <div className="flex gap-4 flex-wrap">
            {["New", "Renovated"].map((condition) => (
              <RadioCheck
                key={condition}
                selectedValue={formik.values.propertyCondition}
                handleChange={() =>
                  formik.setFieldValue("propertyCondition", condition)
                }
                type="radio"
                name="propertyCondition"
                value={condition}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-2">
          <h3>Purpose</h3>
          <div className="flex gap-4 flex-wrap">
            {["Residential", "Office"].map((purpose) => (
              <RadioCheck
                key={purpose}
                selectedValue={formik.values.purpose}
                handleChange={() => formik.setFieldValue("purpose", purpose)}
                type="radio"
                name="purpose"
                value={purpose}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      {renderFeatures(tenantBaseFeatures, tenantPremiumFeatures, "tenant")}

      {/* Additional Information */}
      <Input
        label="Additional Information"
        name="additionalNotes"
        type="textArea"
        multiline={true}
        rows={3}
        value={formik.values.additionalNotes}
        onChange={formik.handleChange}
        placeholder="Notes (e.g., Must allow pets)"
        isDisabled={areInputsDisabled}
      />
    </div>
  );

  // Render developer preference Step 1
  const renderDeveloperStep1 = () => (
    <div className="flex flex-col gap-[30px]">
      {renderLocationFields()}

      {/* Minimum Land Size */}
      <Input
        label="Minimum Land Size (sqm or plots)"
        name="minLandSize"
        type="text"
        value={formik.values.minLandSize}
        onChange={formik.handleChange}
        placeholder="Enter minimum land size"
        isDisabled={areInputsDisabled}
      />

      {/* Budget Range */}
      <Input
        label="Budget Range / Investment Capacity (Optional)"
        name="budgetRange"
        type="text"
        value={formik.values.budgetRange}
        onChange={(event) => {
          const rawValue = event.target.value.replace(/,/g, "");
          formik.setFieldValue("budgetRange", formatNumberWithCommas(rawValue));
        }}
        placeholder="Enter budget range"
        isDisabled={areInputsDisabled}
      />

      {/* Property Details */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Property Details
        </h2>

        {/* Preferred JV Type */}
        <div className="flex flex-col gap-2">
          <h3>Preferred JV Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Equity Split", "Lease-to-Build", "Development Partner"].map(
              (type) => (
                <RadioCheck
                  key={type}
                  selectedValue={formik.values.jvType}
                  handleChange={() => formik.setFieldValue("jvType", type)}
                  type="radio"
                  name="jvType"
                  value={type}
                  isDisabled={areInputsDisabled}
                />
              ),
            )}
          </div>
        </div>

        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <h3>Property Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Land", "Old Building", "Structure to demolish"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.propertyType}
                handleChange={() => formik.setFieldValue("propertyType", type)}
                type="radio"
                name="propertyType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Expected Structure Type */}
        <div className="flex flex-col gap-2">
          <h3>Expected Structure Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Mini Flats", "Luxury Duplexes"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.expectedStructureType}
                handleChange={() =>
                  formik.setFieldValue("expectedStructureType", type)
                }
                type="radio"
                name="expectedStructureType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-2">
          <h3>Timeline</h3>
          <div className="flex gap-4 flex-wrap">
            {["Ready Now", "In 3 Months", "Within 1 Year"].map((timeline) => (
              <RadioCheck
                key={timeline}
                selectedValue={formik.values.timeline}
                handleChange={() => formik.setFieldValue("timeline", timeline)}
                type="radio"
                name="timeline"
                value={timeline}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      {renderFeatures(
        developerBaseFeatures,
        developerPremiumFeatures,
        "developer",
      )}

      {/* Additional Information */}
      <Input
        label="Partner Expectations, Restrictions, etc."
        name="partnerExpectations"
        type="textArea"
        multiline={true}
        rows={3}
        value={formik.values.partnerExpectations}
        onChange={formik.handleChange}
        placeholder="Partner expectations, restrictions, upload past projects (optional)"
        isDisabled={areInputsDisabled}
      />
    </div>
  );

  // Render shortlet preference Step 1
  const renderShortletStep1 = () => (
    <div className="flex flex-col gap-[30px]">
      {renderLocationFields()}

      {/* Budget Per Night */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Budget Per Night (₦)
        </h2>
        <div className="flex w-full gap-4">
          <Input
            label="Minimum Price"
            name="minPricePerNight"
            type="text"
            value={formik.values.minPricePerNight}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minPricePerNight",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Minimum price per night"
            isDisabled={areInputsDisabled}
          />
          <Input
            label="Maximum Price"
            name="maxPricePerNight"
            type="text"
            value={formik.values.maxPricePerNight}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxPricePerNight",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Maximum price per night"
            isDisabled={areInputsDisabled}
          />
        </div>
      </div>

      {/* Booking Details */}
      <div className="flex flex-col gap-[15px]">
        <h2 className="text-[20px] leading-[32px] font-medium text-[#1E1E1E]">
          Booking Details
        </h2>

        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <h3>Property Type</h3>
          <div className="flex gap-4 flex-wrap">
            {["Studio", "1-Bed Apartment", "2-Bed Flat"].map((type) => (
              <RadioCheck
                key={type}
                selectedValue={formik.values.propertyType}
                handleChange={() => formik.setFieldValue("propertyType", type)}
                type="radio"
                name="propertyType"
                value={type}
                isDisabled={areInputsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="flex gap-4">
          <div className="flex flex-col w-1/3 gap-2">
            <h3>Minimum Bedrooms</h3>
            <Select
              options={bedroomOptions}
              value={bedroomOptions.find(
                (option) => option.value === formik.values.minBedrooms,
              )}
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "minBedrooms",
                  selectedOption?.value || "",
                );
              }}
              placeholder="Select bedrooms"
              isDisabled={areInputsDisabled}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: 48,
                  height: 48,
                  border: "1px solid #D6DDEB",
                  backgroundColor: "#FAFAFA",
                }),
              }}
            />
          </div>
          <Input
            label="Number of Guests"
            name="numberOfGuests"
            type="number"
            value={formik.values.numberOfGuests}
            onChange={formik.handleChange}
            placeholder="Number of guests"
            isDisabled={areInputsDisabled}
            className="w-1/3"
          />
        </div>

        {/* Check-in and Check-out Dates */}
        <div className="flex gap-4">
          <Input
            label="Check-in Date"
            name="checkInDate"
            type="date"
            value={formik.values.checkInDate}
            onChange={formik.handleChange}
            isDisabled={areInputsDisabled}
            className="w-1/2"
          />
          <Input
            label="Check-out Date"
            name="checkOutDate"
            type="date"
            value={formik.values.checkOutDate}
            onChange={formik.handleChange}
            isDisabled={areInputsDisabled}
            className="w-1/2"
          />
        </div>
      </div>

      {/* Features */}
      {renderFeatures(
        shortletBaseFeatures,
        shortletPremiumFeatures,
        "shortlet",
      )}

      {/* Additional Information */}
      <Input
        label="Additional Information"
        name="additionalNotes"
        type="textArea"
        multiline={true}
        rows={3}
        value={formik.values.additionalNotes}
        onChange={formik.handleChange}
        placeholder="Preferences (e.g., No Smoking, Must allow pets), Notes (e.g., Anniversary getaway)"
        isDisabled={areInputsDisabled}
      />
    </div>
  );

  // Render contact information step
  const renderContactStep = () => {
    if (currentPreferenceType === "developer") {
      return (
        <div className="flex flex-col gap-[20px]">
          <Input
            label="Company / Developer Name"
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            type="text"
            isDisabled={areInputsDisabled}
          />
          <Input
            label="Contact Person"
            name="contactPerson"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            type="text"
            isDisabled={areInputsDisabled}
          />
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="block text-sm font-medium text-black">
                Phone Number:
              </label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                placeholder="Enter phone number"
                className="w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] focus:outline-none focus:ring-0 disabled:bg-[#FAFAFA] disabled:cursor-not-allowed"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
            <Input
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              isDisabled={areInputsDisabled}
              className="w-1/2"
            />
          </div>
          <Input
            label="CAC Registration Number (Optional)"
            name="cacRegistrationNumber"
            value={formik.values.cacRegistrationNumber}
            onChange={formik.handleChange}
            type="text"
            isDisabled={areInputsDisabled}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-[20px]">
          <div className="flex gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              type="text"
              isDisabled={areInputsDisabled}
              className="w-1/2"
            />
            <div className="flex flex-col gap-2 w-1/2">
              <label className="block text-sm font-medium text-black">
                Phone Number:
              </label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                placeholder="Enter phone number"
                className="w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] focus:outline-none focus:ring-0 disabled:bg-[#FAFAFA] disabled:cursor-not-allowed"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
          <Input
            label="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            type="email"
            isDisabled={areInputsDisabled}
          />
        </div>
      );
    }
  };

  // Get step content based on current preference type and step
  const getStepContent = () => {
    if (currentStep === 0) {
      switch (currentPreferenceType) {
        case "buyer":
          return renderBuyerStep1();
        case "tenant":
          return renderTenantStep1();
        case "developer":
          return renderDeveloperStep1();
        case "shortlet":
          return renderShortletStep1();
        default:
          return null;
      }
    } else {
      return renderContactStep();
    }
  };

  // Get step title
  const getStepTitle = () => {
    if (currentStep === 0) {
      switch (currentPreferenceType) {
        case "buyer":
          return "Property Requirements";
        case "tenant":
          return "Rental Requirements";
        case "developer":
          return "Development Interest";
        case "shortlet":
          return "Booking Requirements";
        default:
          return "Requirements";
      }
    } else {
      return "Contact Information";
    }
  };

  // Get step subtitle
  const getStepSubtitle = () => {
    if (currentStep === 0) {
      switch (currentPreferenceType) {
        case "buyer":
          return "Please provide details about the property you want to buy";
        case "tenant":
          return "Please provide details about the property you want to rent";
        case "developer":
          return "Please provide details about your joint venture interest";
        case "shortlet":
          return "Please provide details about your shortlet booking requirements";
        default:
          return "Please provide your requirements";
      }
    } else {
      return "Please provide your contact details so we can get back to you.";
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section className="min-h-[800px] bg-[#EEF1F1] w-full flex justify-center items-center transition-all duration-500">
        <div className="container flex flex-col justify-center items-center gap-[10px] my-[20px] px-[20px]">
          <div className="w-full flex justify-start">
            <BreadcrumbNav
              point="Cancel"
              onBack={() => router.back()}
              arrowIcon={arrowRightIcon}
              backText="MarketPlace"
            />
          </div>

          {/* Preference Type Selector */}
          {renderPreferenceTypeSelector()}

          {/* Stepper */}
          <div className="my-7">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === "completed"
                        ? "bg-[#8DDB90] text-white"
                        : step.status === "active"
                          ? "bg-[#8DDB90] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      step.status === "active"
                        ? "text-[#8DDB90]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-300 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[#0B0D0C] lg:text-[24px] font-semibold text-center text-[18px]">
            {getStepTitle()}
          </h2>
          <h2 className="lg:w-[953px] w-full text-base md:text-lg text-[#515B6F] font-normal text-center">
            {getStepSubtitle()}
          </h2>

          <div className="lg:w-[877px] w-full">
            <form
              onSubmit={formik.handleSubmit}
              className="w-full border-[#8D909680] flex flex-col"
            >
              <div className="min-h-[629px] py-[40px] lg:px-[80px] w-full">
                <div className="w-full flex flex-col gap-[30px]">
                  {getStepContent()}
                </div>
              </div>

              <div className="w-full flex items-center mt-8 justify-between">
                <Button
                  value={currentStep === 0 ? "Cancel" : "Back"}
                  type="button"
                  onClick={() => {
                    if (currentStep === 0) {
                      router.back();
                    } else {
                      setCurrentStep((prev) => Math.max(prev - 1, 0));
                    }
                  }}
                  className="border-[1px] border-black lg:w-[25%] text-black text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] disabled:cursor-not-allowed"
                />
                <Button
                  value={currentStep === steps.length - 1 ? "Submit" : "Next"}
                  type={currentStep === steps.length - 1 ? "submit" : "button"}
                  onClick={
                    currentStep === steps.length - 1
                      ? undefined
                      : () => {
                          setCurrentStep((prev) => prev + 1);
                        }
                  }
                  isDisabled={areInputsDisabled}
                  className={`lg:w-[25%] text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] ${
                    areInputsDisabled
                      ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-[#8DDB90] text-white"
                  }`}
                />
              </div>
            </form>

            <LocalSubmitModal
              open={showFinalSubmit}
              onClose={() => {
                setShowFinalSubmit(false);
                setTimeout(() => {
                  router.push("/");
                }, 100);
              }}
            />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

// Bedroom options
const bedroomOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "More", label: "More" },
];

// Success Modal Component
interface LocalSubmitModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subheader?: string;
  buttonText?: string;
}

const LocalSubmitModal: React.FC<LocalSubmitModalProps> = ({
  open,
  onClose,
  title = "Successfully Submitted",
  subheader = "We will reach out to you soon",
  buttonText = "Home",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    if (onClose) onClose();
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        ref={ref}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
        <p className="text-base text-gray-600 mb-6 text-center">{subheader}</p>
        <button
          onClick={onClose}
          className="bg-[#8DDB90] text-white font-bold py-3 px-8 rounded w-full"
        >
          {buttonText}
        </button>
      </motion.div>
    </div>
  );
};

export default NewPreference;
