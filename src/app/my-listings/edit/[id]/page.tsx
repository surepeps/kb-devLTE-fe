/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader, Home } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PUT_REQUEST, GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loading from "@/components/loading-component/loading";

interface Brief {
  _id: string;
  propertyType: string;
  propertyCondition: string;
  briefType: string;
  price: number;
  features: string[];
  tenantCriteria: string[];
  owner: string;
  areYouTheOwner: boolean;
  isAvailable: string;
  pictures: string[];
  isApproved: boolean;
  isRejected: boolean;
  docOnProperty: Array<{
    docName: string;
    isProvided: boolean;
    _id: string;
  }>;
  isPreference: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  landSize: {
    measurementType: string;
    size: number;
  };
  additionalFeatures: {
    additionalFeatures: string[];
    noOfBedroom?: string;
    noOfBathroom?: string;
    noOfToilet?: string;
    noOfCarPark?: string;
  };
}

const validationSchema = Yup.object({
  price: Yup.number()
    .required("Price is required")
    .min(1, "Price must be greater than 0"),
  propertyCondition: Yup.string().required("Property condition is required"),
  isAvailable: Yup.string().required("Availability status is required"),
  location: Yup.object({
    state: Yup.string().required("State is required"),
    localGovernment: Yup.string().required("Local Government is required"),
    area: Yup.string().required("Area is required"),
  }),
  landSize: Yup.object({
    size: Yup.number()
      .required("Land size is required")
      .min(1, "Land size must be greater than 0"),
    measurementType: Yup.string().required("Measurement type is required"),
  }),
  additionalFeatures: Yup.object({
    noOfBedroom: Yup.string(),
    noOfBathroom: Yup.string(),
    noOfToilet: Yup.string(),
    noOfCarPark: Yup.string(),
  }),
});

