"use client";
import React, { Fragment, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select, { MultiValue, SingleValue } from "react-select";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import data from "@/data/state-lga";
import { toast } from "react-hot-toast";
import useClickOutside from "@/hooks/clickOutside";
import { useLoading } from "@/hooks/useLoading";
import Loading from "@/components/loading-component/loading";

// Types
interface Option {
  value: string;
  label: string;
}

type PreferenceType = "buy" | "rent" | "joint-venture" | "shortlet";
type PreferenceMode = "buy" | "tenant" | "developer" | "shortlet";

interface PreferenceConfig {
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  preferenceType: PreferenceType;
  preferenceMode: PreferenceMode;
}

// Preference configurations with payload mapping
const PREFERENCE_CONFIGS: Record<string, PreferenceConfig> = {
  buy: {
    label: "Buy a Property",
    shortLabel: "Buy",
    icon: "🏠",
    description: "Find properties to purchase",
    preferenceType: "buy",
    preferenceMode: "buy",
  },
  rent: {
    label: "Rent Property",
    shortLabel: "Rent",
    icon: "🏡",
    description: "Find rental properties",
    preferenceType: "rent",
    preferenceMode: "tenant",
  },
  jointVenture: {
    label: "Joint Venture",
    shortLabel: "JV",
    icon: "🏗",
    description: "Partner for development",
    preferenceType: "joint-venture",
    preferenceMode: "developer",
  },
  shortlet: {
    label: "Shortlet Guest Stay",
    shortLabel: "Shortlet",
    icon: "🏘",
    description: "Book short-term stays",
    preferenceType: "shortlet",
    preferenceMode: "shortlet",
  },
};

// Features data
const FEATURES_DATA = {
  buy: {
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
  rent: {
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
  jointVenture: {
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

// Custom searchable select styles with reduced curves
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "48px",
    border: state.isFocused ? "2px solid #059669" : "1px solid #E5E7EB",
    borderRadius: "8px", // Reduced from 16px
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#059669",
    },
    transition: "all 0.2s ease",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "8px 12px",
    fontSize: "15px",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#9CA3AF",
    fontSize: "15px",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#D1FAE5",
    borderRadius: "6px", // Reduced from 8px
    border: "1px solid #10B981",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#047857",
    fontSize: "13px",
    fontWeight: "500",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#047857",
    "&:hover": {
      backgroundColor: "#10B981",
      color: "white",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#10B981"
      : state.isFocused
        ? "#F3F4F6"
        : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "10px 12px",
    fontSize: "15px",
    "&:hover": {
      backgroundColor: state.isSelected ? "#10B981" : "#F3F4F6",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "8px", // Reduced from 16px
    border: "1px solid #E5E7EB",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    zIndex: 50,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: "4px",
    borderRadius: "8px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#6B7280",
    "&:hover": {
      color: "#059669",
    },
  }),
};

// Modern Input Component with reduced curves
const ModernInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  rows = 4,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 resize-none placeholder-gray-400"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 placeholder-gray-400"
        />
      )}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};

// Modern Button Component with reduced curves
const ModernButton = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  fullWidth = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  fullWidth?: boolean;
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 disabled:bg-gray-300",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
    ghost:
      "bg-transparent hover:bg-gray-50 text-gray-600 border border-gray-300 hover:border-gray-400 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

