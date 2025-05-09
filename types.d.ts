interface WeeklySale {
  week: number;
  quantity: number;
}

interface SMAResult {
  week: number;
  actual: number;
  forecast: number | null;
  error: number | null;
  errorSquared: number | null;
  absoluteError: number | null;
  percentageError: number | null;
  absolutePercentageError: number | null;
}

interface CalculateResult {
  itemName: string;
  period: number;
  data: SMAResult[];
  nextForecast: SMAResult;
  errorMetrics: {
    MAD: number;
    MSE: number;
    RMSE: number;
    MAPE: number;
    bias: number;
  };
}

interface SessionPayload {
  userId: string | number;
  expiresAt: Date;
}
