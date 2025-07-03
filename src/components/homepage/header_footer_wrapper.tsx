/** @format */

"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import HeaderLogic from "@/logic/headerLogic";
import Footer from "./footer";

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
			<HeaderLogic isComingSoon={isComingSoon} />
			{children}
			<Footer isComingSoon={isComingSoon} />
			{viewImage && <ViewImage imageData={imageData} />}
		</Fragment>
	);
}
