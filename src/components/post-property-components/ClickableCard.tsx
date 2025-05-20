import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StaticImageData } from 'next/image';

interface ClickableCardProps {
  imageSrc: string | StaticImageData;
  text: string;
  href: string;
}

const ClickableCard: React.FC<ClickableCardProps & { onClick?: () => void }> = ({ imageSrc, text, href, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
    <Link href={href} onClick={e => { if (href === "#") e.preventDefault(); }}>
      <div className="flex items-center justify-between border rounded-md p-5 hover:shadow-md transition cursor-pointer bg-white px-10">
        {/* Left side: icon and text */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Image src={imageSrc} alt="icon" width={24} height={24} />
          </div>
          <p className="font-medium text-lg sm:text-base text-black">
            {text}
          </p>
        </div>

        {/* Right arrow */}
        <ArrowRight className="text-gray-800" size={24} />
      </div>
    </Link>
    </div>
  );
};

export default ClickableCard;
