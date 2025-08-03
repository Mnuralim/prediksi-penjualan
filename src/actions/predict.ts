"use server";
import prisma from "@/lib/prisma";
import { getItemName } from "./item";
import { redirect } from "next/navigation";

export async function calculateSingleMovingAverage(
  itemId: string,
  period: number = 3
): Promise<CalculateResult> {
  const salesData = await prisma.sale.findMany({
    where: {
      itemId: itemId,
    },
    select: {
      week: true,
      quantity: true,
    },
    orderBy: {
      week: "asc",
    },
  });

  const weeklySales: WeeklySale[] = [];
  const weekMap = new Map<number, number>();

  for (const sale of salesData) {
    if (weekMap.has(sale.week)) {
      weekMap.set(sale.week, weekMap.get(sale.week)! + sale.quantity);
    } else {
      weekMap.set(sale.week, sale.quantity);
    }
  }

  for (const [week, quantity] of weekMap.entries()) {
    weeklySales.push({ week, quantity });
  }

  weeklySales.sort((a, b) => a.week - b.week);

  const results: SMAResult[] = [];

  for (let i = 0; i < weeklySales.length; i++) {
    const currentSale = weeklySales[i];
    const result: SMAResult = {
      week: currentSale.week,
      actual: currentSale.quantity,
      forecast: null,
      error: null,
      errorSquared: null,
      absoluteError: null,
      percentageError: null,
      absolutePercentageError: null,
    };

    if (i >= period) {
      let sum = 0;
      for (let j = 1; j <= period; j++) {
        sum += weeklySales[i - j].quantity;
      }
      result.forecast = sum / period;
      result.error = result.actual - result.forecast;
      result.absoluteError = Math.abs(result.error);
      result.errorSquared = Math.pow(result.error, 2);

      if (result.actual !== 0) {
        result.percentageError = result.error / result.actual;
        result.absolutePercentageError =
          Math.abs(result.error) / Math.abs(result.actual);
      } else {
        result.percentageError = null;
        result.absolutePercentageError = null;
      }
    }
    results.push(result);
  }

  let sumAbsPercentageError = 0;
  let countValidMAPE = 0;

  for (const result of results) {
    if (result.forecast !== null) {
      if (result.absolutePercentageError !== null) {
        sumAbsPercentageError += result.absolutePercentageError;
        countValidMAPE++;
      }
    }
  }

  const nextPeriod =
    weeklySales.length > 0 ? weeklySales[weeklySales.length - 1].week + 1 : 1;
  let nextForecast = 0;

  if (weeklySales.length >= period) {
    let sum = 0;
    for (let i = 1; i <= period; i++) {
      sum += weeklySales[weeklySales.length - i].quantity;
    }
    nextForecast = sum / period;
  }

  const forecasting: SMAResult = {
    week: nextPeriod,
    actual: 0,
    forecast: nextForecast,
    error: null,
    errorSquared: null,
    absoluteError: null,
    percentageError: null,
    absolutePercentageError: null,
  };

  const errorMetrics = {
    MAPE:
      countValidMAPE > 0 ? (sumAbsPercentageError / countValidMAPE) * 100 : 0,
  };

  const itemName = await getItemName(itemId);

  return {
    itemName,
    period,
    data: results,
    nextForecast: forecasting,
    errorMetrics: errorMetrics,
  };
}

export async function calculateAllItemsMovingAverage(
  period: number = 3
): Promise<CalculateResult[]> {
  const items = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  const results: CalculateResult[] = [];

  for (const item of items) {
    try {
      const smaResult = await calculateSingleMovingAverage(item.id, period);

      if (smaResult.data.length > period) {
        const hasValidForecast = smaResult.data.some(
          (result) => result.forecast !== null
        );
        if (hasValidForecast) {
          results.push(smaResult);
        }
      }
    } catch (error) {
      console.error(`Error calculating SMA for item ${item.id}:`, error);
    }
  }

  results.sort((a, b) => a.itemName.localeCompare(b.itemName));

  return results;
}

interface PredictState {
  error: string | null;
}

export async function predictSMA(
  prevState: PredictState,
  formData: FormData
): Promise<PredictState> {
  const period = formData.get("period") as string;
  if (!period) {
    return { error: "Data tidak lengkap" };
  }
  redirect(`/predict?period=${period}&all=true`);
}
