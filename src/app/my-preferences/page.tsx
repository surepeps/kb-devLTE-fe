"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST, DELETE_REQUEST, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin as MapPinIcon,
  ArrowLeft as ArrowLeftIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  Building as BuildingIcon,
  Briefcase as BriefcaseIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  TrendingUp as TrendingUpIcon,
  Eye as EyeIcon,
  Share as ShareIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  Heart as HeartIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Zap as ZapIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  RefreshCw as RefreshIcon,
  MoreVertical as MoreVerticalIcon,
  Copy as CopyIcon,
  ExternalLink as ExternalLinkIcon,
  PauseCircle as PauseCircleIcon,
  PlayCircle as PlayCircleIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";
import AuthGuard from "@/components/common/AuthGuard";

interface PreferenceData {
  _id: string;
  preferenceType: "buy" | "rent" | "joint-venture" | "shortlet";
  propertyType: string;
  properenceMode?: string;
  location: {
    state: string;
    localGovernmentAreas: string[];
    areas?: string[];
    customLocation?: string;
  };
  budgetMin: number;
  budgetMax: number;
  propertyDetails?: {
    minBedrooms?: number;
    minBathrooms?: number;
    propertyCondition?: string;
    purpose?: string;
    landSize?: string;
    measurementUnit?: string;
  };
  features?: {
    baseFeatures?: string[];
    premiumFeatures?: string[];
  };
  contactInfo?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  additionalNotes?: string;
  status: "active" | "paused" | "fulfilled" | "expired";
  matchingProperties?: number;
  lastMatchDate?: string;
  isPublic: boolean;
  priority: "high" | "medium" | "low";
  notifications: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PreferenceMetrics {
  totalPreferences: number;
  activePreferences: number;
  totalMatches: number;
  recentMatches: number;
  conversionRate: string;
  avgResponseTime: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  action: () => void;
}

const PREFERENCE_TYPE_CONFIG = {
  buy: {
    label: "Purchase",
    shortLabel: "Buy",
    icon: HomeIcon,
    color: "emerald",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    iconColor: "text-emerald-600",
  },
  rent: {
    label: "Rental",
    shortLabel: "Rent",
    icon: BuildingIcon,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    iconColor: "text-blue-600",
  },
  "joint-venture": {
    label: "Joint Venture",
    shortLabel: "JV",
    icon: BriefcaseIcon,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    iconColor: "text-purple-600",
  },
  shortlet: {
    label: "Shortlet",
    shortLabel: "Shortlet",
    icon: ClockIcon,
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    iconColor: "text-orange-600",
  },
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: CheckCircleIcon,
  },
  paused: {
    label: "Paused",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: PauseCircleIcon,
  },
  fulfilled: {
    label: "Fulfilled",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: CheckCircleIcon,
  },
  expired: {
    label: "Expired",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    icon: XCircleIcon,
  },
};

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    dotColor: "bg-red-400",
  },
  medium: {
    label: "Medium",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    dotColor: "bg-yellow-400",
  },
  low: {
    label: "Low",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    dotColor: "bg-green-400",
  },
};

const FILTER_OPTIONS = {
  preferenceType: [
    { value: "", label: "All Types" },
    { value: "buy", label: "Purchase" },
    { value: "rent", label: "Rental" },
    { value: "joint-venture", label: "Joint Venture" },
    { value: "shortlet", label: "Shortlet" },
  ],
  status: [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "fulfilled", label: "Fulfilled" },
    { value: "expired", label: "Expired" },
  ],
  priority: [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ],
  sortBy: [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priority", label: "Priority" },
    { value: "matches", label: "Most Matches" },
    { value: "budget_high", label: "Budget: High to Low" },
    { value: "budget_low", label: "Budget: Low to High" },
  ],
};

