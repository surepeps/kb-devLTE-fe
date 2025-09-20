"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { GET_REQUEST, POST_REQUEST, POST_REQUEST_FILE_UPLOAD, PUT_REQUEST, DELETE_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import {
  Trash2,
  Save,
  Link as LinkIcon,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  BarChart2,
  ExternalLink,
  Copy,
  Pause,
  Play,
  Trash,
  Shield,
} from "lucide-react";
import { useUserContext } from "@/context/user-context";
import { CombinedAuthGuard } from "@/logic/combinedAuthGuard";
import Stepper from "@/components/post-property-components/Stepper";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OverlayPreloader from "@/components/general-components/OverlayPreloader";
import ModalWrapper from "@/components/general-components/modal-wrapper";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

interface ContactVisibility {
  showEmail: boolean;
  showPhone: boolean;
  enableContactForm: boolean;
  showWhatsAppButton: boolean;
  whatsappNumber?: string;
}

interface FeatureSelection {
  mode: "auto" | "manual";
  propertyIds: string;
}

interface MarketplaceDefaults {
  defaultTab: "buy" | "rent" | "shortlet" | "jv";
  defaultSort: "newest" | "price-asc" | "price-desc";
  showVerifiedOnly: boolean;
  enablePriceNegotiationButton: boolean;
}

interface PublicPageDesign {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
  heroImageUrl?: string;
}

interface InspectionDesignSettings {
  allowPublicBooking: boolean;
  defaultInspectionFee: number;
  inspectionStatus?: string;
  negotiationEnabled?: boolean;
}

interface FooterDetails {
  shortDescription: string;
  copyrightText: string;
}

interface BankDetails {
  business_name: string;
  account_number: string;
  settlement_bank: string; // bank code
  primary_contact_email?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
}

interface DealSiteSettings {
  publicSlug: string;
  title: string;
  keywords: string[];
  description: string;
  logoUrl?: string;
  theme: { primaryColor: string; secondaryColor: string };
  inspectionSettings: InspectionDesignSettings;
  listingsLimit: number;
  socialLinks: SocialLinks;
  contactVisibility: ContactVisibility;
  featureSelection: FeatureSelection;
  marketplaceDefaults: MarketplaceDefaults;
  publicPage: PublicPageDesign;
  footer?: FooterDetails;
  bankDetails?: BankDetails;
}

type PropertyItem = {
  _id: string;
  propertyType?: string;
  propertyCategory?: string;
  price?: number;
  location?: { state?: string; localGovernment?: string; area?: string };
  pictures?: string[];
  description?: string;
  title?: string;
  status?: string;
  isApproved?: boolean;
};

const STORAGE_KEY = "deal_site_settings";
const SLUG_LOCK_KEY = "deal_site_slug_locked";

const Step0Schema = Yup.object({
  publicSlug: Yup.string()
    .required("Public Link is required")
    .matches(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, "Invalid subdomain format"),
  title: Yup.string().required("Title is required"),
  keywordsText: Yup.string().required("Keywords are required"),
  description: Yup.string().required("Description is required"),
});

const Step1Schema = Yup.object({
  shortDescription: Yup.string().required("Footer Details is required"),
  copyrightText: Yup.string().required("Copyright Text is required"),
});

