import React from "react";
import { User } from "lucide-react";
import UpdateAdminForm from "./_components/update-admin-form";
import { getAdmin } from "@/actions/admin";

export default async function AdminSettingsPage() {
  const admin = await getAdmin();
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Informasi Admin
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Kelola data akun admin utama aplikasi
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Nama</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {admin?.name || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {admin?.email || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">
                Terakhir Login
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                -
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                Aktif
              </span>
            </div>
          </div>
        </div>

        <UpdateAdminForm admin={admin!} />
      </main>
    </div>
  );
}
