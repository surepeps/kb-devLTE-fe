"use client";
import React, { Fragment, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import data from "@/data/state-lga";
import { toast } from "react-hot-toast";
import useClickOutside from "@/hooks/clickOutside";
import { useLoading } from "@/hooks/useLoading";
import Loading from "@/components/loading-component/loading";

interface Option {
  value: string;
  label: string;
}

type PreferenceType = "buyer" | "tenant" | "developer" | "shortlet";

// Custom Button Component
const CustomButton = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) => {
  const baseStyles =
    "font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
    ghost:
      "bg-transparent hover:bg-gray-50 text-gray-600 border border-gray-300 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

// Custom Input Component
const CustomInput = ({
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
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
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
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Custom Select Component with Tag Support
const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  isMulti = false,
  required = false,
  disabled = false,
  className = "",
}: {
  label: string;
  options: Option[];
  value: Option | Option[] | null;
  onChange: (selected: Option | Option[] | null) => void;
  placeholder?: string;
  isMulti?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useClickOutside(selectRef, () => setIsOpen(false));

  const handleOptionClick = (option: Option) => {
    if (isMulti) {
      const currentValue = (value as Option[]) || [];
      const isSelected = currentValue.some(
        (item) => item.value === option.value,
      );

      if (isSelected) {
        const newValue = currentValue.filter(
          (item) => item.value !== option.value,
        );
        onChange(newValue.length > 0 ? newValue : null);
      } else {
        onChange([...currentValue, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const removeTag = (optionToRemove: Option) => {
    if (isMulti) {
      const currentValue = (value as Option[]) || [];
      const newValue = currentValue.filter(
        (item) => item.value !== optionToRemove.value,
      );
      onChange(newValue.length > 0 ? newValue : null);
    }
  };

  const displayValue = () => {
    if (isMulti) {
      const multiValue = (value as Option[]) || [];
      return multiValue.length > 0
        ? `${multiValue.length} selected`
        : placeholder;
    } else {
      return (value as Option)?.label || placeholder;
    }
  };

  const isOptionSelected = (option: Option) => {
    if (isMulti) {
      const multiValue = (value as Option[]) || [];
      return multiValue.some((item) => item.value === option.value);
    } else {
      return (value as Option)?.value === option.value;
    }
  };

  return (
    <div className={`space-y-2 ${className}`} ref={selectRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Selected Tags for Multi-select */}
      {isMulti && value && (value as Option[]).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {(value as Option[]).map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-emerald-100 text-emerald-800 border border-emerald-200"
            >
              {option.label}
              <button
                type="button"
                onClick={() => removeTag(option)}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Select Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-4 py-3 text-left border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500 flex items-center justify-between"
        >
          <span className="truncate">{displayValue()}</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl max-h-60 overflow-y-auto"
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      isOptionSelected(option)
                        ? "bg-emerald-50 text-emerald-700"
                        : ""
                    }`}
                  >
                    <span>{option.label}</span>
                    {isOptionSelected(option) && (
                      <svg
                        className="w-5 h-5 text-emerald-500"
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
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Custom Radio Group Component
const CustomRadioGroup = ({
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
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`space-y-2 ${layout === "horizontal" ? "sm:flex sm:space-y-0 sm:space-x-4" : ""}`}
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 cursor-pointer group"
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
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  value === option
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 group-hover:border-emerald-300"
                }`}
              >
                {value === option && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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

// Custom Checkbox Group Component
const CustomCheckboxGroup = ({
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={(e) => handleChange(option, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all ${
                  value.includes(option)
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 group-hover:border-emerald-300"
                }`}
              >
                {value.includes(option) && (
                  <svg
                    className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Section Container Component
const SectionContainer = ({
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
      className={`bg-gray-50 rounded-2xl p-6 space-y-6 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

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

  // Handle LGA change
  const handleLGAChange = useCallback(
    (selectedOptions: Option[] | null) => {
      const options = selectedOptions || [];
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
    (lga: string, selectedOptions: Option[] | null) => {
      const options = selectedOptions || [];
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

  // Get initial values
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

  // Validation schema
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
    enableReinitialize: false,
    validateOnBlur: true,
    validateOnChange: false,
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

  // Preference type options
  const preferenceTypeOptions = [
    {
      key: "buyer",
      label: "Buy Property",
      shortLabel: "Buy",
      icon: "🏠",
      description: "Find properties to purchase",
    },
    {
      key: "tenant",
      label: "Rent Property",
      shortLabel: "Rent",
      icon: "🏡",
      description: "Find rental properties",
    },
    {
      key: "developer",
      label: "Joint Venture",
      shortLabel: "JV",
      icon: "🏗",
      description: "Partner for development",
    },
    {
      key: "shortlet",
      label: "Shortlet",
      shortLabel: "Shortlet",
      icon: "🏘",
      description: "Book short-term stays",
    },
  ];

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

  // Steps
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

  // Render preference type selector
  const renderPreferenceTypeSelector = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Choose Your Preference
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {preferenceTypeOptions.map((item) => (
          <motion.button
            key={item.key}
            type="button"
            onClick={() =>
              handlePreferenceTypeChange(item.key as PreferenceType)
            }
            className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              item.key === currentPreferenceType
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-medium text-gray-900 mb-1">
              <span className="block sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:block">{item.label}</span>
            </h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Render location fields
  const renderLocationFields = () => (
    <SectionContainer
      title="Preferred Location"
      icon={
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomSelect
            label="State"
            options={stateOptions}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select State"
            required
            disabled={areInputsDisabled}
          />

          <CustomSelect
            label="Local Government Areas"
            options={lgaOptions}
            value={selectedLGAs}
            onChange={handleLGAChange}
            placeholder="Select LGAs"
            isMulti
            required
            disabled={areInputsDisabled || !selectedState}
          />
        </div>

        {/* Dynamic Area Selection with Responsive Grid */}
        {selectedLGAs.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              Preferred Areas
            </h4>
            <div
              className={`grid gap-4 ${
                selectedLGAs.length === 1
                  ? "grid-cols-1"
                  : selectedLGAs.length === 2
                    ? "grid-cols-1 lg:grid-cols-2"
                    : selectedLGAs.length === 3
                      ? "grid-cols-1 lg:grid-cols-3"
                      : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {selectedLGAs.map((lga) => (
                <motion.div
                  key={lga.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                >
                  <CustomSelect
                    label={`Areas in ${lga.label}`}
                    options={getAreaOptions(lga.value)}
                    value={selectedAreas[lga.value] || []}
                    onChange={(selectedOptions) =>
                      handleAreaChange(lga.value, selectedOptions as Option[])
                    }
                    placeholder={`Select areas`}
                    isMulti
                    disabled={areInputsDisabled}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentPreferenceType === "buyer" && (
          <CustomInput
            label="Nearby Landmark"
            name="nearbyLandmark"
            value={formik.values.nearbyLandmark || ""}
            onChange={formik.handleChange}
            placeholder="Enter nearby landmark (optional)"
            disabled={areInputsDisabled}
          />
        )}
      </div>
    </SectionContainer>
  );

  // Render buyer step 1
  const renderBuyerStep1 = () => (
    <div className="space-y-8">
      {renderLocationFields()}

      <SectionContainer
        title="Budget Range"
        icon={
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomInput
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
          />
          <CustomInput
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
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Property Details"
        icon={
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Land", "Residential", "Commercial"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />

            <CustomRadioGroup
              label="Building Type"
              name="buildingType"
              options={["Detached", "Semi-Detached", "Block of Flats"]}
              value={formik.values.buildingType}
              onChange={(value) => formik.setFieldValue("buildingType", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomSelect
              label="Minimum Bedrooms"
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
              placeholder="Select bedrooms"
              required
              disabled={areInputsDisabled}
            />

            <CustomInput
              label="Minimum Bathrooms"
              name="minBathrooms"
              type="number"
              value={formik.values.minBathrooms}
              onChange={formik.handleChange}
              placeholder="Enter bathrooms"
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
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

            <CustomRadioGroup
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
      </SectionContainer>

      <SectionContainer
        title="Features"
        icon={
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <CustomCheckboxGroup
            label="Base Features"
            options={featuresData.buyer.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <CustomCheckboxGroup
            label="Premium Features (Optional)"
            options={featuresData.buyer.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Additional Information"
        icon={
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
      >
        <CustomInput
          label="Notes or Custom Requirements"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Enter any additional requirements or notes..."
          disabled={areInputsDisabled}
        />
      </SectionContainer>
    </div>
  );

  // Render tenant step 1
  const renderTenantStep1 = () => (
    <div className="space-y-8">
      {renderLocationFields()}

      <SectionContainer
        title="Rent Budget"
        icon={
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomInput
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
          />
          <CustomInput
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
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Property Details"
        icon={
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Self-con", "Flat", "Mini Flat", "Bungalow"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />

            <CustomSelect
              label="Minimum Bedrooms"
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
              placeholder="Select bedrooms"
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
              label="Lease Term"
              name="leaseTerm"
              options={["6 Months", "1 Year"]}
              value={formik.values.leaseTerm}
              onChange={(value) => formik.setFieldValue("leaseTerm", value)}
              required
              disabled={areInputsDisabled}
            />

            <CustomRadioGroup
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

          <CustomRadioGroup
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
      </SectionContainer>

      <SectionContainer
        title="Features"
        icon={
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <CustomCheckboxGroup
            label="Base Features"
            options={featuresData.tenant.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <CustomCheckboxGroup
            label="Premium Features (Optional)"
            options={featuresData.tenant.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Additional Information"
        icon={
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
      >
        <CustomInput
          label="Notes"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Notes (e.g., Must allow pets)"
          disabled={areInputsDisabled}
        />
      </SectionContainer>
    </div>
  );

  // Render developer step 1
  const renderDeveloperStep1 = () => (
    <div className="space-y-8">
      {renderLocationFields()}

      <SectionContainer
        title="Development Requirements"
        icon={
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomInput
            label="Minimum Land Size (sqm or plots)"
            name="minLandSize"
            value={formik.values.minLandSize}
            onChange={formik.handleChange}
            placeholder="Enter land size"
            required
            disabled={areInputsDisabled}
          />
          <CustomInput
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
      </SectionContainer>

      <SectionContainer
        title="Property Details"
        icon={
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
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17h4v-2a3 3 0 00-3-3H4a3 3 0 00-3 3v2h3z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
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

            <CustomRadioGroup
              label="Property Type"
              name="propertyType"
              options={["Land", "Old Building", "Structure to demolish"]}
              value={formik.values.propertyType}
              onChange={(value) => formik.setFieldValue("propertyType", value)}
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomRadioGroup
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

            <CustomRadioGroup
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
      </SectionContainer>

      <SectionContainer
        title="Features"
        icon={
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <CustomCheckboxGroup
            label="Base Features (Must-Have)"
            options={featuresData.developer.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <CustomCheckboxGroup
            label="Premium Features (Optional)"
            options={featuresData.developer.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Additional Information"
        icon={
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
      >
        <CustomInput
          label="Partner Expectations, Restrictions, etc."
          name="partnerExpectations"
          type="textarea"
          value={formik.values.partnerExpectations || ""}
          onChange={formik.handleChange}
          placeholder="Partner expectations, restrictions, upload past projects (optional)"
          disabled={areInputsDisabled}
        />
      </SectionContainer>
    </div>
  );

  // Render shortlet step 1
  const renderShortletStep1 = () => (
    <div className="space-y-8">
      {renderLocationFields()}

      <SectionContainer
        title="Budget Per Night"
        icon={
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomInput
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
          />
          <CustomInput
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
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Booking Details"
        icon={
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <CustomRadioGroup
            label="Property Type"
            name="propertyType"
            options={["Studio", "1-Bed Apartment", "2-Bed Flat"]}
            value={formik.values.propertyType}
            onChange={(value) => formik.setFieldValue("propertyType", value)}
            required
            disabled={areInputsDisabled}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomSelect
              label="Minimum Bedrooms"
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
              placeholder="Select bedrooms"
              required
              disabled={areInputsDisabled}
            />

            <CustomInput
              label="Number of Guests"
              name="numberOfGuests"
              type="number"
              value={formik.values.numberOfGuests}
              onChange={formik.handleChange}
              placeholder="Number of guests"
              required
              disabled={areInputsDisabled}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomInput
              label="Check-in Date"
              name="checkInDate"
              type="date"
              value={formik.values.checkInDate}
              onChange={formik.handleChange}
              required
              disabled={areInputsDisabled}
            />

            <CustomInput
              label="Check-out Date"
              name="checkOutDate"
              type="date"
              value={formik.values.checkOutDate}
              onChange={formik.handleChange}
              required
              disabled={areInputsDisabled}
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Features"
        icon={
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      >
        <div className="space-y-6">
          <CustomCheckboxGroup
            label="Base Features"
            options={featuresData.shortlet.base}
            value={formik.values.baseFeatures || []}
            onChange={(value) => formik.setFieldValue("baseFeatures", value)}
          />

          <CustomCheckboxGroup
            label="Premium Features (Optional)"
            options={featuresData.shortlet.premium}
            value={formik.values.premiumFeatures || []}
            onChange={(value) => formik.setFieldValue("premiumFeatures", value)}
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Additional Information"
        icon={
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
      >
        <CustomInput
          label="Preferences & Notes"
          name="additionalNotes"
          type="textarea"
          value={formik.values.additionalNotes || ""}
          onChange={formik.handleChange}
          placeholder="Preferences (e.g., No Smoking, Must allow pets), Notes (e.g., Anniversary getaway)"
          disabled={areInputsDisabled}
        />
      </SectionContainer>
    </div>
  );

  // Render contact step
  const renderContactStep = () => (
    <div className="space-y-8">
      <SectionContainer
        title="Contact Information"
        icon={
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      >
        {currentPreferenceType === "developer" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomInput
                label="Company / Developer Name"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                placeholder="Enter company name"
                required
                disabled={areInputsDisabled}
              />
              <CustomInput
                label="Contact Person"
                name="contactPerson"
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                placeholder="Enter contact person"
                required
                disabled={areInputsDisabled}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
                  className="custom-phone-input"
                />
              </div>

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
                required
                disabled={areInputsDisabled}
              />
            </div>

            <CustomInput
              label="CAC Registration Number"
              name="cacRegistrationNumber"
              value={formik.values.cacRegistrationNumber}
              onChange={formik.handleChange}
              placeholder="Enter CAC number (optional)"
              disabled={areInputsDisabled}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <CustomInput
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              placeholder="Enter your full name"
              required
              disabled={areInputsDisabled}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
                  className="custom-phone-input"
                />
              </div>

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Enter email"
                required
                disabled={areInputsDisabled}
              />
            </div>
          </div>
        )}
      </SectionContainer>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-6"
            >
              ← Back to Marketplace
            </CustomButton>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Submit Your Preference
              </h1>
              <p className="text-lg text-gray-600">
                Tell us what you're looking for and we'll help you find it
              </p>
            </div>
          </div>

          {/* Preference Type Selector */}
          {renderPreferenceTypeSelector()}

          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        step.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : step.status === "active"
                            ? "bg-emerald-500 text-white"
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
                        className={`text-lg font-semibold ${
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
                    <div className="w-20 h-0.5 bg-gray-300 mx-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit}>
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
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <CustomButton
                variant="ghost"
                onClick={() => {
                  if (currentStep === 0) {
                    router.back();
                  } else {
                    setCurrentStep((prev) => Math.max(prev - 1, 0));
                  }
                }}
                className="min-w-[120px]"
              >
                {currentStep === 0 ? "Cancel" : "← Back"}
              </CustomButton>

              <CustomButton
                variant="primary"
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={
                  currentStep === steps.length - 1
                    ? undefined
                    : () => setCurrentStep((prev) => prev + 1)
                }
                disabled={areInputsDisabled}
                className="min-w-[120px]"
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next →"}
              </CustomButton>
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
        .custom-phone-input input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .custom-phone-input input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </Fragment>
  );
};

// Success Modal Component
interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        ref={ref}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-emerald-500"
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

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Successfully Submitted!
        </h2>

        <p className="text-gray-600 mb-8">
          We've received your preference and will reach out to you with matching
          properties soon.
        </p>

        <CustomButton variant="primary" onClick={onClose} className="w-full">
          Back to Home
        </CustomButton>
      </motion.div>
    </div>
  );
};

export default NewPreference;
