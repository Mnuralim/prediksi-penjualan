"use server";
import prisma from "@/lib/prisma";
import { getItemName } from "./item";

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

  let sumAbsError = 0;
  let sumError = 0;
  let sumSquaredError = 0;
  let sumAbsPercentageError = 0;
  let countWithForecast = 0;
  let countValidMAPE = 0;

  for (const result of results) {
    if (result.forecast !== null) {
      sumAbsError += result.absoluteError!;
      sumError += result.error!;
      sumSquaredError += result.errorSquared!;
      countWithForecast++;

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
    MAD: countWithForecast > 0 ? sumAbsError / countWithForecast : 0,
    MSE: countWithForecast > 0 ? sumSquaredError / countWithForecast : 0,
    RMSE:
      countWithForecast > 0
        ? Math.sqrt(sumSquaredError / countWithForecast)
        : 0,
    MAPE:
      countValidMAPE > 0 ? (sumAbsPercentageError / countValidMAPE) * 100 : 0,
    bias: countWithForecast > 0 ? sumError / countWithForecast : 0,
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
