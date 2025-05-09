import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  smaResult: CalculateResult;
}

export const Chart = ({ smaResult }: Props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={smaResult.data.map((item) => ({
          week: `Minggu ${item.week}`,
          actual: item.actual,
          forecast: item.forecast,
        }))}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="week" tick={{ fill: "#6B7280" }} />
        <YAxis tick={{ fill: "#6B7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "0.5rem",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#4F46E5"
          strokeWidth={2}
          name="Penjualan"
          dot={{ r: 4, fill: "#4F46E5" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#10B981"
          strokeWidth={2}
          name={`SMA (${smaResult.period} minggu)`}
          dot={{ r: 4, fill: "#10B981" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
