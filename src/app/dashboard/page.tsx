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
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  FileText as FileTextIcon,
  Filter as FilterIcon,
  Bell as BellIcon,
  Search as SearchIcon,
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
  const [activeFilter, setActiveFilter] = useState("all");

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
      title: "Total Properties",
      value: dashboardData?.totalBriefs || 0,
      icon: HomeIcon,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Active Listings",
      value: dashboardData?.totalActiveBriefs || 0,
      icon: TrendingUpIcon,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Total Views",
      value: dashboardData?.totalViews || 0,
      icon: EyeIcon,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+24%",
      changeType: "increase",
    },
    {
      title: "Properties Sold",
      value: dashboardData?.propertySold || 0,
      icon: CurrencyDollarIcon,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%",
      changeType: "increase",
    },
  ];

  const quickActions = [
    {
      title: "List New Property",
      description: "Add a new property to your portfolio",
            href: "/post-property",
      icon: PlusIcon,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "My Listings",
      description: "Manage your property listings",
      href: "/my-listings",
      icon: HomeIcon,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Inspection Requests",
      description: "Manage property inspections",
      href: "/landlord-inspection-requests",
      icon: CalendarIcon,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Profile Settings",
      description: "Manage your profile and account",
      href: "/profile-settings",
      icon: SettingsIcon,
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Analytics",
      description: "View detailed property analytics",
      href: "/analytics",
      icon: ChartBarIcon,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Notifications",
      description: "View important updates",
      href: "/notifications",
      icon: BellIcon,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your property portfolio and track performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                href="/post-property"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon size={20} />
                List New Property
              </Link>
              <Link
                href="/my-listings"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <HomeIcon size={20} />
                My Listings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
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
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <IconComponent size={24} className={card.textColor} />
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        card.changeType === "increase"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof card.value === "number"
                      ? card.value.toLocaleString()
                      : card.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      My Properties
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {dashboardData?.newPendingBriefs?.length || 0} pending
                      approval
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeFilter === "all"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveFilter("active")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeFilter === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setActiveFilter("pending")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeFilter === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                    <Link
                      href="/my-listings"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>

              {(!dashboardData?.recentBriefs ||
                dashboardData.recentBriefs.length === 0) &&
              (!dashboardData?.newPendingBriefs ||
                dashboardData.newPendingBriefs.length === 0) ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BriefcaseIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Properties Listed Yet
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Start building your portfolio by listing your first property
                  </p>
                  <Link
                    href="/post_property"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <PlusIcon size={20} />
                    List Your First Property
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {/* Pending Briefs Section */}
                  {dashboardData?.newPendingBriefs &&
                    dashboardData.newPendingBriefs.length > 0 && (
                      <>
                        {dashboardData.newPendingBriefs
                          .slice(0, 3)
                          .map((brief, index) => (
                            <motion.div
                              key={`pending-${brief._id}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {brief.pictures?.[0] ? (
                                      <img
                                        src={brief.pictures[0]}
                                        alt={brief.propertyType}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <BriefcaseIcon
                                        size={18}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 capitalize">
                                      {brief.propertyType}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {brief.pictures?.length || 0} images
                                      uploaded
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending Review
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </>
                    )}

                  {/* Recent Briefs Section */}
                  {dashboardData?.recentBriefs &&
                    dashboardData.recentBriefs.length > 0 && (
                      <>
                        {dashboardData.recentBriefs
                          .slice(0, 4)
                          .map((brief, index) => (
                            <motion.div
                              key={`recent-${brief._id}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {brief.pictures?.[0] ? (
                                      <img
                                        src={brief.pictures[0]}
                                        alt={brief.propertyType}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <BriefcaseIcon
                                        size={18}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 capitalize">
                                      {brief.propertyType}
                                    </h4>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <MapPinIcon size={12} />
                                      {brief.location?.area},{" "}
                                      {brief.location?.localGovernment}
                                    </div>
                                    <p className="text-sm text-green-600 font-medium">
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
                                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                                    <ClockIcon size={10} />
                                    {brief.createdAt
                                      ? new Date(
                                          brief.createdAt,
                                        ).toLocaleDateString()
                                      : "Recently"}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {quickActions.slice(0, 4).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <IconComponent
                              size={18}
                              className={action.textColor}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                              {action.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
