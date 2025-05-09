import React from "react";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart,
  FileBarChart,
  Settings,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

interface Props {
  totalSales: number;
  itemCount: number;
  transactionCount: number;
  salesChange: number;
  itemChange: number;
  transactionChange: number;
}

export function Dashboard({
  itemChange,
  salesChange,
  transactionChange,
  itemCount,
  totalSales,
  transactionCount,
}: Props) {
  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/" },
    {
      name: "Barang",
      icon: <Package className="w-5 h-5" />,
      href: "/items",
    },
    {
      name: "Penjualan",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/sales",
    },
    {
      name: "Prediksi",
      icon: <BarChart className="w-5 h-5" />,
      href: "/predict",
    },
    {
      name: "Laporan",
      icon: <FileBarChart className="w-5 h-5" />,
      href: "/report",
    },
    {
      name: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
  ];

  const statCards = [
    {
      title: "Total Penjualan",
      value: `Rp ${totalSales.toLocaleString("id-ID")}`,
      change: `${salesChange > 0 ? "+" : ""}${salesChange.toFixed(1)}%`,
      trend: salesChange >= 0 ? "up" : "down",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Jumlah Barang",
      value: itemCount.toString(),
      change: `${itemChange > 0 ? "+" : ""}${itemChange.toFixed(1)}%`,
      trend: itemChange >= 0 ? "up" : "down",
      icon: <Package className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Transaksi",
      value: transactionCount.toString(),
      change: `${transactionChange > 0 ? "+" : ""}${transactionChange.toFixed(
        1
      )}%`,
      trend: transactionChange >= 0 ? "up" : "down",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ];

  const quickAccessItems = [
    {
      name: "Tambah Barang",
      icon: <Package className="w-6 h-6 text-blue-500" />,
      href: "/items",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      name: "Tambah Penjualan",
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
      href: "/sales",
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      name: "Prediksi Stok",
      icon: <BarChart className="w-6 h-6 text-purple-500" />,
      href: "/predict",
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      name: "Laporan",
      icon: <FileBarChart className="w-6 h-6 text-orange-500" />,
      href: "/report",
      color: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {card.value}
                </h3>
              </div>
              <div
                className={`p-2.5 rounded-lg ${card.color} bg-opacity-20 dark:bg-opacity-20`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {card.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  card.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                dibanding minggu lalu
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Akses Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-lg mr-4 ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {item.name}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Menu Utama
          </h2>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mr-3">
                  {item.icon}
                </div>
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-200">
                  {item.name}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
