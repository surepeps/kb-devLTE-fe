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
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface Brief {
  _id: string;
  propertyType: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  price: number;
  createdAt: string;
  status: "active" | "assigned" | "completed";
}

interface DashboardStats {
  totalBriefs: number;
  activeBriefs: number;
  completedDeals: number;
  totalCommission: number;
  monthlyCommission: number;
  averageRating: number;
}

export default function AgentDashboard() {
  const router = useRouter();
  const { user } = useUserContext();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBriefs: 0,
    activeBriefs: 0,
    completedDeals: 0,
    totalCommission: 0,
    monthlyCommission: 0,
    averageRating: 4.5,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/agent/auth/login");
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

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch agent briefs
      const briefsResponse = await GET_REQUEST(
        `${URLS.BASE}${URLS.fetchBriefs}?page=1&limit=100`,
        Cookies.get("agentToken") || Cookies.get("token"),
      );

      if (briefsResponse?.data) {
        const agentBriefs = briefsResponse.data;
        setBriefs(agentBriefs);

        // Calculate stats
        const totalBriefs = agentBriefs.length;
        const activeBriefs = agentBriefs.filter(
          (b: Brief) => b.status === "active",
        ).length;
        const completedDeals = agentBriefs.filter(
          (b: Brief) => b.status === "completed",
        ).length;

        setStats({
          totalBriefs,
          activeBriefs,
          completedDeals,
          totalCommission: completedDeals * 500000, // Mock calculation
          monthlyCommission: 1500000, // Mock data
          averageRating: 4.5,
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
      value: stats.activeBriefs,
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
      title: "Total Commission",
      value: `₦${stats.totalCommission.toLocaleString()}`,
      icon: DollarSignIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#09391C] font-display">
              Welcome back, Agent {user.firstName}!
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage your briefs and track your real estate performance
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/agent/briefs"
              className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <BriefcaseIcon size={20} />
              View Briefs
            </Link>
            <Link
              href="/agent_marketplace"
              className="bg-white hover:bg-gray-50 text-[#09391C] border border-[#8DDB90] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <PlusIcon size={20} />
              Marketplace
            </Link>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8DDB90] mb-2">
                ₦{stats.monthlyCommission.toLocaleString()}
              </div>
              <p className="text-[#5A5D63]">This Month's Commission</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <StarIcon size={24} className="text-yellow-500 fill-current" />
                <span className="text-3xl font-bold text-[#09391C] ml-2">
                  {stats.averageRating}
                </span>
              </div>
              <p className="text-[#5A5D63]">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#09391C] mb-2">
                {Math.round((stats.completedDeals / stats.totalBriefs) * 100) ||
                  0}
                %
              </div>
              <p className="text-[#5A5D63]">Success Rate</p>
            </div>
          </div>
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

        {/* Recent Briefs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#09391C]">
                Recent Briefs
              </h2>
              <Link
                href="/agent/briefs"
                className="text-[#8DDB90] hover:text-[#7BC87F] font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {briefs.length === 0 ? (
            <div className="p-12 text-center">
              <BriefcaseIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Briefs Available
              </h3>
              <p className="text-gray-500 mb-6">
                Check the marketplace for new opportunities or wait for clients
                to submit briefs
              </p>
              <Link
                href="/agent_marketplace"
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <PlusIcon size={20} />
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {briefs.slice(0, 5).map((brief, index) => (
                <motion.div
                  key={brief._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#8DDB90] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <BriefcaseIcon size={20} className="text-[#8DDB90]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#09391C] capitalize">
                          {brief.propertyType}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-[#5A5D63]">
                          <MapPinIcon size={12} />
                          {brief.location.area},{" "}
                          {brief.location.localGovernment}
                        </div>
                        <p className="text-sm text-[#8DDB90] font-medium">
                          ₦{brief.price.toLocaleString()}
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
                        {brief.status}
                      </span>
                      <p className="text-xs text-[#5A5D63] mt-1 flex items-center gap-1">
                        <ClockIcon size={12} />
                        {new Date(brief.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#09391C] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/agent/briefs"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#8DDB90] bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <BriefcaseIcon size={24} className="text-[#8DDB90]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">View Briefs</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Manage your assigned briefs
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/agent_marketplace"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <PlusIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">Marketplace</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Find new opportunities
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/preference"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <UsersIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">Settings</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Update your preferences
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
