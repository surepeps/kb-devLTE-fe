/** @format */
"use client"
import { ReactNode, use, useEffect } from 'react';
import AdminNavbar from '@/components/admincomponents/navbar';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/auth/login';

  useEffect(() => {
    const adminToken = Cookies.get('adminToken');
    if (!adminToken && !isLoginPage) {
      router.push('/admin/auth/login');
    }
  }, [isLoginPage, router]);

  return (
    <main className='w-full flex'>
      {!isLoginPage && <AdminNavbar />}
      <section className='md:flex-1 w-full p-4 lg:w-1/2'>{children}</section>
    </main>
  );
}
