import React from "react";
import { Calendar } from "lucide-react";
import { Dashboard } from "./_components/dashboard";
import { dashboardStats } from "@/actions/stats";

export default async function DashboardPage() {
  const {
    itemChange,
    itemCount,
    salesChange,
    currentWeekRevenue,
    transactionChange,
    currentWeekTransactionCount,
  } = await dashboardStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg px-6 py-8 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-2">
            Selamat Datang Kembali!
          </h2>
          <p className="opacity-90 mb-4">
            Akses semua informasi terkini mengenai toko Anda.
          </p>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Dashboard
          itemChange={itemChange}
          itemCount={itemCount}
          salesChange={salesChange}
          totalSales={currentWeekRevenue}
          transactionChange={transactionChange}
          transactionCount={currentWeekTransactionCount}
        />
      </main>
    </div>
  );
}
