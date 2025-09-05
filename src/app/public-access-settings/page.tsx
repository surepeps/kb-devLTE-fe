"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { GET_REQUEST, POST_REQUEST_FILE_UPLOAD, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import { Trash2, Save, Link as LinkIcon, Image as ImageIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { useUserContext } from "@/context/user-context";

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
  propertyIds: string; // comma separated IDs for manual mode
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
}

interface PublicAccessSettings {
  publicSlug: string;
  title: string;
  keywords: string[];
  description: string;
  logoUrl?: string;
  theme: { primaryColor: string; secondaryColor: string };
  inspectionSettings: { allowPublicBooking: boolean; defaultInspectionFee: number };
  listingsLimit: number;
  // New
  socialLinks: SocialLinks;
  contactVisibility: ContactVisibility;
  featureSelection: FeatureSelection;
  marketplaceDefaults: MarketplaceDefaults;
  publicPage: PublicPageDesign;
  testimonialsEnabled: boolean;
}

const STORAGE_KEY = "public_access_settings";
const SLUG_LOCK_KEY = "public_access_slug_locked";

export default function PublicAccessSettingsPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);

  const [form, setForm] = useState<PublicAccessSettings>({
    publicSlug: "",
    title: "",
    keywords: [],
    description: "",
    logoUrl: "",
    theme: { primaryColor: "#09391C", secondaryColor: "#8DDB90" },
    inspectionSettings: { allowPublicBooking: true, defaultInspectionFee: 0 },
    listingsLimit: 6,
    socialLinks: {},
    contactVisibility: { showEmail: true, showPhone: true, enableContactForm: true, showWhatsAppButton: false, whatsappNumber: "" },
    featureSelection: { mode: "auto", propertyIds: "" },
    marketplaceDefaults: { defaultTab: "buy", defaultSort: "newest", showVerifiedOnly: false, enablePriceNegotiationButton: true },
    publicPage: { heroTitle: "Hi, I'm your trusted agent", heroSubtitle: "Browse my verified listings and book inspections easily.", ctaText: "Browse Listings", ctaLink: "/market-place" },
    testimonialsEnabled: false,
  });

  const previewUrl = useMemo(() => {
    if (!form.publicSlug) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/pv-account/${form.publicSlug}`;
  }, [form.publicSlug]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        // Server fetch
        try {
          const res = await GET_REQUEST<any>(`${URLS.BASE}/account/public-access/settings`, token);
          if (res?.success && res.data) {
            const s = res.data as Partial<PublicAccessSettings>;
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
              },
              listingsLimit: typeof s.listingsLimit === "number" ? s.listingsLimit : prev.listingsLimit,
              socialLinks: s.socialLinks || prev.socialLinks,
              contactVisibility: s.contactVisibility || prev.contactVisibility,
              featureSelection: s.featureSelection || prev.featureSelection,
              marketplaceDefaults: s.marketplaceDefaults || prev.marketplaceDefaults,
              publicPage: s.publicPage || prev.publicPage,
              testimonialsEnabled: s.testimonialsEnabled ?? prev.testimonialsEnabled,
            }));
            if (s.publicSlug) setSlugLocked(true);
          }
        } catch {}

        // Local fallback
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) setForm(JSON.parse(cached));
          const locked = localStorage.getItem(SLUG_LOCK_KEY);
          if (locked === "true") setSlugLocked(true);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("for", "public-logo");
    const token = Cookies.get("token");

    const res = await POST_REQUEST_FILE_UPLOAD<{ url: string }>(`${URLS.BASE}${URLS.uploadSingleImg}`, formData, token);
    if (res?.success && res.data && (res.data as any).url) {
      setForm((prev) => ({ ...prev, logoUrl: (res.data as any).url }));
      toast.success("Logo uploaded");
    } else {
      toast.error(res?.message || "Upload failed");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.publicSlug) {
      toast.error("Please set your public link");
      return;
    }
    setSaving(true);
    try {
      const token = Cookies.get("token");
      const payload: PublicAccessSettings = {
        ...form,
        keywords: form.keywords.map((k) => k.trim()).filter(Boolean),
        contactVisibility: {
          ...form.contactVisibility,
          whatsappNumber: form.contactVisibility.showWhatsAppButton ? form.contactVisibility.whatsappNumber : "",
        },
      };
      const res = await PUT_REQUEST(`${URLS.BASE}/account/public-access/settings`, payload, token);
      if (res?.success) {
        toast.success("Settings saved");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        if (!slugLocked && form.publicSlug) {
          setSlugLocked(true);
          localStorage.setItem(SLUG_LOCK_KEY, "true");
        }
        return;
      }
      throw new Error(res?.message || "Save failed");
    } catch (err) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      if (!slugLocked && form.publicSlug) {
        setSlugLocked(true);
        localStorage.setItem(SLUG_LOCK_KEY, "true");
      }
      toast.success("Saved locally");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#09391C]">Public Access Settings</h1>
          <p className="text-sm text-[#5A5D63] mt-1">Customize your public marketplace page and link.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Public Link (Slug) */}
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
              <label className="text-sm text-gray-700">Choose your public link (can be set once)</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-gray-500">/pv-account/</span>
                <input
                  type="text"
                  value={form.publicSlug}
                  onChange={(e) => setForm({ ...form, publicSlug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase() })}
                  disabled={slugLocked}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
                  placeholder="your-name"
                  required
                />
              </div>
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-emerald-700">Preview: {previewUrl}</a>
              )}
            </div>
          </div>

          {/* Branding & SEO */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#09391C]">Branding & SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Page title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={form.keywords.join(", ")}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="agent, real estate, listings"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px]"
                placeholder="Tell visitors about you"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Logo</label>
              {form.logoUrl ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.logoUrl} alt="Logo" className="h-12 w-12 rounded border object-contain bg-white" />
                  <button type="button" onClick={() => setForm({ ...form, logoUrl: "" })} className="px-3 py-2 text-sm border rounded-lg inline-flex items-center gap-2">
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUploadLogo(e.target.files[0])} />
                  <ImageIcon size={16} /> Upload Logo
                </label>
              )}
            </div>
          </div>

          {/* Public Page Design */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#09391C]">Public Page Design</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Hero Title</label>
                <input type="text" value={form.publicPage.heroTitle} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, heroTitle: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Hero Subtitle</label>
                <input type="text" value={form.publicPage.heroSubtitle} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, heroSubtitle: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">CTA Text</label>
                <input type="text" value={form.publicPage.ctaText} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, ctaText: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">CTA Link</label>
                <input type="text" value={form.publicPage.ctaLink} onChange={(e) => setForm({ ...form, publicPage: { ...form.publicPage, ctaLink: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="/market-place?tab=buy" />
              </div>
            </div>
          </div>

          {/* Theme */}
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

          {/* Marketplace Defaults */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Marketplace Defaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Default Tab</label>
                <select value={form.marketplaceDefaults.defaultTab} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, defaultTab: e.target.value as any } })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="shortlet">Shortlet</option>
                  <option value="jv">Joint Venture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Default Sort</label>
                <select value={form.marketplaceDefaults.defaultSort} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, defaultSort: e.target.value as any } })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.marketplaceDefaults.showVerifiedOnly} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, showVerifiedOnly: e.target.checked } })} />
                Show only listings with verified documents
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.marketplaceDefaults.enablePriceNegotiationButton} onChange={(e) => setForm({ ...form, marketplaceDefaults: { ...form.marketplaceDefaults, enablePriceNegotiationButton: e.target.checked } })} />
                Enable price negotiation button
              </label>
            </div>
          </div>

          {/* Contact Visibility */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Contact & Visibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.contactVisibility.showEmail} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showEmail: e.target.checked } })} /> Show Email</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.contactVisibility.showPhone} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showPhone: e.target.checked } })} /> Show Phone</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.contactVisibility.enableContactForm} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, enableContactForm: e.target.checked } })} /> Enable Contact Form</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.contactVisibility.showWhatsAppButton} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, showWhatsAppButton: e.target.checked } })} /> Show WhatsApp Button</label>
            </div>
            {form.contactVisibility.showWhatsAppButton && (
              <div className="mt-3">
                <label className="block text-sm text-gray-700 mb-1">WhatsApp Number</label>
                <input type="tel" value={form.contactVisibility.whatsappNumber} onChange={(e) => setForm({ ...form, contactVisibility: { ...form.contactVisibility, whatsappNumber: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. +2348012345678" />
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["website","twitter","instagram","facebook","linkedin"] as (keyof SocialLinks)[]).map((key) => (
                <div key={key}>
                  <label className="block text-sm text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input type="url" value={(form.socialLinks?.[key] || "") as string} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={key === "website" ? "https://your-site.com" : `https://${key}.com/your-handle`} />
                </div>
              ))}
            </div>
          </div>

          {/* Featured Listings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Featured Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Mode</label>
                <select value={form.featureSelection.mode} onChange={(e) => setForm({ ...form, featureSelection: { ...form.featureSelection, mode: e.target.value as any } })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="auto">Auto (Top recent)</option>
                  <option value="manual">Manual (Specify IDs)</option>
                </select>
              </div>
              {form.featureSelection.mode === "manual" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Property IDs (comma separated)</label>
                  <input type="text" value={form.featureSelection.propertyIds} onChange={(e) => setForm({ ...form, featureSelection: { ...form.featureSelection, propertyIds: e.target.value } })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="prop123, prop456" />
                </div>
              )}
            </div>
          </div>

          {/* Listings Limit */}
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
                className="px-3 py-2 border rounded-lg text-sm w-32"
              />
            </div>
          </div>

          {/* Extras */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Extras</h2>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.testimonialsEnabled} onChange={(e) => setForm({ ...form, testimonialsEnabled: e.target.checked })} /> Show testimonials section</label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
