export const weekUtils = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  const weekOptions = [];
  for (let i = 1; i <= 52; i++) {
    weekOptions.push(i);
  }

  return {
    weekOptions,
    currentWeek: Math.ceil(diff / oneWeek),
  };
};

export const formatNumber = (num: number) => {
  if (num === null || num === undefined) return "";
  return Number(num).toFixed(2);
};

export const formatPercentage = (num: number) => {
  if (num === null || num === undefined) return "";
  return Number(num).toFixed(2);
};

export const calculatePercentageChange = (
  current: number,
  previous: number
) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
