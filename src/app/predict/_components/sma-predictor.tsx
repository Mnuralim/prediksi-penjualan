"use client";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BarChart3, Calculator, TrendingUp } from "lucide-react";
import { Chart } from "./chart";
import type { Item } from "@prisma/client";

interface Props {
  items: Item[];
  smaResult: CalculateResult | null;
}

export const SMAPredictor = ({ items, smaResult }: Props) => {
  const [itemId, setItemId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [period, setPeriod] = useState<number>(3);
  const router = useRouter();

  const handleSubmit = () => {
    if (!itemId) return;
    router.push(`/predict?itemId=${itemId}&period=${period}`);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto">
          <div className="flex items-center mb-4">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Prediksi dengan Metode Single Moving Average (SMA)
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Pilih barang dan tentukan periode untuk menghitung prediksi dengan
            metode SMA
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pilih Barang
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">-- Pilih Barang --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Periode SMA
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={period}
                onChange={(e) =>
                  setPeriod(Math.max(2, parseInt(e.target.value) || 2))
                }
                min="2"
                placeholder="Minimal 2"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-transparent">
                Aksi
              </label>
              <button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:dark:bg-gray-700 disabled:dark:text-gray-400`}
                onClick={handleSubmit}
                disabled={loading || !itemId}
              >
                {loading ? (
                  "Memproses..."
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Hitung Prediksi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {smaResult && (
        <div className="p-6">
          <div className="mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Prediksi Minggu Selanjutnya
                </h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(smaResult.nextForecast.forecast || 0)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    unit
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {smaResult.itemName} - Minggu {smaResult.nextForecast.week}
                </div>
              </div>

              {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Mean Absolute Deviation (MAD)
                </h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(smaResult.errorMetrics.MAD)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Rata-rata deviasi absolut
                </div>
              </div> */}

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Mean Absolute Percentage Error
                </h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(smaResult.errorMetrics.MAPE)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Rata-rata persentase kesalahan
                </div>
              </div>

              {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Root Mean Squared Error
                </h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(smaResult.errorMetrics.RMSE)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Akar rata-rata error kuadrat
                </div>
              </div> */}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Grafik Perbandingan Penjualan vs Prediksi
                </h2>
              </div>

              <div className="h-72">
                <Chart smaResult={smaResult} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Detail Perhitungan SMA
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nama Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Minggu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Penjualan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        SMA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Error
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        |Error|
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        |Error/Aktual| (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {smaResult.data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {smaResult.itemName}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.week}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.actual}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.forecast !== null
                            ? formatNumber(item.forecast)
                            : ""}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.error !== null ? formatNumber(item.error) : ""}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.absoluteError !== null
                            ? formatNumber(item.absoluteError)
                            : ""}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                          {item.absolutePercentageError !== null
                            ? formatPercentage(
                                item.absolutePercentageError * 100
                              )
                            : ""}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100">
                        {smaResult.data.length + 1}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100">
                        {smaResult.itemName}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-100">
                        {smaResult.nextForecast.week}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatNumber(smaResult.nextForecast.forecast || 0)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        -
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Metrik Evaluasi
                      </td>
                      <td
                        colSpan={4}
                        className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200"
                      >
                        <div className="flex flex-col space-y-1">
                          {/* <div className="flex justify-between">
                            <span>MAD:</span>
                            <span className="font-medium">
                              {formatNumber(smaResult.errorMetrics.MAD)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>MSE:</span>
                            <span className="font-medium">
                              {formatNumber(smaResult.errorMetrics.MSE)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>RMSE:</span>
                            <span className="font-medium">
                              {formatNumber(smaResult.errorMetrics.RMSE)}
                            </span>
                          </div> */}
                          <div className="flex justify-between">
                            <span>MAPE:</span>
                            <span className="font-medium">
                              {formatNumber(smaResult.errorMetrics.MAPE)}%
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span>Bias:</span>
                            <span className="font-medium">
                              {formatNumber(smaResult.errorMetrics.bias)}
                            </span>
                          </div> */}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
