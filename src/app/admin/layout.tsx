/** @format */

import { ReactNode } from 'react';
import AdminNavbar from '@/components/admincomponents/navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <main className='w-full flex'>
      <AdminNavbar />
      {/* Content */}
      <section className='md:flex-1 w-full p-4 lg:w-1/2'>{children}</section>
    </main>
  );
}
