/** @format */

import type { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  return {
    title: `Product: ${params.id}`, // Dynamic title
    description: `Details about ID ${params.id}`,
    icons: {
      icon: '/khabi-teq.svg',
    },
  };
}

export default function ProductDetailsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
