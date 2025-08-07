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
  Briefcase as BriefcaseIcon,
  TrendingUp as TrendingUpIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  CreditCard as CreditCardIcon,
  Eye,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface Brief {
  _id: string;
  briefType: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  pictures: string[];
  price: number;
  createdAt: string;
  status: "pending";
}

interface DashboardStats {
  totalBriefs: number;
  totalActiveBriefs: number;
  totalInactiveBriefs: number;
  totalViews: number;
  totalInspectionRequests: number;
  totalCompletedInspectionRequests: number;
  newPendingBriefs: Brief[]; // This should hold the recent briefs
  averageRating: number;
  completedDeals: number;
  totalCommission: number; // Added based on usage in statCards
}


export default function AgentDashboard() {
  const router = useRouter();
  const { user } = useUserContext();
  // Briefs state will now be directly from stats.newPendingBriefs for "Recent Briefs" section
  const [stats, setStats] = useState<DashboardStats>({
    totalBriefs: 0,
    totalActiveBriefs: 0,
    totalInactiveBriefs: 0,
    completedDeals: 0,
    totalViews: 0,
    totalInspectionRequests: 0,
    totalCompletedInspectionRequests: 0,
    newPendingBriefs: [],
    averageRating: 0,
    totalCommission: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Assuming there's a single dashboard endpoint that returns all these stats
      // Replace URLS.fetchDashboardStats with your actual dashboard stats endpoint
      const dashboardResponse = await GET_REQUEST(
        `${URLS.BASE}${URLS.fetchDashboardStats}`, // This URL needs to be defined in URLS.ts
        Cookies.get("token"),
      );

      if (dashboardResponse?.data) {
        setStats({
          ...dashboardResponse.data,
          // Ensure newPendingBriefs is an array, default to empty if not present
          newPendingBriefs: dashboardResponse.data.newPendingBriefs || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Total Briefs",
      value: stats.totalBriefs,
      icon: BriefcaseIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Active Briefs",
      value: stats.totalActiveBriefs, // Changed to totalActiveBriefs from stats
      icon: TrendingUpIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Completed Deals",
      value: stats.completedDeals,
      icon: DollarSignIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Views",
      value: `${stats.totalViews}`,
      icon: Eye,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
              Welcome back, Agent {user.firstName}!
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage your briefs and track your real estate performance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              href="/my-listings"
              className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <BriefcaseIcon size={20} />
              <span className="hidden sm:inline">View </span>Briefs
            </Link>
            <Link
              href="/my-inspection-requests"
              className="bg-white hover:bg-gray-50 text-[#09391C] border border-[#8DDB90] px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarIcon size={20} />
              <span className="hidden sm:inline">Inspection</span>Requests
            </Link>
            <Link
              href="/agent-marketplace"
              className="bg-white hover:bg-gray-50 text-[#09391C] border border-gray-300 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <PlusIcon size={20} />
              Marketplace
            </Link>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#8DDB90] mb-2">
                ₦{stats.totalCommission.toLocaleString()}
              </div>
              <p className="text-sm sm:text-base text-[#5A5D63]">
                Total Commission
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <StarIcon
                  size={20}
                  className="text-yellow-500 fill-current sm:w-6 sm:h-6"
                />
                <span className="text-2xl sm:text-3xl font-bold text-[#09391C] ml-2">
                  {stats.averageRating}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#5A5D63]">
                Average Rating
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#09391C] mb-2">
                {/* Ensure totalBriefs is not zero to avoid division by zero */}
                {stats.totalBriefs > 0
                  ? Math.round((stats.completedDeals / stats.totalBriefs) * 100)
                  : 0}
                %
              </div>
              <p className="text-sm sm:text-base text-[#5A5D63]">
                Success Rate
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#5A5D63] mb-1">
                      {card.title}
                    </p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>
                      {typeof card.value === "number"
                        ? card.value.toLocaleString()
                        : card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                    <IconComponent size={24} className={card.textColor} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Briefs and Properties Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Recent Briefs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#09391C]">
                  Recent Briefs
                </h2>
                <Link
                  href="/my-listings"
                  className="text-[#8DDB90] hover:text-[#7BC87F] font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            {stats.newPendingBriefs.length === 0 ? (
              <div className="p-8 text-center">
                <BriefcaseIcon
                  size={32}
                  className="mx-auto text-gray-400 mb-3"
                />
                <h3 className="text-base font-medium text-gray-600 mb-2">
                  No Briefs Available
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create new brief / Listing
                </p>
                <Link
                  href="/post-property"
                  className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors text-sm"
                >
                  <PlusIcon size={16} />
                  Post Brief
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {stats.newPendingBriefs.slice(0, 5).map((brief, index) => (
                  <motion.div
                    key={brief._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8DDB90] bg-opacity-10 rounded-lg flex items-center justify-center">
                          <BriefcaseIcon size={16} className="text-[#8DDB90]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#09391C] capitalize text-sm">
                            {brief.briefType}
                          </h3> {/* Changed from propertyType to briefType as per Brief interface */}
                          <div className="flex items-center gap-1 text-xs text-[#5A5D63]">
                            <MapPinIcon size={10} />
                            {brief.location.area}
                          </div>
                          <p className="text-xs text-[#8DDB90] font-medium">
                            ₦{brief.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-[#09391C]">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <Link
                href="/post-property"
                className="w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <PlusIcon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">List New Property</h3>
                  <p className="text-sm opacity-90">
                    Add property to portfolio
                  </p>
                </div>
              </Link>

              <Link
                href="/agent-marketplace"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-[#8DDB90] p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-[#8DDB90] bg-opacity-10 rounded-lg">
                  <BriefcaseIcon size={20} className="text-[#8DDB90]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Browse Marketplace</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Find new opportunities
                  </p>
                </div>
              </Link>

              <Link
                href="/my-inspection-requests"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-purple-500 bg-opacity-10 rounded-lg">
                  <CalendarIcon size={20} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Inspection Requests</h3>
                  <p className="text-sm text-[#5A5D63]">Manage inspections</p>
                </div>
              </Link>

              <Link
                href="/notifications"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-purple-500 bg-opacity-10 rounded-lg">
                  <UsersIcon size={20} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-[#5A5D63]">View notifications</p>
                </div>
              </Link>

              <Link
                href="/agent-subscriptions"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
                  <CreditCardIcon size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Manage Subscriptions</h3>
                  <p className="text-sm text-[#5A5D63]">View plans & renewals</p>
                </div>
              </Link>

              <Link
                href="/my-preferences"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-green-500 bg-opacity-10 rounded-lg">
                  <UsersIcon size={20} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Buyer Preferences</h3>
                  <p className="text-sm text-[#5A5D63]">View buyer requests</p>
                </div>
              </Link>

              <Link
                href="/my-listings"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
                  <UsersIcon size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">My Listings</h3>
                  <p className="text-sm text-[#5A5D63]">Manage properties</p>
                </div>
              </Link>

              <Link
                href="/profile-settings"
                className="w-full bg-white hover:bg-gray-50 text-[#09391C] border border-gray-200 p-4 rounded-lg font-medium flex items-center gap-3 transition-colors group"
              >
                <div className="p-2 bg-gray-500 bg-opacity-10 rounded-lg">
                  <UsersIcon size={20} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Profile Settings</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Manage account settings
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
