"use client";

import { motion } from "framer-motion";
import { Users, Zap, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

const AgentMarketplace = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: Users,
      title: "High-Intent Leads",
      description: "These buyers are serious and have already committed.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Zap,
      title: "Faster Closures",
      description: "Submit matching briefs directly and reduce back-and-forth.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Verified Opportunities",
      description:
        "Every preference is screened and backed by negotiation and inspection support",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Boost Your Profile",
      description: "Agents who submit relevant briefs get priority visibility",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <section className="py-10 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Connect with Ready Buyers
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            When a buyer submits a preference, they&apos;re actively looking for
            a property that matches their exact needs. This is your chance to
            submit a matching brief and close deals faster.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="relative group cursor-pointer"
            >
              <motion.div
                variants={cardHoverVariants}
                className="bg-white/80 backdrop-blur-sm p-5 shadow-lg border border-blue-100 h-full"
              >
                <h3 className="text-xl font-semibold text-[#1976D2] mb-4 text-center">
                  {feature.title}
                </h3>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <Link href="/agent/agent-marketplace">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-16 py-4 bg-[#8DDB90] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Agent Marketplace</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentMarketplace;
