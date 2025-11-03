"use client";

import React, { useState } from "react";
import {
  Home,
  Star,
  Check,
  Shield,
  Lock,
  Zap,
  Award,
  Truck,
  MapPin,
  Users,
  Heart,
  Briefcase,
  TrendingUp,
  DollarSign,
  Eye,
  Handshake,
  Target,
  Lightbulb,
  Clock,
  Verified,
  Building,
  Search,
  Key,
  Anchor,
  AlertCircle,
  Bookmark,
  Compass,
  Crown,
  Database,
  Fastforward,
  Gift,
  Globe,
  Headphones,
  Hexagon,
  Inbox,
  Infinity,
  Layers,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  Move,
  Package,
  PieChart,
  Play,
  Pocket,
  Power,
  Printer,
  RefreshCw,
  Repeat,
  Rocket,
  RotateCw,
  Save,
  Server,
  Slack,
  Smile,
  Square,
  Sun,
  Trello,
  Unlock,
  Watch,
  Wifi,
  Wind,
  X,
} from "lucide-react";

interface IconSelectorProps {
  value?: string;
  onChange: (iconName: string) => void;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Home,
  Star,
  Check,
  Shield,
  Lock,
  Zap,
  Award,
  Truck,
  MapPin,
  Users,
  Heart,
  Briefcase,
  TrendingUp,
  DollarSign,
  Eye,
  Handshake,
  Target,
  Lightbulb,
  Clock,
  Verified,
  Building,
  Search,
  Key,
  Anchor,
  AlertCircle,
  Bookmark,
  Compass,
  Crown,
  Database,
  Fastforward,
  Gift,
  Globe,
  Headphones,
  Hexagon,
  Inbox,
  Infinity,
  Layers,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  Move,
  Package,
  PieChart,
  Play,
  Pocket,
  Power,
  Printer,
  RefreshCw,
  Repeat,
  Rocket,
  RotateCw,
  Save,
  Server,
  Slack,
  Smile,
  Square,
  Sun,
  Trello,
  Unlock,
  Watch,
  Wifi,
  Wind,
  X,
};

const ICON_NAMES = Object.keys(ICON_MAP);

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const SelectedIcon = value ? ICON_MAP[value] : null;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 flex items-center justify-between bg-white hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <>
              <SelectedIcon size={18} className="text-gray-600" />
              <span className="text-gray-700">{value}</span>
            </>
          ) : (
            <span className="text-gray-500">Select an icon</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-96 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
            {ICON_NAMES.map((iconName) => {
              const Icon = ICON_MAP[iconName];
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    value === iconName
                      ? "bg-emerald-100 border border-emerald-500"
                      : "hover:bg-gray-100 border border-transparent"
                  }`}
                  title={iconName}
                >
                  <Icon size={20} className="text-gray-700" />
                  <span className="text-xs text-gray-600 truncate max-w-full">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
