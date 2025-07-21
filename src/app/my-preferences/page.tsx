"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST, DELETE_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface AgentPreference {
  _id: string;
  preferenceType: "buy" | "rent" | "joint-venture" | "shortlet";
  propertyType: string;
  propertyCondition?: "Brand New" | "Good Condition" | "Any";
  location: {
    state: string;
    localGovernmentAreas: string[];
    areas?: string[];
    customLocation?: string;
  };
  budgetMin: number;
  budgetMax: number;
  noOfBedrooms?: number;
  noOfBathrooms?: number;
  features?: {
    baseFeatures: string[];
    premiumFeatures: string[];
  };
  documents?: string[];
  landSize?: {
    min: number;
    max: number;
    unit: string;
  };
  additionalInfo?: string;
  status: "active" | "paused" | "fulfilled" | "expired";
  matchingProperties?: number;
  lastMatchDate?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  priority: "high" | "medium" | "low";
  expiresAt?: string;
}

interface PreferenceMetrics {
  totalPreferences: number;
  activePreferences: number;
  matchingProperties: number;
  recentMatches: number;
  conversionRate: string;
}

const PREFERENCE_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "buy", label: "Purchase" },
  { value: "rent", label: "Rental" },
  { value: "joint-venture", label: "Joint Venture" },
  { value: "shortlet", label: "Shortlet" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "expired", label: "Expired" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "Priority" },
  { value: "matches", label: "Most Matches" },
  { value: "budget_high", label: "Budget: High to Low" },
  { value: "budget_low", label: "Budget: Low to High" },
];

