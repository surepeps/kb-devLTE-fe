/** @format */

"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Eye, Edit, Share, Trash } from "lucide-react";
import useClickOutside from "@/hooks/clickOutside";

interface ActionDropdownProps {
  onView?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  briefId: string;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onView,
  onEdit,
  onShare,
  onDelete,
  briefId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const actionItems = [
    {
      label: "View Details",
      icon: Eye,
      action: onView,
      color: "text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50",
    },
    {
      label: "Edit Brief",
      icon: Edit,
      action: onEdit,
      color: "text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50",
    },
    {
      label: "Share",
      icon: Share,
      action: onShare,
      color: "text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50",
    },
    {
      label: "Delete",
      icon: Trash,
      action: onDelete,
      color: "text-red-500 hover:text-red-700 hover:bg-red-50",
    },
  ];

  const handleActionClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90] focus:ring-opacity-50"
        aria-label="More actions"
        title="More actions"
      >
        <MoreVertical size={16} className="text-[#5A5D63]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
          >
            {actionItems.map((item, index) => {
              if (!item.action) return null;

              const IconComponent = item.icon;

              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(item.action)}
                  className={`w-full px-3 py-2 text-sm flex items-center gap-2 transition-colors ${item.color}`}
                >
                  <IconComponent size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionDropdown;
