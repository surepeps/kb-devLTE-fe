'use client';

import React from 'react';

const Dashboard = () => {
  // You can fetch user data here or get it from context later
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userType: 'User',
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

      <section className="bg-white p-6 rounded shadow max-w-md">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          <li>
            <strong>User Type:</strong> {user.userType}
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Dashboard;
