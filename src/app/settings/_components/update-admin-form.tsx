"use client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { User, Mail, Lock } from "lucide-react";
import { updateAdmin } from "@/actions/admin";
import { SubmitButton } from "./submit-button";
import { ErrorMessage } from "@/app/_components/error-message";

interface Props {
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export default function UpdateAdminForm({ admin }: Props) {
  const [state, formAction] = useFormState(updateAdmin, { error: null });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Perbarui Profil Admin
        </h2>
      </div>

      {state.error && <ErrorMessage message={state.error} />}

      {/* {successMessage && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        </div>
      )} */}

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={admin?.name || ""}
              required
              className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={admin?.email || ""}
              required
              className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="nama@perusahaan.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password Baru (kosongkan jika tidak ingin mengubah)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
            >
              <span className="text-gray-500 dark:text-gray-400 text-xs underline">
                {isPasswordVisible ? "Sembunyikan" : "Tampilkan"}
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Password harus minimal 8 karakter
          </p>
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
