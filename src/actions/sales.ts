"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Prisma } from "@prisma/client";

interface SaleState {
  error: string | null;
}

export async function createSales(
  prevState: SaleState,
  formData: FormData
): Promise<SaleState> {
  const itemId = formData.get("item-id") as string;
  const week = formData.get("week") as string;
  const totalSales = formData.get("total-sales") as string;

  if (!itemId || !week || !totalSales) {
    return { error: "Data tidak lengkap" };
  }

  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk membuat sales",
    };
  }

  const existing = await prisma.sale.findFirst({
    where: {
      itemId,
      week: parseInt(week),
    },
  });

  if (existing) {
    return {
      error: "Data sudah ada",
    };
  }

  await prisma.sale.create({
    data: {
      itemId,
      week: parseInt(week),
      quantity: parseInt(totalSales),
      adminId: session?.userId as string,
    },
  });

  revalidatePath("/sales");
  redirect("/sales");
}

export async function updateSales(
  prevState: SaleState,
  formData: FormData
): Promise<SaleState> {
  const itemId = formData.get("item-id") as string;
  const week = formData.get("week") as string;
  const totalSales = formData.get("total-sales") as string;
  const id = formData.get("id") as string;

  if (!itemId || !week || !totalSales || !id) {
    return { error: "Data tidak lengkap" };
  }

  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk mengubah penjualan",
    };
  }

  const currentSale = await prisma.sale.findUnique({
    where: { id },
  });

  if (
    currentSale &&
    (currentSale.itemId !== itemId || currentSale.week !== parseInt(week))
  ) {
    const existingRecord = await prisma.sale.findFirst({
      where: {
        itemId,
        week: parseInt(week),
        id: { not: id },
      },
    });

    if (existingRecord) {
      return {
        error: `Error: Data penjualan untuk barang yang sama pada minggu ${week} sudah ada.`,
      };
    }
  }

  await prisma.sale.update({
    where: {
      id,
    },
    data: {
      itemId,
      week: parseInt(week),
      quantity: parseInt(totalSales),
    },
  });

  revalidatePath("/sales");
  redirect("/sales");
}

export async function deleteSales(id: string) {
  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk menghapus data penjualan",
    };
  }
  await prisma.sale.delete({
    where: {
      id,
    },
  });

  revalidatePath("/sales");
  redirect("/sales");
}

export async function getSales(): Promise<
  Prisma.SaleGetPayload<{
    include: {
      item: true;
    };
  }>[]
> {
  return prisma.sale.findMany({
    include: {
      item: true,
    },
  });
}
