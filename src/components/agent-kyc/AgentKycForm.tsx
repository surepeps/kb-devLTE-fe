"use client";
import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import {
  AgentKycSubmissionPayload,
  AgentType,
  SPECIALIZATION_OPTIONS,
  SERVICE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/agent-upgrade.types";
import toast from "react-hot-toast";
import AttachFile from "@/components/general-components/attach_file";
import {
  FileText,
  Award,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { getAllStates, getLGAs, getAreas } from "@/data/dummy-location-data";

// Validation schema
const kycValidationSchema = Yup.object({
  agentLicenseNumber: Yup.string().optional().min(3, "License number must be at least 3 characters"),
  profileBio: Yup.string().required("Profile bio is required").min(50, "Bio must be at least 50 characters").max(500, "Bio cannot exceed 500 characters"),
  specializations: Yup.array().of(Yup.string()).min(1, "At least one specialization is required").max(5, "Maximum 5 specializations allowed"),
  languagesSpoken: Yup.array().of(Yup.string()).min(1, "At least one language is required"),
  servicesOffered: Yup.array().of(Yup.string()).min(2, "At least two services are required"),
  address: Yup.object({
    street: Yup.string().required("Street address is required"),
    homeNo: Yup.string().required("House number is required"),
    state: Yup.string().required("State is required"),
    localGovtArea: Yup.string().required("Local government area is required"),
  }),
  regionOfOperation: Yup.array().of(Yup.string()).min(1, "Select at least one region"),
  agentType: Yup.string().oneOf(["Individual", "Company"], "Please select a valid agent type").required("Agent type is required"),
  meansOfId: Yup.array().of(
    Yup.object({
      name: Yup.string().required("ID type is required"),
      docImg: Yup.array().of(Yup.string().url("Invalid image URL")).min(1, "At least one document image is required"),
    })
  ).min(1, "At least one form of identification is required"),
});

const steps = [
  { key: "identity", title: "Identity Documents", icon: FileText },
  { key: "professional", title: "Professional Info", icon: Briefcase },
  { key: "location", title: "Address & Regions", icon: MapPin },
  { key: "portfolio", title: "Achievements & Listings", icon: Award },
] as const;

const isImage = (url?: string) => !!url && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(url);

const AgentKycForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<AgentKycSubmissionPayload>({
    initialValues: {
      meansOfId: [
        { name: "", docImg: [] },
      ],
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

  const selectedState = formik.values.address.state;
  const stateOptions = useMemo(() => getAllStates(), []);
  const lgaOptions = useMemo(() => (selectedState ? getLGAs(selectedState) : []), [selectedState]);
  const areaOptions = useMemo(() => {
    if (!selectedState) return [] as string[];
    const lgas = getLGAs(selectedState);
    const areas: string[] = [];
    lgas.forEach((lga) => areas.push(...getAreas(selectedState, lga)));
    const merged = Array.from(new Set([...(areas || []), ...(lgas || [])]));
    return merged;
  }, [selectedState]);

  const handleSubmit = async (values: AgentKycSubmissionPayload) => {
    setIsSubmitting(true);
    try {
      const token = getCookie("token") as string;
      const response = await PUT_REQUEST(`${URLS.BASE}${URLS.submitKyc}`, values, token as string);
      if (response.success) {
        toast.success("KYC submitted successfully");
      } else {
        toast.error(response.message || "KYC submission failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = async () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const addMeansOfId = () => {
    formik.setFieldValue("meansOfId", [...formik.values.meansOfId, { name: "", docImg: [] }]);
  };
  const removeMeansOfId = (index: number) => {
    formik.setFieldValue("meansOfId", formik.values.meansOfId.filter((_, i) => i !== index));
  };

  const handleFileUpload = (fileUrl: string, field: "meansOfId" | "achievements", index: number, imgIndex?: number) => {
    if (field === "meansOfId" && typeof imgIndex === "number") {
      const copy = [...formik.values.meansOfId];
      if (!copy[index].docImg) copy[index].docImg = [];
      copy[index].docImg[imgIndex] = fileUrl;
      formik.setFieldValue("meansOfId", copy);
    } else if (field === "achievements") {
      const copy = [...(formik.values.achievements || [])];
      copy[index].fileUrl = fileUrl;
      formik.setFieldValue("achievements", copy);
    }
  };

  const addAchievement = () => {
    formik.setFieldValue("achievements", [
      ...(formik.values.achievements || []),
      { title: "", description: "", dateAwarded: "", fileUrl: "" },
    ]);
  };
  const removeAchievement = (index: number) => {
    formik.setFieldValue("achievements", (formik.values.achievements || []).filter((_, i) => i !== index));
  };

  const addFeaturedListing = () => {
    formik.setFieldValue("featuredListings", [...(formik.values.featuredListings || []), ""]);
  };
  const removeFeaturedListing = (index: number) => {
    formik.setFieldValue("featuredListings", (formik.values.featuredListings || []).filter((_, i) => i !== index));
  };

  const handleMultiSelect = (field: keyof AgentKycSubmissionPayload, value: string) => {
    const current = (formik.values[field] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    formik.setFieldValue(field, next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8F8] to-[#E8EEEE] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B572B] to-[#8DDB90] px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Agent KYC Verification</h1>
            <p className="text-white/90">Complete your verification to enhance your public agent profile</p>
          </div>

          {/* Stepper */}
          <div className="px-6 pt-6">
            <ol className="flex items-center gap-4 overflow-x-auto">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const active = idx === currentStep;
                const done = idx < currentStep;
                return (
                  <li key={s.key} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${active ? "bg-[#0B572B] text-white border-[#0B572B]" : done ? "bg-[#8DDB90] text-white border-[#8DDB90]" : "border-gray-300 text-gray-600"}`}>
                      {done ? <CheckCircle2 size={18}/> : <Icon size={18} />}
                    </div>
                    <span className={`text-sm whitespace-nowrap ${active ? "text-[#0B572B] font-medium" : "text-gray-600"}`}>{s.title}</span>
                    {idx < steps.length - 1 && <span className="w-8 h-px bg-gray-300 mx-1"/>}
                  </li>
                );
              })}
            </ol>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
            {/* Step 1: Identity */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <FileText className="text-[#0B572B]" size={24} />
                  <h2 className="text-xl font-semibold text-[#0C1E1B]">Identity Documents</h2>
                </div>

                {formik.values.meansOfId.map((idDoc, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-[#0C1E1B]">Document {index + 1}</h3>
                      {formik.values.meansOfId.length > 1 && (
                        <button type="button" onClick={() => removeMeansOfId(index)} className="text-red-500 hover:text-red-700">
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0C1E1B] mb-2">ID Type</label>
                        <select
                          value={idDoc.name}
                          onChange={(e) => {
                            const next = [...formik.values.meansOfId];
                            next[index].name = e.target.value;
                            formik.setFieldValue("meansOfId", next);
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
                        <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Document Images</label>
                        <div className="space-y-3">
                          {[0, 1].map((imgIndex) => (
                            <div key={imgIndex} className="space-y-2">
                              <AttachFile heading={`Upload Image ${imgIndex + 1}`} setFileUrl={(url) => handleFileUpload(url!, "meansOfId", index, imgIndex)} id={`means-of-id-${index}-${imgIndex}`} className="w-full" />
                              {idDoc.docImg?.[imgIndex] && (
                                <div className="flex items-center gap-3">
                                  <div className="w-20 h-14 rounded overflow-hidden bg-white border">
                                    <img src={idDoc.docImg[imgIndex]} alt={`Document ${index + 1}-${imgIndex + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                  <a className="text-sm text-[#0B572B] underline" href={idDoc.docImg[imgIndex]} target="_blank" rel="noreferrer">Preview</a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addMeansOfId} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10">
                  <Plus size={16} /> Add Another ID Document
                </button>
              </div>
            )}

            {/* Step 2: Professional */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <Briefcase className="text-[#0B572B]" size={24} />
                  <h2 className="text-xl font-semibold text-[#0C1E1B]">Professional Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Agent License Number (Optional)</label>
                    <input type="text" {...formik.getFieldProps("agentLicenseNumber")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="AGT-12345-XYZ" />
                    {formik.touched.agentLicenseNumber && formik.errors.agentLicenseNumber && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.agentLicenseNumber as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Agent Type</label>
                    <select {...formik.getFieldProps("agentType")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent">
                      <option value="Individual">Individual</option>
                      <option value="Company">Company</option>
                    </select>
                    {formik.touched.agentType && formik.errors.agentType && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.agentType as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Profile Bio</label>
                  <textarea {...formik.getFieldProps("profileBio")} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="Describe your experience, expertise, and what makes you unique as a real estate agent..." />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{formik.values.profileBio.length}/500 characters</span>
                    {formik.touched.profileBio && formik.errors.profileBio && <span className="text-red-500">{formik.errors.profileBio as string}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SPECIALIZATION_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={formik.values.specializations.includes(option.value)} onChange={() => handleMultiSelect("specializations", option.value)} className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]" />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Languages Spoken</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {LANGUAGE_OPTIONS.map((language) => (
                      <label key={language} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={formik.values.languagesSpoken.includes(language)} onChange={() => handleMultiSelect("languagesSpoken", language)} className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]" />
                        <span>{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Services Offered</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SERVICE_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={formik.values.servicesOffered.includes(option.value)} onChange={() => handleMultiSelect("servicesOffered", option.value)} className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]" />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address & Region */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <MapPin className="text-[#0B572B]" size={24} />
                  <h2 className="text-xl font-semibold text-[#0C1E1B]">Address & Regions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Street Address</label>
                    <input type="text" {...formik.getFieldProps("address.street")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="Bode Thomas Street" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">House Number</label>
                    <input type="text" {...formik.getFieldProps("address.homeNo")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="12A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">State</label>
                    <select value={formik.values.address.state} onChange={(e) => {
                      formik.setFieldValue("address.state", e.target.value);
                      formik.setFieldValue("address.localGovtArea", "");
                      formik.setFieldValue("regionOfOperation", []);
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent">
                      <option value="">Select state</option>
                      {stateOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Local Government Area</label>
                    <select value={formik.values.address.localGovtArea} onChange={(e) => formik.setFieldValue("address.localGovtArea", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" disabled={!selectedState}>
                      <option value="">Select LGA</option>
                      {lgaOptions.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Region of Operation</label>
                  <p className="text-xs text-gray-500 mb-2">Select areas/LGAs you primarily operate in for the selected state</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-auto border rounded-lg p-3">
                    {(areaOptions || []).map((area) => (
                      <label key={area} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={formik.values.regionOfOperation.includes(area)} onChange={() => handleMultiSelect("regionOfOperation", area)} className="rounded border-gray-300 text-[#8DDB90] focus:ring-[#8DDB90]" />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                  {formik.touched.regionOfOperation && formik.errors.regionOfOperation && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.regionOfOperation as string}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Portfolio */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <Award className="text-[#0B572B]" size={24} />
                  <h2 className="text-xl font-semibold text-[#0C1E1B]">Achievements & Featured Listings</h2>
                </div>

                {/* Achievements */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0C1E1B]">Achievements</h3>
                  {(formik.values.achievements || []).map((ach, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Achievement {index + 1}</span>
                        <button type="button" onClick={() => removeAchievement(index)} className="text-red-500 hover:text-red-700"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={ach.title} onChange={(e) => {
                          const copy = [...(formik.values.achievements || [])];
                          copy[index].title = e.target.value;
                          formik.setFieldValue("achievements", copy);
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="Title (e.g., Top Seller 2022)" />
                        <input type="date" value={ach.dateAwarded} onChange={(e) => {
                          const copy = [...(formik.values.achievements || [])];
                          copy[index].dateAwarded = e.target.value;
                          formik.setFieldValue("achievements", copy);
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" />
                      </div>
                      <textarea value={ach.description} onChange={(e) => {
                        const copy = [...(formik.values.achievements || [])];
                        copy[index].description = e.target.value;
                        formik.setFieldValue("achievements", copy);
                      }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" rows={3} placeholder="Description" />
                      <div className="space-y-2">
                        <AttachFile heading="Upload Certificate (optional)" setFileUrl={(url) => handleFileUpload(url!, "achievements", index)} id={`achievement-${index}`} className="w-full" />
                        {ach.fileUrl && (
                          <div className="flex items-center gap-3">
                            {isImage(ach.fileUrl) ? (
                              <div className="w-20 h-14 rounded overflow-hidden bg-white border">
                                <img src={ach.fileUrl} alt="Certificate" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-500" />
                            )}
                            <a href={ach.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-[#0B572B] underline">Preview file</a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10">
                    <Plus size={16} /> Add Achievement
                  </button>
                </div>

                {/* Featured Listings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0C1E1B]">Featured Listings (IDs)</h3>
                  {(formik.values.featuredListings || []).map((id, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={id} onChange={(e) => {
                        const copy = [...(formik.values.featuredListings || [])];
                        copy[index] = e.target.value;
                        formik.setFieldValue("featuredListings", copy);
                      }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent" placeholder="Property ID" />
                      <button type="button" onClick={() => removeFeaturedListing(index)} className="text-red-500 hover:text-red-700"><X size={18} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addFeaturedListing} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/10">
                    <Plus size={16} /> Add Listing ID
                  </button>
                </div>
              </div>
            )}

            {/* Footer controls */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button type="button" onClick={goPrev} disabled={currentStep === 0} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-[#0B572B] border-[#8DDB90] disabled:opacity-50">
                <ChevronLeft size={18} /> Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={goNext} className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B572B] text-white rounded-lg hover:bg-[#094C25]">
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting || !formik.isValid} className="px-8 py-2 bg-gradient-to-r from-[#0B572B] to-[#8DDB90] text-white font-semibold rounded-lg hover:from-[#094C25] hover:to-[#7BC87F] disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : "Submit KYC"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentKycForm;
