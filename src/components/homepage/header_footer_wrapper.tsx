/** @format */

"use client";

import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import HeaderLogic from "@/logic/headerLogic";
import NewFooter from "./new-footer";

import { ReactNode } from "react";
import ViewImage from "../general-components/viewImage";
import { usePageContext } from "@/context/page-context";

interface Props {
	children: ReactNode;
	isComingSoon?: boolean;
} 

export default function HeaderFooterWrapper({ children, isComingSoon }: Props) {
	const pathname = usePathname();
	const { viewImage, imageData } = usePageContext();
	return (
		<Fragment>
			{/* Promo slot rendered before header - global top banner */}
			import HeaderLogic from "@/logic/headerLogic"; // ensure header import remains
			{/* BannerSlot is lazy loaded to keep header render fast */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			{typeof window !== 'undefined' && (
				<React.Suspense fallback={null}>
					{/* dynamic import to avoid adding to server bundle */}
					{React.createElement(require('@/components/promo/BannerSlot').default, { slot: 'top-header', className: 'mb-2', height: 'h-20' })}
				</React.Suspense>
			)}
			<HeaderLogic isComingSoon={isComingSoon} />
			{children}
			<NewFooter isComingSoon={isComingSoon} />
			{viewImage && <ViewImage imageData={imageData} />}
		</Fragment>
	);
}
