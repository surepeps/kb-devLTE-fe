import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Marketplace - Khabiteq Realty",
  description:
    "Advanced property marketplace with enhanced search and filtering capabilities",
  keywords: "property, real estate, Nigeria, buy, rent, lease, marketplace",
};

export default function NewMarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
