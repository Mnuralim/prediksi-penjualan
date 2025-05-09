"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginButton } from "./login-button";
import { useFormState } from "react-dom";
import { login } from "@/actions/auth";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action] = useFormState(login, {
    error: null,
  });

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">IN</span>
            </div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Logo
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {state.error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
            {state.error}
          </div>
        )}

        <form action={action}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                placeholder="nama@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <LoginButton />
          </div>
        </form>
      </div>
    </div>
  );
};
