"use server";
import { calculatePercentageChange, weekUtils } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function dashboardStats() {
  const { currentWeek } = weekUtils();
  const previousWeek = currentWeek - 1;

  const itemCount = await prisma.item.count();

  const currentWeekSales = await prisma.sale.findMany({
    where: {
      week: currentWeek,
    },
    include: {
      item: true,
    },
  });

  const previousWeekSales = await prisma.sale.findMany({
    where: {
      week: previousWeek,
    },
    include: {
      item: true,
    },
  });

  const currentWeekRevenue = currentWeekSales.reduce(
    (acc, sale) => acc + sale.item.price * sale.quantity,
    0
  );

  const previousWeekRevenue = previousWeekSales.reduce(
    (acc, sale) => acc + sale.item.price * sale.quantity,
    0
  );

  const currentWeekTransactionCount = currentWeekSales.length;
  const previousWeekTransactionCount = previousWeekSales.length;

  const previousWeekItemsWithActivity = await prisma.item.count({
    where: {
      OR: [
        {
          sales: {
            some: {
              week: previousWeek,
            },
          },
        },
        {
          stock: {
            gt: 0,
          },
        },
      ],
    },
  });

  const salesChange = calculatePercentageChange(
    currentWeekRevenue,
    previousWeekRevenue
  );
  const transactionChange = calculatePercentageChange(
    currentWeekTransactionCount,
    previousWeekTransactionCount
  );
  const itemChange = calculatePercentageChange(
    itemCount,
    previousWeekItemsWithActivity
  );

  return {
    itemChange,
    itemCount,
    salesChange,
    currentWeekRevenue,
    transactionChange,
    currentWeekTransactionCount,
  };
}
