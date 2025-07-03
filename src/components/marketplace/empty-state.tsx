/** @format */

import React from "react";
import { Home, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/general-components/button";

interface EmptyStateProps {
  type: "no-results" | "no-data" | "error";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showFilters?: boolean;
  onClearFilters?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  showFilters = false,
  onClearFilters,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case "no-results":
        return {
          icon: Search,
          title: title || "No properties found",
          description:
            description ||
            "We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms.",
          actionLabel: actionLabel || "Clear Filters",
          action: onClearFilters || onAction,
        };
      case "error":
        return {
          icon: Home,
          title: title || "Something went wrong",
          description:
            description ||
            "We encountered an error while loading properties. Please try again.",
          actionLabel: actionLabel || "Retry",
          action: onAction,
        };
      default: // no-data
        return {
          icon: Home,
          title: title || "No properties available",
          description:
            description ||
            "There are currently no properties available in this category. Check back later for new listings.",
          actionLabel: actionLabel || "Browse All Properties",
          action: onAction,
        };
    }
  };

  const { icon: IconComponent, ...content } = getDefaultContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 bg-[#E4EFE7] rounded-full flex items-center justify-center mb-6">
        <IconComponent size={32} className="text-[#8DDB90]" />
      </div>

      <h3 className="text-xl font-semibold text-[#09391C] mb-3 font-display">
        {content.title}
      </h3>

      <p className="text-[#5A5D63] mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {content.action && (
          <Button
            value={content.actionLabel}
            onClick={content.action}
            green={true}
            className="px-6 py-3 font-semibold"
          />
        )}

        {showFilters && onClearFilters && type === "no-results" && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#C7CAD0] text-[#5A5D63] rounded-lg hover:border-[#8DDB90] hover:text-[#8DDB90] transition-colors font-semibold"
          >
            <Filter size={16} />
            Clear All Filters
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
