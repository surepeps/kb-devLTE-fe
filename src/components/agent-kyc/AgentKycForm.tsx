"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PUT_REQUEST, GET_REQUEST } from "@/utils/requests";
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
  Search,
} from "lucide-react";
import { getCookie } from "cookies-next";
import Select from "react-select";
import customStyles from "@/styles/inputStyle";
import { useUserContext } from "@/context/user-context";
import { getStates, getLGAsByState, getAreasByStateLGA, searchLocations, formatLocationString } from "@/utils/location-utils";

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
    }),
  ).min(1, "At least one form of identification is required"),
});

const steps = [
  { key: "identity", title: "Identity Documents" },
  { key: "professional", title: "Professional Info" },
  { key: "location", title: "Address & Regions" },
  { key: "portfolio", title: "Achievements & Listings" },
] as const;

const isImage = (url?: string) => !!url && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(url);

const AgentKycForm: React.FC = () => {
  const { user } = useUserContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [agentProperties, setAgentProperties] = useState<any[]>([]);

  const [listingQuery, setListingQuery] = useState("");
  const [listingResults, setListingResults] = useState<any[]>([]);
  const [isSearchingListings, setIsSearchingListings] = useState(false);

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

  const selectedState = formik.values.address.state;
  const stateOptions = useMemo(() => getStates(), []);
  const lgaOptions = useMemo(() => (selectedState ? getLGAsByState(selectedState) : []), [selectedState]);
  const areaOptions = useMemo(() => {
    if (!selectedState) return [] as string[];
    const areas: string[] = [];
    lgaOptions.forEach((lga) => areas.push(...getAreasByStateLGA(selectedState, lga)));
    const merged = Array.from(new Set([...(areas || []), ...(lgaOptions || [])]));
    return merged;
  }, [selectedState, lgaOptions]);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const token = getCookie("token") as string;
        const res = await GET_REQUEST<any>(`${URLS.BASE}/account/properties/fetchAll?page=1&limit=12`, token);
        if (res.success && Array.isArray(res.data)) setAgentProperties(res.data);
        else setAgentProperties([]);
      } catch {
        setAgentProperties([]);
      }
    };
    fetchProps();
  }, [user]);

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

  const goNext = () => {
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
    formik.setFieldValue("achievements", [...(formik.values.achievements || []), { title: "", description: "", dateAwarded: "", fileUrl: "" }]);
  };
  const removeAchievement = (index: number) => {
    formik.setFieldValue("achievements", (formik.values.achievements || []).filter((_, i) => i !== index));
  };

  const addFeaturedListing = (id?: string) => {
    const current = formik.values.featuredListings || [];
    const next = id ? (current.includes(id) ? current : [...current, id]) : [...current, ""];
    formik.setFieldValue("featuredListings", next);
  };
  const removeFeaturedListing = (index: number) => {
    formik.setFieldValue("featuredListings", (formik.values.featuredListings || []).filter((_, i) => i !== index));
  };

  const handleMultiSelect = (field: keyof AgentKycSubmissionPayload, value: string) => {
    const current = (formik.values[field] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    formik.setFieldValue(field, next);
  };

  const searchListings = async () => {
    if (!listingQuery || !user) return;
    setIsSearchingListings(true);
    try {
      const url = `${URLS.BASE}${URLS.accountPropertyBaseUrl}?search=${encodeURIComponent(listingQuery)}&owner=${user._id}`;
      const res = await GET_REQUEST<any>(url);
      if (res.success && Array.isArray(res.data)) {
        setListingResults(res.data);
      } else {
        setListingResults([]);
      }
    } catch (error) {
      setListingResults([]);
    } finally {
      setIsSearchingListings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent KYC Verification</h1>
          <p className="text-gray-600 mt-1">Complete your verification to enhance your public agent profile</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 pt-6">
            <ol className="flex items-center gap-4 overflow-x-auto">
              {steps.map((s, idx) => {
                const active = idx === currentStep;
                const done = idx < currentStep;
                return (
                  <li key={s.key} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${active ? "bg-[#0B572B] text-white border-[#0B572B]" : done ? "bg-[#8DDB90] text-white border-[#8DDB90]" : "border-gray-300 text-gray-600"}`}>
                      {done ? <CheckCircle2 size={18} /> : <span className="text-xs">{idx + 1}</span>}
                    </div>
                    <span className={`text-sm whitespace-nowrap ${active ? "text-[#0B572B] font-medium" : "text-gray-600"}`}>{s.title}</span>
                    {idx < steps.length - 1 && <span className="w-8 h-px bg-gray-300 mx-1" />}
                  </li>
                );
              })}
            </ol>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
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
                        <Select
                          styles={customStyles}
                          options={[
                            { value: "International Passport", label: "International Passport" },
                            { value: "National ID", label: "National ID" },
                            { value: "Driver's License", label: "Driver's License" },
                            { value: "Voter's Card", label: "Voter's Card" },
                          ]}
                          placeholder="Select ID Type"
                          value={idDoc.name ? { value: idDoc.name, label: idDoc.name } as any : null}
                          onChange={(opt: any) => {
                            const next = [...formik.values.meansOfId];
                            next[index].name = opt?.value || "";
                            formik.setFieldValue("meansOfId", next);
                          }}
                          isClearable
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Document Images</label>
                        <div className="space-y-3">
                          {[0, 1].map((imgIndex) => (
                            <div key={imgIndex} className="space-y-2">
                              <AttachFile heading={`Upload Image ${imgIndex + 1}`} setFileUrl={(url: string | null) => handleFileUpload(url!, "meansOfId", index, imgIndex)} id={`means-of-id-${index}-${imgIndex}`} className="w-full" />
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

                <button type="button" onClick={addMeansOfId} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg">
                  <Plus size={16} /> Add Another ID Document
                </button>
              </div>
            )}

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
                    <Select
                      styles={customStyles}
                      options={[{ value: "Individual", label: "Individual" }, { value: "Company", label: "Company" }]}
                      value={formik.values.agentType ? { value: formik.values.agentType, label: formik.values.agentType } as any : null}
                      onChange={(opt: any) => formik.setFieldValue("agentType", opt?.value || "")}
                      placeholder="Select agent type"
                    />
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
                    {SPECIALIZATION_OPTIONS.map((option) => {
                      const selected = formik.values.specializations.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleMultiSelect("specializations", option.value)}
                          className={`px-3 py-1 rounded-full border text-sm ${selected ? "bg-[#0B572B] text-white border-[#0B572B]" : "bg-white text-[#0C1E1B] border-gray-300 hover:border-[#0B572B]"}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Languages Spoken</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {LANGUAGE_OPTIONS.map((language) => {
                      const selected = formik.values.languagesSpoken.includes(language);
                      return (
                        <button
                          key={language}
                          type="button"
                          onClick={() => handleMultiSelect("languagesSpoken", language)}
                          className={`px-3 py-1 rounded-full border text-sm ${selected ? "bg-[#0B572B] text-white border-[#0B572B]" : "bg-white text-[#0C1E1B] border-gray-300 hover:border-[#0B572B]"}`}
                        >
                          {language}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Services Offered</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SERVICE_OPTIONS.map((option) => {
                      const selected = formik.values.servicesOffered.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleMultiSelect("servicesOffered", option.value)}
                          className={`px-3 py-1 rounded-full border text-sm ${selected ? "bg-[#0B572B] text-white border-[#0B572B]" : "bg-white text-[#0C1E1B] border-gray-300 hover:border-[#0B572B]"}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

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
                    <Select
                      styles={customStyles}
                      options={stateOptions.map((s) => ({ value: s, label: s }))}
                      value={formik.values.address.state ? { value: formik.values.address.state, label: formik.values.address.state } as any : null}
                      onChange={(opt: any) => {
                        formik.setFieldValue("address.state", opt?.value || "");
                        formik.setFieldValue("address.localGovtArea", "");
                        formik.setFieldValue("regionOfOperation", []);
                      }}
                      placeholder="Select state"
                      isClearable
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0C1E1B] mb-2">Local Government Area</label>
                    <Select
                      styles={customStyles}
                      isDisabled={!selectedState}
                      options={lgaOptions.map((l) => ({ value: l, label: l }))}
                      value={formik.values.address.localGovtArea ? { value: formik.values.address.localGovtArea, label: formik.values.address.localGovtArea } as any : null}
                      onChange={(opt: any) => formik.setFieldValue("address.localGovtArea", opt?.value || "")}
                      placeholder="Select LGA"
                      isClearable
                    />
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

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <Award className="text-[#0B572B]" size={24} />
                  <h2 className="text-xl font-semibold text-[#0C1E1B]">Achievements & Featured Listings</h2>
                </div>

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
                        <AttachFile heading="Upload Certificate (optional)" setFileUrl={(url: string | null) => handleFileUpload(url!, "achievements", index)} id={`achievement-${index}`} className="w-full" />
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
                  <button type="button" onClick={addAchievement} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg">
                    <Plus size={16} /> Add Achievement
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0C1E1B]">Featured Listings</h3>

                  <div className="flex gap-3 items-center">
                    <input type="text" placeholder="Search your listings by title or id" value={listingQuery} onChange={(e) => setListingQuery(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button type="button" onClick={searchListings} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B572B] text-white rounded-lg">
                      <Search size={16} /> {isSearchingListings ? "Searching..." : "Search"}
                    </button>
                  </div>

                  {listingResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {listingResults.map((l) => (
                        <div key={l._id} className="border rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-[#09391C]">{l.title || l._id}</div>
                            <div className="text-sm text-[#5A5D63]">₦{(l.price || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <button type="button" onClick={() => addFeaturedListing(l._id)} className="px-3 py-1 bg-[#8DDB90] text-white rounded-lg">Add</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    {(formik.values.featuredListings || []).map((id, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input type="text" value={id} onChange={(e) => {
                          const copy = [...(formik.values.featuredListings || [])];
                          copy[index] = e.target.value;
                          formik.setFieldValue("featuredListings", copy);
                        }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                        <button type="button" onClick={() => removeFeaturedListing(index)} className="text-red-500">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addFeaturedListing()} className="flex items-center gap-2 px-4 py-2 text-[#0B572B] border border-[#8DDB90] rounded-lg">
                      <Plus size={16} /> Add Listing ID
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button type="button" onClick={goPrev} disabled={currentStep === 0} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-[#0B572B] border-[#8DDB90] disabled:opacity-50">
                <ChevronLeft size={18} /> Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={goNext} className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B572B] text-white rounded-lg">
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting || !formik.isValid} className="px-8 py-2 bg-gradient-to-r from-[#0B572B] to-[#8DDB90] text-white font-semibold rounded-lg disabled:opacity-50">
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
