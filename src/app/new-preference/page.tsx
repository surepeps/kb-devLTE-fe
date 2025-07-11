"use client";
import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type PreferenceType = "buyer" | "tenant" | "developer" | "shortlet";

const NewPreference = () => {
  const isLoading = useLoading();
  const router = useRouter();
  const [currentPreferenceType, setCurrentPreferenceType] =
    useState<PreferenceType>("buyer");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGAs, setSelectedLGAs] = useState<Option[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<{
    [lga: string]: Option[];
  }>({});
  const [showFinalSubmit, setShowFinalSubmit] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState<boolean>(false);

  // Memoized options to prevent re-rendering
  const stateOptions = useMemo(
    () =>
      Object.keys(data).map((state: string) => ({
        value: state,
        label: state,
      })),
    [],
  );

  const lgaOptions = useMemo(() => {
    if (!selectedState) return [];
    const lgas = data[selectedState.label as keyof typeof data];
    if (Array.isArray(lgas)) {
      return lgas.map((lga: string) => ({
        value: lga,
        label: lga,
      }));
    }
    return [];
  }, [selectedState]);

  // Steps configuration
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

  // Features data
  const featuresData = {
    buyer: {
      base: [
        "Security",
        "Water Supply",
        "Parking",
        "Power Supply",
        "Title Preference (e.g., C of O)",
      ],
      premium: [
        "Gated Estate",
        "Smart Home Features",
        "Infrastructure",
        "Sea View / Waterfront",
      ],
    },
    tenant: {
      base: [
        "Parking",
        "Power Supply",
        "Clean Water",
        "Security",
        "Accessibility to Road",
      ],
      premium: [
        "Gated Estate",
        "Furnished",
        "Serviced Apartment",
        "Backup Generator",
        "Proximity to School/Work",
      ],
    },
    developer: {
      base: ["Titled Land", "Dry Land", "Accessible Road", "Within Urban Zone"],
      premium: [
        "Existing Drawings",
        "Fenced Land",
        "High-Demand Area",
        "Market Demand for Flats",
      ],
    },
    shortlet: {
      base: ["Wi-Fi", "Power Supply", "Clean Bathroom", "AC", "Kitchen"],
      premium: [
        "Smart TV / Netflix",
        "Gym",
        "Swimming Pool",
        "Housekeeping",
        "Pet-Friendly",
        "Breakfast",
        "Balcony",
        "Gated Estate",
      ],
    },
  };

  // Handle state change
  const handleStateChange = useCallback((selected: Option | null) => {
    setSelectedState(selected);
    setSelectedLGAs([]);
    setSelectedAreas({});
    formik.setFieldValue("state", selected?.value || "");
    formik.setFieldValue("localGovernmentAreas", []);
    formik.setFieldValue("selectedAreas", {});
  }, []);

  // Handle multiple LGA selection
  const handleLGAChange = useCallback(
    (selectedOptions: Option[]) => {
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
    },
    [selectedAreas],
  );

  // Handle area selection for specific LGA
  const handleAreaChange = useCallback(
    (lga: string, selectedOptions: Option[]) => {
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
    },
    [selectedAreas],
  );

  // Sample area options
  const getAreaOptions = useCallback((lga: string): Option[] => {
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
  }, []);

  // Get initial form values based on preference type
  const getInitialValues = useCallback((preferenceType: PreferenceType) => {
    const baseValues = {
      state: "",
      localGovernmentAreas: [],
      selectedAreas: {},
      baseFeatures: [],
      premiumFeatures: [],
      fullName: "",
      phoneNumber: "",
      email: "",
    };

    switch (preferenceType) {
      case "buyer":
        return {
          ...baseValues,
          nearbyLandmark: "",
          minPrice: "",
          maxPrice: "",
          propertyType: "Land",
          buildingType: "Detached",
          minBedrooms: "",
          minBathrooms: "",
          propertyCondition: "New",
          purpose: "For living",
          additionalNotes: "",
        };
      case "tenant":
        return {
          ...baseValues,
          minMonthlyRent: "",
          maxMonthlyRent: "",
          propertyType: "Self-con",
          minBedrooms: "",
          leaseTerm: "1 Year",
          propertyCondition: "New",
          purpose: "Residential",
          additionalNotes: "",
        };
      case "developer":
        return {
          ...baseValues,
          minLandSize: "",
          budgetRange: "",
          jvType: "Equity Split",
          propertyType: "Land",
          expectedStructureType: "Mini Flats",
          timeline: "Ready Now",
          partnerExpectations: "",
          companyName: "",
          contactPerson: "",
          cacRegistrationNumber: "",
        };
      case "shortlet":
        return {
          ...baseValues,
          minPricePerNight: "",
          maxPricePerNight: "",
          propertyType: "Studio",
          minBedrooms: "",
          numberOfGuests: "",
          checkInDate: "",
          checkOutDate: "",
          additionalNotes: "",
        };
    }
  }, []);

  // Form validation schema
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

  // Initialize formik
  const formik = useFormik({
    initialValues: getInitialValues(currentPreferenceType),
    validationSchema: getValidationSchema(currentPreferenceType, currentStep),
    enableReinitialize: false, // Prevent re-rendering when values change
    validateOnBlur: true,
    validateOnChange: false, // Prevent re-rendering on every change
    onSubmit: async (values) => {
      setAreInputsDisabled(true);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/buyers/submit-preference`;

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
  const handlePreferenceTypeChange = useCallback(
    (type: PreferenceType) => {
      setCurrentPreferenceType(type);
      setCurrentStep(0);
      setSelectedState(null);
      setSelectedLGAs([]);
      setSelectedAreas({});
      formik.resetForm();
      formik.setValues(getInitialValues(type));
    },
    [getInitialValues],
  );

  // Format number with commas
  const formatNumberWithCommas = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // Custom select styles
  const customSelectStyles = useMemo(
    () => ({
      control: (provided: any) => ({
        ...provided,
        minHeight: 40,
        height: 40,
        border: "1px solid #D1D5DB",
        borderRadius: "8px",
        fontSize: "14px",
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        height: 38,
        padding: "0 12px",
      }),
      input: (provided: any) => ({
        ...provided,
        margin: 0,
        padding: 0,
      }),
      indicatorsContainer: (provided: any) => ({
        ...provided,
        height: 38,
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "#8DDB90",
        borderRadius: "4px",
      }),
      multiValueLabel: (provided: any) => ({
        ...provided,
        color: "white",
        fontSize: "12px",
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color: "white",
        "&:hover": {
          backgroundColor: "#7BC97F",
          color: "white",
        },
      }),
    }),
    [],
  );

  // Render preference type selector
  const renderPreferenceTypeSelector = () => (
    <div className="mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { key: "buyer", label: "Buy Property", icon: "🏠" },
          { key: "tenant", label: "Rent Property", icon: "🏡" },
          { key: "developer", label: "Joint Venture", icon: "🏗" },
          { key: "shortlet", label: "Shortlet", icon: "🏘" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              handlePreferenceTypeChange(item.key as PreferenceType)
            }
            className={`p-3 text-sm font-medium border rounded-lg transition-all ${
              item.key === currentPreferenceType
                ? "bg-[#8DDB90] text-white border-[#8DDB90]"
                : "bg-white text-gray-700 border-gray-300 hover:border-[#8DDB90]"
            }`}
          >
            <div className="text-lg mb-1">{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Render location fields
  const renderLocationFields = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Preferred Location</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <Select
            options={stateOptions}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select State"
            isDisabled={areInputsDisabled}
            styles={customSelectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Local Government Areas <span className="text-red-500">*</span>
          </label>
          <Select
            options={lgaOptions}
            value={selectedLGAs}
            onChange={handleLGAChange}
            placeholder="Select LGAs"
            isMulti
            isDisabled={areInputsDisabled || !selectedState}
            styles={customSelectStyles}
          />
        </div>
      </div>

      {/* Dynamic Area Selection for each LGA */}
      {selectedLGAs.map((lga) => (
        <div key={lga.value} className="bg-gray-50 p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select preferred areas in{" "}
            <span className="text-[#8DDB90]">{lga.label}</span>
          </label>
          <Select
            options={getAreaOptions(lga.value)}
            value={selectedAreas[lga.value] || []}
            onChange={(selectedOptions) =>
              handleAreaChange(lga.value, selectedOptions as Option[])
            }
            placeholder={`Areas in ${lga.label}`}
            isMulti
            isDisabled={areInputsDisabled}
            styles={customSelectStyles}
          />
        </div>
      ))}

      {currentPreferenceType === "buyer" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nearby Landmark (Optional)
          </label>
          <input
            type="text"
            value={formik.values.nearbyLandmark || ""}
            onChange={formik.handleChange}
            name="nearbyLandmark"
            placeholder="Enter nearby landmark"
            disabled={areInputsDisabled}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}
    </div>
  );

  // Render features
  const renderFeatures = () => {
    const currentFeatures = featuresData[currentPreferenceType];

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Base Features</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {currentFeatures.base.map((feature: string, idx: number) => (
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
          <h4 className="font-medium text-gray-900 mb-2">
            Premium Features (Optional)
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {currentFeatures.premium.map((feature: string, idx: number) => (
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
  };

  // Render buyer step 1
  const renderBuyerStep1 = () => (
    <div className="space-y-6">
      {renderLocationFields()}

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Budget Range (₦)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.minPrice}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "minPrice",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter minimum price"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.maxPrice}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "maxPrice",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter maximum price"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Property Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["Land", "Residential", "Commercial"].map((type) => (
                <RadioCheck
                  key={type}
                  selectedValue={formik.values.propertyType}
                  handleChange={() =>
                    formik.setFieldValue("propertyType", type)
                  }
                  type="radio"
                  name="propertyType"
                  value={type}
                  isDisabled={areInputsDisabled}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["Detached", "Semi-Detached", "Block of Flats"].map((type) => (
                <RadioCheck
                  key={type}
                  selectedValue={formik.values.buildingType}
                  handleChange={() =>
                    formik.setFieldValue("buildingType", type)
                  }
                  type="radio"
                  name="buildingType"
                  value={type}
                  isDisabled={areInputsDisabled}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms <span className="text-red-500">*</span>
            </label>
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
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bathrooms <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formik.values.minBathrooms}
              onChange={formik.handleChange}
              name="minBathrooms"
              placeholder="Enter bathrooms"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Condition <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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
      </div>

      {renderFeatures()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Information
        </label>
        <textarea
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          name="additionalNotes"
          rows={3}
          placeholder="Notes or custom requirements"
          disabled={areInputsDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>
    </div>
  );

  // Render tenant step 1
  const renderTenantStep1 = () => (
    <div className="space-y-6">
      {renderLocationFields()}

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Rent Budget (₦)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Monthly Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.minMonthlyRent}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "minMonthlyRent",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter minimum rent"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Monthly Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.maxMonthlyRent}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "maxMonthlyRent",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter maximum rent"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Property Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["Self-con", "Flat", "Mini Flat", "Bungalow"].map((type) => (
                <RadioCheck
                  key={type}
                  selectedValue={formik.values.propertyType}
                  handleChange={() =>
                    formik.setFieldValue("propertyType", type)
                  }
                  type="radio"
                  name="propertyType"
                  value={type}
                  isDisabled={areInputsDisabled}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms <span className="text-red-500">*</span>
            </label>
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
              styles={customSelectStyles}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease Term <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Condition <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
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

      {renderFeatures()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Information
        </label>
        <textarea
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          name="additionalNotes"
          rows={3}
          placeholder="Notes (e.g., Must allow pets)"
          disabled={areInputsDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>
    </div>
  );

  // Render developer step 1
  const renderDeveloperStep1 = () => (
    <div className="space-y-6">
      {renderLocationFields()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Land Size (sqm or plots){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formik.values.minLandSize}
            onChange={formik.handleChange}
            name="minLandSize"
            placeholder="Enter land size"
            disabled={areInputsDisabled}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range / Investment Capacity (Optional)
          </label>
          <input
            type="text"
            value={formik.values.budgetRange}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "budgetRange",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter budget range"
            disabled={areInputsDisabled}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Property Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred JV Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["Land", "Old Building", "Structure to demolish"].map((type) => (
                <RadioCheck
                  key={type}
                  selectedValue={formik.values.propertyType}
                  handleChange={() =>
                    formik.setFieldValue("propertyType", type)
                  }
                  type="radio"
                  name="propertyType"
                  value={type}
                  isDisabled={areInputsDisabled}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Structure Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["Ready Now", "In 3 Months", "Within 1 Year"].map((timeline) => (
                <RadioCheck
                  key={timeline}
                  selectedValue={formik.values.timeline}
                  handleChange={() =>
                    formik.setFieldValue("timeline", timeline)
                  }
                  type="radio"
                  name="timeline"
                  value={timeline}
                  isDisabled={areInputsDisabled}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {renderFeatures()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partner Expectations, Restrictions, etc.
        </label>
        <textarea
          value={formik.values.partnerExpectations || ""}
          onChange={formik.handleChange}
          name="partnerExpectations"
          rows={3}
          placeholder="Partner expectations, restrictions, upload past projects (optional)"
          disabled={areInputsDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>
    </div>
  );

  // Render shortlet step 1
  const renderShortletStep1 = () => (
    <div className="space-y-6">
      {renderLocationFields()}

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Budget Per Night (₦)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.minPricePerNight}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "minPricePerNight",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter minimum price"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.maxPricePerNight}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/,/g, "");
                formik.setFieldValue(
                  "maxPricePerNight",
                  formatNumberWithCommas(rawValue),
                );
              }}
              placeholder="Enter maximum price"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Booking Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms <span className="text-red-500">*</span>
            </label>
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
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formik.values.numberOfGuests}
              onChange={formik.handleChange}
              name="numberOfGuests"
              placeholder="Number of guests"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formik.values.checkInDate}
              onChange={formik.handleChange}
              name="checkInDate"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formik.values.checkOutDate}
              onChange={formik.handleChange}
              name="checkOutDate"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {renderFeatures()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Information
        </label>
        <textarea
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          name="additionalNotes"
          rows={3}
          placeholder="Preferences (e.g., No Smoking, Must allow pets), Notes (e.g., Anniversary getaway)"
          disabled={areInputsDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
        />
      </div>
    </div>
  );

  // Render contact step
  const renderContactStep = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Contact Information</h3>

      {currentPreferenceType === "developer" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company / Developer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              name="companyName"
              placeholder="Enter company name"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              name="contactPerson"
              placeholder="Enter contact person"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                placeholder="Enter phone number"
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                name="email"
                placeholder="Enter email"
                disabled={areInputsDisabled}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CAC Registration Number (Optional)
            </label>
            <input
              type="text"
              value={formik.values.cacRegistrationNumber}
              onChange={formik.handleChange}
              name="cacRegistrationNumber"
              placeholder="Enter CAC number"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              name="fullName"
              placeholder="Enter your full name"
              disabled={areInputsDisabled}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                placeholder="Enter phone number"
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                name="email"
                placeholder="Enter email"
                disabled={areInputsDisabled}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Get step content
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

  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <div className="min-h-screen bg-[#EEF1F1] py-4">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-4">
            <BreadcrumbNav
              point="Cancel"
              onBack={() => router.back()}
              arrowIcon={arrowRightIcon}
              backText="MarketPlace"
            />
          </div>

          <div className="bg-white rounded-lg p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Submit Your Preference
              </h1>
              <p className="text-gray-600">
                Let us help you find the perfect property
              </p>
            </div>

            {/* Preference Type Selector */}
            {renderPreferenceTypeSelector()}

            {/* Step Progress */}
            <div className="mb-6">
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

            {/* Form Content */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPreferenceType}-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {getStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
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
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                />
                <Button
                  value={currentStep === steps.length - 1 ? "Submit" : "Next"}
                  type={currentStep === steps.length - 1 ? "submit" : "button"}
                  onClick={
                    currentStep === steps.length - 1
                      ? undefined
                      : () => setCurrentStep((prev) => prev + 1)
                  }
                  isDisabled={areInputsDisabled}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    areInputsDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#8DDB90] text-white hover:bg-[#7BC97F]"
                  }`}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Success Modal */}
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
        className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center mx-4"
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