export default function MyPreferencesPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [preferences, setPreferences] = useState<AgentPreference[]>([]);
  const [filteredPreferences, setFilteredPreferences] = useState<AgentPreference[]>([]);
  const [metrics, setMetrics] = useState<PreferenceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState<AgentPreference | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    preferenceType: "all",
    status: "all",
    sortBy: "newest",
    location: "",
    budgetRange: { min: "", max: "" },
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Only allow agents to access this page
    if (user.userType !== "Agent") {
      router.push("/");
      return;
    }

    if (!user.accountApproved) {
      router.push("/agent/under-review");
      return;
    }

    fetchPreferences();
    fetchMetrics();
  }, [user, router]);

  useEffect(() => {
    filterPreferences();
  }, [preferences, searchTerm, filters]);

  const fetchMetrics = async () => {
    try {
      // Mock metrics data - replace with actual API call
      const mockMetrics: PreferenceMetrics = {
        totalPreferences: 12,
        activePreferences: 8,
        matchingProperties: 145,
        recentMatches: 23,
        conversionRate: "18.5%",
      };
      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);

      // Enhanced mock data for agent's own preferences
      const mockData: AgentPreference[] = [
        {
          _id: "1",
          preferenceType: "buy",
          propertyType: "3 Bedroom Apartment",
          propertyCondition: "Brand New",
          location: {
            state: "Lagos",
            localGovernmentAreas: ["Victoria Island", "Ikoyi"],
            areas: ["VI Extension", "Banana Island"],
          },
          budgetMin: 50000000,
          budgetMax: 80000000,
          noOfBedrooms: 3,
          noOfBathrooms: 3,
          features: {
            baseFeatures: ["Swimming Pool", "24/7 Security", "Parking"],
            premiumFeatures: ["Gym", "Concierge Service", "Smart Home"],
          },
          documents: ["C of O", "Governor Consent"],
          additionalInfo: "Looking for luxury apartments for high-end clients in prime locations.",
          status: "active",
          matchingProperties: 23,
          lastMatchDate: "2024-01-15T10:00:00.000Z",
          createdAt: "2024-01-10T10:00:00.000Z",
          updatedAt: "2024-01-15T10:00:00.000Z",
          isPublic: true,
          priority: "high",
          expiresAt: "2024-06-10T10:00:00.000Z",
        },
        {
          _id: "2",
          preferenceType: "rent",
          propertyType: "2 Bedroom Flat",
          propertyCondition: "Good Condition",
          location: {
            state: "Lagos",
            localGovernmentAreas: ["Ikeja", "Surulere"],
            customLocation: "Close to major transportation hubs",
          },
          budgetMin: 800000,
          budgetMax: 1500000,
          noOfBedrooms: 2,
          noOfBathrooms: 2,
          features: {
            baseFeatures: ["Parking", "Security", "Water Supply"],
            premiumFeatures: ["Generator", "Elevator"],
          },
          additionalInfo: "Affordable housing options for young professionals.",
          status: "active",
          matchingProperties: 67,
          lastMatchDate: "2024-01-14T15:30:00.000Z",
          createdAt: "2024-01-08T14:00:00.000Z",
          updatedAt: "2024-01-14T15:30:00.000Z",
          isPublic: true,
          priority: "medium",
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
          landSize: {
            min: 2000,
            max: 10000,
            unit: "Square Meters",
          },
          documents: ["Survey Document", "C of O", "EIA Certificate"],
          additionalInfo: "Looking for joint venture opportunities for commercial development projects.",
          status: "paused",
          matchingProperties: 8,
          lastMatchDate: "2024-01-05T12:00:00.000Z",
          createdAt: "2024-01-03T16:00:00.000Z",
          updatedAt: "2024-01-12T09:00:00.000Z",
          isPublic: false,
          priority: "high",
        },
        {
          _id: "4",
          preferenceType: "shortlet",
          propertyType: "1 Bedroom Apartment",
          propertyCondition: "Any",
          location: {
            state: "Lagos",
            localGovernmentAreas: ["Victoria Island", "Lekki"],
          },
          budgetMin: 15000,
          budgetMax: 30000,
          noOfBedrooms: 1,
          noOfBathrooms: 1,
          features: {
            baseFeatures: ["WiFi", "AC", "Kitchen"],
            premiumFeatures: ["Pool", "Gym", "24/7 Security"],
          },
          additionalInfo: "Short-term accommodation for business travelers and tourists.",
          status: "fulfilled",
          matchingProperties: 45,
          lastMatchDate: "2024-01-10T08:00:00.000Z",
          createdAt: "2023-12-20T10:00:00.000Z",
          updatedAt: "2024-01-10T08:00:00.000Z",
          isPublic: true,
          priority: "low",
        },
      ];

      setPreferences(mockData);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPreferences = () => {
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
          pref.additionalInfo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Preference type filter
    if (filters.preferenceType !== "all") {
      filtered = filtered.filter((pref) => pref.preferenceType === filters.preferenceType);
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((pref) => pref.status === filters.status);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(
        (pref) =>
          pref.location.state.toLowerCase().includes(filters.location.toLowerCase()) ||
          pref.location.localGovernmentAreas.some(lga =>
            lga.toLowerCase().includes(filters.location.toLowerCase())
          )
      );
    }

    // Budget range filter
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
  };

  const handleDeletePreference = async (preferenceId: string) => {
    try {
      // API call would go here
      setPreferences(prev => prev.filter(pref => pref._id !== preferenceId));
      toast.success("Preference deleted successfully");
      setShowDeleteModal(false);
      setSelectedPreference(null);
    } catch (error) {
      console.error("Failed to delete preference:", error);
      toast.error("Failed to delete preference");
    }
  };

  const handleToggleStatus = async (preferenceId: string, newStatus: "active" | "paused") => {
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
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "paused":
        return <AlertCircleIcon size={16} className="text-yellow-500" />;
      case "fulfilled":
        return <CheckCircleIcon size={16} className="text-blue-500" />;
      case "expired":
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "fulfilled":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPreferenceTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <HomeIcon size={20} className="text-green-500" />;
      case "rent":
        return <BuildingIcon size={20} className="text-blue-500" />;
      case "joint-venture":
        return <BriefcaseIcon size={20} className="text-purple-500" />;
      case "shortlet":
        return <ClockIcon size={20} className="text-orange-500" />;
      default:
        return <FileTextIcon size={20} className="text-gray-500" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      preferenceType: "all",
      status: "all",
      sortBy: "newest",
      location: "",
      budgetRange: { min: "", max: "" },
    });
    setSearchTerm("");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Link
              href="/agent/dashboard"
              className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium"
            >
              <ArrowLeftIcon size={20} />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#09391C] font-display mb-2">
                My Preferences
              </h1>
              <p className="text-[#5A5D63] text-lg">
                Manage your property preferences and track matching opportunities
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/preference"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
              >
                <PlusIcon size={16} />
                Add New Preference
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Dashboard */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileTextIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#09391C]">{metrics.totalPreferences}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.activePreferences}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BuildingIcon size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Matches</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.matchingProperties}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUpIcon size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.recentMatches}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSignIcon size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion</p>
                  <p className="text-lg font-bold text-emerald-600">{metrics.conversionRate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search preferences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>

            <select
              value={filters.preferenceType}
              onChange={(e) => setFilters({...filters, preferenceType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            >
              {PREFERENCE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredPreferences.length} of {preferences.length} preferences
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-[#8DDB90] hover:text-[#7BC87F] font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Preferences List */}
        {filteredPreferences.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm">
            <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm || Object.values(filters).some(f => f !== "all" && f !== "newest" && f !== "")
                ? "No matching preferences found"
                : "No preferences yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== "all" && f !== "newest" && f !== "")
                ? "Try adjusting your search or filter criteria"
                : "Create your first preference to start matching with properties"}
            </p>
            <Link
              href="/preference"
              className="inline-flex items-center gap-2 bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <PlusIcon size={16} />
              Create Your First Preference
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPreferences.map((preference, index) => (
              <motion.div
                key={preference._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon */}
                    <div className="lg:w-16 lg:h-16 w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getPreferenceTypeIcon(preference.preferenceType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#09391C]">
                              {preference.propertyType}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(preference.status)}`}>
                              {preference.status.charAt(0).toUpperCase() + preference.status.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(preference.priority)}`}>
                              {preference.priority?.toUpperCase()}
                            </span>
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
                          <p className="text-base font-medium text-[#8DDB90]">
                            ₦{preference.budgetMin.toLocaleString()} - ₦{preference.budgetMax.toLocaleString()}
                          </p>
                          {preference.matchingProperties !== undefined && (
                            <p className="text-sm text-green-600 mt-1">
                              {preference.matchingProperties} matching properties found
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusIcon(preference.status)}
                          <p className="text-xs text-gray-500">
                            {preference.preferenceType === "joint-venture" ? "Joint Venture" : 
                             preference.preferenceType.charAt(0).toUpperCase() + preference.preferenceType.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Requirements */}
                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">Requirements</h4>
                          {preference.noOfBedrooms && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {preference.noOfBedrooms} Bedroom{preference.noOfBedrooms > 1 ? "s" : ""}
                            </p>
                          )}
                          {preference.noOfBathrooms && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {preference.noOfBathrooms} Bathroom{preference.noOfBathrooms > 1 ? "s" : ""}
                            </p>
                          )}
                          {preference.propertyCondition && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              Condition: {preference.propertyCondition}
                            </p>
                          )}
                          {preference.landSize && (
                            <p className="text-sm text-[#5A5D63]">
                              Size: {preference.landSize.min}-{preference.landSize.max} {preference.landSize.unit}
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        {preference.features && (
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
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                            <CalendarIcon size={12} />
                            Created: {new Date(preference.createdAt).toLocaleDateString()}
                          </p>
                          {preference.lastMatchDate && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              <TrendingUpIcon size={12} />
                              Last match: {new Date(preference.lastMatchDate).toLocaleDateString()}
                            </p>
                          )}
                          {preference.expiresAt && (
                            <p className="text-sm text-orange-600 flex items-center gap-1">
                              <ClockIcon size={12} />
                              Expires: {new Date(preference.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      {preference.additionalInfo && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">Additional Information</h4>
                          <p className="text-sm text-[#5A5D63] bg-gray-50 p-3 rounded-lg">
                            {preference.additionalInfo}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => router.push(`/preference/edit/${preference._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors text-sm"
                        >
                          <EditIcon size={14} />
                          Edit
                        </button>
                        
                        <button
                          onClick={() => router.push(`/agent_marketplace?preference=${preference._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <EyeIcon size={14} />
                          View Matches
                        </button>

                        {preference.status === "active" ? (
                          <button
                            onClick={() => handleToggleStatus(preference._id, "paused")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                          >
                            Pause
                          </button>
                        ) : preference.status === "paused" ? (
                          <button
                            onClick={() => handleToggleStatus(preference._id, "active")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Activate
                          </button>
                        ) : null}

                        <button
                          onClick={() => {
                            setSelectedPreference(preference);
                            setShowDeleteModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <TrashIcon size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPreference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">
                Delete Preference
              </h3>
              <p className="text-[#5A5D63] mb-6">
                Are you sure you want to delete this preference? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePreference(selectedPreference._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
