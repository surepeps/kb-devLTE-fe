"use client";

import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { GET_REQUEST, POST_REQUEST_FILE_UPLOAD, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import toast from "react-hot-toast";
import { Trash2, Save, Link as LinkIcon, Image as ImageIcon, ShieldCheck } from "lucide-react";

interface PublicAccessSettings {
  publicSlug: string;
  title: string;
  keywords: string[];
  description: string;
  logoUrl?: string;
  theme: { primaryColor: string; secondaryColor: string };
  inspectionSettings: { allowPublicBooking: boolean; defaultInspectionFee: number };
  listingsLimit: number;
}

const STORAGE_KEY = "public_access_settings";
const SLUG_LOCK_KEY = "public_access_slug_locked";

export default function PublicAccessSettingsPage() {
  const router = useRouter();
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

        // Attempt to fetch from server
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
            }));
            if (s.publicSlug) setSlugLocked(true);
          }
        } catch {
          // ignore network/server errors and try local storage
        }

        // Fallback to localStorage
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached) as PublicAccessSettings;
            setForm(parsed);
          }
          const locked = localStorage.getItem(SLUG_LOCK_KEY);
          if (locked === "true") setSlugLocked(true);
        } catch {
          // ignore parse errors
        }
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
      const payload: PublicAccessSettings = { ...form, keywords: form.keywords.map(k => k.trim()).filter(Boolean) };
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
      // Fallback to localStorage
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#09391C]">Public Access Settings</h1>
          <p className="text-sm text-[#5A5D63] mt-1">Customize your public page and link.</p>
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
              <div className="flex items-center gap-2">
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

          {/* Inspection Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#09391C] mb-4">Inspection Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.inspectionSettings.allowPublicBooking}
                  onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, allowPublicBooking: e.target.checked } })}
                />
                Allow public to book inspections
              </label>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 w-56">Default Inspection Fee (₦)</label>
                <input
                  type="number"
                  min={0}
                  value={form.inspectionSettings.defaultInspectionFee}
                  onChange={(e) => setForm({ ...form, inspectionSettings: { ...form.inspectionSettings, defaultInspectionFee: Number(e.target.value || 0) } })}
                  className="px-3 py-2 border rounded-lg text-sm w-48"
                />
              </div>
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

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