const EditBriefPage = () => {
  const router = useRouter();
  const params = useParams();
  const briefId = params.id as string;

  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTenantCriteria, setSelectedTenantCriteria] = useState<
    string[]
  >([]);
  const [hasFetched, setHasFetched] = useState(false);

  const availableFeatures = [
    "Air conditioner",
    "POP Ceilings",
    "Built-in cupboards",
    "Staff Room",
    "In-house Cinema",
    "Parking",
    "Gym house",
    "Children Playground",
    "Bath Tub",
    "Walk-in closet",
    "Outdoor Kitchen",
  ];

  const availableTenantCriteria = [
    "No smoking",
    "No pets",
    "Family only",
    "Working professionals",
    "Students welcome",
    "Short term lease",
    "Long term lease",
  ];

  const propertyConditions = [
    "New",
    "Excellent",
    "Good",
    "Fair",
    "Needs renovation",
  ];

  const measurementTypes = [
    "Plot",
    "Acres",
    "Square meters",
    "Square feet",
    "Hectares",
  ];

  useEffect(() => {
    if (briefId && !hasFetched) {
      fetchBrief();
    }
  }, [briefId, hasFetched]);

  const fetchBrief = async () => {
    if (hasFetched || !briefId) return;

    setLoading(true);
    setError(null);
    setHasFetched(true);

    try {
      const response = await GET_REQUEST(
        `${URLS.BASE}/user/briefs/${briefId}`,
        Cookies.get("token"),
      );

      if (response?.success && response?.data) {
        const briefData = response.data;
        setBrief(briefData);
        setSelectedFeatures(briefData.features || []);
        setSelectedTenantCriteria(briefData.tenantCriteria || []);
        setError(null);
      } else {
        const errorMessage =
          response?.message || "Failed to fetch brief details";
        setError(errorMessage);
        console.error("API response error:", response);
      }
    } catch (error) {
      console.error("Error fetching brief:", error);
      setError("An error occurred while fetching brief details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        features: selectedFeatures,
        tenantCriteria: selectedTenantCriteria,
      };

      const response = await PUT_REQUEST(
        `${URLS.BASE}/user/briefs/${briefId}`,
        payload,
        Cookies.get("token"),
      );

      if (response && response.success !== false) {
        toast.success("Brief updated successfully!");
        router.push("/my-listings");
      } else {
        toast.error(response?.message || "Failed to update brief");
      }
    } catch (error) {
      console.error("Error updating brief:", error);
      toast.error("An error occurred while updating the brief");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const toggleTenantCriteria = (criteria: string) => {
    setSelectedTenantCriteria((prev) =>
      prev.includes(criteria)
        ? prev.filter((c) => c !== criteria)
        : [...prev, criteria],
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#09391C] mb-4">
            Unable to Load Brief
          </h2>
          <p className="text-[#5A5D63] mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setHasFetched(false);
                fetchBrief();
              }}
              className="bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/my-listings")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to My Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!brief && !loading) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#09391C] mb-4">
            Brief Not Found
          </h2>
          <p className="text-[#5A5D63] mb-6">
            The requested brief could not be found.
          </p>
          <button
            onClick={() => router.push("/my-listings")}
            className="bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors"
          >
            Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  const initialValues = {
    price: brief.price,
    propertyCondition: brief.propertyCondition,
    isAvailable: brief.isAvailable,
    location: {
      state: brief.location.state,
      localGovernment: brief.location.localGovernment,
      area: brief.location.area,
    },
    landSize: {
      size: brief.landSize.size,
      measurementType: brief.landSize.measurementType,
    },
    additionalFeatures: {
      noOfBedroom: brief.additionalFeatures?.noOfBedroom || "",
      noOfBathroom: brief.additionalFeatures?.noOfBathroom || "",
      noOfToilet: brief.additionalFeatures?.noOfToilet || "",
      noOfCarPark: brief.additionalFeatures?.noOfCarPark || "",
    },
    areYouTheOwner: brief.areYouTheOwner,
  };

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-[#5A5D63] mb-4 flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="hover:text-[#09391C] flex items-center gap-1"
            >
              <Home size={16} />
              Home
            </button>
            <span>���</span>
            <button
              onClick={() => router.push("/my-listings")}
              className="hover:text-[#09391C]"
            >
              My Listings
            </button>
            <span>›</span>
            <span className="text-[#09391C] font-medium">Edit Brief</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/my-listings")}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft size={20} className="text-[#09391C]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#09391C] font-display">
                Edit Property Brief
              </h1>
              <p className="text-[#5A5D63] mt-1">
                Update your {brief.propertyType} brief details
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Price (₦)
                        </label>
                        <Field
                          name="price"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="Enter price"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Property Condition
                        </label>
                        <Field
                          as="select"
                          name="propertyCondition"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                        >
                          <option value="">Select condition</option>
                          {propertyConditions.map((condition) => (
                            <option key={condition} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="propertyCondition"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-4">
                      Availability
                    </h3>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <Field
                          type="radio"
                          name="isAvailable"
                          value="yes"
                          className="mr-3 h-4 w-4 text-[#8DDB90] border-gray-300 focus:ring-[#8DDB90]"
                        />
                        <span className="text-[#5A5D63]">Available</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <Field
                          type="radio"
                          name="isAvailable"
                          value="no"
                          className="mr-3 h-4 w-4 text-[#8DDB90] border-gray-300 focus:ring-[#8DDB90]"
                        />
                        <span className="text-[#5A5D63]">Not Available</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="isAvailable"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                      Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          State
                        </label>
                        <Field
                          name="location.state"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="Enter state"
                        />
                        <ErrorMessage
                          name="location.state"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Local Government
                        </label>
                        <Field
                          name="location.localGovernment"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="Enter LGA"
                        />
                        <ErrorMessage
                          name="location.localGovernment"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Area
                        </label>
                        <Field
                          name="location.area"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="Enter area"
                        />
                        <ErrorMessage
                          name="location.area"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Land Size */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                      Land Size Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Size
                        </label>
                        <Field
                          name="landSize.size"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="Enter size"
                        />
                        <ErrorMessage
                          name="landSize.size"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Measurement Type
                        </label>
                        <Field
                          as="select"
                          name="landSize.measurementType"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                        >
                          {measurementTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="landSize.measurementType"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                      Room Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Bedrooms
                        </label>
                        <Field
                          name="additionalFeatures.noOfBedroom"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Bathrooms
                        </label>
                        <Field
                          name="additionalFeatures.noOfBathroom"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Toilets
                        </label>
                        <Field
                          name="additionalFeatures.noOfToilet"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#09391C] mb-2">
                          Parking Spaces
                        </label>
                        <Field
                          name="additionalFeatures.noOfCarPark"
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                      Property Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableFeatures.map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="mr-3 h-4 w-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                          />
                          <span className="text-sm text-[#5A5D63]">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tenant Criteria (for rent properties) */}
                  {brief.briefType === "Rent" && (
                    <div>
                      <h3 className="text-xl font-semibold text-[#09391C] mb-6">
                        Tenant Criteria
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {availableTenantCriteria.map((criteria) => (
                          <label
                            key={criteria}
                            className="flex items-center cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTenantCriteria.includes(
                                criteria,
                              )}
                              onChange={() => toggleTenantCriteria(criteria)}
                              className="mr-3 h-4 w-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90]"
                            />
                            <span className="text-sm text-[#5A5D63]">
                              {criteria}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Owner Declaration */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                      Owner Declaration
                    </h3>
                    <label className="flex items-start cursor-pointer">
                      <Field
                        type="checkbox"
                        name="areYouTheOwner"
                        className="mr-3 h-4 w-4 text-[#8DDB90] border-gray-300 rounded focus:ring-[#8DDB90] mt-1"
                      />
                      <span className="text-sm text-[#5A5D63] leading-relaxed">
                        I confirm that I am the legal owner of this property and
                        have the right to list it for sale, rent, or joint
                        venture. All information provided is accurate to the
                        best of my knowledge.
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => router.push("/my-listings")}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      disabled={isSubmitting}
                    >
                      Cancel Changes
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditBriefPage;