// Modern Checkbox Group
const ModernCheckboxGroup = ({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}) => {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...value, option]);
    } else {
      onChange(value.filter((item) => item !== option));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-start space-x-2.5 cursor-pointer group p-2.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={(e) => handleChange(option, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 transition-all ${
                  value.includes(option)
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 group-hover:border-emerald-300"
                }`}
              >
                {value.includes(option) && (
                  <svg
                    className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Modern Radio Group
const ModernRadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  layout = "vertical",
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  layout?: "vertical" | "horizontal";
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`space-y-2 ${layout === "horizontal" ? "sm:flex sm:space-y-0 sm:space-x-4" : ""}`}
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  value === option
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 group-hover:border-emerald-300"
                }`}
              >
                {value === option && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Section Card Component with mobile-adaptive design
const SectionCard = ({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100 ${className}`}
    >
      {/* Desktop title design */}
      <div className="hidden sm:flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600 text-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      {/* Mobile title design - more compact */}
      <div className="flex sm:hidden items-center space-x-2.5 pb-2 border-b border-gray-100">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 text-base">
          {icon}
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>

      {children}
    </motion.div>
  );
};

const NewPreference = () => {
  const isLoading = useLoading();
  const router = useRouter();
  const [currentPreferenceKey, setCurrentPreferenceKey] =
    useState<string>("buy");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGAs, setSelectedLGAs] = useState<Option[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<{
    [lga: string]: Option[];
  }>({});
  const [showFinalSubmit, setShowFinalSubmit] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState<boolean>(false);

  // Get current preference config
  const currentPreference = PREFERENCE_CONFIGS[currentPreferenceKey];

  // Memoized options
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
      "Magodo",
      "Ojodu",
      "Berger",
      "Ketu",
      "Mile 12",
      "Festac",
      "Satellite Town",
    ];
    return sampleAreas.map((area) => ({
      value: `${area} - ${lga}`,
      label: `${area} - ${lga}`,
    }));
  }, []);

  // Handle state change
  const handleStateChange = useCallback((selected: SingleValue<Option>) => {
    setSelectedState(selected);
    setSelectedLGAs([]);
    setSelectedAreas({});
    formik.setFieldValue("state", selected?.value || "");
    formik.setFieldValue("localGovernmentAreas", []);
    formik.setFieldValue("selectedAreas", {});
  }, []);

  // Handle LGA change
  const handleLGAChange = useCallback(
    (selectedOptions: MultiValue<Option>) => {
      const options = Array.from(selectedOptions);
      setSelectedLGAs(options);
      formik.setFieldValue(
        "localGovernmentAreas",
        options.map((option) => option.value),
      );

      // Reset areas for deselected LGAs
      const newSelectedAreas = { ...selectedAreas };
      const selectedLGAValues = options.map((option) => option.value);

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

  // Handle area change
  const handleAreaChange = useCallback(
    (lga: string, selectedOptions: MultiValue<Option>) => {
      const options = Array.from(selectedOptions);
      const newSelectedAreas = {
        ...selectedAreas,
        [lga]: options,
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

  // Get initial values
  const getInitialValues = useCallback((preferenceKey: string) => {
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

    switch (preferenceKey) {
      case "buy":
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
      case "rent":
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
      case "jointVenture":
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
      default:
        return baseValues;
    }
  }, []);

  // Validation schema
  const getValidationSchema = (preferenceKey: string, step: number) => {
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
      switch (preferenceKey) {
        case "buy":
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
        case "rent":
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
        case "jointVenture":
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
      if (preferenceKey === "jointVenture") {
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
    initialValues: getInitialValues(currentPreferenceKey),
    validationSchema: getValidationSchema(currentPreferenceKey, currentStep),
    enableReinitialize: false,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setAreInputsDisabled(true);

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/buyers/submit-preference`;

        // Create payload with proper preferenceType and preferenceMode
        const transformedData = {
          preferenceType: currentPreference.preferenceType,
          preferenceMode: currentPreference.preferenceMode,
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
    (preferenceKey: string) => {
      setCurrentPreferenceKey(preferenceKey);
      setCurrentStep(0);
      setSelectedState(null);
      setSelectedLGAs([]);
      setSelectedAreas({});
      formik.resetForm();
      formik.setValues(getInitialValues(preferenceKey));
    },
    [getInitialValues],
  );

  // Format number with commas
  const formatNumberWithCommas = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // Bedroom options
  const bedroomOptions = [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5", label: "5 Bedrooms" },
    { value: "6", label: "6 Bedrooms" },
    { value: "7", label: "7 Bedrooms" },
    { value: "8", label: "8 Bedrooms" },
    { value: "9", label: "9 Bedrooms" },
    { value: "10", label: "10 Bedrooms" },
    { value: "More", label: "More than 10" },
  ];

  // Steps
  const steps = [
    {
      label:
        currentPreferenceKey === "buy"
          ? "Property Requirements"
          : currentPreferenceKey === "rent"
            ? "Rental Requirements"
            : currentPreferenceKey === "jointVenture"
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

  // Render preference type selector
  const renderPreferenceTypeSelector = () => (
    <div className="mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Choose Your Preference
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Select the type of property transaction you're interested in
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(PREFERENCE_CONFIGS).map(([key, config]) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => handlePreferenceTypeChange(key)}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              key === currentPreferenceKey
                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              {config.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
              <span className="block sm:hidden">{config.shortLabel}</span>
              <span className="hidden sm:block">{config.label}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {config.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Render location fields
  const renderLocationFields = () => (
    <SectionCard title="Preferred Location" icon="📍">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              State <span className="text-red-500">*</span>
            </label>
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              placeholder="Search and select state..."
              isDisabled={areInputsDisabled}
              styles={customSelectStyles}
              isSearchable
              isClearable
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Local Government Areas <span className="text-red-500">*</span>
            </label>
            <Select
              options={lgaOptions}
              value={selectedLGAs}
              onChange={handleLGAChange}
              placeholder="Search and select LGAs..."
              isMulti
              isDisabled={areInputsDisabled || !selectedState}
              styles={customSelectStyles}
              isSearchable
              isClearable
            />
          </div>
        </div>

        {/* Dynamic Area Selection with Responsive Grid */}
        {selectedLGAs.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              Preferred Areas
            </h4>
            <div
              className={`grid gap-3 sm:gap-4 ${
                selectedLGAs.length === 1
                  ? "grid-cols-1"
                  : selectedLGAs.length === 2
                    ? "grid-cols-1 lg:grid-cols-2"
                    : selectedLGAs.length === 3
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {selectedLGAs.map((lga) => (
                <motion.div
                  key={lga.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Areas in{" "}
                      <span className="text-emerald-600">{lga.label}</span>
                    </label>
                    <Select
                      options={getAreaOptions(lga.value)}
                      value={selectedAreas[lga.value] || []}
                      onChange={(selectedOptions) =>
                        handleAreaChange(lga.value, selectedOptions)
                      }
                      placeholder="Search areas..."
                      isMulti
                      isDisabled={areInputsDisabled}
                      styles={customSelectStyles}
                      isSearchable
                      isClearable
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentPreferenceKey === "buy" && (
          <ModernInput
            label="Nearby Landmark"
            name="nearbyLandmark"
            value={formik.values.nearbyLandmark || ""}
            onChange={formik.handleChange}
            placeholder="Enter nearby landmark (optional)"
            disabled={areInputsDisabled}
          />
        )}
      </div>
    </SectionCard>
  );

  // Render buy form
  const renderBuyStep1 = () => (
    <div className="space-y-6 sm:space-y-8">
      {renderLocationFields()}

      <SectionCard title="Budget Range" icon="💰">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ModernInput
            label="Minimum Price (₦)"
            name="minPrice"
            value={formik.values.minPrice}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minPrice",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter minimum price"
            required
            disabled={areInputsDisabled}
            error={formik.touched.minPrice ? formik.errors.minPrice : undefined}
          />
          <ModernInput
            label="Maximum Price (₦)"
            name="maxPrice"
            value={formik.values.maxPrice}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxPrice",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter maximum price"
            required
            disabled={areInputsDisabled}
            error={formik.touched.maxPrice ? formik.errors.maxPrice : undefined}
          />
        </div>
      </SectionCard>

      <SectionCard title="Property Details" icon="🏠">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Land", "Residential", "Commercial"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />

            <ModernRadioGroup
              label="Building Type"
              name="buildingType"
              options={["Detached", "Semi-Detached", "Block of Flats"]}
              value={formik.values.buildingType}
              onChange={(value) => formik.setFieldValue("buildingType", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Minimum Bedrooms <span className="text-red-500">*</span>
              </label>
              <Select
                options={bedroomOptions}
                value={
                  bedroomOptions.find(
                    (option) => option.value === formik.values.minBedrooms,
                  ) || null
                }
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "minBedrooms",
                    (selectedOption as Option)?.value || "",
                  );
                }}
                placeholder="Select bedrooms..."
                isDisabled={areInputsDisabled}
                styles={customSelectStyles}
                isSearchable
              />
            </div>

            <ModernInput
              label="Minimum Bathrooms"
              name="minBathrooms"
              type="number"
              value={formik.values.minBathrooms}
              onChange={formik.handleChange}
              placeholder="Enter bathrooms"
              required
              disabled={areInputsDisabled}
              error={
                formik.touched.minBathrooms
                  ? formik.errors.minBathrooms
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Property Condition"
              name="propertyCondition"
              options={["New", "Renovated", "Any"]}
              value={formik.values.propertyCondition}
              onChange={(value) =>
                formik.setFieldValue("propertyCondition", value)
              }
              required
              disabled={areInputsDisabled}
            />

            <ModernRadioGroup
              label="Purpose"
              name="purpose"
              options={["For living", "Resale", "Development"]}
              value={formik.values.purpose}
              onChange={(value) => formik.setFieldValue("purpose", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Features" icon="✨">
        <div className="space-y-4 sm:space-y-6">
          <ModernCheckboxGroup
            label="Base Features"
            options={FEATURES_DATA.buy.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <ModernCheckboxGroup
            label="Premium Features (Optional)"
            options={FEATURES_DATA.buy.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Additional Information" icon="📝">
        <ModernInput
          label="Notes or Custom Requirements"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Enter any additional requirements or notes..."
          disabled={areInputsDisabled}
        />
      </SectionCard>
    </div>
  );

  // Render rent form (similar structure with reduced spacing)
  const renderRentStep1 = () => (
    <div className="space-y-6 sm:space-y-8">
      {renderLocationFields()}

      <SectionCard title="Rent Budget" icon="💰">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ModernInput
            label="Minimum Monthly Rent (₦)"
            name="minMonthlyRent"
            value={formik.values.minMonthlyRent}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minMonthlyRent",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter minimum rent"
            required
            disabled={areInputsDisabled}
            error={
              formik.touched.minMonthlyRent
                ? formik.errors.minMonthlyRent
                : undefined
            }
          />
          <ModernInput
            label="Maximum Monthly Rent (₦)"
            name="maxMonthlyRent"
            value={formik.values.maxMonthlyRent}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxMonthlyRent",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter maximum rent"
            required
            disabled={areInputsDisabled}
            error={
              formik.touched.maxMonthlyRent
                ? formik.errors.maxMonthlyRent
                : undefined
            }
          />
        </div>
      </SectionCard>

      <SectionCard title="Property Details" icon="🏡">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Self-con", "Flat", "Mini Flat", "Bungalow"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Minimum Bedrooms <span className="text-red-500">*</span>
              </label>
              <Select
                options={bedroomOptions}
                value={
                  bedroomOptions.find(
                    (option) => option.value === formik.values.minBedrooms,
                  ) || null
                }
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "minBedrooms",
                    (selectedOption as Option)?.value || "",
                  );
                }}
                placeholder="Select bedrooms..."
                isDisabled={areInputsDisabled}
                styles={customSelectStyles}
                isSearchable
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Lease Term"
              name="leaseTerm"
              options={["6 Months", "1 Year"]}
              value={formik.values.leaseTerm}
              onChange={(value) => formik.setFieldValue("leaseTerm", value)}
              required
              disabled={areInputsDisabled}
            />

            <ModernRadioGroup
              label="Property Condition"
              name="propertyCondition"
              options={["New", "Renovated"]}
              value={formik.values.propertyCondition}
              onChange={(value) =>
                formik.setFieldValue("propertyCondition", value)
              }
              required
              disabled={areInputsDisabled}
            />
          </div>

          <ModernRadioGroup
            label="Purpose"
            name="purpose"
            options={["Residential", "Office"]}
            value={formik.values.purpose}
            onChange={(value) => formik.setFieldValue("purpose", value)}
            required
            disabled={areInputsDisabled}
            layout="horizontal"
          />
        </div>
      </SectionCard>

      <SectionCard title="Features" icon="✨">
        <div className="space-y-4 sm:space-y-6">
          <ModernCheckboxGroup
            label="Base Features"
            options={FEATURES_DATA.rent.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <ModernCheckboxGroup
            label="Premium Features (Optional)"
            options={FEATURES_DATA.rent.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Additional Information" icon="📝">
        <ModernInput
          label="Notes"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Notes (e.g., Must allow pets)"
          disabled={areInputsDisabled}
        />
      </SectionCard>
    </div>
  );

  // Render joint venture form with complete implementation
  const renderJointVentureStep1 = () => (
    <div className="space-y-6 sm:space-y-8">
      {renderLocationFields()}

      <SectionCard title="Development Requirements" icon="🏗">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ModernInput
            label="Minimum Land Size (sqm or plots)"
            name="minLandSize"
            value={formik.values.minLandSize}
            onChange={formik.handleChange}
            placeholder="Enter land size"
            required
            disabled={areInputsDisabled}
            error={
              formik.touched.minLandSize ? formik.errors.minLandSize : undefined
            }
          />
          <ModernInput
            label="Budget Range / Investment Capacity"
            name="budgetRange"
            value={formik.values.budgetRange}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "budgetRange",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter budget range (optional)"
            disabled={areInputsDisabled}
          />
        </div>
      </SectionCard>

      <SectionCard title="Property Details" icon="🏢">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Preferred JV Type"
              name="jvType"
              options={[
                "Equity Split",
                "Lease-to-Build",
                "Development Partner",
              ]}
              value={formik.values.jvType}
              onChange={(value) => formik.setFieldValue("jvType", value)}
              required
              disabled={areInputsDisabled}
            />

            <ModernRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Land", "Old Building", "Structure to demolish"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernRadioGroup
              label="Expected Structure Type"
              name="expectedStructureType"
              options={["Mini Flats", "Luxury Duplexes"]}
              value={formik.values.expectedStructureType}
              onChange={(value) =>
                formik.setFieldValue("expectedStructureType", value)
              }
              required
              disabled={areInputsDisabled}
            />

            <ModernRadioGroup
              label="Timeline"
              name="timeline"
              options={["Ready Now", "In 3 Months", "Within 1 Year"]}
              value={formik.values.timeline}
              onChange={(value) => formik.setFieldValue("timeline", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Features" icon="✨">
        <div className="space-y-4 sm:space-y-6">
          <ModernCheckboxGroup
            label="Base Features (Must-Have)"
            options={FEATURES_DATA.jointVenture.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <ModernCheckboxGroup
            label="Premium Features (Optional)"
            options={FEATURES_DATA.jointVenture.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Additional Information" icon="📝">
        <ModernInput
          label="Partner Expectations, Restrictions, etc."
          name="partnerExpectations"
          type="textarea"
          value={formik.values.partnerExpectations || ""}
          onChange={formik.handleChange}
          placeholder="Partner expectations, restrictions, upload past projects (optional)"
          disabled={areInputsDisabled}
        />
      </SectionCard>
    </div>
  );

  // Render shortlet form with complete implementation
  const renderShortletStep1 = () => (
    <div className="space-y-6 sm:space-y-8">
      {renderLocationFields()}

      <SectionCard title="Budget Per Night" icon="💰">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ModernInput
            label="Minimum Price (₦)"
            name="minPricePerNight"
            value={formik.values.minPricePerNight}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "minPricePerNight",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter minimum price"
            required
            disabled={areInputsDisabled}
            error={
              formik.touched.minPricePerNight
                ? formik.errors.minPricePerNight
                : undefined
            }
          />
          <ModernInput
            label="Maximum Price (₦)"
            name="maxPricePerNight"
            value={formik.values.maxPricePerNight}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              formik.setFieldValue(
                "maxPricePerNight",
                formatNumberWithCommas(rawValue),
              );
            }}
            placeholder="Enter maximum price"
            required
            disabled={areInputsDisabled}
            error={
              formik.touched.maxPricePerNight
                ? formik.errors.maxPricePerNight
                : undefined
            }
          />
        </div>
      </SectionCard>

      <SectionCard title="Booking Details" icon="📅">
        <div className="space-y-4 sm:space-y-6">
          <ModernRadioGroup
            label="Property Type"
            name="propertyType"
            options={["Studio", "1-Bed Apartment", "2-Bed Flat"]}
            value={formik.values.propertyType}
            onChange={(value) => formik.setFieldValue("propertyType", value)}
            required
            disabled={areInputsDisabled}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Minimum Bedrooms <span className="text-red-500">*</span>
              </label>
              <Select
                options={bedroomOptions}
                value={
                  bedroomOptions.find(
                    (option) => option.value === formik.values.minBedrooms,
                  ) || null
                }
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "minBedrooms",
                    (selectedOption as Option)?.value || "",
                  );
                }}
                placeholder="Select bedrooms..."
                isDisabled={areInputsDisabled}
                styles={customSelectStyles}
                isSearchable
              />
            </div>

            <ModernInput
              label="Number of Guests"
              name="numberOfGuests"
              type="number"
              value={formik.values.numberOfGuests}
              onChange={formik.handleChange}
              placeholder="Number of guests"
              required
              disabled={areInputsDisabled}
              error={
                formik.touched.numberOfGuests
                  ? formik.errors.numberOfGuests
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ModernInput
              label="Check-in Date"
              name="checkInDate"
              type="date"
              value={formik.values.checkInDate}
              onChange={formik.handleChange}
              required
              disabled={areInputsDisabled}
              error={
                formik.touched.checkInDate
                  ? formik.errors.checkInDate
                  : undefined
              }
            />

            <ModernInput
              label="Check-out Date"
              name="checkOutDate"
              type="date"
              value={formik.values.checkOutDate}
              onChange={formik.handleChange}
              required
              disabled={areInputsDisabled}
              error={
                formik.touched.checkOutDate
                  ? formik.errors.checkOutDate
                  : undefined
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Features" icon="✨">
        <div className="space-y-4 sm:space-y-6">
          <ModernCheckboxGroup
            label="Base Features"
            options={FEATURES_DATA.shortlet.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <ModernCheckboxGroup
            label="Premium Features (Optional)"
            options={FEATURES_DATA.shortlet.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Additional Information" icon="📝">
        <ModernInput
          label="Preferences & Notes"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Preferences (e.g., No Smoking, Must allow pets), Notes (e.g., Anniversary getaway)"
          disabled={areInputsDisabled}
        />
      </SectionCard>
    </div>
  );

  // Render contact step
  const renderContactStep = () => (
    <div className="space-y-6 sm:space-y-8">
      <SectionCard title="Contact Information" icon="👤">
        {currentPreferenceKey === "jointVenture" ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ModernInput
                label="Company / Developer Name"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                placeholder="Enter company name"
                required
                disabled={areInputsDisabled}
                error={
                  formik.touched.companyName
                    ? formik.errors.companyName
                    : undefined
                }
              />
              <ModernInput
                label="Contact Person"
                name="contactPerson"
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                placeholder="Enter contact person"
                required
                disabled={areInputsDisabled}
                error={
                  formik.touched.contactPerson
                    ? formik.errors.contactPerson
                    : undefined
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={formik.values.phoneNumber}
                  onChange={(value) =>
                    formik.setFieldValue("phoneNumber", value)
                  }
                  placeholder="Enter phone number"
                  className="modern-phone-input"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-sm text-red-500 font-medium">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>

              <ModernInput
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
                required
                disabled={areInputsDisabled}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </div>

            <ModernInput
              label="CAC Registration Number"
              name="cacRegistrationNumber"
              value={formik.values.cacRegistrationNumber}
              onChange={formik.handleChange}
              placeholder="Enter CAC number (optional)"
              disabled={areInputsDisabled}
            />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <ModernInput
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              placeholder="Enter your full name"
              required
              disabled={areInputsDisabled}
              error={
                formik.touched.fullName ? formik.errors.fullName : undefined
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={formik.values.phoneNumber}
                  onChange={(value) =>
                    formik.setFieldValue("phoneNumber", value)
                  }
                  placeholder="Enter phone number"
                  className="modern-phone-input"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-sm text-red-500 font-medium">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>

              <ModernInput
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
                required
                disabled={areInputsDisabled}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );

  // Get step content
  const getStepContent = () => {
    if (currentStep === 0) {
      switch (currentPreferenceKey) {
        case "buy":
          return renderBuyStep1();
        case "rent":
          return renderRentStep1();
        case "jointVenture":
          return renderJointVentureStep1();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4 sm:mb-6"
            >
              ← Back to Marketplace
            </ModernButton>

            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Submit Your Property Preference
              </h1>
              <p className="text-base sm:text-xl text-gray-600">
                Tell us what you're looking for and we'll help you find the
                perfect match
              </p>
            </div>
          </div>

          {/* Preference Type Selector */}
          {renderPreferenceTypeSelector()}

          {/* Step Progress - Mobile Adaptive */}
          <div className="mb-8 sm:mb-12">
            {/* Desktop Stepper */}
            <div className="hidden sm:flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        step.status === "completed"
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                          : step.status === "active"
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-500">
                        Step {index + 1}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          step.status === "active"
                            ? "text-emerald-600"
                            : "text-gray-700"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-24 h-1 bg-gray-300 mx-8 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Stepper - Compact Design */}
            <div className="flex sm:hidden items-center justify-center">
              <div className="flex items-center space-x-3">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          step.status === "completed"
                            ? "bg-emerald-500 text-white"
                            : step.status === "active"
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-sm font-bold ${
                            step.status === "active"
                              ? "text-emerald-600"
                              : "text-gray-700"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPreferenceKey}-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {getStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-8 sm:mt-12 pt-6 sm:pt-8">
              <ModernButton
                variant="ghost"
                onClick={() => {
                  if (currentStep === 0) {
                    router.back();
                  } else {
                    setCurrentStep((prev) => Math.max(prev - 1, 0));
                  }
                }}
                className="order-2 sm:order-1 sm:min-w-[140px]"
                fullWidth={false}
              >
                {currentStep === 0 ? "Cancel" : "← Previous"}
              </ModernButton>

              <ModernButton
                variant="primary"
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={
                  currentStep === steps.length - 1
                    ? undefined
                    : () => setCurrentStep((prev) => prev + 1)
                }
                disabled={areInputsDisabled}
                className="order-1 sm:order-2 sm:min-w-[140px]"
                fullWidth={false}
              >
                {currentStep === steps.length - 1
                  ? "Submit Preference"
                  : "Next Step →"}
              </ModernButton>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        <SuccessModal
          open={showFinalSubmit}
          onClose={() => {
            setShowFinalSubmit(false);
            setTimeout(() => {
              router.push("/");
            }, 100);
          }}
        />
      </div>

      {/* Custom styles for phone input */}
      <style jsx global>{`
        .modern-phone-input input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background-color: white;
        }
        .modern-phone-input input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
        }
        .modern-phone-input .PhoneInputCountrySelectArrow {
          border-color: #6b7280;
        }
        .modern-phone-input .PhoneInputCountrySelect {
          border-radius: 8px 0 0 8px;
          border-right: 1px solid #e5e7eb;
        }
      `}</style>
    </Fragment>
  );
};

// Success Modal Component with reduced curves
interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <motion.div
        ref={ref}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          Preference Submitted Successfully!
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          We've received your preference and will reach out to you with matching
          properties soon.
        </p>

        <ModernButton variant="primary" onClick={onClose} fullWidth>
          Back to Home
        </ModernButton>
      </motion.div>
    </div>
  );
};

export default NewPreference;
