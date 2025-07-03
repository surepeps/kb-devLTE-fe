import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import { StaticImageData } from "next/image";

interface ClickableCardProps {
  imageSrc?: string | StaticImageData;
  text?: string;
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
  color?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ClickableCard: React.FC<ClickableCardProps> = ({
  imageSrc,
  text,
  title,
  description,
  href = "#",
  icon,
  color = "bg-gray-500",
  isSelected = false,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (href === "#") e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      {href !== "#" ? (
        <Link href={href} onClick={handleClick}>
          <CardContent
            imageSrc={imageSrc}
            text={text}
            title={title}
            description={description}
            icon={icon}
            color={color}
            isSelected={isSelected}
          />
        </Link>
      ) : (
        <CardContent
          imageSrc={imageSrc}
          text={text}
          title={title}
          description={description}
          icon={icon}
          color={color}
          isSelected={isSelected}
        />
      )}
    </motion.div>
  );
};

const CardContent: React.FC<ClickableCardProps> = ({
  imageSrc,
  text,
  title,
  description,
  icon,
  color,
  isSelected,
}) => {
  // New card style for property type selection
  if (title && description) {
    return (
      <div
        className={`relative border-2 rounded-lg p-6 transition-all ${
          isSelected
            ? "border-[#8DDB90] bg-[#8DDB90] bg-opacity-10 shadow-md"
            : "border-gray-200 hover:border-[#8DDB90] hover:shadow-md bg-white"
        }`}
      >
        {isSelected && (
          <div className="absolute top-4 right-4">
            <CheckCircle size={20} className="text-[#8DDB90]" />
          </div>
        )}

        <div className="text-center">
          {icon && (
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}
            >
              <span className="text-2xl">{icon}</span>
            </div>
          )}

          <h3 className="text-xl font-semibold text-[#09391C] mb-2">{title}</h3>

          <p className="text-[#5A5D63] text-sm">{description}</p>
        </div>
      </div>
    );
  }

  // Original card style
  return (
    <div className="flex items-center justify-between border rounded-md p-3 md:p-5 hover:shadow-md transition cursor-pointer bg-white px-4 md:px-10">
      {/* Left side: icon and text */}
      <div className="flex items-center space-x-4">
        {imageSrc && (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Image src={imageSrc} alt="icon" width={24} height={24} />
          </div>
        )}
        <p className="font-medium text-sm md:text-lg sm:text-base text-black">
          {text}
        </p>
      </div>

      {/* Right arrow */}
      <ArrowRight className="text-gray-800" size={24} />
    </div>
  );
};

export default ClickableCard;
