/** @format */
"use client"
import { ReactNode } from 'react';
import AdminNavbar from '@/components/admincomponents/navbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/auth/login';

  return (
    <main className='w-full flex'>
      {!isLoginPage && <AdminNavbar />}
      <section className='md:flex-1 w-full p-4 lg:w-1/2'>{children}</section>
    </main>
  );
}
