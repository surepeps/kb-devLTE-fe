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
  Plus as PlusIcon,
  Home as HomeIcon,
  Eye as EyeIcon,
  BarChart3 as ChartBarIcon,
  DollarSign as CurrencyDollarIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon,
  Briefcase as BriefcaseIcon,
  MapPin as MapPinIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface PendingBrief {
  _id: string;
  propertyType: string;
  pictures: string[];
  isApproved: boolean;
}

interface DashboardData {
  totalBriefs: number;
  totalActiveBriefs: number;
  totalInactiveBriefs: number;
  propertySold: number;
  totalViews: number;
  recentBriefs: any[];
  newPendingBriefs: PendingBrief[];
}

interface DashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}

export default function LandlordDashboard() {
  const router = useRouter();
  const { user } = useUserContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Landowners") {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const response = await GET_REQUEST(
        `${URLS.BASE}/user/dashboard`,
        Cookies.get("token"),
      );

      if (response?.success && response.dashboard) {
        setDashboardData(response.dashboard);
      } else {
        toast.error("Failed to load dashboard data");
        setDashboardData(null);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setDashboardData(null);
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
      value: dashboardData?.totalBriefs || 0,
      icon: BriefcaseIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Active Briefs",
      value: dashboardData?.totalActiveBriefs || 0,
      icon: ChartBarIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Inactive Briefs",
      value: dashboardData?.totalInactiveBriefs || 0,
      icon: ClockIcon,
      color: "bg-gray-500",
      textColor: "text-gray-600",
    },

    {
      title: "Total Views",
      value: dashboardData?.totalViews || 0,
      icon: EyeIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage your properties and track your real estate portfolio
            </p>
          </div>
          <Link
            href="/post_property"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <PlusIcon size={20} />
            <span className="sm:inline">List New Property</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#5A5D63] mb-1">
                      {card.title}
                    </p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>
                      {card.value.toLocaleString()}
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

        {/* Briefs and Pending Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Briefs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#09391C]">
                  Recent Briefs
                </h2>
                <Link
                  href="/agent_marketplace"
                  className="text-[#8DDB90] hover:text-[#7BC87F] font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            {!dashboardData?.recentBriefs ||
            dashboardData.recentBriefs.length === 0 ? (
              <div className="p-12 text-center">
                <BriefcaseIcon
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Recent Briefs
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first brief to start finding properties
                </p>
                <Link
                  href="/agent_marketplace"
                  className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <PlusIcon size={20} />
                  Create Brief
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {dashboardData.recentBriefs.slice(0, 5).map((brief, index) => (
                  <motion.div
                    key={brief._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {brief.pictures?.[0] ? (
                            <img
                              src={brief.pictures[0]}
                              alt={brief.propertyType}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <BriefcaseIcon
                              size={24}
                              className="text-gray-400"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#09391C] capitalize">
                            {brief.propertyType}
                          </h3>
                          <p className="text-sm text-[#5A5D63]">
                            {brief.location?.area},{" "}
                            {brief.location?.localGovernment}
                          </p>
                          <p className="text-sm text-[#8DDB90] font-medium">
                            {brief.price
                              ? `₦${brief.price.toLocaleString()}`
                              : "Price not set"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            brief.status === "active"
                              ? "bg-green-100 text-green-800"
                              : brief.status === "assigned"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {brief.status || "pending"}
                        </span>
                        <p className="text-xs text-[#5A5D63] mt-1 flex items-center gap-1">
                          <ClockIcon size={12} />
                          {brief.createdAt
                            ? new Date(brief.createdAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Briefs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#09391C]">
                  Pending Briefs
                </h2>
                <span className="text-sm text-[#5A5D63]">
                  {dashboardData?.newPendingBriefs?.length || 0} pending
                  approval
                </span>
              </div>
            </div>

            {!dashboardData?.newPendingBriefs ||
            dashboardData.newPendingBriefs.length === 0 ? (
              <div className="p-8 text-center">
                <ClockIcon size={32} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-medium text-gray-600 mb-2">
                  No Pending Briefs
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  All your briefs have been processed
                </p>
                <Link
                  href="/agent_marketplace"
                  className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors text-sm"
                >
                  <PlusIcon size={16} />
                  Create New Brief
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {dashboardData.newPendingBriefs
                  .slice(0, 5)
                  .map((brief, index) => (
                    <motion.div
                      key={brief._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {brief.pictures?.[0] ? (
                              <img
                                src={brief.pictures[0]}
                                alt={brief.propertyType}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BriefcaseIcon
                                size={16}
                                className="text-gray-400"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-[#09391C] capitalize text-sm">
                              {brief.propertyType}
                            </h3>
                            <p className="text-xs text-[#5A5D63]">
                              {brief.pictures?.length || 0} images uploaded
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              brief.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {brief.isApproved ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#09391C] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/post_property"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#8DDB90] bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <PlusIcon size={24} className="text-[#8DDB90]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    List Property
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    Add a new property to your portfolio
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/my-listings"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <HomeIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    View Listings
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    Manage your property listings
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/notifications"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <UserGroupIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    Notifications
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    View your notifications
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/profile-settings"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <UserGroupIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    Profile Settings
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    Manage your profile and account
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
