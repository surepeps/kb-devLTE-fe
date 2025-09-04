"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { 
  AgentKycSubmissionPayload, 
  AgentKycMeansOfId, 
  AgentKycAchievement, 
  AgentKycAddress,
  AgentType,
  SPECIALIZATION_OPTIONS,
  SERVICE_OPTIONS,
  LANGUAGE_OPTIONS
} from "@/types/agent-upgrade.types";
import toast from "react-hot-toast";
import AttachFile from "@/components/general-components/attach_file";
import { Plus, X, Upload, FileText, Award, MapPin, User, Briefcase } from "lucide-react";
import { getCookie } from "cookies-next";

// KYC validation schema
const kycValidationSchema = Yup.object({
  agentLicenseNumber: Yup.string()
    .optional()
    .min(3, "License number must be at least 3 characters"),
  profileBio: Yup.string()
    .required("Profile bio is required")
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio cannot exceed 500 characters"),
  specializations: Yup.array()
    .of(Yup.string())
    .min(1, "At least one specialization is required")
    .max(5, "Maximum 5 specializations allowed"),
  languagesSpoken: Yup.array()
    .of(Yup.string())
    .min(1, "At least one language is required"),
  servicesOffered: Yup.array()
    .of(Yup.string())
    .min(2, "At least two services are required"),
  address: Yup.object({
    street: Yup.string().required("Street address is required"),
    homeNo: Yup.string().required("House number is required"),
    state: Yup.string().required("State is required"),
    localGovtArea: Yup.string().required("Local government area is required"),
  }),
  regionOfOperation: Yup.array()
    .of(Yup.string())
    .min(1, "At least one region of operation is required"),
  agentType: Yup.string()
    .oneOf(["Individual", "Company"], "Please select a valid agent type")
    .required("Agent type is required"),
  meansOfId: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("ID type is required"),
        docImg: Yup.array()
          .of(Yup.string().url("Invalid image URL"))
          .min(1, "At least one document image is required"),
      })
    )
    .min(1, "At least one form of identification is required"),
});

const AgentKycForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});

  const formik = useFormik<AgentKycSubmissionPayload>({
    initialValues: {
      meansOfId: [{ name: "", docImg: [] }],
      agentLicenseNumber: "",
      profileBio: "",
      specializations: [],
      languagesSpoken: [],
      servicesOffered: [],
      achievements: [],
      featuredListings: [],
      address: {
        street: "",
        homeNo: "",
        state: "",
        localGovtArea: "",
      },
      regionOfOperation: [],
      agentType: "Individual" as AgentType,
    },
    validationSchema: kycValidationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: AgentKycSubmissionPayload) => {
    setIsSubmitting(true);
    try {
      const token = getCookie("token") as string;
      
      const response = await PUT_REQUEST(
        `${URLS.BASE}${URLS.submitKyc}`,
        values,
        token
      );

      if (response.success) {
        toast.success("KYC submitted successfully!");
        // Redirect or show success state
      } else {
        toast.error(response.message || "KYC submission failed.");
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (fileUrl: string, field: string, index?: number, subIndex?: number) => {
    if (field === "meansOfId" && typeof index === "number" && typeof subIndex === "number") {
      const newMeansOfId = [...formik.values.meansOfId];
      if (!newMeansOfId[index].docImg) {
        newMeansOfId[index].docImg = [];
      }
      newMeansOfId[index].docImg[subIndex] = fileUrl;
      formik.setFieldValue("meansOfId", newMeansOfId);
    } else if (field === "achievements" && typeof index === "number") {
      const newAchievements = [...(formik.values.achievements || [])];
      if (newAchievements[index]) {
        newAchievements[index].fileUrl = fileUrl;
        formik.setFieldValue("achievements", newAchievements);
      }
    }
  };

  const addMeansOfId = () => {
    formik.setFieldValue("meansOfId", [
      ...formik.values.meansOfId,
      { name: "", docImg: [] }
    ]);
  };

  const removeMeansOfId = (index: number) => {
    const newMeansOfId = formik.values.meansOfId.filter((_, i) => i !== index);
    formik.setFieldValue("meansOfId", newMeansOfId);
  };

  const addAchievement = () => {
    const newAchievements = [
      ...(formik.values.achievements || []),
      { title: "", description: "", dateAwarded: "", fileUrl: "" }
    ];
    formik.setFieldValue("achievements", newAchievements);
  };

  const removeAchievement = (index: number) => {
    const newAchievements = (formik.values.achievements || []).filter((_, i) => i !== index);
    formik.setFieldValue("achievements", newAchievements);
  };

  const addRegionOfOperation = () => {
    const newRegions = [...formik.values.regionOfOperation, ""];
    formik.setFieldValue("regionOfOperation", newRegions);
  };

  const removeRegionOfOperation = (index: number) => {
    const newRegions = formik.values.regionOfOperation.filter((_, i) => i !== index);
    formik.setFieldValue("regionOfOperation", newRegions);
  };

  const handleMultiSelect = (field: string, value: string) => {
    const currentValues = formik.values[field as keyof AgentKycSubmissionPayload] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    formik.setFieldValue(field, newValues);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8F8] to-[#E8EEEE] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B572B] to-[#8DDB90] px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Agent KYC Verification
            </h1>
            <p className="text-white/90">
              Complete your Know Your Customer verification to enhance your agent profile
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
            {/* Identity Documents Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <FileText className="text-[#0B572B]" size={24} />
                <h2 className="text-xl font-semibold text-[#0C1E1B]">Identity Documents</h2>
              </div>

              {formik.values.meansOfId.map((idDoc, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-[#0C1E1B]">Identity Document {index + 1}</h3>
                    {formik.values.meansOfId.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeansOfId(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                        ID Type
                      </label>
                      <select
                        value={idDoc.name}
                        onChange={(e) => {
                          const newMeansOfId = [...formik.values.meansOfId];
                          newMeansOfId[index].name = e.target.value;
                          formik.setFieldValue("meansOfId", newMeansOfId);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      >
                        <option value="">Select ID Type</option>
                        <option value="International Passport">International Passport</option>
                        <option value="National ID">National ID</option>
                        <option value="Driver's License">Driver's License</option>
                        <option value="Voter's Card">Voter's Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                        Document Images
                      </label>
                      <div className="space-y-2">
                        {[0, 1].map((imgIndex) => (
                          <AttachFile
                            key={imgIndex}
                            heading={`Document Image ${imgIndex + 1}`}
                            setFileUrl={(url) => handleFileUpload(url!, "meansOfId", index, imgIndex)}
                            id={`means-of-id-${index}-${imgIndex}`}
                            className="w-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMeansOfId}
                className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10"
              >
                <Plus size={16} />
                Add Another ID Document
              </button>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <Briefcase className="text-[#0B572B]" size={24} />
                <h2 className="text-xl font-semibold text-[#0C1E1B]">Professional Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    Agent License Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("agentLicenseNumber")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="AGT-12345-XYZ"
                  />
                  {formik.touched.agentLicenseNumber && formik.errors.agentLicenseNumber && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.agentLicenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    Agent Type
                  </label>
                  <select
                    {...formik.getFieldProps("agentType")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                  </select>
                  {formik.touched.agentType && formik.errors.agentType && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.agentType}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                  Profile Bio
                </label>
                <textarea
                  {...formik.getFieldProps("profileBio")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  placeholder="Describe your experience, expertise, and what makes you unique as a real estate agent..."
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formik.values.profileBio.length}/500 characters</span>
                  {formik.touched.profileBio && formik.errors.profileBio && (
                    <span className="text-red-500">{formik.errors.profileBio}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                  Specializations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formik.values.specializations.includes(option.value)}
                        onChange={() => handleMultiSelect("specializations", option.value)}
                        className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]"
                      />
                      <span className="text-sm text-[#0C1E1B]">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.specializations && formik.errors.specializations && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.specializations}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                  Languages Spoken
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <label key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formik.values.languagesSpoken.includes(language)}
                        onChange={() => handleMultiSelect("languagesSpoken", language)}
                        className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]"
                      />
                      <span className="text-sm text-[#0C1E1B]">{language}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.languagesSpoken && formik.errors.languagesSpoken && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.languagesSpoken}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SERVICE_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formik.values.servicesOffered.includes(option.value)}
                        onChange={() => handleMultiSelect("servicesOffered", option.value)}
                        className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]"
                      />
                      <span className="text-sm text-[#0C1E1B]">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.servicesOffered && formik.errors.servicesOffered && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.servicesOffered}</p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <MapPin className="text-[#0B572B]" size={24} />
                <h2 className="text-xl font-semibold text-[#0C1E1B]">Address Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("address.street")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="Enter street address"
                  />
                  {formik.touched.address?.street && formik.errors.address?.street && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.address.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    House Number
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("address.homeNo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="12A"
                  />
                  {formik.touched.address?.homeNo && formik.errors.address?.homeNo && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.address.homeNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("address.state")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="Lagos"
                  />
                  {formik.touched.address?.state && formik.errors.address?.state && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.address.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                    Local Government Area
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("address.localGovtArea")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="Surulere"
                  />
                  {formik.touched.address?.localGovtArea && formik.errors.address?.localGovtArea && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.address.localGovtArea}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Region of Operation Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <MapPin className="text-[#0B572B]" size={24} />
                <h2 className="text-xl font-semibold text-[#0C1E1B]">Region of Operation</h2>
              </div>

              {formik.values.regionOfOperation.map((region, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => {
                      const newRegions = [...formik.values.regionOfOperation];
                      newRegions[index] = e.target.value;
                      formik.setFieldValue("regionOfOperation", newRegions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    placeholder="e.g., Lagos Mainland, Lekki, Ikoyi"
                  />
                  {formik.values.regionOfOperation.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRegionOfOperation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addRegionOfOperation}
                className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10"
              >
                <Plus size={16} />
                Add Region
              </button>
              
              {formik.touched.regionOfOperation && formik.errors.regionOfOperation && (
                <p className="text-red-500 text-sm">{formik.errors.regionOfOperation}</p>
              )}
            </div>

            {/* Achievements Section (Optional) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <Award className="text-[#0B572B]" size={24} />
                <h2 className="text-xl font-semibold text-[#0C1E1B]">Achievements (Optional)</h2>
              </div>

              {(formik.values.achievements || []).map((achievement, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-[#0C1E1B]">Achievement {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => {
                          const newAchievements = [...(formik.values.achievements || [])];
                          newAchievements[index].title = e.target.value;
                          formik.setFieldValue("achievements", newAchievements);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                        placeholder="Top Seller 2022"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                        Date Awarded
                      </label>
                      <input
                        type="date"
                        value={achievement.dateAwarded}
                        onChange={(e) => {
                          const newAchievements = [...(formik.values.achievements || [])];
                          newAchievements[index].dateAwarded = e.target.value;
                          formik.setFieldValue("achievements", newAchievements);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#0C1E1B] mb-2">
                        Description
                      </label>
                      <textarea
                        value={achievement.description}
                        onChange={(e) => {
                          const newAchievements = [...(formik.values.achievements || [])];
                          newAchievements[index].description = e.target.value;
                          formik.setFieldValue("achievements", newAchievements);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                        placeholder="Describe the achievement..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <AttachFile
                        heading="Certificate/Document (Optional)"
                        setFileUrl={(url) => handleFileUpload(url!, "achievements", index)}
                        id={`achievement-${index}`}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addAchievement}
                className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10"
              >
                <Plus size={16} />
                Add Achievement
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !formik.isValid}
                className="px-8 py-3 bg-gradient-to-r from-[#0B572B] to-[#8DDB90] text-white font-semibold rounded-lg hover:from-[#094C25] hover:to-[#7BC87F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? "Submitting KYC..." : "Submit KYC"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentKycForm;