export default function MyPreferencesPage() {
  const router = useRouter();
  const { user } = useUserContext();
  
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [filteredPreferences, setFilteredPreferences] = useState<PreferenceData[]>([]);
  const [metrics, setMetrics] = useState<PreferenceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPreference, setSelectedPreference] = useState<PreferenceData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    preferenceType: "",
    status: "",
    priority: "",
    sortBy: "newest",
    dateFrom: "",
    dateTo: "",
    budgetRange: { min: "", max: "" },
  });

  // Mock data for demonstration - Replace with actual API calls
  const mockPreferences: PreferenceData[] = [
    {
      _id: "1",
      preferenceType: "buy",
      propertyType: "3 Bedroom Apartment",
      location: {
        state: "Lagos",
        localGovernmentAreas: ["Victoria Island", "Ikoyi"],
        areas: ["VI Extension", "Banana Island"],
      },
      budgetMin: 50000000,
      budgetMax: 80000000,
      propertyDetails: {
        minBedrooms: 3,
        minBathrooms: 3,
        propertyCondition: "Brand New",
        purpose: "Personal Use",
      },
      features: {
        baseFeatures: ["Swimming Pool", "24/7 Security", "Parking"],
        premiumFeatures: ["Gym", "Concierge Service", "Smart Home"],
      },
      contactInfo: {
        fullName: "John Agent",
        email: "john@agent.com",
        phoneNumber: "+234 803 123 4567",
      },
      additionalNotes: "Looking for luxury apartments for high-end clients in prime locations.",
      status: "active",
      matchingProperties: 23,
      lastMatchDate: "2024-01-15T10:00:00.000Z",
      isPublic: true,
      priority: "high",
      notifications: true,
      expiresAt: "2024-06-10T10:00:00.000Z",
      createdAt: "2024-01-10T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    },
    {
      _id: "2",
      preferenceType: "rent",
      propertyType: "2 Bedroom Flat",
      location: {
        state: "Lagos",
        localGovernmentAreas: ["Ikeja", "Surulere"],
      },
      budgetMin: 800000,
      budgetMax: 1500000,
      propertyDetails: {
        minBedrooms: 2,
        minBathrooms: 2,
        propertyCondition: "Good Condition",
      },
      features: {
        baseFeatures: ["Parking", "Security", "Water Supply"],
        premiumFeatures: ["Generator", "Elevator"],
      },
      additionalNotes: "Affordable housing options for young professionals.",
      status: "active",
      matchingProperties: 67,
      lastMatchDate: "2024-01-14T15:30:00.000Z",
      isPublic: true,
      priority: "medium",
      notifications: true,
      createdAt: "2024-01-08T14:00:00.000Z",
      updatedAt: "2024-01-14T15:30:00.000Z",
    },
    {
      _id: "3",
      preferenceType: "joint-venture",
      propertyType: "Commercial Land",
      location: {
        state: "Lagos",
        localGovernmentAreas: ["Lekki", "Ajah"],
      },
      budgetMin: 100000000,
      budgetMax: 500000000,
      propertyDetails: {
        landSize: "2000-10000",
        measurementUnit: "Square Meters",
      },
      additionalNotes: "Looking for joint venture opportunities for commercial development projects.",
      status: "paused",
      matchingProperties: 8,
      lastMatchDate: "2024-01-05T12:00:00.000Z",
      isPublic: false,
      priority: "high",
      notifications: false,
      createdAt: "2024-01-03T16:00:00.000Z",
      updatedAt: "2024-01-12T09:00:00.000Z",
    },
  ];

  // Fetch preferences
  const fetchPreferences = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    if (!showLoading) setIsRefreshing(true);

    try {
      // Replace with actual API call
      // const url = `${URLS.BASE}/user/preferences`;
      // const token = Cookies.get("token");
      // const response = await GET_REQUEST(url, token);
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setPreferences(mockPreferences);
      
      // Calculate metrics
      calculateMetrics(mockPreferences);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Failed to load preferences");
      setPreferences([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Calculate metrics
  const calculateMetrics = useCallback((data: PreferenceData[]) => {
    const metrics: PreferenceMetrics = {
      totalPreferences: data.length,
      activePreferences: data.filter(p => p.status === "active").length,
      totalMatches: data.reduce((sum, p) => sum + (p.matchingProperties || 0), 0),
      recentMatches: data.filter(p => 
        p.lastMatchDate && 
        new Date(p.lastMatchDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      conversionRate: "18.5%",
      avgResponseTime: "2.3 hours",
    };
    setMetrics(metrics);
  }, []);

  // Filter preferences
  const filterPreferences = useCallback(() => {
    let filtered = [...preferences];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pref) =>
          pref.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pref.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pref.location.localGovernmentAreas.some(lga => 
            lga.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          pref.additionalNotes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.preferenceType) {
      filtered = filtered.filter((pref) => pref.preferenceType === filters.preferenceType);
    }

    if (filters.status) {
      filtered = filtered.filter((pref) => pref.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((pref) => pref.priority === filters.priority);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (pref) => new Date(pref.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (pref) => new Date(pref.createdAt) <= new Date(filters.dateTo)
      );
    }

    if (filters.budgetRange.min) {
      filtered = filtered.filter((pref) => pref.budgetMax >= parseInt(filters.budgetRange.min));
    }

    if (filters.budgetRange.max) {
      filtered = filtered.filter((pref) => pref.budgetMin <= parseInt(filters.budgetRange.max));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "matches":
        filtered.sort((a, b) => (b.matchingProperties || 0) - (a.matchingProperties || 0));
        break;
      case "budget_high":
        filtered.sort((a, b) => b.budgetMax - a.budgetMax);
        break;
      case "budget_low":
        filtered.sort((a, b) => a.budgetMin - b.budgetMin);
        break;
    }

    setFilteredPreferences(filtered);
  }, [preferences, searchTerm, filters]);

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user, fetchPreferences]);

  // Apply filters when they change
  useEffect(() => {
    filterPreferences();
  }, [filterPreferences]);

  // Quick actions
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: "create",
      label: "Create New",
      icon: PlusIcon,
      color: "emerald",
      action: () => router.push("/preference"),
    },
    {
      id: "marketplace",
      label: "Browse Market",
      icon: EyeIcon,
      color: "blue",
      action: () => router.push("/market-place"),
    },
    {
      id: "analytics",
      label: "View Analytics",
      icon: TrendingUpIcon,
      color: "purple",
      action: () => toast("Analytics coming soon", { icon: "ℹ️" }),
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      color: "gray",
      action: () => toast("Settings coming soon", { icon: "ℹ️" }),
    },
  ], [router]);

  // Handle actions
  const handleToggleStatus = useCallback(async (preferenceId: string, newStatus: "active" | "paused") => {
    try {
      setPreferences(prev =>
        prev.map(pref =>
          pref._id === preferenceId
            ? { ...pref, status: newStatus, updatedAt: new Date().toISOString() }
            : pref
        )
      );
      toast.success(`Preference ${newStatus === "active" ? "activated" : "paused"} successfully`);
    } catch (error) {
      console.error("Failed to update preference status:", error);
      toast.error("Failed to update preference status");
    }
  }, []);

  const handleDeletePreference = useCallback(async (preferenceId: string) => {
    try {
      setPreferences(prev => prev.filter(pref => pref._id !== preferenceId));
      toast.success("Preference deleted successfully");
      setShowDeleteModal(false);
      setSelectedPreference(null);
    } catch (error) {
      console.error("Failed to delete preference:", error);
      toast.error("Failed to delete preference");
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPreferences(false);
  }, [fetchPreferences]);

  const clearFilters = useCallback(() => {
    setFilters({
      preferenceType: "",
      status: "",
      priority: "",
      sortBy: "newest",
      dateFrom: "",
      dateTo: "",
      budgetRange: { min: "", max: "" },
    });
    setSearchTerm("");
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <AuthGuard requireAuth allowedUserTypes={["Agent"]}>
        <Loading />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth allowedUserTypes={["Agent"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <Link
                href="/agent/dashboard"
                className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium transition-colors"
              >
                <ArrowLeftIcon size={20} />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#09391C] font-display mb-3 leading-tight">
                  My Preferences
                </h1>
                <p className="text-[#5A5D63] text-xl leading-relaxed">
                  Manage your property preferences and track matching opportunities
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  <RefreshIcon size={16} className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  onClick={action.action}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group`}
                >
                  <div className={`p-3 bg-${action.color}-100 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={24} className={`text-${action.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-[#09391C] group-hover:text-[#8DDB90] transition-colors">
                    {action.label}
                  </h3>
                </motion.button>
              );
            })}
          </div>

          {/* Metrics Dashboard */}
          {metrics && (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileTextIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-[#09391C]">{metrics.totalPreferences}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircleIcon size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.activePreferences}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <TargetIcon size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Matches</p>
                    <p className="text-2xl font-bold text-purple-600">{metrics.totalMatches}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <ZapIcon size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.recentMatches}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <TrendingUpIcon size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion</p>
                    <p className="text-lg font-bold text-emerald-600">{metrics.conversionRate}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <ClockIcon size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-lg font-bold text-indigo-600">{metrics.avgResponseTime}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <SearchIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search preferences by type, location, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8DDB90] text-white rounded-xl hover:bg-[#7BC87F] transition-all duration-200 font-medium"
              >
                <FilterIcon size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={filters.preferenceType}
                          onChange={(e) => setFilters({...filters, preferenceType: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-all duration-200"
                        >
                          {FILTER_OPTIONS.preferenceType.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({...filters, status: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-all duration-200"
                        >
                          {FILTER_OPTIONS.status.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={filters.priority}
                          onChange={(e) => setFilters({...filters, priority: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-all duration-200"
                        >
                          {FILTER_OPTIONS.priority.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                          value={filters.sortBy}
                          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-all duration-200"
                        >
                          {FILTER_OPTIONS.sortBy.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {filteredPreferences.length} of {preferences.length} preferences
                      </span>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[#8DDB90] hover:text-[#7BC87F] font-medium transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preferences List */}
          {filteredPreferences.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                {searchTerm || Object.values(filters).some(f => f !== "" && f !== "newest")
                  ? "No matching preferences found"
                  : "No preferences yet"}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                {searchTerm || Object.values(filters).some(f => f !== "" && f !== "newest")
                  ? "Try adjusting your search or filter criteria to find what you're looking for"
                  : "Create your first property preference to start receiving matching opportunities"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || Object.values(filters).some(f => f !== "" && f !== "newest")) ? (
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-[#8DDB90] hover:bg-[#7BC87F] text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <>
                    <Link
                      href="/preference"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#8DDB90] hover:bg-[#7BC87F] text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <PlusIcon size={16} />
                      Create Your First Preference
                    </Link>
                    <Link
                      href="/market-place"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-[#09391C] border border-gray-300 rounded-xl font-medium transition-all duration-200"
                    >
                      <EyeIcon size={16} />
                      Browse Properties
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredPreferences.map((preference, index) => {
                const typeConfig = PREFERENCE_TYPE_CONFIG[preference.preferenceType];
                const statusConfig = STATUS_CONFIG[preference.status];
                const priorityConfig = PRIORITY_CONFIG[preference.priority];
                const TypeIcon = typeConfig.icon;
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div
                    key={preference._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Icon and Type */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 ${typeConfig.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <TypeIcon size={24} className={typeConfig.iconColor} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-[#09391C] group-hover:text-[#8DDB90] transition-colors">
                                  {preference.propertyType}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                                  {typeConfig.label}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                  {statusConfig.label}
                                </span>
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}></div>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor}`}>
                                    {priorityConfig.label}
                                  </span>
                                </div>
                                {!preference.isPublic && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    PRIVATE
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                                <MapPinIcon size={14} />
                                {preference.location.localGovernmentAreas.join(", ")}, {preference.location.state}
                              </p>
                              <p className="text-lg font-semibold text-[#8DDB90] mb-3">
                                ₦{preference.budgetMin.toLocaleString()} - ₦{preference.budgetMax.toLocaleString()}
                              </p>
                              {preference.matchingProperties !== undefined && (
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-green-600 font-medium">
                                    {preference.matchingProperties} matching properties
                                  </span>
                                  {preference.lastMatchDate && (
                                    <span className="text-gray-500">
                                      Last match: {new Date(preference.lastMatchDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Action Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === preference._id ? null : preference._id)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                              >
                                <MoreVerticalIcon size={20} />
                              </button>
                              
                              <AnimatePresence>
                                {activeDropdown === preference._id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                                  >
                                    <button
                                      onClick={() => {
                                        setSelectedPreference(preference);
                                        setShowDetailModal(true);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <EyeIcon size={16} />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        router.push(`/preference/edit/${preference._id}`);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <EditIcon size={16} />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        router.push(`/agent_marketplace?preference=${preference._id}`);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <ExternalLinkIcon size={16} />
                                      View Matches
                                    </button>
                                    {preference.status === "active" ? (
                                      <button
                                        onClick={() => {
                                          handleToggleStatus(preference._id, "paused");
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <PauseCircleIcon size={16} />
                                        Pause
                                      </button>
                                    ) : preference.status === "paused" ? (
                                      <button
                                        onClick={() => {
                                          handleToggleStatus(preference._id, "active");
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <PlayCircleIcon size={16} />
                                        Activate
                                      </button>
                                    ) : null}
                                    <hr className="my-1" />
                                    <button
                                      onClick={() => {
                                        setSelectedPreference(preference);
                                        setShowDeleteModal(true);
                                        setActiveDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                    >
                                      <TrashIcon size={16} />
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Requirements */}
                            {preference.propertyDetails && (
                              <div>
                                <h4 className="text-sm font-medium text-[#09391C] mb-2">Requirements</h4>
                                <div className="space-y-1 text-sm text-[#5A5D63]">
                                  {preference.propertyDetails.minBedrooms && (
                                    <p>{preference.propertyDetails.minBedrooms} Bedroom{preference.propertyDetails.minBedrooms > 1 ? "s" : ""}</p>
                                  )}
                                  {preference.propertyDetails.minBathrooms && (
                                    <p>{preference.propertyDetails.minBathrooms} Bathroom{preference.propertyDetails.minBathrooms > 1 ? "s" : ""}</p>
                                  )}
                                  {preference.propertyDetails.propertyCondition && (
                                    <p>Condition: {preference.propertyDetails.propertyCondition}</p>
                                  )}
                                  {preference.propertyDetails.landSize && (
                                    <p>Size: {preference.propertyDetails.landSize} {preference.propertyDetails.measurementUnit}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Features */}
                            {preference.features && (preference.features.baseFeatures || preference.features.premiumFeatures) && (
                              <div>
                                <h4 className="text-sm font-medium text-[#09391C] mb-2">Features</h4>
                                <div className="flex flex-wrap gap-1">
                                  {preference.features.baseFeatures?.slice(0, 3).map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                  {(preference.features.baseFeatures?.length || 0) > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                      +{(preference.features.baseFeatures?.length || 0) - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Timeline */}
                            <div>
                              <h4 className="text-sm font-medium text-[#09391C] mb-2">Timeline</h4>
                              <div className="space-y-1 text-sm text-[#5A5D63]">
                                <p className="flex items-center gap-1">
                                  <CalendarIcon size={12} />
                                  Created: {new Date(preference.createdAt).toLocaleDateString()}
                                </p>
                                {preference.expiresAt && (
                                  <p className="flex items-center gap-1 text-orange-600">
                                    <ClockIcon size={12} />
                                    Expires: {new Date(preference.expiresAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Additional Notes */}
                          {preference.additionalNotes && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-[#09391C] mb-2">Additional Notes</h4>
                              <p className="text-sm text-[#5A5D63] bg-gray-50 p-3 rounded-lg leading-relaxed">
                                {preference.additionalNotes}
                              </p>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedPreference(preference);
                                setShowDetailModal(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-all duration-200 text-sm font-medium group-hover:scale-105"
                            >
                              <EyeIcon size={14} />
                              View Details
                            </button>
                            
                            <button
                              onClick={() => router.push(`/preference/edit/${preference._id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                            >
                              <EditIcon size={14} />
                              Edit
                            </button>
                            
                            <button
                              onClick={() => router.push(`/agent_marketplace?preference=${preference._id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                            >
                              <ExternalLinkIcon size={14} />
                              View Matches ({preference.matchingProperties || 0})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedPreference && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-[#09391C]">
                      Preference Details
                    </h2>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XCircleIcon size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-600">Property Type:</span>
                        <p className="mt-1">{selectedPreference.propertyType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Preference Type:</span>
                        <p className="mt-1 capitalize">{selectedPreference.preferenceType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Status:</span>
                        <p className="mt-1 capitalize">{selectedPreference.status}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Priority:</span>
                        <p className="mt-1 capitalize">{selectedPreference.priority}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-600">Budget Range:</span>
                        <p className="mt-1 font-medium text-[#8DDB90]">
                          ₦{selectedPreference.budgetMin.toLocaleString()} - ₦{selectedPreference.budgetMax.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Location Preferences</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">State:</span>
                          <p className="mt-1">{selectedPreference.location.state}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Local Government Areas:</span>
                          <p className="mt-1">{selectedPreference.location.localGovernmentAreas.join(", ")}</p>
                        </div>
                        {selectedPreference.location.areas && selectedPreference.location.areas.length > 0 && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Specific Areas:</span>
                            <p className="mt-1">{selectedPreference.location.areas.join(", ")}</p>
                          </div>
                        )}
                        {selectedPreference.location.customLocation && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Custom Location:</span>
                            <p className="mt-1">{selectedPreference.location.customLocation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  {selectedPreference.propertyDetails && (
                    <div>
                      <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Property Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                        {Object.entries(selectedPreference.propertyDetails).map(([key, value]) => (
                          value && (
                            <div key={key}>
                              <span className="font-medium text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                              </span>
                              <p className="mt-1">{value}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedPreference.features && (
                    <div>
                      <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Features & Amenities</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedPreference.features.baseFeatures && selectedPreference.features.baseFeatures.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-600 block mb-2">Base Features:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedPreference.features.baseFeatures.map((feature, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedPreference.features.premiumFeatures && selectedPreference.features.premiumFeatures.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600 block mb-2">Premium Features:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedPreference.features.premiumFeatures.map((feature, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {selectedPreference.contactInfo && (
                    <div>
                      <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                        {Object.entries(selectedPreference.contactInfo).map(([key, value]) => (
                          value && (
                            <div key={key}>
                              <span className="font-medium text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                              </span>
                              <p className="mt-1">{value}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedPreference.additionalNotes && (
                    <div>
                      <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Additional Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedPreference.additionalNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Matching Stats */}
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Matching Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-600">Matching Properties:</span>
                        <p className="mt-1 font-medium text-green-600">{selectedPreference.matchingProperties || 0}</p>
                      </div>
                      {selectedPreference.lastMatchDate && (
                        <div>
                          <span className="font-medium text-gray-600">Last Match:</span>
                          <p className="mt-1">{new Date(selectedPreference.lastMatchDate).toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600">Notifications:</span>
                        <p className="mt-1">{selectedPreference.notifications ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Visibility:</span>
                        <p className="mt-1">{selectedPreference.isPublic ? "Public" : "Private"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-600">Created:</span>
                        <p className="mt-1">{new Date(selectedPreference.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Last Updated:</span>
                        <p className="mt-1">{new Date(selectedPreference.updatedAt).toLocaleString()}</p>
                      </div>
                      {selectedPreference.expiresAt && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-600">Expires:</span>
                          <p className="mt-1 text-orange-600">{new Date(selectedPreference.expiresAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        router.push(`/preference/edit/${selectedPreference._id}`);
                      }}
                      className="px-6 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
                    >
                      Edit Preference
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedPreference && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-md w-full"
              >
                <div className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrashIcon size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#09391C] mb-2">
                      Delete Preference
                    </h3>
                    <p className="text-[#5A5D63] mb-6 leading-relaxed">
                      Are you sure you want to delete this preference? This action cannot be undone and you will lose all matching history.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePreference(selectedPreference._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside to close dropdown */}
        {activeDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
