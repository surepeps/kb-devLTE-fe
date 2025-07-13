"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  User as UserIcon,
  ArrowLeft as ArrowLeftIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  Heart as HeartIcon,
  Building as BuildingIcon,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface BuyerPreference {
  _id: string;
  buyer: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  propertyType: "Residential" | "Commercial" | "Land";
  preferenceType: "buy" | "rent" | "joint-venture";
  propertyCondition?: "Brand New" | "Good Condition";
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  budgetMin: number;
  budgetMax: number;
  noOfBedrooms?: number;
  noOfBathrooms?: number;
  features?: string[];
  documents?: string[];
  landSize?: number;
  measurementType?: string;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AgentPreferencesPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [preferences, setPreferences] = useState<BuyerPreference[]>([]);
  const [filteredPreferences, setFilteredPreferences] = useState<
    BuyerPreference[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("all");
  const [preferenceTypeFilter, setPreferenceTypeFilter] =
    useState<string>("all");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Agent") {
      router.push("/");
      return;
    }

    if (!user.accountApproved) {
      router.push("/agent/under-review");
      return;
    }

    fetchPreferences();
  }, [user, router]);

  useEffect(() => {
    filterPreferences();
  }, [preferences, searchTerm, propertyTypeFilter, preferenceTypeFilter]);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);

      // Mock data for demonstration - replace with actual API call
      const mockData: BuyerPreference[] = [
        {
          _id: "1",
          buyer: {
            _id: "buyer1",
            fullName: "John Doe",
            email: "john.doe@email.com",
            phoneNumber: "+234 803 123 4567",
          },
          propertyType: "Residential",
          preferenceType: "buy",
          propertyCondition: "Brand New",
          location: {
            state: "Lagos",
            localGovernment: "Lagos Island",
            area: "Victoria Island",
          },
          budgetMin: 20000000,
          budgetMax: 30000000,
          noOfBedrooms: 3,
          noOfBathrooms: 3,
          features: ["Swimming Pool", "Gym", "24/7 Security", "Parking Space"],
          documents: ["C of O", "Governor Consent"],
          additionalInfo:
            "Looking for a luxury apartment with modern amenities in a prime location.",
          createdAt: "2024-01-10T10:00:00.000Z",
          updatedAt: "2024-01-10T10:00:00.000Z",
        },
        {
          _id: "2",
          buyer: {
            _id: "buyer2",
            fullName: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phoneNumber: "+234 801 987 6543",
          },
          propertyType: "Commercial",
          preferenceType: "rent",
          propertyCondition: "Good Condition",
          location: {
            state: "Lagos",
            localGovernment: "Ikeja",
            area: "Computer Village",
          },
          budgetMin: 500000,
          budgetMax: 1000000,
          features: ["Parking Space", "24/7 Security", "Generator"],
          documents: ["Agreement", "Receipt"],
          additionalInfo:
            "Need a commercial space for electronics retail business.",
          createdAt: "2024-01-08T14:00:00.000Z",
          updatedAt: "2024-01-09T09:30:00.000Z",
        },
        {
          _id: "3",
          buyer: {
            _id: "buyer3",
            fullName: "Michael Brown",
            email: "michael.brown@email.com",
            phoneNumber: "+234 802 456 7890",
          },
          propertyType: "Land",
          preferenceType: "joint-venture",
          location: {
            state: "Lagos",
            localGovernment: "Eti-Osa",
            area: "Lekki",
          },
          budgetMin: 50000000,
          budgetMax: 100000000,
          landSize: 1000,
          measurementType: "Square Meter",
          documents: ["Survey Document", "C of O", "Governor Consent"],
          additionalInfo:
            "Looking for prime land for joint venture development project.",
          createdAt: "2024-01-05T16:00:00.000Z",
          updatedAt: "2024-01-08T12:00:00.000Z",
        },
        {
          _id: "4",
          buyer: {
            _id: "buyer4",
            fullName: "Grace Adeyemi",
            email: "grace.adeyemi@email.com",
            phoneNumber: "+234 805 123 4567",
          },
          propertyType: "Residential",
          preferenceType: "buy",
          propertyCondition: "Good Condition",
          location: {
            state: "Abuja",
            localGovernment: "Abuja Municipal",
            area: "Garki",
          },
          budgetMin: 15000000,
          budgetMax: 25000000,
          noOfBedrooms: 2,
          noOfBathrooms: 2,
          features: ["Parking Space", "24/7 Security"],
          documents: ["C of O"],
          additionalInfo:
            "First-time buyer looking for affordable housing in Abuja.",
          createdAt: "2024-01-03T10:00:00.000Z",
          updatedAt: "2024-01-04T15:30:00.000Z",
        },
      ];

      setPreferences(mockData);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Failed to load buyer preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPreferences = () => {
    let filtered = [...preferences];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (pref) =>
          pref.buyer.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pref.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pref.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pref.location.state
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pref.propertyType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by property type
    if (propertyTypeFilter !== "all") {
      filtered = filtered.filter(
        (pref) => pref.propertyType === propertyTypeFilter,
      );
    }

    // Filter by preference type
    if (preferenceTypeFilter !== "all") {
      filtered = filtered.filter(
        (pref) => pref.preferenceType === preferenceTypeFilter,
      );
    }

    setFilteredPreferences(filtered);
  };

  const getPreferenceTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <HomeIcon size={16} className="text-green-500" />;
      case "rent":
        return <BuildingIcon size={16} className="text-blue-500" />;
      case "joint-venture":
        return <BriefcaseIcon size={16} className="text-purple-500" />;
      default:
        return <FileTextIcon size={16} className="text-gray-500" />;
    }
  };

  const getPreferenceTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-green-100 text-green-800";
      case "rent":
        return "bg-blue-100 text-blue-800";
      case "joint-venture":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPropertyTypeStats = () => {
    const stats = {
      all: preferences.length,
      Residential: preferences.filter((p) => p.propertyType === "Residential")
        .length,
      Commercial: preferences.filter((p) => p.propertyType === "Commercial")
        .length,
      Land: preferences.filter((p) => p.propertyType === "Land").length,
    };
    return stats;
  };

  const getPreferenceTypeStats = () => {
    const stats = {
      all: preferences.length,
      buy: preferences.filter((p) => p.preferenceType === "buy").length,
      rent: preferences.filter((p) => p.preferenceType === "rent").length,
      "joint-venture": preferences.filter(
        (p) => p.preferenceType === "joint-venture",
      ).length,
    };
    return stats;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const propertyTypeStats = getPropertyTypeStats();
  const preferenceTypeStats = getPreferenceTypeStats();

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 sm:px-6">
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

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
                Buyer Preferences
              </h1>
              <p className="text-[#5A5D63] mt-2">
                View and manage all buyer preferences submitted through the
                platform
              </p>
            </div>
            <div className="text-sm text-[#5A5D63] bg-white px-4 py-2 rounded-lg">
              {filteredPreferences.length} of {preferences.length} preferences
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5A5D63] mb-1">
                  Total Preferences
                </p>
                <p className="text-2xl font-bold text-[#09391C]">
                  {preferences.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#8DDB90] bg-opacity-10">
                <HeartIcon size={24} className="text-[#8DDB90]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5A5D63] mb-1">
                  Buy Requests
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {preferenceTypeStats.buy}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500 bg-opacity-10">
                <HomeIcon size={24} className="text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5A5D63] mb-1">
                  Rent Requests
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {preferenceTypeStats.rent}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10">
                <BuildingIcon size={24} className="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5A5D63] mb-1">
                  Joint Ventures
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {preferenceTypeStats["joint-venture"]}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500 bg-opacity-10">
                <BriefcaseIcon size={24} className="text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by buyer name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              />
            </div>

            {/* Property Type Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon size={20} className="text-gray-400" />
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              >
                <option value="all">All Property Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
            </div>

            {/* Preference Type Filter */}
            <div className="flex items-center gap-2">
              <select
                value={preferenceTypeFilter}
                onChange={(e) => setPreferenceTypeFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
              >
                <option value="all">All Preference Types</option>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="joint-venture">Joint Venture</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences List */}
        {filteredPreferences.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm">
            <HeartIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm ||
              propertyTypeFilter !== "all" ||
              preferenceTypeFilter !== "all"
                ? "No matching preferences found"
                : "No buyer preferences yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              propertyTypeFilter !== "all" ||
              preferenceTypeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Buyer preferences submitted through the platform will appear here"}
            </p>
            {(searchTerm ||
              propertyTypeFilter !== "all" ||
              preferenceTypeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPropertyTypeFilter("all");
                  setPreferenceTypeFilter("all");
                }}
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPreferences.map((preference, index) => (
              <motion.div
                key={preference._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Preference Type Icon */}
                    <div className="lg:w-16 lg:h-16 w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getPreferenceTypeIcon(preference.preferenceType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#09391C]">
                              {preference.propertyType} Property
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPreferenceTypeColor(preference.preferenceType)}`}
                            >
                              {preference.preferenceType === "joint-venture"
                                ? "Joint Venture"
                                : preference.preferenceType
                                    .charAt(0)
                                    .toUpperCase() +
                                  preference.preferenceType.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                            <MapPinIcon size={14} />
                            {preference.location.area},{" "}
                            {preference.location.localGovernment},{" "}
                            {preference.location.state}
                          </p>
                          <p className="text-base font-medium text-[#8DDB90]">
                            ₦{preference.budgetMin.toLocaleString()} - ₦
                            {preference.budgetMax.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#5A5D63] flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {new Date(
                              preference.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Buyer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                            <UserIcon size={16} />
                            Buyer Details
                          </h4>
                          <p className="text-sm text-[#5A5D63] mb-1">
                            {preference.buyer.fullName}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                            <MailIcon size={12} />
                            {preference.buyer.email}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1">
                            <PhoneIcon size={12} />
                            {preference.buyer.phoneNumber}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            Requirements
                          </h4>
                          {preference.noOfBedrooms && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {preference.noOfBedrooms} Bedroom
                              {preference.noOfBedrooms > 1 ? "s" : ""}
                            </p>
                          )}
                          {preference.noOfBathrooms && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {preference.noOfBathrooms} Bathroom
                              {preference.noOfBathrooms > 1 ? "s" : ""}
                            </p>
                          )}
                          {preference.propertyCondition && (
                            <p className="text-sm text-[#5A5D63] mb-1">
                              Condition: {preference.propertyCondition}
                            </p>
                          )}
                          {preference.landSize &&
                            preference.measurementType && (
                              <p className="text-sm text-[#5A5D63] mb-1">
                                Size: {preference.landSize}{" "}
                                {preference.measurementType}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Features and Documents */}
                      {preference.features &&
                        preference.features.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-[#09391C] mb-2">
                              Preferred Features
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {preference.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {preference.documents &&
                        preference.documents.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-[#09391C] mb-2">
                              Required Documents
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {preference.documents.map((doc, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Additional Info */}
                      {preference.additionalInfo && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            Additional Information
                          </h4>
                          <p className="text-sm text-[#5A5D63] bg-gray-50 p-3 rounded-lg">
                            {preference.additionalInfo}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/agent_marketplace/${preference._id}`}
                          className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FileTextIcon size={16} />
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              preference.buyer.email,
                            );
                            toast.success("Email copied to clipboard");
                          }}
                          className="bg-white hover:bg-gray-50 text-[#09391C] border border-[#8DDB90] px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <MailIcon size={16} />
                          Copy Email
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
    </div>
  );
}
