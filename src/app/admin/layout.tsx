"use client";
import { ReactNode, useState } from "react";
import AdminNavbar from "@/components/admincomponents/navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <main className="w-screen min-h-full flex overflow-hidden">
      <AdminNavbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />
      <section
        className={`flex-1 p-4 transition-all duration-300 ${
          isNavbarOpen ? "ml-[100px]" : "ml-0"
        }`}
      >
        {children}
      </section>
    </main>
  );
}
