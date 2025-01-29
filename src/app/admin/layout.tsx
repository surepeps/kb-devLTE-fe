import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-container">
      <nav>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/settings">Settings</a></li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
}