const Tabs: React.FC<{
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}> = ({ tabs, active, onChange }) => (
  <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
          active === t.id
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-white text-[#5A5D63] hover:bg-gray-50 border-gray-200"
        }`}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

export default function DealSitePage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "invalid" | "checking" | "available" | "taken">("idle");
  const [slugMessage, setSlugMessage] = useState<string>("");

  const [form, setForm] = useState<DealSiteSettings>({
    publicSlug: "",
    title: "",
    keywords: [],
    description: "",
    logoUrl: "",
    theme: { primaryColor: "#09391C", secondaryColor: "#8DDB90" },
    inspectionSettings: { allowPublicBooking: true, defaultInspectionFee: 0, inspectionStatus: "optional", negotiationEnabled: true },
    listingsLimit: 6,
    socialLinks: {},
    contactVisibility: { showEmail: true, showPhone: true, enableContactForm: true, showWhatsAppButton: false, whatsappNumber: "" },
    featureSelection: { mode: "auto", propertyIds: "" },
    marketplaceDefaults: { defaultTab: "buy", defaultSort: "newest", showVerifiedOnly: false, enablePriceNegotiationButton: true },
    publicPage: { heroTitle: "Hi, I'm your trusted agent", heroSubtitle: "Browse my verified listings and book inspections easily.", ctaText: "Browse Listings", ctaLink: "/market-place", heroImageUrl: "" },
    footer: { shortDescription: "", copyrightText: "" },
    bankDetails: { business_name: "", account_number: "", settlement_bank: "", primary_contact_email: "", primary_contact_name: "", primary_contact_phone: "" },
  });

  const previewUrl = useMemo(() => {
    if (!form.publicSlug) return "";
    return `https://${form.publicSlug}.khabiteq.com`;
  }, [form.publicSlug]);

  // Analytics state
  const [viewsByDay, setViewsByDay] = useState<{ date: string; count: number }[]>([]);
  const [mostViewed, setMostViewed] = useState<{ id?: string; title?: string; views?: number; image?: string } | null>(null);

  const isSetupComplete = slugLocked && !!form.publicSlug;
  const [activeView, setActiveView] = useState<"setup" | "manage">("setup");
  const [activeTab, setActiveTab] = useState("overview");
  const [setupStep, setSetupStep] = useState(0);

  // Global preloader state
  const [preloader, setPreloader] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const showPreloader = (message: string) => setPreloader({ visible: true, message });
  const hidePreloader = () => setPreloader({ visible: false, message: "" });

  // Featured listings state
  const [flLoading, setFlLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "active" as string | undefined,
    propertyType: undefined as string | undefined,
    propertyCategory: undefined as string | undefined,
    state: undefined as string | undefined,
    localGovernment: undefined as string | undefined,
    area: undefined as string | undefined,
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    isApproved: true as boolean | undefined,
  });
  const selectedIds = useMemo<string[]>(() => form.featureSelection.propertyIds.split(",").map((s) => s.trim()).filter(Boolean), [form.featureSelection.propertyIds]);

  useEffect(() => {
    setActiveView(isSetupComplete ? "manage" : "setup");
  }, [isSetupComplete]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        try {
          if (typeof window !== "undefined") {
            window.localStorage.clear();
          }
        } catch {}
        const token = Cookies.get("token");
        showPreloader("Loading Deal Site...");
        const res = await GET_REQUEST<any>(`${URLS.BASE}/account/dealSite/details`, token);
        hidePreloader();
        if (res?.success && res.data) {
          const s = res.data as Partial<DealSiteSettings & { paused?: boolean }>;
          setForm((prev) => ({
            ...prev,
            publicSlug: s.publicSlug || prev.publicSlug,
            title: s.title || prev.title,
            keywords: s.keywords || prev.keywords,
            description: s.description || prev.description,
            logoUrl: s.logoUrl || prev.logoUrl,
            theme: {
              primaryColor: s.theme?.primaryColor || prev.theme.primaryColor,
              secondaryColor: s.theme?.secondaryColor || prev.theme.secondaryColor,
            },
            inspectionSettings: {
              allowPublicBooking: s.inspectionSettings?.allowPublicBooking ?? prev.inspectionSettings.allowPublicBooking,
              defaultInspectionFee: s.inspectionSettings?.defaultInspectionFee ?? prev.inspectionSettings.defaultInspectionFee,
              inspectionStatus: s.inspectionSettings?.inspectionStatus ?? prev.inspectionSettings.inspectionStatus,
              negotiationEnabled: s.inspectionSettings?.negotiationEnabled ?? prev.inspectionSettings.negotiationEnabled,
            },
            listingsLimit: typeof s.listingsLimit === "number" ? s.listingsLimit : prev.listingsLimit,
            socialLinks: s.socialLinks || prev.socialLinks,
            contactVisibility: s.contactVisibility || prev.contactVisibility,
            featureSelection: s.featureSelection || prev.featureSelection,
            marketplaceDefaults: s.marketplaceDefaults || prev.marketplaceDefaults,
            publicPage: s.publicPage || prev.publicPage,
            footer: s.footer || prev.footer,
            bankDetails: (s as any).bankDetails || prev.bankDetails,
          }));
          if (typeof s.paused === "boolean") setIsPaused(s.paused);
          if (s.publicSlug) setSlugLocked(true);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load existing deal site from profile response if available
  useEffect(() => {
    const ds = (user as any)?.dealSite?.[0];
    if (!ds) return;

    setForm((prev) => ({
      ...prev,
      publicSlug: ds.publicSlug || prev.publicSlug,
      title: ds.title || prev.title,
      keywords: Array.isArray(ds.keywords) ? ds.keywords : prev.keywords,
      description: ds.description || prev.description,
      logoUrl: ds.logoUrl || prev.logoUrl,
      theme: {
        primaryColor: ds.theme?.primaryColor || prev.theme.primaryColor,
        secondaryColor: ds.theme?.secondaryColor || prev.theme.secondaryColor,
      },
      inspectionSettings: {
        allowPublicBooking: ds.inspectionSettings?.allowPublicBooking ?? prev.inspectionSettings.allowPublicBooking,
        defaultInspectionFee: ds.inspectionSettings?.defaultInspectionFee ?? prev.inspectionSettings.defaultInspectionFee,
        inspectionStatus: ds.inspectionSettings?.inspectionStatus ?? prev.inspectionSettings.inspectionStatus,
        negotiationEnabled: ds.inspectionSettings?.negotiationEnabled ?? prev.inspectionSettings.negotiationEnabled,
      },
      listingsLimit: typeof ds.listingsLimit === "number" ? ds.listingsLimit : prev.listingsLimit,
      socialLinks: ds.socialLinks || prev.socialLinks,
      contactVisibility: ds.contactVisibility || prev.contactVisibility,
      featureSelection: ds.featureSelection || prev.featureSelection,
      marketplaceDefaults: ds.marketplaceDefaults || prev.marketplaceDefaults,
      publicPage: {
        heroTitle: ds.publicPage?.heroTitle || prev.publicPage.heroTitle,
        heroSubtitle: ds.publicPage?.heroSubtitle || prev.publicPage.heroSubtitle,
        ctaText: ds.publicPage?.ctaText || prev.publicPage.ctaText,
        ctaLink: ds.publicPage?.ctaLink || prev.publicPage.ctaLink,
        heroImageUrl: ds.publicPage?.heroImage || prev.publicPage.heroImageUrl,
      },
      footer: {
        shortDescription: ds.footerSection?.shortDesc || prev.footer?.shortDescription || "",
        copyrightText: ds.footerSection?.copyRight || prev.footer?.copyrightText || "",
      },
    }));

    if (ds.publicSlug && !slugLocked) {
      setSlugLocked(true);
    }
  }, [user, slugLocked]);

  useEffect(() => {
    if (!form.publicSlug || slugLocked) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }
    const sub = form.publicSlug;
    const valid = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(sub);
    if (!valid) {
      setSlugStatus("invalid");
      setSlugMessage("Use 2-63 chars: letters, numbers, hyphens. Cannot start/end with hyphen.");
      return;
    }
    let cancelled = false;
    setSlugStatus("checking");
    setSlugMessage("Checking availability...");
    const token = Cookies.get("token");
    const t = setTimeout(async () => {
      try {
        const resp = await POST_REQUEST<any>(`${URLS.BASE}/account/dealSite/slugAvailability`, { publicSlug: sub }, token);
        const available = (resp?.data?.available ?? resp?.available ?? resp?.data?.isAvailable ?? resp?.isAvailable) === true;
        if (!cancelled) {
          setSlugStatus(available ? "available" : "taken");
          setSlugMessage(available ? "Subdomain is available" : "Subdomain is taken");
        }
      } catch (e) {
        if (!cancelled) {
          setSlugStatus("taken");
          setSlugMessage("Unable to verify. Try again.");
        }
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form.publicSlug, slugLocked]);

  useEffect(() => {
    if (activeView !== "manage") return;
    const fetchAnalytics = async () => {
      try {
        const token = Cookies.get("token");
        const dash = await GET_REQUEST<any>(`${URLS.BASE}${URLS.fetchDashboardStats}`, token);
        if (dash?.success && dash.data?.viewsByDay) setViewsByDay(dash.data.viewsByDay);
      } catch {}
    };
    fetchAnalytics();
  }, [activeView]);

  // Fetch agent properties for Featured Listings
  const buildQuery = (obj: Record<string, any>) =>
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");

  const fetchProperties = async () => {
    try {
      setFlLoading(true);
      const token = Cookies.get("token");
      const qs = buildQuery(filters);
      showPreloader("Loading your listings...");
      const res = await GET_REQUEST<{ data: PropertyItem[]; pagination?: any }>(`${URLS.BASE}/account/properties/fetchAll?${qs}`, token);
      hidePreloader();
      if (res?.success && res.data && Array.isArray(res.data)) {
        setProperties(res.data as unknown as PropertyItem[]);
      } else {
        toast.error(res?.message || "Failed to load listings");
      }
    } finally {
      setFlLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "featured") {
      fetchProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, JSON.stringify(filters)]);

  const handleUploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("for", "public-logo");
    const token = Cookies.get("token");

    showPreloader("Uploading logo...");
    const res = await POST_REQUEST_FILE_UPLOAD<{ url: string }>(`${URLS.BASE}${URLS.uploadSingleImg}`, formData, token);
    hidePreloader();
    if (res?.success && res.data && (res.data as any).url) {
      setForm((prev) => ({ ...prev, logoUrl: (res.data as any).url }));
      toast.success("Logo uploaded");
    } else {
      toast.error(res?.message || "Upload failed");
    }
  };

  const handleUploadHero = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("for", "public-hero");
    const token = Cookies.get("token");

    showPreloader("Uploading hero image...");
    const res = await POST_REQUEST_FILE_UPLOAD<{ url: string }>(`${URLS.BASE}${URLS.uploadSingleImg}`, formData, token);
    hidePreloader();
    if (res?.success && res.data && (res.data as any).url) {
      setForm((prev) => ({ ...prev, publicPage: { ...prev.publicPage, heroImageUrl: (res.data as any).url } }));
      toast.success("Hero image uploaded");
    } else {
      toast.error(res?.message || "Upload failed");
    }
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.publicSlug) {
      toast.error("Please set your public link");
      return;
    }
    if (!slugLocked) {
      const valid = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(form.publicSlug);
      if (!valid) {
        toast.error("Invalid subdomain format");
        return;
      }
      if (slugStatus !== "available") {
        toast.error("Subdomain not available");
        return;
      }
    }
    setSaving(true);
    try {
      const token = Cookies.get("token");
      const payload: DealSiteSettings = {
        ...form,
        keywords: form.keywords.map((k) => k.trim()).filter(Boolean),
        contactVisibility: {
          ...form.contactVisibility,
          whatsappNumber: form.contactVisibility.showWhatsAppButton ? form.contactVisibility.whatsappNumber : "",
        },
        footer: form.footer || { shortDescription: "", copyrightText: "" },
      };

      if (!slugLocked) {
        showPreloader("Setting up your deal site. Please wait...");
        const res = await POST_REQUEST(`${URLS.BASE}/account/dealSite/setUp`, payload, token);
        hidePreloader();
        if ((res as any)?.success) {
          toast.success("Deal Site created");
          setSlugLocked(true);
          setActiveView("manage");
          return;
        }
        throw new Error((res as any)?.message || "Setup failed");
      } else {
        showPreloader("Saving settings...");
        const res = await PUT_REQUEST(`${URLS.BASE}/account/dealSite/${form.publicSlug}/update`, payload, token);
        hidePreloader();
        if (res?.success) {
          toast.success("Settings saved");
          setActiveView("manage");
          return;
        }
        throw new Error(res?.message || "Save failed");
      }
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
      hidePreloader();
    }
  };

  const copyLink = async () => {
    if (!previewUrl) return;
    try {
      await navigator.clipboard.writeText(previewUrl);
      toast.success("Link copied");
    } catch {}
  };

  const pauseDealSite = async () => {
    if (!form.publicSlug) return;
    const token = Cookies.get("token");
    showPreloader("Pausing deal site...");
    const res = await PUT_REQUEST(`${URLS.BASE}/account/dealSite/${form.publicSlug}/pause`, {}, token);
    hidePreloader();
    if (res?.success) {
      setIsPaused(true);
      toast.success("Deal Site paused");
    } else {
      toast.error(res?.message || "Failed to pause");
    }
  };

  const resumeDealSite = async () => {
    if (!form.publicSlug) return;
    const token = Cookies.get("token");
    showPreloader("Resuming deal site...");
    const res = await PUT_REQUEST(`${URLS.BASE}/account/dealSite/${form.publicSlug}/resume`, {}, token);
    hidePreloader();
    if (res?.success) {
      setIsPaused(false);
      toast.success("Deal Site resumed");
    } else {
      toast.error(res?.message || "Failed to resume");
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteDealSite = async () => {
    if (!form.publicSlug) return;
    const token = Cookies.get("token");
    showPreloader("Deleting deal site...");
    const res = await DELETE_REQUEST(`${URLS.BASE}/account/dealSite/${form.publicSlug}/delete`, undefined, token);
    hidePreloader();
    if (res?.success) {
      toast.success("Deal Site deleted");
      setSlugLocked(false);
      setForm((prev) => ({ ...prev, publicSlug: "" }));
      setActiveView("setup");
    } else {
      toast.error(res?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user || user?.userType !== "Agent") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to agents.</p>
        </div>
      </div>
    );
  }

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
        !slugLocked
          ? "bg-gray-50 text-gray-700 border-gray-200"
          : isPaused
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${!slugLocked ? "bg-gray-400" : isPaused ? "bg-yellow-500" : "bg-emerald-500"}`} />
      {!slugLocked ? "Draft" : isPaused ? "Paused" : "Live"}
    </span>
  );

  const inputBase = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400";
  const checkboxBase = "h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500";
  const selectBase = inputBase;

  const SetupHeader = (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#09391C]">Deal Site Setup</h1>
        {statusBadge}
      </div>
      <p className="text-sm text-[#5A5D63] mt-1">Follow the steps to get your deal site live.</p>
    </div>
  );

  const ManageHeader = (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#09391C]">Deal Site</h1>
        {statusBadge}
      </div>
      <p className="text-sm text-[#5A5D63] mt-1">Your deal site settings and analytics.</p>
    </div>
  );

  const steps = [
    { label: "Public Link", status: setupStep > 0 ? "completed" : "active" },
    { label: "Design", status: setupStep > 1 ? "completed" : setupStep === 1 ? "active" : "pending" },
    { label: "Marketplace", status: setupStep > 2 ? "completed" : setupStep === 2 ? "active" : "pending" },
    { label: "Review", status: setupStep === 3 ? "active" : "pending" },
  ] as const;

  const renderBrandingSeo = (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#09391C]">Branding & SEO</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputBase}
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Keywords (comma separated)</label>
          <input
            type="text"
            value={form.keywords.join(", ")}
            onChange={(e) => setForm({ ...form, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })}
            className={inputBase}
            placeholder="agent, real estate, listings"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputBase} min-h-[100px]`}
          placeholder="Tell visitors about you"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-2">Logo</label>
        {form.logoUrl ? (
          <div className="flex items-center gap-3">
            <img src={form.logoUrl} alt="Logo" className="h-12 w-12 rounded border object-contain bg-white" />
            <button type="button" onClick={() => setForm({ ...form, logoUrl: "" })} className="px-3 py-2 text-sm border rounded-lg inline-flex items-center gap-2">
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg text-sm cursor-pointer hover:bg-gray-50">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUploadLogo(e.target.files[0])} />
            <ImageIcon size={16} /> <span className="text-gray-600">Drag & drop or click to upload</span>
          </label>
        )}
      </div>
    </div>
  );

  const renderPublicLink = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#09391C] flex items-center gap-2"><LinkIcon size={18} /> Public Link</h2>
        {slugLocked && (
          <div className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
            <ShieldCheck size={14} /> Locked
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-gray-700">Enter your subdomain (can be set once)</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={form.publicSlug}
            onChange={(e) => setForm({ ...form, publicSlug: e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase() })}
            disabled={slugLocked}
            className={`${inputBase} disabled:bg-gray-100`}
            placeholder="yourname"
            required
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">.khabiteq.com</span>
        </div>
        {!slugLocked && form.publicSlug && (
          <div className={`text-xs ${slugStatus === 'available' ? 'text-emerald-700' : slugStatus === 'taken' || slugStatus === 'invalid' ? 'text-red-600' : 'text-gray-600'}`}>
            {slugMessage}
          </div>
        )}
        {previewUrl && (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
              Preview: {previewUrl} <ExternalLink size={14} />
            </a>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-1 text-emerald-700">
              <Copy size={14} /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPublicDesign = (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#09391C]">Public Page Design</h2>
      <div>
        <label className="block text-sm text-gray-700 mb-2">Hero Image</label>
        {form.publicPage.heroImageUrl ? (
          <div className="flex items-center gap-3">
            <img src={form.publicPage.heroImageUrl} alt="Hero" className="h-20 w-36 rounded border object-cover bg-white" />
            <button type="button" onClick={() => setForm({ ...form, publicPage: { ...form.publicPage, heroImageUrl: "" } })} className="px-3 py-2 text-sm border rounded-lg inline-flex items-center gap-2">
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg text-sm cursor-pointer hover:bg-gray-50">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUploadHero(e.target.files[0])} />
            <ImageIcon size={16} /> <span className="text-gray-600">Drag & drop or click to upload</span>
          </label>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Hero Title</label>
          <input type="text" value={form.publicPage.heroTitle} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, heroTitle: e.target.value } })} className={inputBase} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Hero Subtitle</label>
          <input type="text" value={form.publicPage.heroSubtitle} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, heroSubtitle: e.target.value } })} className={inputBase} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">CTA Text</label>
          <input type="text" value={form.publicPage.ctaText} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, ctaText: e.target.value } })} className={inputBase} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">CTA Link</label>
          <input type="text" value={form.publicPage.ctaLink} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, ctaLink: e.target.value } })} className={inputBase} placeholder="/market-place?tab=buy" />
        </div>
      </div>
    </div>
  );

  const renderTheme = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Theme</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 w-36">Primary Color</label>
          <input type="color" value={form.theme.primaryColor} onChange={(e) => setForm({ ...form, theme: { ...form.theme, primaryColor: e.target.value } })} />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 w-36">Secondary Color</label>
          <input type="color" value={form.theme.secondaryColor} onChange={(e) => setForm({ ...form, theme: { ...form.theme, secondaryColor: e.target.value } })} />
        </div>
      </div>
    </div>
  );

  const renderFooterDetails = (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#09391C]">Footer Details</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Short Description</label>
          <textarea
            value={form.footer?.shortDescription || ''}
            onChange={(e) => setForm({ ...form, footer: { ...(form.footer || { shortDescription: '', copyrightText: '' }), shortDescription: e.target.value } })}
            className={`${inputBase} min-h-[80px]`}
            placeholder="Brief description shown in the footer"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Copyright Text</label>
          <input
            type="text"
            value={form.footer?.copyrightText || ''}
            onChange={(e) => setForm({ ...form, footer: { ...(form.footer || { shortDescription: '', copyrightText: '' }), copyrightText: e.target.value } })}
            className={inputBase}
            placeholder="© 2025 Your Name. All rights reserved."
          />
        </div>
      </div>
    </div>
  );

  const renderMarketplaceDefaults = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Marketplace Defaults</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Default Tab</label>
          <select value={form.marketplaceDefaults.defaultTab} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, defaultTab: e.target.value as any } })} className={selectBase}>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="shortlet">Shortlet</option>
            <option value="jv">Joint Venture</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Default Sort</label>
          <select value={form.marketplaceDefaults.defaultSort} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, defaultSort: e.target.value as any } })} className={selectBase}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input className={checkboxBase} type="checkbox" checked={form.marketplaceDefaults.showVerifiedOnly} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, showVerifiedOnly: e.target.checked } })} />
          Show only listings with verified documents
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input className={checkboxBase} type="checkbox" checked={form.marketplaceDefaults.enablePriceNegotiationButton} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, enablePriceNegotiationButton: e.target.checked } })} />
          Enable price negotiation button
        </label>
      </div>
    </div>
  );

  const renderContactVisibility = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Contact & Visibility</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm"><input className={checkboxBase} type="checkbox" checked={form.contactVisibility.showEmail} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showEmail: e.target.checked } })} /> Show Email</label>
        <label className="flex items-center gap-2 text-sm"><input className={checkboxBase} type="checkbox" checked={form.contactVisibility.showPhone} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showPhone: e.target.checked } })} /> Show Phone</label>
        <label className="flex items-center gap-2 text-sm"><input className={checkboxBase} type="checkbox" checked={form.contactVisibility.enableContactForm} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, enableContactForm: e.target.checked } })} /> Enable Contact Form</label>
        <label className="flex items-center gap-2 text-sm"><input className={checkboxBase} type="checkbox" checked={form.contactVisibility.showWhatsAppButton} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showWhatsAppButton: e.target.checked } })} /> Show WhatsApp Button</label>
      </div>
      {form.contactVisibility.showWhatsAppButton && (
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">WhatsApp Number</label>
          <input type="tel" value={form.contactVisibility.whatsappNumber} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, whatsappNumber: e.target.value } })} className={inputBase} placeholder="e.g. +2348012345678" />
        </div>
      )}
    </div>
  );

  const renderSocialLinks = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Social Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["website", "twitter", "instagram", "facebook", "linkedin"] as (keyof SocialLinks)[]).map((key) => (
          <div key={key}>
            <label className="block text-sm text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input type="url" value={(form.socialLinks?.[key] || "") as string} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })} className={inputBase} placeholder={key === "website" ? "https://your-site.com" : `https://${key}.com/your-handle`} />
          </div>
        ))}
      </div>
    </div>
  );

  const toggleSelect = (id: string) => {
    const set = new Set(selectedIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm((prev) => ({
      ...prev,
      featureSelection: {
        ...prev.featureSelection,
        mode: "manual",
        propertyIds: Array.from(set).join(","),
      },
    }));
  };

  const renderFeaturedListings = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Featured Listings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Mode</label>
          <select value={form.featureSelection.mode} onChange={(e) => setForm({ ...form, featureSelection: { ...form.featureSelection, mode: e.target.value as any } })} className={selectBase}>
            <option value="auto">Auto (Top recent)</option>
            <option value="manual">Manual (Select from your listings)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Listings to display</label>
          <input type="number" min={1} max={50} value={form.listingsLimit} onChange={(e) => setForm({ ...form, listingsLimit: Math.max(1, Math.min(50, Number(e.target.value || 1))) })} className={inputBase} />
        </div>
      </div>

      {form.featureSelection.mode === "manual" && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className={inputBase} placeholder="State" value={filters.state || ""} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value || undefined, page: 1 }))} />
              <input className={inputBase} placeholder="Local Government" value={filters.localGovernment || ""} onChange={(e) => setFilters((f) => ({ ...f, localGovernment: e.target.value || undefined, page: 1 }))} />
              <input className={inputBase} placeholder="Area" value={filters.area || ""} onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value || undefined, page: 1 }))} />
              <select className={selectBase} value={filters.propertyType || ""} onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value || undefined, page: 1 }))}>
                <option value="">All Types</option>
                <option value="duplex">Duplex</option>
                <option value="apartment">Apartment</option>
                <option value="bungalow">Bungalow</option>
              </select>
              <select className={selectBase} value={filters.propertyCategory || ""} onChange={(e) => setFilters((f) => ({ ...f, propertyCategory: e.target.value || undefined, page: 1 }))}>
                <option value="">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
              <select className={selectBase} value={filters.status || ""} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}>
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input className={inputBase} type="number" placeholder="Min Price" value={filters.priceMin ?? ""} onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value ? Number(e.target.value) : undefined, page: 1 }))} />
              <input className={inputBase} type="number" placeholder="Max Price" value={filters.priceMax ?? ""} onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value ? Number(e.target.value) : undefined, page: 1 }))} />
              <label className="flex items-center gap-2 text-sm">
                <input className={checkboxBase} type="checkbox" checked={!!filters.isApproved} onChange={(e) => setFilters((f) => ({ ...f, isApproved: e.target.checked ? true : undefined, page: 1 }))} /> Only approved
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flLoading && (
              <div className="col-span-full flex justify-center py-8 text-sm text-gray-500">Loading...</div>
            )}
            {!flLoading && properties.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">No listings found.</div>
            )}
            {properties.map((p) => (
              <label key={p._id} className={`border rounded-lg overflow-hidden bg-white cursor-pointer transition-shadow hover:shadow-md ${selectedIds.includes(p._id) ? "ring-2 ring-emerald-300" : ""}`}>
                <div className="h-32 w-full bg-gray-100 overflow-hidden">
                  {p.pictures?.[0] && <img src={p.pictures[0]} alt={p.title || p.description || "Property"} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-[#09391C] line-clamp-2">{p.title || p.description || "Property"}</div>
                    <input className={checkboxBase} type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => toggleSelect(p._id)} />
                  </div>
                  <div className="mt-1 text-xs text-[#5A5D63] line-clamp-2">
                    {p.location?.area ? `${p.location.area}, ` : ""}{p.location?.localGovernment ? `${p.location.localGovernment}, ` : ""}{p.location?.state || ""}
                  </div>
                  {p.price ? <div className="mt-1 text-sm text-[#0B572B]">₦{p.price.toLocaleString()}</div> : null}
                </div>
              </label>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-[#09391C] mb-2">Selected Listings</h4>
              <div className="flex flex-wrap gap-2">
                {selectedIds.map((id) => (
                  <span key={id} className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">{id}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderListingsLimit = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Listings</h2>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700 w-56">Number of listings to display</label>
        <input
          type="number"
          min={0}
          max={50}
          value={form.listingsLimit}
          onChange={(e) => setForm({ ...form, listingsLimit: Math.max(0, Math.min(50, Number(e.target.value || 0))) })}
          className={`${inputBase} w-32`}
        />
      </div>
    </div>
  );

  const renderInspectionSettings = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-[#09391C] mb-4">Inspection Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input className={checkboxBase} type="checkbox" checked={form.inspectionSettings.allowPublicBooking} onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, allowPublicBooking: e.target.checked } })} />
          Allow Public Booking
        </label>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Default Inspection Fee</label>
          <input type="number" min={0} value={form.inspectionSettings.defaultInspectionFee} onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, defaultInspectionFee: Math.max(0, Number(e.target.value || 0)) } })} className={inputBase} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Inspection Status</label>
          <select value={form.inspectionSettings.inspectionStatus || "optional"} onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, inspectionStatus: e.target.value } })} className={selectBase}>
            <option value="optional">Optional</option>
            <option value="required">Required</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input className={checkboxBase} type="checkbox" checked={!!form.inspectionSettings.negotiationEnabled} onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, negotiationEnabled: e.target.checked } })} />
          Enable Negotiation
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = (
    <div className="bg-white rounded-lg border border-red-200 p-6">
      <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2"><Shield size={18} /> Security Settings</h2>
      <p className="text-sm text-[#5A5D63] mb-4">Delete your deal site. This action cannot be undone.</p>
      <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">
        <Trash size={16} /> Delete Deal Site
      </button>
    </div>
  );

  const renderOverview = (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#09391C]">Your deal site is {isPaused ? "paused" : slugLocked ? "live" : "in draft"}</h2>
            {previewUrl ? (
              <div className="mt-1 text-sm text-[#0B572B] flex items-center gap-2">
                <a href={previewUrl} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">{previewUrl} <ExternalLink size={14} /></a>
                <button type="button" onClick={copyLink} className="inline-flex items-center gap-1 text-emerald-700"><Copy size={14} /> Copy</button>
              </div>
            ) : (
              <p className="text-sm text-[#5A5D63]">Set your public link to go live.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isPaused ? (
              <button onClick={pauseDealSite} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"><Pause size={16} /> Pause</button>
            ) : (
              <button onClick={resumeDealSite} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"><Play size={16} /> Resume</button>
            )}
            <button onClick={() => setActiveTab("branding")} className="px-4 py-2 border rounded-lg text-sm">Edit Settings</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-[#09391C] flex items-center gap-2"><BarChart2 size={18} /> Views (last days)</h3>
          </div>
          {viewsByDay.length > 0 ? (
            <Line
              data={{
                labels: viewsByDay.map((d) => d.date),
                datasets: [
                  {
                    label: "Views",
                    data: viewsByDay.map((d) => d.count),
                    borderColor: form.theme.primaryColor,
                    backgroundColor: form.theme.secondaryColor,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
              }}
            />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-gray-500">No analytics data available</div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-[#09391C] mb-3">Most Viewed Property</h3>
          {mostViewed ? (
            <div className="flex items-center gap-3">
              <div className="w-20 h-16 rounded bg-gray-100 overflow-hidden border">
                {mostViewed.image && <img src={mostViewed.image} alt={mostViewed.title || "Property"} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-[#09391C] line-clamp-2">{mostViewed.title}</div>
                <div className="text-xs text-[#5A5D63]">{mostViewed.views || 0} views</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-[#5A5D63]">No property view data yet.</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <CombinedAuthGuard requireAuth allowedUserTypes={["Agent"]} requireActiveSubscription>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {activeView === "setup" ? (
            <>
              {SetupHeader}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6"><Stepper steps={steps as any} /></div>

              {setupStep === 0 && (
                <Formik
                  initialValues={{
                    publicSlug: form.publicSlug,
                    title: form.title,
                    keywordsText: form.keywords.join(", "),
                    description: form.description,
                  }}
                  validationSchema={Step0Schema}
                  onSubmit={(values) => {
                    const cleanedSlug = values.publicSlug.replace(/[^a-z0-9-]/g, '').toLowerCase();
                    setForm((prev) => ({
                      ...prev,
                      publicSlug: cleanedSlug,
                      title: values.title,
                      keywords: values.keywordsText.split(',').map((k) => k.trim()).filter(Boolean),
                      description: values.description,
                    }));
                    setSetupStep(1);
                  }}
                >
                  {({ values, errors, touched, handleChange, isValid, isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-[#09391C] flex items-center gap-2"><LinkIcon size={18} /> Public Link</h2>
                          {slugLocked && (
                            <div className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                              <ShieldCheck size={14} /> Locked
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <label className="text-sm text-gray-700">Enter your subdomain (can be set once)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              name="publicSlug"
                              value={values.publicSlug}
                              onChange={(e) => {
                                const v = e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase();
                                const event = { target: { name: "publicSlug", value: v } }; // minimal event for Formik
                                handleChange(event);
                                setForm({ ...form, publicSlug: v });
                              }}

                              // onChange={(e) => {
                              //   const v = e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase();
                              //   handleChange({ ...e, target: { ...e.target, value: v } });
                              //   setForm({ ...form, publicSlug: v });
                              // }}
                              disabled={slugLocked}
                              className={`${inputBase} disabled:bg-gray-100 ${errors.publicSlug && touched.publicSlug ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                              placeholder="yourname"
                              required
                            />
                            <span className="text-sm text-gray-500 whitespace-nowrap">.khabiteq.com</span>
                          </div>
                          {!slugLocked && form.publicSlug && (
                            <div className={`text-xs ${slugStatus === 'available' ? 'text-emerald-700' : slugStatus === 'taken' || slugStatus === 'invalid' ? 'text-red-600' : 'text-gray-600'}`}>
                              {slugMessage}
                            </div>
                          )}
                          {previewUrl && (
                            <div className="flex items-center gap-2 text-sm text-emerald-700">
                              <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                                Preview: {previewUrl} <ExternalLink size={14} />
                              </a>
                              <button type="button" onClick={copyLink} className="inline-flex items-center gap-1 text-emerald-700">
                                <Copy size={14} /> Copy
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
 
                      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-[#09391C]">Branding & SEO</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              name="title"
                              value={values.title}
                              onChange={(e) => { handleChange(e); setForm({ ...form, title: e.target.value }); }}
                              className={`${inputBase} ${errors.title && touched.title ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                              placeholder="Page title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Keywords (comma separated)</label>
                            <input
                              type="text"
                              name="keywordsText"
                              value={values.keywordsText}
                              onChange={(e) => { handleChange(e); setForm({ ...form, keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) }); }}
                              className={`${inputBase} ${errors.keywordsText && touched.keywordsText ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                              placeholder="agent, real estate, listings"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Description</label>
                          <textarea
                            name="description"
                            value={values.description}
                            onChange={(e) => { handleChange(e); setForm({ ...form, description: e.target.value }); }}
                            className={`${inputBase} min-h-[100px] ${errors.description && touched.description ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                            placeholder="Tell visitors about you"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Logo</label>
                          {form.logoUrl ? (
                            <div className="flex items-center gap-3">
                              <img src={form.logoUrl} alt="Logo" className="h-12 w-12 rounded border object-contain bg-white" />
                              <button type="button" onClick={() => setForm({ ...form, logoUrl: "" })} className="px-3 py-2 text-sm border rounded-lg inline-flex items-center gap-2">
                                <Trash2 size={16} /> Remove
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUploadLogo(e.target.files[0])} />
                              <ImageIcon size={16} /> <span className="text-gray-600">Drag & drop or click to upload</span>
                            </label>
                          )}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={!isValid || isSubmitting || (!slugLocked && slugStatus !== 'available')}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B572B] text-white rounded-lg disabled:opacity-60"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              {setupStep === 1 && (
                <Formik
                  initialValues={{
                    shortDescription: form.footer?.shortDescription || '',
                    copyrightText: form.footer?.copyrightText || '',
                  }}
                  validationSchema={Step1Schema}
                  onSubmit={(values) => {
                    setForm((prev) => ({ ...prev, footer: { shortDescription: values.shortDescription, copyrightText: values.copyrightText } }));
                    setSetupStep(2);
                  }}
                >
                  {({ values, errors, touched, handleChange, isValid, isSubmitting }) => (
                    <Form className="space-y-6">
                      {renderPublicDesign}

                      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-[#09391C]">Footer Details</h2>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Short Description</label>
                            <textarea
                              name="shortDescription"
                              value={values.shortDescription}
                              onChange={(e) => { handleChange(e); setForm({ ...form, footer: { ...(form.footer || { shortDescription: '', copyrightText: '' }), shortDescription: e.target.value } }); }}
                              className={`${inputBase} min-h-[80px] ${errors.shortDescription && touched.shortDescription ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                              placeholder="Brief description shown in the footer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Copyright Text</label>
                            <input
                              type="text"
                              name="copyrightText"
                              value={values.copyrightText}
                              onChange={(e) => { handleChange(e); setForm({ ...form, footer: { ...(form.footer || { shortDescription: '', copyrightText: '' }), copyrightText: e.target.value } }); }}
                              className={`${inputBase} ${errors.copyrightText && touched.copyrightText ? 'border-red-500 focus:ring-red-200 focus:border-red-400' : ''}`}
                              placeholder="© 2025 Your Name. All rights reserved."
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B572B] text-white rounded-lg disabled:opacity-60"
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      {renderTheme}
                    </Form>
                  )}
                </Formik>
              )}
              {setupStep === 2 && (
                <div className="space-y-6">
                  {renderMarketplaceDefaults}
                  {renderContactVisibility}
                </div>
              )}
              {setupStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-[#09391C] mb-2">Review</h2>
                    <p className="text-sm text-[#5A5D63] mb-4">Everything looks good. Save to go live.</p>
                    <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><span className="text-gray-500">Public Link:</span> {previewUrl || "/pv-account/" + form.publicSlug}</div>
                      <div><span className="text-gray-500">Title:</span> {form.title || "Untitled"}</div>
                      <div><span className="text-gray-500">Listings Limit:</span> {form.listingsLimit}</div>
                      <div><span className="text-gray-500">Default Tab:</span> {form.marketplaceDefaults.defaultTab}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setSetupStep((s) => Math.max(0, s - 1))}
                  disabled={setupStep === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-[#0B572B] border-[#8DDB90] disabled:opacity-50"
                >
                  Back
                </button>

                {setupStep < 3 ? (
                  (setupStep === 0 || setupStep === 1) ? null : (
                    <button
                      type="button"
                      onClick={() => setSetupStep((s) => Math.min(3, s + 1))}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B572B] text-white rounded-lg"
                    >
                      Next
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => onSubmit()}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save & Go Live"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {ManageHeader}

              <Tabs
                active={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { id: "overview", label: "Overview", icon: <BarChart2 size={16} /> },
                  { id: "branding", label: "Branding & SEO" },
                  { id: "design", label: "Public Page Design" },
                  { id: "theme", label: "Theme" },
                  { id: "marketplace", label: "Marketplace" },
                  { id: "inspection", label: "Inspection Settings" },
                  { id: "contact", label: "Contact" },
                  { id: "social", label: "Social Links" },
                  { id: "featured", label: "Featured Listings" },
                  { id: "listings", label: "Listings" },
                  { id: "security", label: "Security Settings", icon: <Shield size={14} /> },
                ]}
              />

              <div className="mt-6 space-y-6">
                {activeTab === "overview" && renderOverview}
                {activeTab === "branding" && renderBrandingSeo}
                {activeTab === "design" && (
                  <div className="space-y-6">
                    {renderPublicDesign}
                    {renderFooterDetails}
                  </div>
                )}
                {activeTab === "theme" && renderTheme}
                {activeTab === "marketplace" && renderMarketplaceDefaults}
                {activeTab === "inspection" && renderInspectionSettings}
                {activeTab === "contact" && renderContactVisibility}
                {activeTab === "social" && renderSocialLinks}
                {activeTab === "featured" && renderFeaturedListings}
                {activeTab === "listings" && renderListingsLimit}
                {activeTab === "security" && renderSecuritySettings}

                {activeTab !== "overview" && (
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => onSubmit(e as any)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60">
                      <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Preloader */}
      <OverlayPreloader isVisible={preloader.visible} message={preloader.message} />

      {/* Delete confirmation modal */}
      <ModalWrapper isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Deletion" size="sm">
        <div className="p-4">
          <ConfirmationModal
            title="Delete Deal Site"
            message="Are you sure you want to delete your deal site? This action cannot be undone."
            type="danger"
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={deleteDealSite}
            onClose={() => setShowDeleteConfirm(false)}
          />
        </div>
      </ModalWrapper>
    </CombinedAuthGuard>
  );
}
